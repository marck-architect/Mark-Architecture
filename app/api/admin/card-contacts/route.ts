import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/server/adminAuth";
import { getCardContacts, saveCardContact } from "@/lib/server/cardContacts";
import { logAdminAction } from "@/lib/server/audit";

export const runtime = "nodejs";

export async function GET() {
  try {
    const authResult = await requireAdminAuth();
    if (!authResult.success) return authResult.response;

    const contacts = await getCardContacts();
    return NextResponse.json({
      success: true,
      contacts,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("[CardContacts API GET] error:", errorMsg);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAdminAuth();
    if (!authResult.success) return authResult.response;
    const { user } = authResult.admin;

    const body = await req.json();
    const { name, email, phone, notes } = body;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Name, email, and phone number are required." },
        { status: 400 },
      );
    }

    const saved = await saveCardContact({
      name,
      email,
      phone,
      notes,
      email_sent: false,
    });

    await logAdminAction({
      adminEmail: user.email,
      action: "CREATE_CARD_CONTACT",
      entity: "card_contacts",
      entityId: saved.id,
      metadata: { name, email, phone },
    });

    return NextResponse.json({
      success: true,
      contact: saved,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("[CardContacts API POST] error:", errorMsg);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
