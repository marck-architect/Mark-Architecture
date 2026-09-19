import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminAuth } from "@/lib/server/adminAuth";
import { logAdminAction } from "@/lib/server/audit";
import { readLocalTeam, writeLocalTeam } from "../route";
import type { AdminTeamMember } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

async function handleUpdate(
  request: NextRequest,
  params: Promise<{ id: string }>,
) {
  try {
    const authResult = await requireAdminAuth();
    if (!authResult.success) return authResult.response;

    const { id } = await params;
    const { supabase, user } = authResult.admin;
    const body = await request.json();

    const currentMembers = readLocalTeam();
    let targetMember: AdminTeamMember = {
      id,
      name: body.name || "Architect",
      role: body.role || "Team Member",
      credentials: body.credentials || "",
      bio: body.bio || "",
      specialization: body.specialization || "",
      photo_url: body.photo_url || "/images/profile.jpeg",
      email: body.email || "",
      display_order: Number(body.display_order) || 1,
      is_active: body.is_active !== undefined ? Boolean(body.is_active) : true,
      created_at: new Date().toISOString(),
    };

    let found = false;
    const updatedList: AdminTeamMember[] = currentMembers.map((m) => {
      if (m.id === id) {
        found = true;
        targetMember = {
          ...m,
          ...body,
          id, // ensure ID is preserved
        };
        return targetMember;
      }
      return m;
    });

    if (!found) {
      updatedList.push(targetMember);
    }

    // 1. Persist to local JSON file
    writeLocalTeam(updatedList);

    // 2. Sync to Supabase site_content (section_key = 'team_members')
    try {
      await supabase.from("site_content").upsert(
        {
          section_key: "team_members",
          content: { members: updatedList },
          updated_at: new Date().toISOString(),
        },
        { onConflict: "section_key" },
      );
    } catch (scErr) {
      console.warn("Notice: Syncing updated team to site_content:", scErr);
    }

    // 3. Attempt direct update in relational team_members table
    try {
      await supabase
        .from("team_members")
        .update({
          name: targetMember.name,
          role: targetMember.role,
          credentials: targetMember.credentials,
          bio: targetMember.bio,
          specialization: targetMember.specialization,
          photo_url: targetMember.photo_url,
          image_url: targetMember.photo_url,
          email: targetMember.email,
          display_order: targetMember.display_order,
          is_active: targetMember.is_active,
        })
        .eq("id", id);
    } catch (tmErr) {
      console.warn("Notice: Updating in team_members table:", tmErr);
    }

    try {
      await logAdminAction({
        adminEmail: user.email,
        action: "UPDATE_TEAM_MEMBER",
        entity: "team_member",
        entityId: id,
        metadata: body,
      });
    } catch {
      // Ignored
    }

    // Invalidate public page caches
    revalidatePath("/about");
    revalidatePath("/");

    return NextResponse.json({ success: true, data: targetMember });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  return handleUpdate(request, context.params);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  return handleUpdate(request, context.params);
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

    const currentMembers = readLocalTeam();
    const updatedList = currentMembers.filter((m) => m.id !== id);

    // 1. Write local JSON file
    writeLocalTeam(updatedList);

    // 2. Sync to Supabase site_content
    try {
      await supabase.from("site_content").upsert(
        {
          section_key: "team_members",
          content: { members: updatedList },
          updated_at: new Date().toISOString(),
        },
        { onConflict: "section_key" },
      );
    } catch (scErr) {
      console.warn("Notice: Syncing deleted team to site_content:", scErr);
    }

    // 3. Attempt direct delete in relational team_members table
    try {
      await supabase.from("team_members").delete().eq("id", id);
    } catch (tmErr) {
      console.warn("Notice: Deleting from team_members table:", tmErr);
    }

    try {
      await logAdminAction({
        adminEmail: user.email,
        action: "DELETE_TEAM_MEMBER",
        entity: "team_member",
        entityId: id,
      });
    } catch {
      // Ignored
    }

    revalidatePath("/about");
    revalidatePath("/");

    return NextResponse.json({ success: true, id });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
