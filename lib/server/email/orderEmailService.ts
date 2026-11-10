import "server-only";
import { resend, EMAIL_CONFIG } from "./resend";
import {
  renderOrderConfirmationHtml,
  renderOrderConfirmationText,
  renderOrderPaymentVerifiedHtml,
  renderOrderPaymentVerifiedText,
  OrderEmailData,
} from "./templates/order-confirmation";

export interface EmailDispatchResult {
  success: boolean;
  status: "sent" | "failed";
  messageId?: string;
  error?: string;
}

/**
 * Sends the order-received email (with the /orders/[id] tracking link) via
 * Resend. Fired once, synchronously, right after an order is created — no
 * idempotency/duplicate-send tracking needed since there's no "resend"
 * action for orders yet (unlike consultations).
 */
export async function sendOrderConfirmation(
  data: OrderEmailData,
): Promise<EmailDispatchResult> {
  const subject = `Order Received - ${data.orderNumber} | MARK Architects`;
  const html = renderOrderConfirmationHtml(data);
  const text = renderOrderConfirmationText(data);

  if (!resend) {
    console.warn(
      `[OrderEmailService - DEV MODE] RESEND_API_KEY is not set. Simulating send to ${data.clientEmail} for order ${data.orderNumber}.`,
    );
    return { success: true, status: "sent", messageId: `sim_resend_${Date.now()}` };
  }

  try {
    const { data: sendData, error } = await resend.emails.send({
      from: EMAIL_CONFIG.formattedFrom,
      to: [data.clientEmail],
      replyTo: EMAIL_CONFIG.replyTo,
      subject,
      html,
      text,
    });

    if (error) {
      console.error(
        `[OrderEmailService] Resend dispatch failed for order ${data.orderNumber}:`,
        error.message,
      );
      return { success: false, status: "failed", error: error.message };
    }

    return { success: true, status: "sent", messageId: sendData?.id };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[OrderEmailService] Unexpected error sending via Resend:", message);
    return { success: false, status: "failed", error: message };
  }
}

/**
 * Sends the payment-verified email when an admin verifies the client's
 * payment screenshot and confirms the order in the Admin Dashboard.
 */
export async function sendOrderPaymentVerified(
  data: OrderEmailData,
): Promise<EmailDispatchResult> {
  const subject = `Payment Confirmed - ${data.orderNumber} | MARK Architects`;
  const html = renderOrderPaymentVerifiedHtml(data);
  const text = renderOrderPaymentVerifiedText(data);

  if (!resend) {
    console.warn(
      `[OrderEmailService - DEV MODE] RESEND_API_KEY is not set. Simulating payment-verified email to ${data.clientEmail} for order ${data.orderNumber}.`,
    );
    return { success: true, status: "sent", messageId: `sim_resend_verified_${Date.now()}` };
  }

  try {
    const { data: sendData, error } = await resend.emails.send({
      from: EMAIL_CONFIG.formattedFrom,
      to: [data.clientEmail],
      replyTo: EMAIL_CONFIG.replyTo,
      subject,
      html,
      text,
    });

    if (error) {
      console.error(
        `[OrderEmailService] Resend verified dispatch failed for order ${data.orderNumber}:`,
        error.message,
      );
      return { success: false, status: "failed", error: error.message };
    }

    return { success: true, status: "sent", messageId: sendData?.id };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[OrderEmailService] Unexpected error sending verified email:", message);
    return { success: false, status: "failed", error: message };
  }
}
