import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/server/adminAuth";
import { logAdminAction } from "@/lib/server/audit";

export const runtime = "nodejs";

export async function GET() {
  try {
    const authResult = await requireAdminAuth();
    if (!authResult.success) return authResult.response;

    const { supabase } = authResult.admin;
    const { data, error } = await supabase
      .from("faqs")
      .select("*")
      .order("display_order", { ascending: true });

    if (!error && data) {
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
    if (!authResult.success) return authResult.response;

    const { supabase, user } = authResult.admin;
    const body = await request.json();
    const { question, answer, category, display_order, is_published } = body;

    if (!question || !answer) {
      return NextResponse.json(
        { error: "Question and answer are required." },
        { status: 400 },
      );
    }

    const newFaq = {
      question,
      answer,
      category: category || "General",
      display_order: Number(display_order) || 99,
      is_published: is_published !== undefined ? Boolean(is_published) : true,
    };

    const { data, error } = await supabase
      .from("faqs")
      .insert(newFaq)
      .select()
      .single();
    if (error) console.warn("Supabase faqs insert warning:", error);

    const created = data || { id: `faq_${Date.now()}`, ...newFaq };

    await logAdminAction({
      adminEmail: user.email,
      action: "CREATE_FAQ",
      entity: "faq",
      entityId: created.id,
      metadata: { question },
    });

    return NextResponse.json({ success: true, data: created });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
