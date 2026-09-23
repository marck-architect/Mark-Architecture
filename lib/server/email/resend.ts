import "server-only";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;

export const resend = resendApiKey ? new Resend(resendApiKey) : null;

export const EMAIL_CONFIG = {
  fromEmail:
    process.env.RESEND_FROM_EMAIL || "consultations@markarchitects.com",
  fromName: process.env.RESEND_FROM_NAME || "MARK Architects Atelier",
  get formattedFrom(): string {
    return `${this.fromName} <${this.fromEmail}>`;
  },
};
