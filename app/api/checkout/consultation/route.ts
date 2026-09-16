import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { createSafepayCheckoutSession } from "@/lib/server/safepay";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      callTier,
      bookingDate,
      bookingTime,
      message,
      attachmentUrls,
    } = body;

    if (!name || !email || !phone || !bookingDate || !bookingTime) {
      return NextResponse.json(
        { error: "Missing required booking details" },
        { status: 400 },
      );
    }

    // Authoritative PKR Pricing
    const pricing: Record<string, number> = {
      "Basic Call": 3000,
      "Premium Call": 5000,
    };
    const pricePkr = pricing[callTier] || pricing["Basic Call"];
    const tierName = pricing[callTier] ? callTier : "Basic Call";

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    let consultationId = `cons_${Date.now()}`;

    // Try saving record to Supabase
    try {
      const { data, error } = await supabase
        .from("consultations")
        .insert({
          client_name: name,
          client_email: email,
          client_phone: phone,
          tier_name: tierName,
          price_pkr: pricePkr,
          booking_date: bookingDate,
          booking_time: bookingTime,
          attachment_urls: attachmentUrls || [],
          notes: message || null,
          payment_status: "pending",
        })
        .select()
        .single();

      if (error) {
        console.warn("Supabase consultation insert warning:", error.message);
      } else if (data?.id) {
        consultationId = data.id;
      }
    } catch (dbErr) {
      console.warn("Database storage deferred:", dbErr);
    }

    // Generate Safepay Session
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      req.headers.get("origin") ||
      "http://localhost:3000";

    const redirectUrl = `${appUrl}/payment/callback?orderId=${consultationId}&type=consultation`;
    const cancelUrl = `${appUrl}/consultation?canceled=true`;

    const safepayResult = await createSafepayCheckoutSession({
      amountPkr: pricePkr,
      orderId: consultationId,
      customer: { name, email, phone },
      redirectUrl,
      cancelUrl,
      metadata: {
        order_id: String(consultationId),
      },
    });

    // Update record with tracker if possible
    try {
      await supabase
        .from("consultations")
        .update({
          safepay_tracker: safepayResult.tracker,
          safepay_token: safepayResult.token,
        })
        .eq("id", consultationId);
    } catch {
      // Non-blocking if table is waiting for migration
    }

    return NextResponse.json({
      success: true,
      consultationId,
      checkoutUrl: safepayResult.checkoutUrl,
      tracker: safepayResult.tracker,
      isSimulated: safepayResult.isSimulated || false,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("Consultation checkout API error:", errorMsg);
    return NextResponse.json(
      { error: errorMsg || "Failed to initialize Safepay session" },
      { status: 500 },
    );
  }
}
