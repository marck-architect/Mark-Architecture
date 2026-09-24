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
    })
  : null;

/**
 * Creates customer, payment session, passport token, and checkout URL.
 */
export async function createSafepayCheckoutSession(
  params: InitiatePaymentParams,
): Promise<SafepayCheckoutResult> {
  const { amountPkr, orderId, customer, redirectUrl, cancelUrl, metadata } =
    params;

  // Amount in lowest denomination (PKR paisas = PKR * 100)
  const amountInPaisas = Math.round(amountPkr * 100);

  if (!hasLiveSafepayCredentials || !safepayClient) {
    // Sandbox Developer Simulation Mode
    // Allows testing full end-to-end booking flow before live merchant keys are issued
    const simulatedTracker = `track_sim_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const simulatedToken = `tok_sim_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    const encodedRedirect = encodeURIComponent(
      `${redirectUrl}${redirectUrl.includes("?") ? "&" : "?"}tracker=${simulatedTracker}&orderId=${orderId}`,
    );
    const encodedCancel = encodeURIComponent(cancelUrl);

    // Provide a callback or sandbox preview URL
    const simulatedCheckoutUrl = `/payment/callback?tracker=${simulatedTracker}&orderId=${orderId}&simulated=true&redirect=${encodedRedirect}&cancel=${encodedCancel}`;

    return {
      checkoutUrl: simulatedCheckoutUrl,
      tracker: simulatedTracker,
      token: simulatedToken,
      isSimulated: true,
    };
  }

  // 1. Optional Customer Creation / Association
  let customerToken: string | undefined = undefined;
  try {
    const nameParts = customer.name.trim().split(" ");
    const firstName = nameParts[0] || "Client";
    const lastName = nameParts.slice(1).join(" ") || "Customer";

    if (safepayClient.customers?.object?.create) {
      const custRes = await safepayClient.customers.object.create({
        payload: {
          first_name: firstName,
          last_name: lastName,
          email: customer.email,
          phone_number: customer.phone,
          country: "PK",
          is_guest: true,
        },
      });
      customerToken = custRes?.data?.token;
    }
  } catch (custErr) {
    console.warn("Safepay customer creation skipped:", custErr);
  }

  // 2. Safepay strictly accepts only whitelisted metadata keys (primarily order_id)
  const sanitizedMetadata: Record<string, string> = {
    order_id: String(metadata?.order_id || metadata?.order_number || orderId),
  };

  // 3. Create Payment Session
  const sessionRes = await safepayClient.payments.session.setup({
    merchant_api_key: apiKey,
    intent: "CYBERSOURCE",
    mode: "payment",
    entry_mode: "raw",
    currency: "PKR",
    amount: amountInPaisas,
    metadata: sanitizedMetadata,
    include_fees: false,
    ...(customerToken ? { user: customerToken } : {}),
  });

  const trackerToken = sessionRes?.data?.tracker?.token;
  if (!trackerToken) {
    throw new Error(
      `Safepay session setup failed: ${sessionRes?.status?.message || "No tracker returned"}`,
    );
  }

  // 3. Create Authentication Token (TBT)
  const passportRes = await safepayClient.client.passport.create();
  const tbtToken = passportRes?.data;
  if (!tbtToken) {
    throw new Error("Safepay passport token generation failed");
  }

  // 4. Generate Checkout URL
  const separator = redirectUrl.includes("?") ? "&" : "?";
  const finalRedirectUrl = redirectUrl.includes("tracker=")
    ? redirectUrl
    : `${redirectUrl}${separator}tracker=${encodeURIComponent(trackerToken)}`;

  const checkoutUrl = safepayClient.checkout.createCheckoutUrl({
    env,
    tracker: trackerToken,
    tbt: tbtToken,
    source: "hosted",
    user_id: customerToken,
    redirect_url: finalRedirectUrl,
    cancel_url: cancelUrl,
  });

  return {
    checkoutUrl,
    tracker: trackerToken,
    token: tbtToken,
    isSimulated: false,
  };
}

/**
 * Fetches status of payment tracker
 */
export async function fetchSafepayTrackerStatus(trackerToken: string) {
  if (!hasLiveSafepayCredentials || !safepayClient) {
    return {
      state: "TRACKER_ENDED",
      isCompleted: true,
      isSimulated: true,
      success: true,
    };
  }

  try {
    const response = await safepayClient.reporter.payments.fetch(trackerToken);
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
    console.error("Error fetching Safepay tracker:", message);
    return { error: message, isCompleted: false };
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
