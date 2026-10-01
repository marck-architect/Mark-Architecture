import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";
import { requireAdminAuth } from "@/lib/server/adminAuth";
import { logAdminAction } from "@/lib/server/audit";
import type { AdminFaq } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const LOCAL_FAQS_FILE = path.join(process.cwd(), "data", "faqs.json");

export function readLocalFaqs(): AdminFaq[] {
  try {
    if (fs.existsSync(LOCAL_FAQS_FILE)) {
      const content = fs.readFileSync(LOCAL_FAQS_FILE, "utf8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Notice: Reading local faqs data:", err);
  }
  return [];
}

export function writeLocalFaqs(faqs: AdminFaq[]): void {
  try {
    const dir = path.dirname(LOCAL_FAQS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(
      LOCAL_FAQS_FILE,
      JSON.stringify(faqs, null, 2),
      "utf8",
    );
  } catch (err) {
    console.warn("Notice: Writing local faqs data:", err);
  }
}

export async function GET() {
  try {
    const authResult = await requireAdminAuth();
    if (!authResult.success) return authResult.response;

    const { supabase } = authResult.admin;

    // 1. Try dedicated faqs table
    try {
      const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return NextResponse.json({ success: true, data });
      }
    } catch {
      // Fallback
    }

    // 2. Check local data/faqs.json
    const localData = readLocalFaqs();
    if (localData && localData.length > 0) {
      return NextResponse.json({ success: true, data: localData });
    }

    // 3. Fallback to site_content
    try {
      const { data: scData } = await supabase
        .from("site_content")
        .select("content")
        .eq("section_key", "faqs")
        .single();

      if (scData?.content && Array.isArray(scData.content) && scData.content.length > 0) {
        return NextResponse.json({ success: true, data: scData.content });
      }
    } catch {
      // Fallback
    }

    return NextResponse.json({ success: true, data: localData });
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

    const newFaq: AdminFaq = {
      id: `faq_${Date.now()}`,
      question,
      answer,
      category: category || "General",
      display_order: Number(display_order) || 99,
      is_published: is_published !== undefined ? Boolean(is_published) : true,
    };

    // 1. Insert into Supabase faqs table
    try {
      const { data, error } = await supabase
        .from("faqs")
        .insert({
          question: newFaq.question,
          answer: newFaq.answer,
          category: newFaq.category,
          display_order: newFaq.display_order,
          is_published: newFaq.is_published,
        })
        .select()
        .single();

      if (!error && data) {
        newFaq.id = String(data.id);
      }
    } catch (dbErr) {
      console.warn("Notice: Inserting FAQ to Supabase table:", dbErr);
    }

    // 2. Persist to local JSON file
    const current = readLocalFaqs();
    const updatedList = [newFaq, ...current];
    writeLocalFaqs(updatedList);

    // 3. Sync to Supabase site_content
    try {
      await supabase.from("site_content").upsert(
        {
          section_key: "faqs",
          content: updatedList,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "section_key" },
      );
    } catch (scErr) {
      console.warn("Notice: Updating site_content faqs:", scErr);
    }

    await logAdminAction({
      adminEmail: user.email,
      action: "CREATE_FAQ",
      entity: "faq",
      entityId: newFaq.id,
      metadata: { question },
    });

    try {
      revalidatePath("/faqs");
      revalidatePath("/");
    } catch (revalErr) {
      console.warn("revalidatePath error:", revalErr);
    }

    return NextResponse.json({ success: true, data: newFaq });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
