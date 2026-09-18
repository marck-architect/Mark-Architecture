import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminAuth } from "@/lib/server/adminAuth";
import { logAdminAction } from "@/lib/server/audit";

export const runtime = "nodejs";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authResult = await requireAdminAuth();
    if (!authResult.success) return authResult.response;

    const { id } = await params;
    const { supabase, user } = authResult.admin;
    const body = await request.json();

    const updates = {
      ...body,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("collection_packages")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) console.warn("Supabase collection update warning:", error);

    await logAdminAction({
      adminEmail: user.email,
      action: "UPDATE_COLLECTION_PACKAGE",
      entity: "collection",
      entityId: id,
      metadata: updates,
    });

    revalidatePath("/collection");
    revalidatePath("/");

    return NextResponse.json({
      success: true,
      data: data || { id, ...updates },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authResult = await requireAdminAuth();
    if (!authResult.success) return authResult.response;

    const { id } = await params;
    const { supabase, user } = authResult.admin;

    const { error } = await supabase
      .from("collection_packages")
      .delete()
      .eq("id", id);

    if (error) console.warn("Supabase collection delete warning:", error);

    await logAdminAction({
      adminEmail: user.email,
      action: "DELETE_COLLECTION_PACKAGE",
      entity: "collection",
      entityId: id,
    });

    revalidatePath("/collection");
    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
