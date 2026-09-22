import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/server/adminAuth";
import { logAdminAction } from "@/lib/server/audit";

export const runtime = "nodejs";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authResult = await requireAdminAuth();
    if (!authResult.success) {
      return authResult.response;
    }

    const { id } = await params;
    const { supabase, user } = authResult.admin;

    const { error } = await supabase
      .from("blocked_dates")
      .delete()
      .eq("id", id);
    if (error) {
      console.warn("Supabase blocked_dates delete warning:", error);
    }

    await logAdminAction({
      adminEmail: user.email,
      action: "DELETE_BLOCKED_DATE",
      entity: "blocked_date",
      entityId: id,
    });

    return NextResponse.json({ success: true, id });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
