import "server-only";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;

export const resend = resendApiKey ? new Resend(resendApiKey) : null;

const rawFromEmail =
  process.env.RESEND_FROM_EMAIL || "consultations@markarchitects.com";
const rawFromName =
  process.env.RESEND_FROM_NAME || "MARK Architects Atelier";

const isFreeProvider = /@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com)$/i.test(
  rawFromEmail,
);

export const EMAIL_CONFIG = {
  fromEmail: isFreeProvider ? "onboarding@resend.dev" : rawFromEmail,
  fromName: rawFromName,
  replyTo: rawFromEmail,
  get formattedFrom(): string {
    return `${this.fromName} <${this.fromEmail}>`;
  },
};
