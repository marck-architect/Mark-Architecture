import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/server/adminAuth";
import { logAdminAction } from "@/lib/server/audit";
import { seedAvailabilitySettings } from "@/data/adminSeed";

export const runtime = "nodejs";

export async function GET() {
  try {
    const authResult = await requireAdminAuth();
    if (!authResult.success) {
      return authResult.response;
    }

    const { supabase } = authResult.admin;

    const { data, error } = await supabase
      .from("availability_settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (!error && data) {
      return NextResponse.json({ success: true, data });
    }

    return NextResponse.json({ success: true, data: seedAvailabilitySettings });
  } catch (err: unknown) {
    return NextResponse.json({ success: true, data: seedAvailabilitySettings });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authResult = await requireAdminAuth();
    if (!authResult.success) {
      return authResult.response;
    }

    const { supabase, user } = authResult.admin;
    const body = await request.json();

    const updates = {
      ...body,
      updated_at: new Date().toISOString(),
    };

    try {
      await supabase.from("availability_settings").upsert({
        id: "default",
        ...updates,
      });
    } catch (err) {
      console.warn("Supabase availability settings upsert warning:", err);
    }

    await logAdminAction({
      adminEmail: user.email,
      action: "UPDATE_AVAILABILITY_SETTINGS",
      entity: "availability_settings",
      entityId: "default",
      metadata: updates,
    });

    return NextResponse.json({
      success: true,
      data: { ...seedAvailabilitySettings, ...updates },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
