import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Public order lookup by order number + the email or phone used at
 * checkout — lets a customer find their /orders/[id] link again without
 * relying on the confirmation email or this browser's local storage.
 */
export async function POST(request: NextRequest) {
  try {
    const { orderNumber, contact } = await request.json();

    if (!orderNumber || !contact) {
      return NextResponse.json(
        { error: "Order number and email or phone are required" },
        { status: 400 },
      );
    }

    const { getSupabaseAdminClient } = await import("@/lib/server/supabaseAdmin");
    const supabaseAdmin = getSupabaseAdminClient();

    const normalizedContact = String(contact).trim().toLowerCase();

    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("id, client_email, client_phone")
      .eq("order_number", String(orderNumber).trim())
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json({ error: "No order found with those details" }, { status: 404 });
    }

    const matches =
      data.client_email?.toLowerCase() === normalizedContact ||
      data.client_phone?.replace(/\s+/g, "") === normalizedContact.replace(/\s+/g, "");

    if (!matches) {
      return NextResponse.json({ error: "No order found with those details" }, { status: 404 });
    }

    return NextResponse.json({ success: true, orderId: data.id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Order lookup error:", message);
    return NextResponse.json({ error: "Failed to look up order" }, { status: 500 });
  }
}
