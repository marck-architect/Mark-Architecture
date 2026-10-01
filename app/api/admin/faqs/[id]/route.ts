import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminAuth } from "@/lib/server/adminAuth";
import { logAdminAction } from "@/lib/server/audit";
import { readLocalFaqs, writeLocalFaqs } from "../route";
import type { AdminFaq } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

async function handleUpdate(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authResult = await requireAdminAuth();
    if (!authResult.success) return authResult.response;

    const { id } = await params;
    const { supabase, user } = authResult.admin;
    const body = await request.json();

    const currentFaqs = readLocalFaqs();
    let targetFaq: AdminFaq = {
      id,
      question: body.question || "FAQ",
      answer: body.answer || "",
      category: body.category || "General",
      display_order: Number(body.display_order) || 99,
      is_published: body.is_published !== undefined ? Boolean(body.is_published) : true,
    };

    let found = false;
    const updatedList: AdminFaq[] = currentFaqs.map((f) => {
      if (f.id === id) {
        found = true;
        targetFaq = {
          ...f,
          ...body,
          id, // ensure ID is preserved
        };
        return targetFaq;
      }
      return f;
    });

    if (!found) {
      updatedList.push(targetFaq);
    }

    // 1. Persist to local JSON file
    writeLocalFaqs(updatedList);

    // 2. Sync to Supabase site_content
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

    // 3. Update in dedicated faqs table
    try {
      const { data, error } = await supabase
        .from("faqs")
        .update(body)
        .eq("id", id)
        .select()
        .single();
      if (error) console.warn("Supabase faqs update warning:", error);
      if (data) {
        targetFaq = data;
      }
    } catch (dbErr) {
      console.warn("Notice: Updating Supabase table faqs:", dbErr);
    }

    await logAdminAction({
      adminEmail: user.email,
      action: "UPDATE_FAQ",
      entity: "faq",
      entityId: id,
      metadata: body,
    });

    try {
      revalidatePath("/faqs");
      revalidatePath("/");
    } catch (revalErr) {
      console.warn("revalidatePath error:", revalErr);
    }

    return NextResponse.json({ success: true, data: targetFaq });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  params: { params: Promise<{ id: string }> },
) {
  return handleUpdate(request, params);
}

export async function PATCH(
  request: NextRequest,
  params: { params: Promise<{ id: string }> },
) {
  return handleUpdate(request, params);
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

    // 1. Remove from local JSON file
    const currentFaqs = readLocalFaqs();
    const updatedList = currentFaqs.filter((f) => f.id !== id);
    writeLocalFaqs(updatedList);

    // 2. Sync to Supabase site_content
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
      console.warn("Notice: Syncing deleted faqs to site_content:", scErr);
    }

    // 3. Delete from dedicated faqs table
    try {
      const { error } = await supabase.from("faqs").delete().eq("id", id);
      if (error) console.warn("Supabase faqs delete warning:", error);
    } catch (dbErr) {
      console.warn("Notice: Deleting from Supabase table faqs:", dbErr);
    }

    await logAdminAction({
      adminEmail: user.email,
      action: "DELETE_FAQ",
      entity: "faq",
      entityId: id,
    });

    try {
      revalidatePath("/faqs");
      revalidatePath("/");
    } catch (revalErr) {
      console.warn("revalidatePath error:", revalErr);
    }

    return NextResponse.json({ success: true, id });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
