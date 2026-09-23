import "server-only";
import {
  getAuthorizedCalendarClient,
  getGoogleConnectionStatus,
} from "./googleAuth";
import { getSupabaseAdminClient } from "../supabaseAdmin";
import type { MeetingRecord } from "@/types";

export interface CreateCalendarEventParams {
  consultationId: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  tierName?: string;
  bookingDate: string; // YYYY-MM-DD
  bookingTime: string; // e.g. "16:00", "04:00 PM", "11:00 AM"
  durationMinutes?: number;
  notes?: string | null;
  timezone?: string; // default "Asia/Karachi"
}

export interface CreateCalendarEventResult {
  success: boolean;
  status: "scheduled" | "failed" | "skipped";
  calendarEventId?: string;
  meetingUrl?: string;
  scheduledStart?: string;
  scheduledEnd?: string;
  error?: string;
}

/**
 * Parses time string like "14:30" or "02:30 PM" into hours and minutes (24h format).
 */
export function parseTimeTo24h(timeStr: string): {
  hours: number;
  minutes: number;
} {
  const cleaned = timeStr.trim();
  const isPm = /pm/i.test(cleaned);
  const isAm = /am/i.test(cleaned);

  const raw = cleaned.replace(/am|pm/gi, "").trim();
  const parts = raw.split(":").map((p) => parseInt(p, 10));

  let hours = isNaN(parts[0]) ? 12 : parts[0];
  const minutes = parts.length > 1 && !isNaN(parts[1]) ? parts[1] : 0;

  if (isPm && hours < 12) {
    hours += 12;
  } else if (isAm && hours === 12) {
    hours = 0;
  }

  return {
    hours: Math.min(23, Math.max(0, hours)),
    minutes: Math.min(59, Math.max(0, minutes)),
  };
}

/**
 * Builds timezone-aware ISO string for Pakistan Standard Time (PKT, UTC+05:00).
 */
export function buildPktIsoTimestamp(
  dateStr: string,
  hours: number,
  minutes: number,
): string {
  // Normalize dateStr to YYYY-MM-DD
  const dateMatch = dateStr.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  let y = "2026";
  let m = "01";
  let d = "01";

  if (dateMatch) {
    y = dateMatch[1];
    m = dateMatch[2].padStart(2, "0");
    d = dateMatch[3].padStart(2, "0");
  }

  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");

  return `${y}-${m}-${d}T${hh}:${mm}:00+05:00`;
}

/**
 * Calculates start and end timestamps in Asia/Karachi (PKT).
 */
export function calculateScheduleTimestamps(
  bookingDate: string,
  bookingTime: string,
  durationMinutes: number = 60,
): { startIso: string; endIso: string } {
  const { hours, minutes } = parseTimeTo24h(bookingTime);
  const startIso = buildPktIsoTimestamp(bookingDate, hours, minutes);

  const totalEndMinutes = hours * 60 + minutes + durationMinutes;
  const endHours = Math.floor(totalEndMinutes / 60) % 24;
  const endMinutes = totalEndMinutes % 60;
  const endIso = buildPktIsoTimestamp(bookingDate, endHours, endMinutes);

  return { startIso, endIso };
}

/**
 * Creates Google Calendar event with Google Meet conference.
 * Idempotent: If a scheduled meeting already exists for the consultation, returns it.
 */
