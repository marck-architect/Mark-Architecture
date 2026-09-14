import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { createSafepayCheckoutSession } from "@/lib/server/safepay";

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

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    let orderId = orderNumber;

    try {
      const { data, error } = await supabase
        .from("orders")
        .insert({
          order_number: orderNumber,
          client_name: customer.name,
          client_email: customer.email,
          client_phone: customer.phone,
          covered_area_sqft: coveredAreaSqft || null,
          selected_disciplines: selectedDisciplines || null,
          total_amount_pkr: calculatedTotalPkr,
          advance_amount_pkr: advancePkr,
          remaining_balance_pkr: remainingBalancePkr,
          payment_type: paymentType,
          payment_status: "pending",
          attachment_urls: attachmentUrls || [],
          notes: notes || null,
        })
        .select()
        .single();

      if (error) {
        console.warn("Supabase orders insert warning:", error.message);
      } else if (data?.id) {
        orderId = data.id;
      }
    } catch (dbErr) {
      console.warn("Database storage deferred:", dbErr);
    }

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      req.headers.get("origin") ||
      "http://localhost:3000";

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
      },
    });

    try {
      await supabase
        .from("orders")
        .update({ safepay_tracker: safepayResult.tracker })
        .eq("id", orderId);
    } catch {
      // Non-blocking if table is waiting for migration
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
