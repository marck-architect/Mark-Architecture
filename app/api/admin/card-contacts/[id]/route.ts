import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/server/adminAuth";
import { updateCardContact, deleteCardContact } from "@/lib/server/cardContacts";
import { logAdminAction } from "@/lib/server/audit";

export const runtime = "nodejs";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authResult = await requireAdminAuth();
    if (!authResult.success) return authResult.response;
    const { user } = authResult.admin;

    const { id } = await params;
    const body = await req.json();
    const { status, notes } = body;

    const updated = await updateCardContact(id, {
      ...(status ? { status } : {}),
      ...(notes !== undefined ? { notes } : {}),
    });

    if (!updated) {
      return NextResponse.json(
        { error: "Contact record not found or could not be updated." },
        { status: 404 },
      );
    }

    await logAdminAction({
      adminEmail: user.email,
      action: "UPDATE_CARD_CONTACT",
      entity: "card_contacts",
      entityId: id,
      metadata: { status, notes },
    });

    return NextResponse.json({
      success: true,
      message: "Contact updated successfully.",
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("[CardContacts API PATCH] error:", errorMsg);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authResult = await requireAdminAuth();
    if (!authResult.success) return authResult.response;
    const { user } = authResult.admin;

    const { id } = await params;
    const deleted = await deleteCardContact(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Contact not found or already deleted." },
        { status: 404 },
      );
    }

    await logAdminAction({
      adminEmail: user.email,
      action: "DELETE_CARD_CONTACT",
      entity: "card_contacts",
      entityId: id,
    });

    return NextResponse.json({
      success: true,
      message: "Contact deleted successfully.",
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("[CardContacts API DELETE] error:", errorMsg);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
