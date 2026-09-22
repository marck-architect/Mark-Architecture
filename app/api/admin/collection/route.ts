import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { requireAdminAuth } from "@/lib/server/adminAuth";
import { logAdminAction } from "@/lib/server/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LOCAL_COLLECTION_FILE = path.join(
  process.cwd(),
  "data",
  "collection.json",
);

export function readLocalCollection(): any[] {
  try {
    if (fs.existsSync(LOCAL_COLLECTION_FILE)) {
      const content = fs.readFileSync(LOCAL_COLLECTION_FILE, "utf8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Notice: Reading local collection data:", err);
  }

  return [];
}

export function writeLocalCollection(packages: any[]): void {
  try {
    const dir = path.dirname(LOCAL_COLLECTION_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(
      LOCAL_COLLECTION_FILE,
      JSON.stringify(packages, null, 2),
      "utf8",
    );
  } catch (err) {
    console.warn("Notice: Writing local collection data:", err);
  }
}

export async function GET() {
  try {
    const authResult = await requireAdminAuth();
    if (!authResult.success) return authResult.response;

    const { supabase } = authResult.admin;

    try {
      const { data, error } = await supabase
        .from("collection_packages")
        .select("*")
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return NextResponse.json({ success: true, data });
      }
    } catch {
      // Supabase offline/fallback
    }

    const localData = readLocalCollection();
    return NextResponse.json({ success: true, data: localData });
  } catch (err: unknown) {
    const localData = readLocalCollection();
    return NextResponse.json({ success: true, data: localData });
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
        { error: "Package name and price in PKR are required." },
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
      tag: tag || "Standard Package",
      covered_area_sqft: Number(covered_area_sqft) || 3500,
      plot_dimensions: plot_dimensions || "Standard",
      price_pkr: Number(price_pkr) || 25000,
      estimated_construction_cost:
        estimated_construction_cost || "Market Standard",
      turnaround_weeks: turnaround_weeks || "3–5 Days",
      cover_image: cover_image || "/images/Full House Design Package.png",
      gallery_urls: Array.isArray(gallery_urls)
        ? gallery_urls
        : [cover_image || "/images/Full House Design Package.png"],
      deliverables: Array.isArray(deliverables) ? deliverables : [],
      specifications: specifications || {},
      is_published: is_published !== undefined ? Boolean(is_published) : true,
      display_order: Number(display_order) || 99,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    let created: any = { id: `pkg_${Date.now()}`, ...newPackage };

    try {
      const { data, error } = await supabase
        .from("collection_packages")
        .insert(newPackage)
        .select()
        .single();

      if (!error && data) {
        created = data;
      }
    } catch (err) {
      console.warn("Supabase collection insert warning:", err);
    }

    // Persist to local JSON
    const current = readLocalCollection();
    writeLocalCollection([created, ...current]);

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
