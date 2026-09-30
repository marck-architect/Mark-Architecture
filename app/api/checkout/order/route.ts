import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { createSafepayCheckoutSession } from "@/lib/server/safepay";
import { getAppOrigin } from "@/lib/server/origin";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customer,
      items,
      paymentType = "full",
      coveredAreaSqft,
      selectedDisciplines,
      notes,
      attachmentUrls,
    } = body;

    if (!customer?.name || !customer?.email || !customer?.phone) {
      return NextResponse.json(
        { error: "Missing customer contact details" },
        { status: 400 },
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Calculate authoritative totals
    const calculatedTotalPkr = items.reduce(
      (sum: number, item: { price: number; quantity?: number }) =>
        sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
      0,
    );

    if (calculatedTotalPkr <= 0) {
      return NextResponse.json(
        { error: "Invalid order amount" },
        { status: 400 },
      );
    }

    const isAdvance = paymentType === "50_percent_advance";
    const advancePkr = isAdvance
      ? Math.round(calculatedTotalPkr * 0.5)
      : calculatedTotalPkr;
    const remainingBalancePkr = calculatedTotalPkr - advancePkr;

    const orderNumber = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const orderId = crypto.randomUUID();

    const appUrl = getAppOrigin(req);
    const redirectUrl = `${appUrl}/payment/callback?orderId=${orderId}&type=order`;
    const cancelUrl = `${appUrl}/collection?canceled=true`;

    const safepayResult = await createSafepayCheckoutSession({
      amountPkr: advancePkr,
      orderId,
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      },
      redirectUrl,
      cancelUrl,
      metadata: {
        order_id: String(orderId),
        order_number: orderNumber,
      },
    });

    // Build item summary if client notes are omitted
    const itemSummary =
      Array.isArray(items) && items.length > 0
        ? items
            .map(
              (i: { title?: string; name?: string; tier?: string; quantity?: number }) =>
                `${i.title || i.name || "Design Item"}${i.tier ? ` (${i.tier})` : ""}${Number(i.quantity) > 1 ? ` x${i.quantity}` : ""}`,
            )
            .join("; ")
        : null;

    const orderPayload = {
      id: orderId,
      order_number: orderNumber,
      client_name: customer.name,
      client_email: customer.email,
      client_phone: customer.phone,
      covered_area_sqft: coveredAreaSqft ? Number(coveredAreaSqft) : null,
      selected_disciplines: selectedDisciplines || items || null,
      total_amount_pkr: calculatedTotalPkr,
      advance_amount_pkr: advancePkr,
      remaining_balance_pkr: remainingBalancePkr,
      payment_type: paymentType,
      payment_status: "pending",
      safepay_tracker: safepayResult.tracker,
      attachment_urls: attachmentUrls || [],
      notes: notes || itemSummary || null,
    };

    try {
      const { getSupabaseAdminClient } = await import("@/lib/server/supabaseAdmin");
      const supabaseAdmin = getSupabaseAdminClient();
      const { error } = await supabaseAdmin.from("orders").insert(orderPayload);

      if (error) {
        console.warn("[Orders Checkout] Primary admin insert notice:", error.message);
        // Fallback to cookie client
        const cookieStore = await cookies();
        const supabase = createClient(cookieStore);
        const { error: cookieErr } = await supabase.from("orders").insert(orderPayload);
        if (cookieErr) {
          console.warn("[Orders Checkout] Fallback client insert notice:", cookieErr.message);
        }
      }
    } catch (dbErr) {
      console.warn("[Orders Checkout] Database storage notice:", dbErr);
    }

    return NextResponse.json({
      success: true,
      orderNumber,
      orderId,
      checkoutUrl: safepayResult.checkoutUrl,
      tracker: safepayResult.tracker,
      chargedAmount: advancePkr,
      totalAmount: calculatedTotalPkr,
      isSimulated: safepayResult.isSimulated || false,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("Order checkout API error:", errorMsg);
    return NextResponse.json(
      { error: errorMsg || "Failed to initialize Safepay session" },
      { status: 500 },
    );
  }
}
