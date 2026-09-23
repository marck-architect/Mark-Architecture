import "server-only";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export interface SendMeetingInviteParams {
  clientEmail: string;
  clientName: string;
  tierName: string;
  bookingDate: string;
  bookingTime: string;
  meetingUrl: string;
  consultationId: string;
  adminNotes?: string | null;
}

export interface SendMeetingInviteResult {
  success: boolean;
  status: "sent" | "manual" | "failed";
  emailSubject: string;
  emailPreview: string;
  mailtoLink: string;
  error?: string;
}

/**
 * Generates branded HTML template for MARK Architects consultation session
 */
export function generateMeetingInviteHtml({
  clientName,
  tierName,
  bookingDate,
  bookingTime,
  meetingUrl,
}: {
  clientName: string;
  tierName: string;
  bookingDate: string;
  bookingTime: string;
  meetingUrl: string;
}): string {
  const formattedDate = new Date(bookingDate).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>MARK Architects - Consultation Confirmed</title>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #fcf8f8; margin: 0; padding: 20px; color: #1c1b1b; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e7e5e4; border-radius: 16px; overflow: hidden; }
    .header { background: #1c1b1b; padding: 32px 24px; text-align: center; color: #ffffff; }
    .header h1 { font-family: Georgia, serif; font-size: 24px; margin: 0; letter-spacing: 1px; }
    .header p { color: #d4af37; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin-top: 8px; margin-bottom: 0; }
    .content { padding: 32px 24px; }
    .badge { display: inline-block; background: #fef3c7; color: #78350f; font-size: 11px; font-weight: bold; padding: 4px 12px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 1px; }
    .card { background: #fafaf9; border: 1px solid #e7e5e4; border-radius: 12px; padding: 20px; margin: 24px 0; }
    .card-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f5f5f4; }
    .card-label { color: #78716c; font-size: 13px; }
    .card-val { font-weight: 600; font-size: 13px; color: #1c1b1b; }
    .cta-btn { display: block; background: #7e5714; color: #ffffff !important; text-align: center; padding: 16px 24px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin: 28px 0; }
    .footer { text-align: center; font-size: 11px; color: #a8a29e; padding: 24px; border-top: 1px solid #f5f5f4; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>MARK ARCHITECTS</h1>
      <p>Consultation Confirmed & Scheduled</p>
    </div>
    <div class="content">
      <div class="badge">Appointment Confirmed</div>
      <h2 style="font-family: Georgia, serif; font-size: 20px; margin-top: 16px; margin-bottom: 8px;">Hello, ${clientName}</h2>
      <p style="font-size: 14px; line-height: 1.6; color: #44403c;">
        Your architectural consultation session with our principal architect has been confirmed. Below are your appointment coordinates and your direct live video meeting link.
      </p>

      <div class="card">
        <div class="card-row">
          <span class="card-label">Session Format</span>
          <span class="card-val">${tierName} (Live HD Video)</span>
        </div>
        <div class="card-row">
          <span class="card-label">Scheduled Date</span>
          <span class="card-val">${formattedDate}</span>
        </div>
        <div class="card-row">
          <span class="card-label">Scheduled Time</span>
          <span class="card-val">${bookingTime} PKT (Pakistan Standard Time)</span>
        </div>
        <div class="card-row" style="border-bottom: none;">
          <span class="card-label">Studio Location</span>
          <span class="card-val">Live Video Conference</span>
        </div>
      </div>

      <a href="${meetingUrl}" target="_blank" class="cta-btn">Join Video Meeting</a>

      <p style="font-size: 12px; color: #78716c; line-height: 1.5;">
        <strong>Preparation note:</strong> If you haven't uploaded your CAD drawings, site contour surveys, or plot photos yet, please reply directly with your documents so our architects can review them ahead of time.
      </p>
    </div>
    <div class="footer">
      MARK Architects Atelier • Lahore | Islamabad | Karachi<br/>
      Studio Hotline: +92 300 1234567 • contact@markarchitects.com
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Dispatches the meeting link to client.
 * Uses RESEND_API_KEY or SMTP if available, or logs & provides mailto fallback if in dev.
 */
export async function sendConsultationMeetingInvite({
  clientEmail,
  clientName,
  tierName,
  bookingDate,
  bookingTime,
  meetingUrl,
  consultationId,
}: SendMeetingInviteParams): Promise<SendMeetingInviteResult> {
  const subject = `Your Architecture Consultation is Confirmed - MARK Architects`;

  const { sendConsultationConfirmation } = await import("./email/emailService");
  const result = await sendConsultationConfirmation({
    consultationId,
    clientEmail,
    clientName,
    consultationTitle: tierName,
    date: bookingDate,
    startTime: bookingTime,
    meetingUrl,
    forceResend: true,
  });

  const plainText = `Hello ${clientName},\n\nYour architectural consultation (${tierName}) with MARK Architects has been confirmed for ${bookingDate} at ${bookingTime} PKT.\n\nJoin Video Session: ${meetingUrl}\n\nPlease have your site photos and plan drawings ready.\n\nWarm regards,\nMARK Architects Atelier\nHotline: +92 300 1234567`;

  const mailtoLink = `mailto:${encodeURIComponent(clientEmail)}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(plainText)}`;

  return {
    success: result.success,
    status: result.status === "sent" ? "sent" : "failed",
    emailSubject: subject,
    emailPreview: plainText,
    mailtoLink,
    error: result.error,
  };
}
