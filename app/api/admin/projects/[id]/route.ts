import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminAuth } from "@/lib/server/adminAuth";
import { logAdminAction } from "@/lib/server/audit";
import { readLocalProjects, writeLocalProjects } from "../route";
import type { AdminProject } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function handleUpdate(
  request: NextRequest,
  params: Promise<{ id: string }>,
) {
  try {
    const authResult = await requireAdminAuth();
    if (!authResult.success) {
      return authResult.response;
    }

    const { id } = await params;
    const { supabase, user } = authResult.admin;
    const body = await request.json();

    const current = readLocalProjects();
    const existing = current.find((p) => p.id === id || p.slug === body.slug);

    const updates = {
      ...body,
      updated_at: new Date().toISOString(),
    };

    let targetProject: AdminProject = {
      title: body.title || existing?.title || "Project",
      slug: body.slug || existing?.slug || id,
      category: body.category || existing?.category || "residential",
      location: body.location || existing?.location || "",
      year: body.year || existing?.year || new Date().getFullYear().toString(),
      client_name:
        body.client_name !== undefined
          ? body.client_name
          : existing?.client_name || null,
      area_sqft: body.area_sqft
        ? Number(body.area_sqft)
        : existing?.area_sqft || null,
      price: body.price !== undefined ? body.price : existing?.price || null,
      aspectClass: body.aspectClass || existing?.aspectClass || "aspect-[4/5]",
      description: body.description || existing?.description || "",
      short_description:
        body.short_description !== undefined
          ? body.short_description
          : existing?.short_description || null,
      cover_image:
        body.cover_image ||
        existing?.cover_image ||
        "/images/Full House Design Package.png",
      gallery_urls: Array.isArray(body.gallery_urls)
        ? body.gallery_urls
        : existing?.gallery_urls || [
            body.cover_image || "/images/Full House Design Package.png",
          ],
      is_featured:
        body.is_featured !== undefined
          ? Boolean(body.is_featured)
          : (existing?.is_featured ?? false),
      is_published:
        body.is_published !== undefined
          ? Boolean(body.is_published)
          : (existing?.is_published ?? true),
      display_order: Number(body.display_order) || existing?.display_order || 1,
      ...updates,
      id, // ensure ID is preserved
    };

    // 1. Persist to local JSON file
    let found = false;
    const updatedList = current.map((p) => {
      if (p.id === id || (p.slug && p.slug === targetProject.slug)) {
        found = true;
        return targetProject;
      }
      return p;
    });

    if (!found) {
      updatedList.unshift(targetProject);
    }

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
      console.warn("Notice: Syncing updated projects to site_content:", scErr);
    }

    // 3. Attempt direct update in relational projects table
    try {
      const dbPayload: any = {
        updated_at: new Date().toISOString(),
      };
      if (targetProject.title !== undefined)
        dbPayload.title = targetProject.title;
      if (targetProject.slug !== undefined) dbPayload.slug = targetProject.slug;
      if (targetProject.category !== undefined)
        dbPayload.category = targetProject.category;
      if (targetProject.location !== undefined)
        dbPayload.location = targetProject.location;
      if (targetProject.year !== undefined) dbPayload.year = targetProject.year;
      if (targetProject.client_name !== undefined)
        dbPayload.client_name = targetProject.client_name;
      if (targetProject.area_sqft !== undefined)
        dbPayload.area_sqft = targetProject.area_sqft;
      if (targetProject.description !== undefined)
        dbPayload.description = targetProject.description;
      if (targetProject.short_description !== undefined)
        dbPayload.short_description = targetProject.short_description;
      if (targetProject.cover_image !== undefined)
        dbPayload.cover_image = targetProject.cover_image;
      if (targetProject.gallery_urls !== undefined)
        dbPayload.gallery_urls = targetProject.gallery_urls;
      if (targetProject.is_featured !== undefined)
        dbPayload.is_featured = targetProject.is_featured;
      if (targetProject.is_published !== undefined)
        dbPayload.is_published = targetProject.is_published;
      if (targetProject.display_order !== undefined)
        dbPayload.display_order = targetProject.display_order;

      const { error: updErr } = await supabase
        .from("projects")
        .update(dbPayload)
        .eq("id", id);

      if (updErr && targetProject.slug) {
        await supabase
          .from("projects")
          .update(dbPayload)
          .eq("slug", targetProject.slug);
      }
    } catch (err) {
      console.warn("Notice: Supabase project update fallback:", err);
    }

    try {
      await logAdminAction({
        adminEmail: user.email,
        action: "UPDATE_PROJECT",
        entity: "project",
        entityId: id,
        metadata: updates,
      });
    } catch {
      // Ignored
    }

    // 4. Invalidate public page caches
    revalidatePath("/portfolio");
    revalidatePath("/");

    return NextResponse.json({
      success: true,
      data: targetProject,
      project: targetProject,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return handleUpdate(request, params);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return handleUpdate(request, params);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authResult = await requireAdminAuth();
    if (!authResult.success) {
      return authResult.response;
    }

    const { id } = await params;
    const { supabase, user } = authResult.admin;

    // 1. Persist to local JSON
    const current = readLocalProjects();
    const updated = current.filter((p) => p.id !== id);
    writeLocalProjects(updated);

    // 2. Sync to Supabase site_content (section_key = 'projects')
    try {
      await supabase.from("site_content").upsert(
        {
          section_key: "projects",
          content: updated,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "section_key" },
      );
    } catch (scErr) {
      console.warn("Notice: Syncing deleted projects to site_content:", scErr);
    }

    // 3. Attempt direct delete in relational projects table
    try {
      await supabase.from("projects").delete().eq("id", id);
    } catch (err) {
      console.warn("Notice: Supabase project delete fallback:", err);
    }

    try {
      await logAdminAction({
        adminEmail: user.email,
        action: "DELETE_PROJECT",
        entity: "project",
        entityId: id,
      });
    } catch {
      // Ignored
    }

    // 4. Invalidate public page caches
    revalidatePath("/portfolio");
    revalidatePath("/");

    return NextResponse.json({ success: true, id });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
