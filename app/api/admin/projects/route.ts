import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/server/adminAuth";
import { logAdminAction } from "@/lib/server/audit";
import { seedProjects } from "@/data/adminSeed";

export const runtime = "nodejs";

export async function GET() {
  try {
    const authResult = await requireAdminAuth();
    if (!authResult.success) {
      return authResult.response;
    }

    const { supabase } = authResult.admin;

    const { data: projects, error } = await supabase
      .from("projects")
      .select("*")
      .order("display_order", { ascending: true });

    if (!error && projects && projects.length > 0) {
      return NextResponse.json({ success: true, data: projects });
    }

    return NextResponse.json({ success: true, data: seedProjects });
  } catch (err: unknown) {
    return NextResponse.json({ success: true, data: seedProjects });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAdminAuth();
    if (!authResult.success) {
      return authResult.response;
    }

    const { supabase, user } = authResult.admin;
    const body = await request.json();
    const {
      title,
      slug,
      category,
      location,
      year,
      client_name,
      area_sqft,
      description,
      short_description,
      cover_image,
      gallery_urls,
      is_featured,
      is_published,
      display_order,
    } = body;

    if (!title || !slug) {
      return NextResponse.json(
        { error: "Title and slug are required." },
        { status: 400 },
      );
    }

    const newProject = {
      title,
      slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
      category: category || "residential",
      location: location || "",
      year: year || new Date().getFullYear().toString(),
      client_name: client_name || null,
      area_sqft: area_sqft ? Number(area_sqft) : null,
      description: description || "",
      short_description: short_description || null,
      cover_image: cover_image || "/images/Full House Design Package.png",
      gallery_urls: Array.isArray(gallery_urls) ? gallery_urls : [],
      is_featured: Boolean(is_featured),
      is_published: is_published !== undefined ? Boolean(is_published) : true,
      display_order: Number(display_order) || 99,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("projects")
      .insert(newProject)
      .select()
      .single();

    if (error) {
      console.warn("Supabase project insert warning:", error);
    }

    const created = data || { id: `proj_${Date.now()}`, ...newProject };

    await logAdminAction({
      adminEmail: user.email,
      action: "CREATE_PROJECT",
      entity: "project",
      entityId: created.id,
      metadata: { title },
    });

    return NextResponse.json({ success: true, data: created });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
