import { NextRequest, NextResponse } from "next/server";
import { verifySafepayWebhookSignature } from "@/lib/server/safepay";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-sfpy-signature");

    // Cryptographic signature check
    const isValid = verifySafepayWebhookSignature(rawBody, signature);
    if (!isValid && process.env.SAFEPAY_WEBHOOK_SECRET) {
      console.warn("Unauthorized webhook attempt: invalid signature");
      return NextResponse.json(
        { error: "Invalid cryptographic signature" },
        { status: 401 },
      );
    }

    let payload: Record<string, unknown> = {};
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        { error: "Malformed JSON payload" },
        { status: 400 },
      );
    }

    const event = (payload?.event as string) || "";
    const data = (payload?.data as Record<string, unknown>) || {};
    const tracker = (data?.tracker as string) || (data?.token as string) || "";

    console.log(`[Safepay Webhook] Event: ${event} | Tracker: ${tracker}`);

    if (event === "payment.succeeded" || data?.status === "PAID") {
      const { getSupabaseAdminClient } =
        await import("@/lib/server/supabaseAdmin");
      const supabaseAdmin = getSupabaseAdminClient();

      // Check if this tracker belongs to a consultation
      try {
        const { data: consultation } = await supabaseAdmin
          .from("consultations")
          .select("id, payment_status")
          .eq("safepay_tracker", tracker)
          .maybeSingle();

        if (consultation) {
          const { processPaidConsultation } =
            await import("@/lib/server/consultationWorkflow");
          await processPaidConsultation(consultation.id, tracker);
        } else {
          // Attempt updating order
          await supabaseAdmin
            .from("orders")
            .update({
              payment_status: "advance_paid",
              updated_at: new Date().toISOString(),
            })
            .eq("safepay_tracker", tracker);
        }
      } catch (err) {
        console.warn("Could not process webhook event:", err);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("Safepay webhook processing error:", errorMsg);
    return NextResponse.json(
      { error: errorMsg || "Webhook handling failed" },
      { status: 500 },
    );
  }
}
