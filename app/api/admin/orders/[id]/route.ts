import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { GATEKEEPER_COOKIE_NAME, isValidGatekeeperToken } = await import(
      "@/lib/server/adminGatekeeper"
    );
    const gatekeeperCookie = cookieStore.get(GATEKEEPER_COOKIE_NAME)?.value;
    const isGatekeeper = isValidGatekeeperToken(gatekeeperCookie);

    const adminEmail =
      process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL;

    if (!user && !isGatekeeper) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user && adminEmail && user.email?.toLowerCase() !== adminEmail.toLowerCase()) {
      return NextResponse.json(
        { error: "Forbidden: Not an authorized administrator" },
        { status: 403 },
      );
    }

    const { getSupabaseAdminClient } = await import("@/lib/server/supabaseAdmin");
    const supabaseAdmin = getSupabaseAdminClient();

    const isUuid = (val: string) =>
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);

    let query = supabaseAdmin.from("orders").select("*");
    if (isUuid(id)) {
      query = query.or(`id.eq.${id},order_number.eq.${id}`);
    } else {
      query = query.eq("order_number", id);
    }

    let { data, error } = await query.maybeSingle();

    if (error || !data) {
      let fbQuery = supabase.from("orders").select("*");
      if (isUuid(id)) {
        fbQuery = fbQuery.or(`id.eq.${id},order_number.eq.${id}`);
      } else {
        fbQuery = fbQuery.eq("order_number", id);
      }
      const fbResult = await fbQuery.maybeSingle();
      if (fbResult.error) throw fbResult.error;
      data = fbResult.data;
    }

    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    console.error("Failed to fetch order details:", err);
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // 1. Verify User Session & Single-Email Admin Authority (or Gatekeeper cookie)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { GATEKEEPER_COOKIE_NAME, isValidGatekeeperToken } = await import(
      "@/lib/server/adminGatekeeper"
    );
    const gatekeeperCookie = cookieStore.get(GATEKEEPER_COOKIE_NAME)?.value;
    const isGatekeeper = isValidGatekeeperToken(gatekeeperCookie);

    const adminEmail =
      process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL;

    if (!user && !isGatekeeper) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user && adminEmail && user.email?.toLowerCase() !== adminEmail.toLowerCase()) {
      return NextResponse.json(
        { error: "Forbidden: Not an authorized administrator" },
        { status: 403 },
      );
    }

    // 2. Parse Body Updates
    const body = await request.json();
    const {
      payment_status,
      safepay_tracker,
      notes,
      remaining_balance_pkr,
      advance_amount_pkr,
      plot_size,
      covered_area_sqft,
    } = body;

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (payment_status !== undefined) {
      // Normalize 'paid' to 'fully_paid' to satisfy Postgres CHECK constraint
      updates.payment_status = payment_status === "paid" ? "fully_paid" : payment_status;
    }
    if (safepay_tracker !== undefined)
      updates.safepay_tracker = safepay_tracker;
    if (notes !== undefined) updates.notes = notes;
    if (remaining_balance_pkr !== undefined)
      updates.remaining_balance_pkr = Number(remaining_balance_pkr);
    if (advance_amount_pkr !== undefined)
      updates.advance_amount_pkr = Number(advance_amount_pkr);
    if (plot_size !== undefined) updates.plot_size = plot_size;
    if (covered_area_sqft !== undefined)
      updates.covered_area_sqft = Number(covered_area_sqft);

    // 3. Update Order in Supabase
    const { getSupabaseAdminClient } = await import("@/lib/server/supabaseAdmin");
    const supabaseAdmin = getSupabaseAdminClient();

    const isUuid = (val: string) =>
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);

    let updateQuery = supabaseAdmin.from("orders").update(updates);
    if (isUuid(id)) {
      updateQuery = updateQuery.or(`id.eq.${id},order_number.eq.${id}`);
    } else {
      updateQuery = updateQuery.eq("order_number", id);
    }

    let { data, error } = await updateQuery.select().maybeSingle();

    if (error) {
      // Fallback to cookie client
      let fallbackQuery = supabase.from("orders").update(updates);
      if (isUuid(id)) {
        fallbackQuery = fallbackQuery.or(`id.eq.${id},order_number.eq.${id}`);
      } else {
        fallbackQuery = fallbackQuery.eq("order_number", id);
      }
      const fbResult = await fallbackQuery.select().maybeSingle();
      if (fbResult.error) throw fbResult.error;
      data = fbResult.data;
    }

    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    console.error("Failed to update order:", err);
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}
