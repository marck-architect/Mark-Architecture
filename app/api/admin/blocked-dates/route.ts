import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/server/adminAuth";
import { logAdminAction } from "@/lib/server/audit";

export const runtime = "nodejs";

export async function GET() {
  try {
    const authResult = await requireAdminAuth();
    if (!authResult.success) {
      return authResult.response;
    }

    const { supabase } = authResult.admin;

    const { data, error } = await supabase
      .from("blocked_dates")
      .select("*")
      .order("date", { ascending: true });

    if (!error && data && data.length > 0) {
      return NextResponse.json({ success: true, data });
    }

    return NextResponse.json({ success: true, data: [] });
  } catch (err: unknown) {
    return NextResponse.json({ success: true, data: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAdminAuth();
    if (!authResult.success) {
      return authResult.response;
    }

    const { supabase, user } = authResult.admin;
    const body = await request.json();
    const { date, start_time, end_time, reason, is_full_day } = body;

    if (!date || !reason) {
      return NextResponse.json(
        { error: "Date and reason are required." },
        { status: 400 },
      );
    }

    const newBlocked = {
      date,
      start_time: start_time || null,
      end_time: end_time || null,
      reason,
      is_full_day: is_full_day !== undefined ? Boolean(is_full_day) : true,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("blocked_dates")
      .insert(newBlocked)
      .select()
      .single();

    if (error) {
      console.warn("Supabase blocked_dates insert warning:", error);
    }

    const created = data || { id: `block_${Date.now()}`, ...newBlocked };

    await logAdminAction({
      adminEmail: user.email,
      action: "CREATE_BLOCKED_DATE",
      entity: "blocked_date",
      entityId: created.id,
      metadata: { date, reason },
    });

    return NextResponse.json({ success: true, data: created });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
