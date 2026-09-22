import { NextRequest, NextResponse } from "next/server";
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

    const updates = {
      ...body,
      updated_at: new Date().toISOString(),
    };

    let targetProject: AdminProject = {
      id,
      title: body.title || "Project",
      slug: body.slug || id,
      category: body.category || "residential",
      location: body.location || "",
      year: body.year || new Date().getFullYear().toString(),
      description: body.description || "",
      cover_image: body.cover_image || "/images/Full House Design Package.png",
      gallery_urls: body.gallery_urls || [],
      is_featured: Boolean(body.is_featured),
      is_published: body.is_published !== false,
      display_order: Number(body.display_order) || 1,
      ...updates,
    };

    try {
      const { data, error } = await supabase
        .from("projects")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (!error && data) {
        targetProject = data as AdminProject;
      }
    } catch (err) {
      console.warn("Supabase project update fallback:", err);
    }

    // Persist to local JSON
    const current = readLocalProjects();
    let found = false;
    const updatedList = current.map((p) => {
      if (p.id === id) {
        found = true;
        targetProject = {
          ...p,
          ...targetProject,
          id, // preserve id
        };
        return targetProject;
      }
      return p;
    });

    if (!found) {
      updatedList.push(targetProject);
    }

    writeLocalProjects(updatedList);

    await logAdminAction({
      adminEmail: user.email,
      action: "UPDATE_PROJECT",
      entity: "project",
      entityId: id,
      metadata: updates,
    });

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

    try {
      await supabase.from("projects").delete().eq("id", id);
    } catch (err) {
      console.warn("Supabase project delete fallback:", err);
    }

    // Persist to local JSON
    const current = readLocalProjects();
    const updated = current.filter((p) => p.id !== id);
    writeLocalProjects(updated);

    await logAdminAction({
      adminEmail: user.email,
      action: "DELETE_PROJECT",
      entity: "project",
      entityId: id,
    });

    return NextResponse.json({ success: true, id });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
