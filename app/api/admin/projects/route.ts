import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { requireAdminAuth } from "@/lib/server/adminAuth";
import { logAdminAction } from "@/lib/server/audit";
import type { AdminProject } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LOCAL_PROJECTS_FILE = path.join(process.cwd(), "data", "projects.json");

export function readLocalProjects(): AdminProject[] {
  try {
    if (fs.existsSync(LOCAL_PROJECTS_FILE)) {
      const content = fs.readFileSync(LOCAL_PROJECTS_FILE, "utf8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Notice: Reading local projects data:", err);
  }
  return [];
}

export function writeLocalProjects(projects: AdminProject[]): void {
  try {
    const dir = path.dirname(LOCAL_PROJECTS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(
      LOCAL_PROJECTS_FILE,
      JSON.stringify(projects, null, 2),
      "utf8",
    );
  } catch (err) {
    console.warn("Notice: Writing local projects data:", err);
  }
}

export async function GET() {
  try {
    const authResult = await requireAdminAuth();
    if (!authResult.success) {
      return authResult.response;
    }

    const { supabase } = authResult.admin;

    try {
      const { data: projects, error } = await supabase
        .from("projects")
        .select("*")
        .order("display_order", { ascending: true });

      if (!error && projects && projects.length > 0) {
        return NextResponse.json({
          success: true,
          data: projects,
          projects,
        });
      }
    } catch {
      // Supabase unavailable / fallback
    }

    const localProjects = readLocalProjects();
    return NextResponse.json({
      success: true,
      data: localProjects,
      projects: localProjects,
    });
  } catch (err: unknown) {
    const localProjects = readLocalProjects();
    return NextResponse.json({
      success: true,
      data: localProjects,
      projects: localProjects,
    });
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
      price,
      aspectClass,
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

    const newProject: AdminProject = {
      id: `proj_${Date.now()}`,
      title,
      slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
      category: category || "residential",
      location: location || "",
      year: year || new Date().getFullYear().toString(),
      client_name: client_name || null,
      area_sqft: area_sqft ? Number(area_sqft) : null,
      price: price || null,
      aspectClass: aspectClass || null,
      description: description || "",
      short_description: short_description || null,
      cover_image: cover_image || "/images/Full House Design Package.png",
      gallery_urls: Array.isArray(gallery_urls)
        ? gallery_urls
        : [cover_image || "/images/Full House Design Package.png"],
      is_featured: Boolean(is_featured),
      is_published: is_published !== undefined ? Boolean(is_published) : true,
      display_order: Number(display_order) || 99,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    let created = newProject;

    try {
      const { data, error } = await supabase
        .from("projects")
        .insert(newProject)
        .select()
        .single();

      if (!error && data) {
        created = data as AdminProject;
      }
    } catch (err) {
      console.warn("Supabase project insert fallback:", err);
    }

    // Persist to local JSON
    const current = readLocalProjects();
    writeLocalProjects([created, ...current]);

    await logAdminAction({
      adminEmail: user.email,
      action: "CREATE_PROJECT",
      entity: "project",
      entityId: created.id,
      metadata: { title },
    });

    return NextResponse.json({
      success: true,
      data: created,
      project: created,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
