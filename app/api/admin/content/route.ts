import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminAuth } from "@/lib/server/adminAuth";
import { logAdminAction } from "@/lib/server/audit";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAdminAuth();
    if (!authResult.success) return authResult.response;

    const { supabase } = authResult.admin;
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section");

    if (section) {
      const { data, error } = await supabase
        .from("site_content")
        .select("content")
        .eq("section_key", section)
        .single();

      if (!error && data?.content) {
        return NextResponse.json({
          success: true,
          section,
          data: data.content,
        });
      }
      return NextResponse.json({ success: true, section, data: null });
    }

    const { data, error } = await supabase.from("site_content").select("*");
    if (!error && data) {
      return NextResponse.json({ success: true, data });
    }
    return NextResponse.json({ success: true, data: [] });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authResult = await requireAdminAuth();
    if (!authResult.success) return authResult.response;

    const { supabase, user } = authResult.admin;
    const body = await request.json();
    const { section_key, content } = body;

    if (!section_key || !content) {
      return NextResponse.json(
        { error: "section_key and content JSON are required." },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("site_content")
      .upsert(
        {
          section_key,
          content,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "section_key" },
      )
      .select()
      .single();

    if (error) console.warn("Supabase site_content upsert warning:", error);

    await logAdminAction({
      adminEmail: user.email,
      action: "UPDATE_SITE_CONTENT",
      entity: "site_content",
      entityId: section_key,
      metadata: { section_key },
    });

    // Invalidate homepage and about page caches
    revalidatePath("/");
    revalidatePath("/about");

    return NextResponse.json({
      success: true,
      data: data || { section_key, content },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
