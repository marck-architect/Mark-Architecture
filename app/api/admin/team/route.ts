import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";
import { requireAdminAuth } from "@/lib/server/adminAuth";
import { logAdminAction } from "@/lib/server/audit";
import type { AdminTeamMember } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const LOCAL_TEAM_FILE = path.join(process.cwd(), "data", "team.json");

export function readLocalTeam(): AdminTeamMember[] {
  try {
    if (fs.existsSync(LOCAL_TEAM_FILE)) {
      const content = fs.readFileSync(LOCAL_TEAM_FILE, "utf8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Notice: Reading local team data:", err);
  }
  return [];
}

export function writeLocalTeam(members: AdminTeamMember[]): void {
  try {
    const dir = path.dirname(LOCAL_TEAM_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LOCAL_TEAM_FILE, JSON.stringify(members, null, 2), "utf8");
  } catch (err) {
    console.warn("Notice: Writing local team data:", err);
  }
}

export async function GET() {
  try {
    const authResult = await requireAdminAuth();
    if (!authResult.success) return authResult.response;

    const { supabase } = authResult.admin;

    // 1. Try Supabase team_members table
    try {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        // Map database row back to AdminTeamMember format
        const formatted: AdminTeamMember[] = data.map((m: any) => ({
          id: String(m.id),
          name: m.name,
          role: m.role,
          credentials: m.credentials || "",
          bio: m.bio || "",
          specialization: m.specialization || "",
          photo_url: m.photo_url || m.image_url || "/images/profile.jpeg",
          email: m.email || "",
          display_order: m.display_order ?? 1,
          is_active: m.is_active ?? true,
          created_at: m.created_at || new Date().toISOString(),
        }));
        writeLocalTeam(formatted);
        return NextResponse.json({ success: true, data: formatted });
      }
    } catch {
      // Ignore and fallback to site_content
    }

    // 2. Try Supabase site_content table (section_key = 'team_members')
    try {
      const { data: contentRow, error: contentErr } = await supabase
        .from("site_content")
        .select("content")
        .eq("section_key", "team_members")
        .single();

      if (
        !contentErr &&
        contentRow?.content?.members &&
        Array.isArray(contentRow.content.members)
      ) {
        writeLocalTeam(contentRow.content.members);
        return NextResponse.json({
          success: true,
          data: contentRow.content.members,
        });
      }
    } catch {
      // Ignore and fallback to local file
    }

    // 3. Fallback to local JSON file
    const local = readLocalTeam();
    return NextResponse.json({ success: true, data: local });
  } catch (err: unknown) {
    const local = readLocalTeam();
    return NextResponse.json({ success: true, data: local });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAdminAuth();
    if (!authResult.success) return authResult.response;

    const { supabase, user } = authResult.admin;
    const body = await request.json();
    const {
      name,
      role,
      credentials,
      bio,
      specialization,
      photo_url,
      email,
      display_order,
      is_active,
    } = body;

    if (!name || !role) {
      return NextResponse.json(
        { error: "Name and role are required." },
        { status: 400 },
      );
    }

    const currentMembers = readLocalTeam();
    const newId = `team_${Date.now()}`;
    const newMember: AdminTeamMember = {
      id: newId,
      name,
      role,
      credentials: credentials || "",
      bio: bio || "",
      specialization: specialization || "",
      photo_url: photo_url || "/images/profile.jpeg",
      email: email || "",
      display_order: Number(display_order) || currentMembers.length + 1,
      is_active: is_active !== undefined ? Boolean(is_active) : true,
      created_at: new Date().toISOString(),
    };

    const updatedList = [...currentMembers, newMember];

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
      console.warn("Notice: Syncing team to site_content:", scErr);
    }

    // 3. Attempt direct insert to relational team_members table if available
    try {
      await supabase.from("team_members").insert({
        id: newMember.id,
        name: newMember.name,
        role: newMember.role,
        credentials: newMember.credentials,
        bio: newMember.bio,
        specialization: newMember.specialization,
        photo_url: newMember.photo_url,
        image_url: newMember.photo_url,
        email: newMember.email,
        display_order: newMember.display_order,
        is_active: newMember.is_active,
      });
    } catch (tmErr) {
      console.warn("Notice: Inserting to team_members table:", tmErr);
    }

    try {
      await logAdminAction({
        adminEmail: user.email,
        action: "CREATE_TEAM_MEMBER",
        entity: "team_member",
        entityId: newMember.id,
        metadata: { name, role },
      });
    } catch {
      // Ignored
    }

    // Invalidate public page caches
    revalidatePath("/about");
    revalidatePath("/");

    return NextResponse.json({ success: true, data: newMember });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
