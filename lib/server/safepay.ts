import "server-only";
import crypto from "crypto";

// Type definition for @sfpy/node-core
// eslint-disable-next-line @typescript-eslint/no-require-imports
const sfpyFactory = require("@sfpy/node-core");

export interface SafepayCustomerInput {
  name: string;
  email: string;
  phone: string;
}

export interface InitiatePaymentParams {
  amountPkr: number;
  orderId: string;
  customer: SafepayCustomerInput;
  redirectUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface SafepayCheckoutResult {
  checkoutUrl: string;
  tracker: string;
  token: string;
  isSimulated?: boolean;
}

const env = (process.env.SAFEPAY_ENV || "sandbox") as "sandbox" | "production";
const apiKey =
  process.env.SAFEPAY_API_KEY || process.env.SAFEPAY_PUBLIC_KEY || "";
const v1Secret =
  process.env.SAFEPAY_V1_SECRET || process.env.SAFEPAY_SECRET_KEY || "";
const webhookSecret = process.env.SAFEPAY_WEBHOOK_SECRET || "";

const isProduction = env === "production";
const host = isProduction
  ? "https://api.getsafepay.com"
  : "https://sandbox.api.getsafepay.com";

// Check if valid credentials exist
export const hasLiveSafepayCredentials = Boolean(apiKey && v1Secret);

// Initialize client if credentials present
const safepayClient = hasLiveSafepayCredentials
  ? sfpyFactory(v1Secret, {
      authType: "secret",
      host,
      timeout: 10000,
    })
  : null;

/**
 * Formats a phone number into standard international E.164 format (+92...)
 */
export function formatE164PhoneNumber(phone: string): string {
  if (!phone) return "+923000000000";
  const cleaned = phone.trim().replace(/[\s\-()]/g, "");
  if (cleaned.startsWith("+")) {
    return cleaned;
  }
  if (cleaned.startsWith("00")) {
    return `+${cleaned.slice(2)}`;
  }
  if (cleaned.startsWith("0")) {
    return `+92${cleaned.slice(1)}`;
  }
  if (cleaned.length === 10 && !cleaned.startsWith("+")) {
    return `+92${cleaned}`;
  }
  return cleaned.startsWith("+") ? cleaned : `+${cleaned}`;
}

/**
 * Helper to generate a simulated developer checkout session
 */
function createSimulatedSession(
  orderId: string,
  redirectUrl: string,
  cancelUrl: string,
): SafepayCheckoutResult {
  const simulatedTracker = `track_sim_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const simulatedToken = `tok_sim_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

  const encodedRedirect = encodeURIComponent(
    `${redirectUrl}${redirectUrl.includes("?") ? "&" : "?"}tracker=${simulatedTracker}&orderId=${orderId}`,
  );
  const encodedCancel = encodeURIComponent(cancelUrl);

  const simulatedCheckoutUrl = `/payment/callback?tracker=${simulatedTracker}&orderId=${orderId}&simulated=true&redirect=${encodedRedirect}&cancel=${encodedCancel}`;

  return {
    checkoutUrl: simulatedCheckoutUrl,
    tracker: simulatedTracker,
    token: simulatedToken,
    isSimulated: true,
  };
}

/**
 * Creates customer, payment session, passport token, and checkout URL.
 */
export async function createSafepayCheckoutSession(
  params: InitiatePaymentParams,
): Promise<SafepayCheckoutResult> {
  const { amountPkr, orderId, customer, redirectUrl, cancelUrl, metadata } =
    params;

  if (!hasLiveSafepayCredentials || !safepayClient) {
    return createSimulatedSession(orderId, redirectUrl, cancelUrl);
  }

  // Amount in lowest denomination (PKR paisas = PKR * 100)
  const amountInPaisas = Math.round(amountPkr * 100);

  try {
    // 1. Optional Customer Creation / Association
    let customerToken: string | undefined = undefined;
    try {
      const nameParts = customer.name.trim().split(" ");
      const firstName = nameParts[0] || "Client";
      const lastName = nameParts.slice(1).join(" ") || "Customer";

      if (safepayClient.customers?.object?.create) {
        const custRes = await safepayClient.customers.object.create({
          first_name: firstName,
          last_name: lastName,
          email: customer.email,
          phone_number: formatE164PhoneNumber(customer.phone),
          country: "PK",
          is_guest: true,
        });
        customerToken = custRes?.data?.token || custRes?.token;
      }
    } catch (custErr) {
      console.warn("Safepay customer creation skipped:", custErr);
    }

    // 2. Safepay strictly accepts only whitelisted metadata keys (primarily order_id)
    const sanitizedMetadata: Record<string, string> = {
      order_id: String(metadata?.order_id || metadata?.order_number || orderId),
    };

    // 3. Create Payment Session (Guest hosted checkout does not require customer user token)
    const sessionRes = await safepayClient.payments.session.setup({
      merchant_api_key: apiKey,
      intent: "CYBERSOURCE",
      mode: "payment",
      entry_mode: "raw",
      currency: "PKR",
      amount: amountInPaisas,
      metadata: sanitizedMetadata,
      include_fees: false,
    });

    const trackerToken = sessionRes?.data?.tracker?.token;
    if (!trackerToken) {
      throw new Error(
        `Safepay session setup failed: ${sessionRes?.status?.message || "No tracker returned"}`,
      );
    }

    // 4. Create Authentication Token (TBT)
    const passportRes = await safepayClient.client.passport.create();
    const tbtToken =
      typeof passportRes?.data === "string"
        ? passportRes.data
        : passportRes?.data?.token || passportRes?.token || "";
    if (!tbtToken) {
      throw new Error("Safepay passport token generation failed");
    }

    // 5. Generate Checkout URL for Hosted Guest Checkout (Safepay automatically appends tracker upon completion)
    const checkoutUrl = safepayClient.checkout.createCheckoutUrl({
      env,
      tracker: trackerToken,
      tbt: tbtToken,
      source: "hosted",
      redirect_url: redirectUrl,
      cancel_url: cancelUrl,
    });

    return {
      checkoutUrl,
      tracker: trackerToken,
      token: tbtToken,
      isSimulated: false,
    };
  } catch (err: unknown) {
    const rawMessage = err instanceof Error ? err.message : String(err);
    console.error("Safepay checkout session setup error:", rawMessage);

    // If running in sandbox or test environment and Safepay servers are unreachable,
    // timing out, or dropping connections ("The request was made but no response was received"),
    // gracefully fall back to the simulated checkout session so orders and consultations
    // can be placed, validated, and verified without breaking developer workflows.
    if (!isProduction) {
      console.warn(
        "⚠️ Safepay sandbox gateway is unreachable or unresponsive. Gracefully falling back to developer simulation checkout.",
      );
      return createSimulatedSession(orderId, redirectUrl, cancelUrl);
    }

    const isNetworkError =
      rawMessage.includes("no response was received") ||
      rawMessage.includes("ENOTFOUND") ||
      rawMessage.includes("ETIMEDOUT") ||
      rawMessage.includes("ECONNREFUSED");

    if (isNetworkError) {
      throw new Error(
        "Safepay payment gateway is currently unreachable. Please check your internet connection or try again shortly.",
      );
    }

    throw err;
  }
}

/**
 * Fetches status of payment tracker
 */
export async function fetchSafepayTrackerStatus(trackerToken: string) {
  const cleanTracker = trackerToken
    ? decodeURIComponent(trackerToken).split("?")[0].split("&")[0].trim()
    : "";

  if (
    !hasLiveSafepayCredentials ||
    !safepayClient ||
    cleanTracker.startsWith("track_sim_")
  ) {
    return {
      state: "TRACKER_ENDED",
      isCompleted: true,
      isSimulated: true,
      success: true,
    };
  }

  try {
    const response = await safepayClient.reporter.payments.fetch(cleanTracker);
    const tracker = response?.data?.tracker || response?.data;
    const trackerState = tracker?.state || response?.data?.state;
    const isCompleted =
      trackerState === "TRACKER_ENDED" ||
      trackerState === "COMPLETED" ||
      trackerState === "PAID" ||
      tracker?.is_success === true;

    return {
      state: trackerState,
      isCompleted,
      purchaseTotals: tracker?.purchase_totals,
      action: response?.data?.action,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);

    const isNetworkError =
      message.includes("no response was received") ||
      message.includes("ENOTFOUND") ||
      message.includes("ETIMEDOUT") ||
      message.includes("ECONNREFUSED") ||
      message.includes("network error") ||
      message.includes("fetch failed");

    if (isNetworkError) {
      console.warn(
        `[Safepay] Payment status verification network warning: ${message}`,
      );
    } else {
      console.error("Error fetching Safepay tracker:", message);
    }

    if (!isProduction && cleanTracker.startsWith("track_sim_")) {
      return {
        state: "TRACKER_ENDED",
        isCompleted: true,
        isSimulated: true,
        success: true,
      };
    }

    return { error: message, isCompleted: false, isNetworkError };
  }
}

/**
 * Validates HMAC SHA-256 webhook signature against raw request body
 */
export function verifySafepayWebhookSignature(
  rawBody: string,
  signatureHeader: string | null,
): boolean {
  if (!webhookSecret || !signatureHeader) return false;

  try {
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    const expectedBuffer = Buffer.from(expectedSignature, "utf8");
    const providedBuffer = Buffer.from(signatureHeader, "utf8");

    if (expectedBuffer.length !== providedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuffer, providedBuffer);
  } catch (err) {
    console.error("Webhook signature verification error:", err);
    return false;
  }
}
