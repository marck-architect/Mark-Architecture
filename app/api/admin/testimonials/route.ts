import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";
import { requireAdminAuth } from "@/lib/server/adminAuth";
import { logAdminAction } from "@/lib/server/audit";
import type { AdminTestimonial } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const LOCAL_TESTIMONIALS_FILE = path.join(
  process.cwd(),
  "data",
  "testimonials.json",
);

export function readLocalTestimonials(): AdminTestimonial[] {
  try {
    if (fs.existsSync(LOCAL_TESTIMONIALS_FILE)) {
      const content = fs.readFileSync(LOCAL_TESTIMONIALS_FILE, "utf8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return parsed.map((t: any) => ({
          ...t,
          review: t.review || t.quote || "",
          position: t.position || t.client_role || null,
          photo_url: t.photo_url || t.avatar_url || null,
        }));
      }
    }
  } catch (err) {
    console.warn("Notice: Reading local testimonials data:", err);
  }
  return [];
}

export function writeLocalTestimonials(testimonials: AdminTestimonial[]): void {
  try {
    const dir = path.dirname(LOCAL_TESTIMONIALS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(
      LOCAL_TESTIMONIALS_FILE,
      JSON.stringify(testimonials, null, 2),
      "utf8",
    );
  } catch (err) {
    console.warn("Notice: Writing local testimonials data:", err);
  }
}

export async function GET() {
  try {
    const authResult = await requireAdminAuth();
    if (!authResult.success) return authResult.response;

    const { supabase } = authResult.admin;
    try {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        const normalized: AdminTestimonial[] = data.map((t: any) => ({
          id: String(t.id),
          client_name: t.client_name,
          company: t.company || null,
          position: t.position || t.client_role || null,
          review: t.review || t.quote || "",
          rating: Number(t.rating) || 5,
          photo_url: t.photo_url || t.avatar_url || null,
          project_title: t.project_title || null,
          is_featured: Boolean(t.is_featured),
          is_published: t.is_published !== false,
          display_order: Number(t.display_order) || 0,
          created_at: t.created_at,
        }));
        return NextResponse.json({ success: true, data: normalized });
      }
    } catch {
      // Fallback
    }

    const localData = readLocalTestimonials();
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
    const {
      client_name,
      company,
      position,
      review,
      rating,
      photo_url,
      project_title,
      is_featured,
      is_published,
      display_order,
    } = body;

    if (!client_name || !review) {
      return NextResponse.json(
        { error: "Client name and review text are required." },
        { status: 400 },
      );
    }

    let created: AdminTestimonial = {
      id: `test_${Date.now()}`,
      client_name,
      company: company || undefined,
      position: position || undefined,
      review,
      rating: Number(rating) || 5,
      photo_url: photo_url || undefined,
      project_title: project_title || undefined,
      is_featured: Boolean(is_featured),
      is_published: is_published !== undefined ? Boolean(is_published) : true,
      display_order: Number(display_order) || 99,
      created_at: new Date().toISOString(),
    };

    // Support both Supabase table column naming conventions
    const dbPayloadQuote = {
      client_name,
      company: company || null,
      client_role: position || null,
      quote: review,
      rating: Number(rating) || 5,
      avatar_url: photo_url || null,
      project_title: project_title || null,
      is_featured: Boolean(is_featured),
      is_published: is_published !== undefined ? Boolean(is_published) : true,
      display_order: Number(display_order) || 99,
    };

    const dbPayloadReview = {
      client_name,
      company: company || null,
      position: position || null,
      review: review,
      rating: Number(rating) || 5,
      photo_url: photo_url || null,
      project_title: project_title || null,
      is_featured: Boolean(is_featured),
      is_published: is_published !== undefined ? Boolean(is_published) : true,
      display_order: Number(display_order) || 99,
    };

    try {
      let { data, error } = await supabase
        .from("testimonials")
        .insert(dbPayloadQuote)
        .select()
        .single();

      if (error) {
        const retry = await supabase
          .from("testimonials")
          .insert(dbPayloadReview)
          .select()
          .single();
        if (!retry.error && retry.data) {
          data = retry.data;
          error = null;
        }
      }

      if (!error && data) {
        created = {
          id: String(data.id),
          client_name: data.client_name,
          company: data.company,
          position: data.position || data.client_role || position,
          review: data.review || data.quote || review,
          rating: Number(data.rating) || Number(rating) || 5,
          photo_url: data.photo_url || data.avatar_url || photo_url,
          project_title: data.project_title || project_title,
          is_featured: Boolean(data.is_featured),
          is_published: data.is_published !== false,
          display_order: Number(data.display_order) || Number(display_order) || 99,
          created_at: data.created_at,
        };
      }
    } catch (dbErr) {
      console.warn("Notice: Inserting testimonial to DB fallback:", dbErr);
    }

    // Persist to local JSON file
    const current = readLocalTestimonials();
    const updatedList = [created, ...current];
    writeLocalTestimonials(updatedList);

    // Also sync to Supabase site_content for complete database consistency
    try {
      await supabase.from("site_content").upsert(
        {
          section_key: "testimonials",
          content: updatedList,
        },
        { onConflict: "section_key" },
      );
    } catch (scErr) {
      console.warn("Notice: Updating site_content testimonials:", scErr);
    }

    await logAdminAction({
      adminEmail: user.email,
      action: "CREATE_TESTIMONIAL",
      entity: "testimonial",
      entityId: created.id,
      metadata: { client_name },
    });

    try {
      revalidatePath("/");
      revalidatePath("/admin/testimonials");
    } catch (revalErr) {
      console.warn("revalidatePath error:", revalErr);
    }

    return NextResponse.json({ success: true, data: created });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
