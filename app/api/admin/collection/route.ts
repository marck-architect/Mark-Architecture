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
      if (Array.isArray(parsed) && parsed.length > 0) {
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

    // 1. Try Supabase site_content first (preserves rich attributes & customized packages)
    try {
      const { data: contentData, error: scErr } = await supabase
        .from("site_content")
        .select("content")
        .eq("section_key", "collection_packages")
        .single();

      if (
        !scErr &&
        contentData?.content &&
        Array.isArray(contentData.content) &&
        contentData.content.length > 0
      ) {
        writeLocalCollection(contentData.content);
        return NextResponse.json({
          success: true,
          data: contentData.content,
        });
      }
    } catch {
      // Ignore and try collection_packages table
    }

    // 2. Try relational collection_packages table
    try {
      const { data, error } = await supabase
        .from("collection_packages")
        .select("*")
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        const local = readLocalCollection();
        const merged = data.map((pkg: any) => {
          const matched = local.find(
            (l) => l.id === String(pkg.id) || l.slug === pkg.slug,
          );
          return {
            id: String(pkg.id),
            slug: pkg.slug,
            name: pkg.name,
            subtitle: pkg.subtitle || matched?.subtitle || "",
            tag: pkg.tag || matched?.tag || "Standard Package",
            covered_area_sqft: pkg.covered_area_sqft
              ? Number(pkg.covered_area_sqft)
              : matched?.covered_area_sqft || 4500,
            plot_dimensions:
              pkg.plot_dimensions || matched?.plot_dimensions || "10 Marla",
            price_pkr: pkg.price_pkr
              ? Number(pkg.price_pkr)
              : matched?.price_pkr || 25000,
            estimated_construction_cost:
              pkg.estimated_construction_cost ||
              matched?.estimated_construction_cost ||
              "Market Standard",
            turnaround_weeks:
              pkg.turnaround_weeks || matched?.turnaround_weeks || "3–5 Days",
            cover_image:
              pkg.cover_image ||
              matched?.cover_image ||
              "/images/Full House Design Package.png",
            gallery_urls:
              Array.isArray(pkg.gallery_urls) && pkg.gallery_urls.length > 0
                ? pkg.gallery_urls
                : matched?.gallery_urls || [
                    pkg.cover_image || "/images/Full House Design Package.png",
                  ],
            deliverables:
              Array.isArray(pkg.deliverables) && pkg.deliverables.length > 0
                ? pkg.deliverables
                : matched?.deliverables || [],
            is_published: pkg.is_published ?? matched?.is_published ?? true,
            display_order: pkg.display_order ?? matched?.display_order ?? 1,
            created_at:
              pkg.created_at || matched?.created_at || new Date().toISOString(),
            updated_at:
              pkg.updated_at || matched?.updated_at || new Date().toISOString(),
          };
        });
        writeLocalCollection(merged);
        return NextResponse.json({ success: true, data: merged });
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

    const generatedSlug = (slug || name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const newPackage = {
      id: `pkg_${Date.now()}`,
      name,
      slug: generatedSlug,
      subtitle: subtitle || "",
      tag: tag || "Standard Package",
      covered_area_sqft: Number(covered_area_sqft) || 3500,
      plot_dimensions: plot_dimensions || "Standard",
      price_pkr: Number(price_pkr) || 25000,
      estimated_construction_cost:
        estimated_construction_cost || "Market Standard",
      turnaround_weeks: turnaround_weeks || "3–5 Days",
      cover_image: cover_image || "/images/Full House Design Package.png",
      gallery_urls:
        Array.isArray(gallery_urls) && gallery_urls.length > 0
          ? gallery_urls
          : [cover_image || "/images/Full House Design Package.png"],
      deliverables: Array.isArray(deliverables) ? deliverables : [],
      specifications: specifications || {},
      is_published: is_published !== undefined ? Boolean(is_published) : true,
      display_order: Number(display_order) || 99,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // 1. Persist to local JSON file
    const current = readLocalCollection();
    const updatedCollection = [
      newPackage,
      ...current.filter((p) => p.slug !== generatedSlug),
    ];
    writeLocalCollection(updatedCollection);

    // 2. Sync to Supabase site_content (section_key = 'collection_packages')
    try {
      await supabase.from("site_content").upsert(
        {
          section_key: "collection_packages",
          content: updatedCollection,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "section_key" },
      );
    } catch (scErr) {
      console.warn("Notice: Syncing collection to site_content:", scErr);
    }

    // 3. Attempt companion upsert into collection_packages relational table
    try {
      const dbPayload: any = {
        name: newPackage.name,
        slug: newPackage.slug,
        subtitle: newPackage.subtitle,
        tag: newPackage.tag,
        covered_area_sqft: newPackage.covered_area_sqft,
        plot_dimensions: newPackage.plot_dimensions,
        price_pkr: newPackage.price_pkr,
        estimated_construction_cost: newPackage.estimated_construction_cost,
        turnaround_weeks: newPackage.turnaround_weeks,
        cover_image: newPackage.cover_image,
        gallery_urls: newPackage.gallery_urls,
        deliverables: newPackage.deliverables,
        specifications: newPackage.specifications,
        is_published: newPackage.is_published,
        display_order: newPackage.display_order,
      };
      await supabase
        .from("collection_packages")
        .upsert(dbPayload, { onConflict: "slug" });
    } catch (err) {
      console.warn("Notice: Supabase collection insert warning:", err);
    }

    try {
      await logAdminAction({
        adminEmail: user.email,
        action: "CREATE_COLLECTION_PACKAGE",
        entity: "collection",
        entityId: newPackage.id,
        metadata: { name },
      });
    } catch {
      // Ignored
    }

    // 4. Invalidate public page caches
    revalidatePath("/collection");
    revalidatePath("/");

    return NextResponse.json({ success: true, data: newPackage });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
