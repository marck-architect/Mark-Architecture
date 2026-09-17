import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/server/adminAuth";
import { logAdminAction } from "@/lib/server/audit";
import { seedTeamMembers } from "@/data/adminSeed";

export const runtime = "nodejs";

export async function GET() {
  try {
    const authResult = await requireAdminAuth();
    if (!authResult.success) return authResult.response;

    const { supabase } = authResult.admin;
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .order("display_order", { ascending: true });

    if (!error && data && data.length > 0) {
      return NextResponse.json({ success: true, data });
    }
    return NextResponse.json({ success: true, data: seedTeamMembers });
  } catch (err: unknown) {
    return NextResponse.json({ success: true, data: seedTeamMembers });
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

    const newMember = {
      name,
      role,
      credentials: credentials || "",
      bio: bio || "",
      specialization: specialization || null,
      photo_url: photo_url || "/images/profile.png",
      email: email || null,
      display_order: Number(display_order) || 99,
      is_active: is_active !== undefined ? Boolean(is_active) : true,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("team_members")
      .insert(newMember)
      .select()
      .single();
    if (error) console.warn("Supabase team_member insert warning:", error);

    const created = data || { id: `team_${Date.now()}`, ...newMember };

    await logAdminAction({
      adminEmail: user.email,
      action: "CREATE_TEAM_MEMBER",
      entity: "team_member",
      entityId: created.id,
      metadata: { name, role },
    });

    return NextResponse.json({ success: true, data: created });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
