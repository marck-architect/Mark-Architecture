import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Public order lookup by id — used by the post-checkout order status /
 * receipt page. No auth required: the order UUID itself is the access
 * token (same pattern most order-confirmation / receipt links use), and
 * only a safe subset of fields is returned.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const { getSupabaseAdminClient } = await import("@/lib/server/supabaseAdmin");
    const supabaseAdmin = getSupabaseAdminClient();

    const { data, error } = await supabaseAdmin
      .from("orders")
      .select(
        "id, order_number, client_name, total_amount_pkr, advance_amount_pkr, remaining_balance_pkr, payment_type, payment_status, selected_disciplines, attachment_urls, notes, created_at",
      )
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Order lookup error:", message);
    return NextResponse.json({ error: "Failed to load order" }, { status: 500 });
  }
}
