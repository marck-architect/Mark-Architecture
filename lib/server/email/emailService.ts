import "server-only";
import { resend, EMAIL_CONFIG } from "./resend";
import {
  renderConsultationConfirmationHtml,
  renderConsultationConfirmationText,
  ConsultationEmailData,
} from "./templates/consultation-confirmation";
import { getSupabaseAdminClient } from "../supabaseAdmin";

export interface SendConsultationEmailParams extends ConsultationEmailData {
  forceResend?: boolean;
}

export interface EmailDispatchResult {
  success: boolean;
  status: "sent" | "failed" | "skipped";
  messageId?: string;
  error?: string;
}

/**
 * Sends a consultation confirmation email via Resend and tracks the delivery status in Supabase.
 * Idempotent: If an email has already been successfully sent for this consultation,
 * it will NOT send a duplicate unless forceResend is explicitly true.
 */
export async function sendConsultationConfirmation(
  params: SendConsultationEmailParams,
): Promise<EmailDispatchResult> {
  const supabase = getSupabaseAdminClient();
  const { consultationId, clientEmail, forceResend = false } = params;

  // 1. Idempotency Check: check if already sent
  if (!forceResend) {
    try {
      const { data: existingNotification } = await supabase
        .from("notifications")
        .select("id, status, provider_message_id")
        .eq("consultation_id", consultationId)
        .eq("type", "consultation_confirmation")
        .eq("status", "sent")
        .maybeSingle();

      if (existingNotification) {
        console.log(
          `[EmailService] Confirmation email already sent for consultation ${consultationId} (messageId: ${existingNotification.provider_message_id}). Skipping duplicate.`,
        );
        return {
          success: true,
          status: "skipped",
          messageId: existingNotification.provider_message_id || undefined,
        };
      }
    } catch (checkErr) {
      console.warn(
        "[EmailService] Could not check existing notification status:",
        checkErr,
      );
    }
  }

  const subject = `Your Architecture Consultation is Confirmed - MARK Architects`;
  const html = renderConsultationConfirmationHtml(params);
  const text = renderConsultationConfirmationText(params);

  let messageId: string | undefined;
  let errorMsg: string | undefined;
  let status: "sent" | "failed" = "failed";

  // 2. Dispatch via Resend SDK
  if (resend) {
    try {
      const { data, error } = await resend.emails.send({
        from: EMAIL_CONFIG.formattedFrom,
        to: [clientEmail],
        subject,
        html,
        text,
      });

      if (error) {
        errorMsg = error.message || "Failed to dispatch email via Resend";
        console.error(
          `[EmailService] Resend dispatch failed for consultation ${consultationId}:`,
          errorMsg,
        );
      } else if (data?.id) {
        messageId = data.id;
        status = "sent";
        console.log(
          `[EmailService] Resend successfully sent confirmation for consultation ${consultationId}, messageId: ${messageId}`,
        );
      }
    } catch (err: unknown) {
      errorMsg = err instanceof Error ? err.message : String(err);
      console.error(
        `[EmailService] Unexpected error sending via Resend:`,
        errorMsg,
      );
    }
  } else {
    // In local development when RESEND_API_KEY is not configured
    console.warn(
      `[EmailService - DEV MODE] RESEND_API_KEY is not set. Simulating successful send to ${clientEmail} for consultation ${consultationId}.`,
    );
    messageId = `sim_resend_${Date.now()}`;
    status = "sent";
  }

  const nowIso = new Date().toISOString();

  // 3. Persist record in public.notifications
  try {
    const { error: notifErr } = await supabase.from("notifications").insert({
      consultation_id: consultationId,
      type: "consultation_confirmation",
      recipient: clientEmail,
      status,
      provider: "resend",
      provider_message_id: messageId || null,
      error: errorMsg || null,
      sent_at: status === "sent" ? nowIso : null,
      created_at: nowIso,
      updated_at: nowIso,
    });

    if (notifErr) {
      console.warn(
        "[EmailService] Failed to insert notification record:",
        notifErr,
      );
    }
  } catch (err) {
    console.warn("[EmailService] Failed to log to notifications table:", err);
  }

  // 4. Update consultation record email_status
  try {
    const { error: emailUpdateErr } = await supabase
      .from("consultations")
      .update({
        email_status: status,
        updated_at: nowIso,
      })
      .eq("id", consultationId);

    if (emailUpdateErr) {
      console.warn(
        "[EmailService] Failed to update consultation email_status:",
        emailUpdateErr.message,
      );
    }
  } catch (err) {
    console.warn(
      "[EmailService] Failed to update consultation email_status:",
      err,
    );
  }

  return {
    success: status === "sent",
    status,
    messageId,
    error: errorMsg,
  };
}

/**
 * Retries dispatching the consultation confirmation email using existing consultation data.
 * Does NOT recreate meeting or calendar event.
 */
export async function retryConsultationConfirmation(
  consultationId: string,
  force: boolean = false,
): Promise<EmailDispatchResult> {
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

  if (!consultation.meeting_url) {
    throw new Error(
      "Cannot send confirmation email: Consultation does not have a Google Meet URL.",
    );
  }

  return sendConsultationConfirmation({
    consultationId: consultation.id,
    clientName: consultation.client_name,
    clientEmail: consultation.client_email,
    consultationTitle:
      consultation.tier_name || "Online Architectural Consultation",
    date: consultation.booking_date,
    startTime: consultation.booking_time,
    timezone: consultation.timezone || "Pakistan Standard Time (PKT)",
    meetingUrl: consultation.meeting_url,
    calendarEventId: consultation.calendar_event_id || undefined,
    forceResend: force,
  });
}
