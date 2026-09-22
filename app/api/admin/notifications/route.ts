import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/server/adminAuth";

export const runtime = "nodejs";

export async function GET() {
  try {
    const authResult = await requireAdminAuth();
    if (!authResult.success) return authResult.response;

    const { supabase } = authResult.admin;
    const { data, error } = await supabase
      .from("admin_notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(30);

    if (!error && data && data.length > 0) {
      return NextResponse.json({ success: true, data });
    }
    return NextResponse.json({ success: true, data: [] });
  } catch (err: unknown) {
    return NextResponse.json({ success: true, data: [] });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authResult = await requireAdminAuth();
    if (!authResult.success) return authResult.response;

    const { supabase } = authResult.admin;
    const body = await request.json();
    const { id, mark_all_read } = body;

    if (mark_all_read) {
      await supabase
        .from("admin_notifications")
        .update({ is_read: true })
        .neq("id", "0");
      return NextResponse.json({ success: true });
    }

    if (id) {
      await supabase
        .from("admin_notifications")
        .update({ is_read: true })
        .eq("id", id);
      return NextResponse.json({ success: true, id });
    }

    return NextResponse.json(
      { error: "Invalid notification payload" },
      { status: 400 },
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
