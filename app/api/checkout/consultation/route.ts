import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { getSiteContent } from "@/lib/server/content";
import { defaultPricingSettings } from "@/data/pricing";
import type { PricingSettingsContent } from "@/types";

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
      paymentScreenshotUrl,
    } = body;

    if (!name || !email || !phone || !bookingDate || !bookingTime) {
      return NextResponse.json(
        { error: "Missing required booking details" },
        { status: 400 },
      );
    }

    if (!paymentScreenshotUrl) {
      return NextResponse.json(
        { error: "A payment screenshot is required to confirm this booking" },
        { status: 400 },
      );
    }

    // Authoritative PKR Pricing from dynamic studio settings
    const pricingSettings = await getSiteContent<PricingSettingsContent>(
      "pricing_settings",
      defaultPricingSettings,
    );
    const basicPrice =
      pricingSettings?.consultationCalls?.basicCallPrice || 3000;
    const premiumPrice =
      pricingSettings?.consultationCalls?.premiumCallPrice || 5000;

    const pricing: Record<string, number> = {
      "Basic Call": basicPrice,
      "Premium Call": premiumPrice,
    };
    const pricePkr = pricing[callTier] || pricing["Basic Call"];
    const tierName = pricing[callTier] ? callTier : "Basic Call";

    const consultationId = crypto.randomUUID();

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // Save record to Supabase with tracker already attached
    try {
      const { data, error } = await supabase
        .from("consultations")
        .insert({
          id: consultationId,
          client_name: name,
          client_email: email,
          client_phone: phone,
          tier_name: tierName,
          price_pkr: pricePkr,
          booking_date: bookingDate,
          booking_time: bookingTime,
          attachment_urls: [...(attachmentUrls || []), paymentScreenshotUrl],
          notes: message || null,
          payment_status: "pending",
        })
        .select()
        .single();

      if (error) {
        console.warn("Supabase consultation insert warning:", error.message);
      }
    } catch (dbErr) {
      console.warn("Database storage deferred:", dbErr);
    }

    return NextResponse.json({
      success: true,
      consultationId,
      pricePkr,
      tierName,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("Consultation checkout API error:", errorMsg);
    return NextResponse.json(
      { error: errorMsg || "Failed to submit booking" },
      { status: 500 },
    );
  }
}
