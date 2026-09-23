import "server-only";
import { getSupabaseAdminClient } from "./supabaseAdmin";
import { createConsultationCalendarEvent } from "./google/googleCalendarService";
import { sendConsultationConfirmation } from "./email/emailService";
import type { ConsultationRecord } from "@/types";

export interface ProcessPaidConsultationResult {
  success: boolean;
  consultationId: string;
  paymentStatus: "paid";
  meetingStatus: "scheduled" | "failed" | "skipped";
  emailStatus: "sent" | "failed" | "skipped" | "not_sent";
  meetingUrl?: string;
  calendarEventId?: string;
  error?: string;
}

/**
 * Authoritative, idempotent post-payment processor for consultations.
 *
 * Execution order:
 * 1. Mark payment as 'paid' and consultation as 'confirmed'
 * 2. Idempotently create Google Calendar event + Google Meet conference (isolated failure)
 * 3. Idempotently dispatch Resend confirmation email (isolated failure)
 *
 * Guarantees:
 * - If called multiple times (e.g. repeated SafePay webhooks/callbacks), no duplicate
 *   meetings or duplicate emails will be created.
 * - If email fails, payment and meeting remain intact.
 * - If meeting creation fails, payment remains paid and email is postponed until retry.
 */
export async function processPaidConsultation(
  consultationId: string,
  safepayTracker?: string,
): Promise<ProcessPaidConsultationResult> {
  const supabase = getSupabaseAdminClient();
  const nowIso = new Date().toISOString();

  // 1. Fetch consultation record
  const { data: consultation, error: fetchErr } = await supabase
    .from("consultations")
    .select("*")
    .eq("id", consultationId)
    .single();

  if (fetchErr || !consultation) {
    console.error(
      `[Workflow] Consultation ${consultationId} not found:`,
      fetchErr?.message,
    );
    throw new Error(`Consultation ${consultationId} not found in database.`);
  }

  // 2. Mark payment_status = 'paid' and consultation_status = 'confirmed'
  const paymentUpdates: Record<string, unknown> = {
    payment_status: "paid",
    consultation_status: "confirmed",
    updated_at: nowIso,
  };
  if (safepayTracker && !consultation.safepay_tracker) {
    paymentUpdates.safepay_tracker = safepayTracker;
  }

  try {
    await supabase
      .from("consultations")
      .update(paymentUpdates)
      .eq("id", consultationId);
  } catch (err) {
    console.warn(
      `[Workflow] Non-fatal: could not update payment_status for ${consultationId}:`,
      err,
    );
  }

  // 3. Create or reuse Google Calendar Event + Google Meet conference
  let meetingStatus: "scheduled" | "failed" | "skipped" = "failed";
  let activeMeetingUrl: string | undefined =
    consultation.meeting_url || undefined;
  let activeCalendarEventId: string | undefined =
    consultation.calendar_event_id || undefined;
  let meetingError: string | undefined;

  try {
    const meetingResult = await createConsultationCalendarEvent({
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

    meetingStatus = meetingResult.status;
    if (meetingResult.meetingUrl) {
      activeMeetingUrl = meetingResult.meetingUrl;
    }
    if (meetingResult.calendarEventId) {
      activeCalendarEventId = meetingResult.calendarEventId;
    }
    if (!meetingResult.success && meetingResult.error) {
      meetingError = meetingResult.error;
    }
  } catch (err: unknown) {
    meetingError = err instanceof Error ? err.message : String(err);
    console.error(
      `[Workflow] Unexpected failure during meeting creation for ${consultationId}:`,
      meetingError,
    );
  }

  // 4. Send or skip confirmation email via Resend
  let emailStatus: "sent" | "failed" | "skipped" | "not_sent" = "not_sent";
  let emailError: string | undefined;

  // Only dispatch email if meeting URL is available (either just created or already existed)
  if (activeMeetingUrl) {
    try {
      const emailResult = await sendConsultationConfirmation({
        consultationId: consultation.id,
        clientName: consultation.client_name,
        clientEmail: consultation.client_email,
        consultationTitle:
          consultation.tier_name || "Online Architectural Consultation",
        date: consultation.booking_date,
        startTime: consultation.booking_time,
        timezone: consultation.timezone || "Pakistan Standard Time (PKT)",
        meetingUrl: activeMeetingUrl,
        calendarEventId: activeCalendarEventId,
        forceResend: false, // Idempotent!
      });

      emailStatus = emailResult.status;
      if (!emailResult.success && emailResult.error) {
        emailError = emailResult.error;
      }
    } catch (err: unknown) {
      emailError = err instanceof Error ? err.message : String(err);
      emailStatus = "failed";
      console.error(
        `[Workflow] Unexpected failure during email dispatch for ${consultationId}:`,
        emailError,
      );
    }
  } else {
    console.warn(
      `[Workflow] Skipping confirmation email for ${consultationId} because meeting URL is not available yet. Meeting status is ${meetingStatus}.`,
    );
  }

  console.log(
    `[Workflow Completed] Consultation: ${consultationId} | Payment: paid | Meeting: ${meetingStatus} | Email: ${emailStatus}`,
  );

  return {
    success: true,
    consultationId,
    paymentStatus: "paid",
    meetingStatus,
    emailStatus,
    meetingUrl: activeMeetingUrl,
    calendarEventId: activeCalendarEventId,
    error: meetingError || emailError,
  };
}
