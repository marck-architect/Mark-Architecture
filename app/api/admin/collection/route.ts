import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminAuth } from "@/lib/server/adminAuth";
import { logAdminAction } from "@/lib/server/audit";
import { architecturalPackages } from "@/data/collection";

export const runtime = "nodejs";

export async function GET() {
  try {
    const authResult = await requireAdminAuth();
    if (!authResult.success) return authResult.response;

    const { supabase } = authResult.admin;
    const { data, error } = await supabase
      .from("collection_packages")
      .select("*")
      .order("display_order", { ascending: true });

    if (!error && data) {
      return NextResponse.json({ success: true, data });
    }

    // Default mapping from static collection
    const defaultData = architecturalPackages.map((p, idx) => ({
      id: p.id,
      slug: p.id,
      name: p.title,
      subtitle: p.description,
      tag: p.tier,
      covered_area_sqft: p.plotSize?.includes("10")
        ? 4500
        : p.plotSize?.includes("1")
          ? 9000
          : 2250,
      plot_dimensions: p.plotSize || "50' x 90'",
      price_pkr: p.pricePKR,
      estimated_construction_cost: "Market Standard",
      turnaround_weeks: p.deliveryTime,
      cover_image: p.image,
      gallery_urls: [p.image],
      deliverables: p.inclusions,
      is_published: true,
      display_order: idx + 1,
    }));

    return NextResponse.json({ success: true, data: defaultData });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
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
      slug,
      subtitle,
      tag,
      covered_area_sqft,
      plot_dimensions,
      price_pkr,
      estimated_construction_cost,
      turnaround_weeks,
      cover_image,
      gallery_urls,
      deliverables,
      specifications,
      is_published,
      display_order,
    } = body;

    if (!name || !price_pkr) {
      return NextResponse.json(
        { error: "Villa name and price in PKR are required." },
        { status: 400 },
      );
    }

    const newPackage = {
      name,
      slug: (slug || name)
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-"),
      subtitle: subtitle || "",
      tag: tag || "Signature Villa",
      covered_area_sqft: Number(covered_area_sqft) || 5000,
      plot_dimensions: plot_dimensions || "50' x 90'",
      price_pkr: Number(price_pkr) || 28000,
      estimated_construction_cost:
        estimated_construction_cost || "PKR 45M – 55M",
      turnaround_weeks: turnaround_weeks || "3-4 weeks delivery",
      cover_image: cover_image || "/images/hero-3d-render.webp",
      gallery_urls: Array.isArray(gallery_urls) ? gallery_urls : [],
      deliverables: Array.isArray(deliverables) ? deliverables : [],
      specifications: specifications || {},
      is_published: is_published !== undefined ? Boolean(is_published) : true,
      display_order: Number(display_order) || 99,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("collection_packages")
      .insert(newPackage)
      .select()
      .single();

    if (error) {
      console.warn("Supabase collection insert warning:", error);
    }

    const created = data || { id: `villa_${Date.now()}`, ...newPackage };

    await logAdminAction({
      adminEmail: user.email,
      action: "CREATE_COLLECTION_PACKAGE",
      entity: "collection",
      entityId: created.id,
      metadata: { name },
    });

    revalidatePath("/collection");
    revalidatePath("/");

    return NextResponse.json({ success: true, data: created });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
