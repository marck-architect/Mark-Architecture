import { NextRequest, NextResponse } from "next/server";
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
        return parsed;
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
        return NextResponse.json({ success: true, data });
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

    const newTestimonial: Omit<AdminTestimonial, "id"> = {
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

    let created: AdminTestimonial = {
      id: `test_${Date.now()}`,
      ...newTestimonial,
    };

    try {
      const { data, error } = await supabase
        .from("testimonials")
        .insert(newTestimonial)
        .select()
        .single();
      if (!error && data) {
        created = data as AdminTestimonial;
      }
    } catch (dbErr) {
      console.warn("Notice: Inserting testimonial to DB fallback:", dbErr);
    }

    // Persist to local JSON file
    const current = readLocalTestimonials();
    writeLocalTestimonials([created, ...current]);

    await logAdminAction({
      adminEmail: user.email,
      action: "CREATE_TESTIMONIAL",
      entity: "testimonial",
      entityId: created.id,
      metadata: { client_name },
    });

    return NextResponse.json({ success: true, data: created });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
