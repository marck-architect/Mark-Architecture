import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/server/adminAuth";
import { logAdminAction } from "@/lib/server/audit";
import { seedServices } from "@/data/adminSeed";

export const runtime = "nodejs";

export async function GET() {
  try {
    const authResult = await requireAdminAuth();
    if (!authResult.success) {
      return authResult.response;
    }

    const { supabase } = authResult.admin;

    const { data: services, error } = await supabase
      .from("services")
      .select("*, service_tiers(*, pricing_rules(*))")
      .order("popularity_rank", { ascending: true });

    if (!error && services && services.length > 0) {
      return NextResponse.json({ success: true, data: services });
    }

    return NextResponse.json({ success: true, data: seedServices });
  } catch (err: unknown) {
    return NextResponse.json({ success: true, data: seedServices });
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
      short_description,
      detailed_scope,
      image_url,
      pricing_type,
      popularity_rank,
      is_active,
    } = body;

    if (!title || !slug) {
      return NextResponse.json(
        { error: "Title and slug are required." },
        { status: 400 },
      );
    }

    const newService = {
      title,
      slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
      category: category || "General",
      short_description: short_description || "",
      detailed_scope: detailed_scope || null,
      image_url: image_url || "/images/Full House Design Package.png",
      pricing_type: pricing_type || "flat",
      popularity_rank: Number(popularity_rank) || 99,
      is_active: is_active !== undefined ? is_active : true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("services")
      .insert(newService)
      .select()
      .single();

    if (error) {
      console.warn("Supabase service insert error:", error);
    }

    const created = data || { id: `srv_${Date.now()}`, ...newService };

    await logAdminAction({
      adminEmail: user.email,
      action: "CREATE_SERVICE",
      entity: "service",
      entityId: created.id,
      metadata: { title },
    });

    return NextResponse.json({ success: true, data: created });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
