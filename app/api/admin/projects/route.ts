import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
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

    // 1. Try Supabase site_content table (section_key = 'projects')
    try {
      const { data: contentData, error: contentErr } = await supabase
        .from("site_content")
        .select("content")
        .eq("section_key", "projects")
        .single();

      if (
        !contentErr &&
        contentData?.content &&
        Array.isArray(contentData.content) &&
        contentData.content.length > 0
      ) {
        writeLocalProjects(contentData.content);
        return NextResponse.json({
          success: true,
          data: contentData.content,
          projects: contentData.content,
        });
      }
    } catch {
      // Fallback
    }

    // 2. Try relational Supabase projects table
    try {
      const { data: projects, error } = await supabase
        .from("projects")
        .select("*")
        .order("display_order", { ascending: true });

      if (!error && projects && projects.length > 0) {
        const local = readLocalProjects();
        const merged: AdminProject[] = projects.map((p: any) => {
          const matched = local.find(
            (l) => l.id === String(p.id) || l.slug === p.slug,
          );
          return {
            id: String(p.id),
            title: p.title,
            slug: p.slug,
            category: p.category || "residential",
            location: p.location || "Pakistan",
            year: p.year || new Date().getFullYear().toString(),
            client_name: p.client_name || matched?.client_name || null,
            area_sqft: p.area_sqft
              ? Number(p.area_sqft)
              : matched?.area_sqft || null,
            price: p.price || matched?.price || null,
            aspectClass:
              p.aspectClass || matched?.aspectClass || "aspect-[4/5]",
            description: p.description || matched?.description || "",
            short_description:
              p.short_description || matched?.short_description || null,
            cover_image:
              p.cover_image ||
              matched?.cover_image ||
              "/images/Full House Design Package.png",
            gallery_urls:
              Array.isArray(p.gallery_urls) && p.gallery_urls.length > 0
                ? p.gallery_urls
                : matched?.gallery_urls || [
                    p.cover_image || "/images/Full House Design Package.png",
                  ],
            is_featured: p.is_featured ?? matched?.is_featured ?? false,
            is_published: p.is_published ?? matched?.is_published ?? true,
            display_order: p.display_order ?? matched?.display_order ?? 1,
            created_at:
              p.created_at || matched?.created_at || new Date().toISOString(),
            updated_at:
              p.updated_at || matched?.updated_at || new Date().toISOString(),
          };
        });
        writeLocalProjects(merged);
        return NextResponse.json({
          success: true,
          data: merged,
          projects: merged,
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

    // 1. Persist to local JSON
    const current = readLocalProjects();
    const updatedList = [
      newProject,
      ...current.filter(
        (p) => p.id !== newProject.id && p.slug !== newProject.slug,
      ),
    ];
    writeLocalProjects(updatedList);

    // 2. Sync to Supabase site_content (section_key = 'projects')
    try {
      await supabase.from("site_content").upsert(
        {
          section_key: "projects",
          content: updatedList,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "section_key" },
      );
    } catch (scErr) {
      console.warn("Notice: Syncing projects to site_content:", scErr);
    }

    // 3. Attempt direct insert/upsert to relational projects table
    try {
      const dbPayload = {
        title: newProject.title,
        slug: newProject.slug,
        category: newProject.category,
        location: newProject.location,
        year: newProject.year,
        client_name: newProject.client_name,
        area_sqft: newProject.area_sqft,
        description: newProject.description,
        short_description: newProject.short_description,
        cover_image: newProject.cover_image,
        gallery_urls: newProject.gallery_urls,
        is_featured: newProject.is_featured,
        is_published: newProject.is_published,
        display_order: newProject.display_order,
      };
      await supabase.from("projects").upsert(dbPayload, { onConflict: "slug" });
    } catch (err) {
      console.warn("Notice: Supabase project insert fallback:", err);
    }

    try {
      await logAdminAction({
        adminEmail: user.email,
        action: "CREATE_PROJECT",
        entity: "project",
        entityId: newProject.id,
        metadata: { title },
      });
    } catch {
      // Ignored
    }

    // 4. Invalidate public page caches
    revalidatePath("/portfolio");
    revalidatePath("/");

    return NextResponse.json({
      success: true,
      data: newProject,
      project: newProject,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