export async function createConsultationCalendarEvent(
  params: CreateCalendarEventParams,
): Promise<CreateCalendarEventResult> {
  const supabase = getSupabaseAdminClient();
  const {
    consultationId,
    clientName,
    clientEmail,
    clientPhone = "",
    tierName = "Online Architectural Consultation",
    bookingDate,
    bookingTime,
    durationMinutes = tierName?.includes("30") ? 30 : 60,
    notes,
    timezone = "Asia/Karachi",
  } = params;

  // 1. Idempotency Check: check if meeting already exists
  try {
    const { data: existingMeeting } = await supabase
      .from("meetings")
      .select("*")
      .eq("consultation_id", consultationId)
      .eq("status", "scheduled")
      .maybeSingle();

    if (existingMeeting && existingMeeting.meeting_url) {
      console.log(
        `[GoogleCalendarService] Active meeting already exists for consultation ${consultationId} (${existingMeeting.meeting_url}). Skipping duplicate creation.`,
      );
      return {
        success: true,
        status: "skipped",
        calendarEventId: existingMeeting.calendar_event_id || undefined,
        meetingUrl: existingMeeting.meeting_url,
        scheduledStart: existingMeeting.scheduled_start || undefined,
        scheduledEnd: existingMeeting.scheduled_end || undefined,
      };
    }
  } catch (checkErr) {
    console.warn(
      "[GoogleCalendarService] Could not check existing meeting:",
      checkErr,
    );
  }

  const { startIso, endIso } = calculateScheduleTimestamps(
    bookingDate,
    bookingTime,
    durationMinutes,
  );

  let calendarEventId: string | undefined;
  let meetingUrl: string | undefined;
  let meetSpaceName: string | undefined;
  let errorMsg: string | undefined;
  let status: "scheduled" | "failed" = "failed";

  // Check if Google is connected
  const statusInfo = await getGoogleConnectionStatus();

  if (!statusInfo.connected) {
    errorMsg =
      "Google Calendar is not authorized. The atelier admin must connect a Google account in the Admin Dashboard.";
    console.warn(
      `[GoogleCalendarService] Cannot create event for consultation ${consultationId}: Google not connected.`,
    );
  } else {
    try {
      const { calendar } = await getAuthorizedCalendarClient();

      const eventSummary = `Architecture Consultation - Muhammad Arsalan & ${clientName}`;
      const eventDescription = [
        `MARK Architects Consultation Session`,
        `Client: ${clientName}`,
        `Email: ${clientEmail}`,
        clientPhone ? `Phone: ${clientPhone}` : null,
        `Tier: ${tierName}`,
        `Duration: ${durationMinutes} minutes`,
        notes ? `Client Notes: ${notes}` : null,
      ]
        .filter(Boolean)
        .join("\n");

      const response = await calendar.events.insert({
        calendarId: "primary",
        conferenceDataVersion: 1,
        requestBody: {
          summary: eventSummary,
          description: eventDescription,
          start: {
            dateTime: startIso,
            timeZone: timezone,
          },
          end: {
            dateTime: endIso,
            timeZone: timezone,
          },
          attendees: [{ email: clientEmail, displayName: clientName }],
          conferenceData: {
            createRequest: {
              requestId: `consultation-${consultationId}`,
              conferenceSolutionKey: {
                type: "hangoutsMeet",
              },
            },
          },
        },
      });

      if (response.data) {
        calendarEventId = response.data.id || undefined;

        // Extract Google Meet URL
        const videoEntry = response.data.conferenceData?.entryPoints?.find(
          (ep) => ep.entryPointType === "video",
        );
        meetingUrl = videoEntry?.uri || response.data.hangoutLink || undefined;
        meetSpaceName = response.data.conferenceData?.conferenceId || undefined;

        if (meetingUrl) {
          status = "scheduled";
          console.log(
            `[GoogleCalendarService] Created Google Calendar event (${calendarEventId}) with Meet URL: ${meetingUrl}`,
          );
        } else {
          errorMsg =
            "Google Calendar event was created, but no Google Meet conference URL was returned.";
          console.warn(
            `[GoogleCalendarService] Event created without conference URL:`,
            response.data,
          );
        }
      }
    } catch (err: unknown) {
      errorMsg = err instanceof Error ? err.message : String(err);
      console.error(
        `[GoogleCalendarService] Google Calendar API error for consultation ${consultationId}:`,
        errorMsg,
      );
    }
  }

  const nowIso = new Date().toISOString();

  // 2. Persist in public.meetings table
  try {
    const { error: dbErr } = await supabase.from("meetings").upsert(
      {
        consultation_id: consultationId,
        provider: "google_meet",
        calendar_event_id: calendarEventId || null,
        calendar_id: "primary",
        meet_space_name: meetSpaceName || null,
        meeting_url: meetingUrl || null,
        scheduled_start: startIso,
        scheduled_end: endIso,
        timezone,
        status,
        error: errorMsg || null,
        updated_at: nowIso,
      },
      { onConflict: "consultation_id" },
    );

    if (dbErr) {
      console.warn(
        "[GoogleCalendarService] Failed to upsert meeting record:",
        dbErr,
      );
    }
  } catch (err) {
    console.warn(
      "[GoogleCalendarService] Error writing to meetings table:",
      err,
    );
  }

  // 3. Update public.consultations table
  try {
    const updateData: Record<string, unknown> = {
      meeting_status: status,
      updated_at: nowIso,
    };
    if (meetingUrl) updateData.meeting_url = meetingUrl;
    if (calendarEventId) updateData.calendar_event_id = calendarEventId;

    await supabase
      .from("consultations")
      .update(updateData)
      .eq("id", consultationId);
  } catch (err) {
    console.warn(
      "[GoogleCalendarService] Error updating consultation record:",
      err,
    );
  }

  return {
    success: status === "scheduled",
    status,
    calendarEventId,
    meetingUrl,
    scheduledStart: startIso,
    scheduledEnd: endIso,
    error: errorMsg,
  };
}

/**
 * Retries creating the Google Calendar event and Google Meet meeting for an existing consultation.
 */
export async function retryConsultationMeeting(
  consultationId: string,
): Promise<CreateCalendarEventResult> {
  const supabase = getSupabaseAdminClient();

  const { data: consultation, error } = await supabase
    .from("consultations")
    .select("*")
    .eq("id", consultationId)
    .single();

  if (error || !consultation) {
    throw new Error(
      `Consultation ${consultationId} not found in database: ${error?.message}`,
    );
  }

  return createConsultationCalendarEvent({
    consultationId: consultation.id,
    clientName: consultation.client_name,
    clientEmail: consultation.client_email,
    clientPhone: consultation.client_phone,
    tierName: consultation.tier_name,
    bookingDate: consultation.booking_date,
    bookingTime: consultation.booking_time,
    notes: consultation.notes,
    timezone: consultation.timezone || "Asia/Karachi",
  });
}
