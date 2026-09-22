import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/server/adminAuth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAdminAuth();
    if (!authResult.success) return authResult.response;

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.toLowerCase();

    const { supabase } = authResult.admin;
    const { data, error } = await supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    let logs = !error && data && data.length > 0 ? data : [];

    if (search) {
      logs = logs.filter(
        (l: any) =>
          l.admin_email?.toLowerCase().includes(search) ||
          l.action?.toLowerCase().includes(search) ||
          l.entity?.toLowerCase().includes(search),
      );
    }

    return NextResponse.json({ success: true, data: logs });
  } catch (err: unknown) {
    return NextResponse.json({ success: true, data: [] });
  }
}
