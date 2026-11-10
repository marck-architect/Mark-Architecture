import "server-only";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;

export const resend = resendApiKey ? new Resend(resendApiKey) : null;

const rawFromEmail =
  process.env.RESEND_FROM_EMAIL || "consultations@mark-architects.com";
const rawFromName =
  process.env.RESEND_FROM_NAME || "MARK Architects Atelier";
const rawReplyTo =
  process.env.RESEND_REPLY_TO || process.env.ADMIN_EMAIL || rawFromEmail;

export const EMAIL_CONFIG = {
  fromEmail: rawFromEmail,
  fromName: rawFromName,
  replyTo: rawReplyTo,
  get formattedFrom(): string {
    return `${this.fromName} <${this.fromEmail}>`;
  },
};
