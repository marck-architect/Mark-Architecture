import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminAuth } from "@/lib/server/adminAuth";
import { logAdminAction } from "@/lib/server/audit";
import { readLocalCollection, writeLocalCollection } from "../route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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

    const current = readLocalCollection();
    const existing = current.find((p) => p.id === id || p.slug === id);

    const updates = {
      ...body,
      updated_at: new Date().toISOString(),
    };
    delete updates.id; // Do not overwrite or mutate primary key id

    let targetPackage: any = {
      name: body.name || existing?.name || "Package",
      slug: body.slug || existing?.slug || id,
      subtitle:
        body.subtitle !== undefined ? body.subtitle : existing?.subtitle || "",
      tag: body.tag || existing?.tag || "Standard Package",
      covered_area_sqft:
        body.covered_area_sqft !== undefined
          ? Number(body.covered_area_sqft)
          : existing?.covered_area_sqft || 4500,
      plot_dimensions:
        body.plot_dimensions !== undefined
          ? body.plot_dimensions
          : existing?.plot_dimensions || "10 Marla",
      price_pkr:
        body.price_pkr !== undefined
          ? Number(body.price_pkr)
          : existing?.price_pkr || 25000,
      estimated_construction_cost:
        body.estimated_construction_cost !== undefined
          ? body.estimated_construction_cost
          : existing?.estimated_construction_cost || "Market Standard",
      turnaround_weeks:
        body.turnaround_weeks !== undefined
          ? body.turnaround_weeks
          : existing?.turnaround_weeks || "3–5 Days",
      cover_image:
        body.cover_image ||
        existing?.cover_image ||
        "/images/Full House Design Package.png",
      gallery_urls: Array.isArray(body.gallery_urls)
        ? body.gallery_urls
        : existing?.gallery_urls || [
            body.cover_image || "/images/Full House Design Package.png",
          ],
      deliverables: Array.isArray(body.deliverables)
        ? body.deliverables
        : existing?.deliverables || [],
      specifications: body.specifications || existing?.specifications || {},
      is_published:
        body.is_published !== undefined
          ? Boolean(body.is_published)
          : (existing?.is_published ?? true),
      display_order: Number(body.display_order) || existing?.display_order || 1,
      ...updates,
      id: existing?.id || id,
    };

    // 1. Persist to local JSON file
    let found = false;
    const updatedList = current.map((p) => {
      if (
        p.id === id ||
        p.slug === id ||
        (targetPackage.slug && p.slug === targetPackage.slug)
      ) {
        found = true;
        return targetPackage;
      }
      return p;
    });

    if (!found) {
      updatedList.push(targetPackage);
    }

    writeLocalCollection(updatedList);

    // 2. Sync to Supabase site_content (section_key = 'collection_packages')
    try {
      await supabase.from("site_content").upsert(
        {
          section_key: "collection_packages",
          content: updatedList,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "section_key" },
      );
    } catch (scErr) {
      console.warn(
        "Notice: Syncing updated collection to site_content:",
        scErr,
      );
    }

    // 3. Attempt companion update into collection_packages relational table
    try {
      const dbPayload = { ...targetPackage };
      delete dbPayload.id; // Don't update primary key

      if (UUID_REGEX.test(id)) {
        await supabase
          .from("collection_packages")
          .update(dbPayload)
          .eq("id", id);
      } else {
        await supabase
          .from("collection_packages")
          .upsert(
            { ...dbPayload, slug: targetPackage.slug },
            { onConflict: "slug" },
          );
      }
    } catch (err) {
      console.warn("Notice: Supabase collection update fallback:", err);
    }

    try {
      await logAdminAction({
        adminEmail: user.email,
        action: "UPDATE_COLLECTION_PACKAGE",
        entity: "collection",
        entityId: id,
        metadata: updates,
      });
    } catch {
      // Ignored
    }

    // 4. Invalidate public page caches
    revalidatePath("/collection");
    revalidatePath("/");

    return NextResponse.json({
      success: true,
      data: targetPackage,
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
    if (!authResult.success) return authResult.response;

    const { id } = await params;
    const { supabase, user } = authResult.admin;

    // 1. Persist to local JSON file
    const current = readLocalCollection();
    const updated = current.filter((p) => p.id !== id && p.slug !== id);
    writeLocalCollection(updated);

    // 2. Sync to Supabase site_content (section_key = 'collection_packages')
    try {
      await supabase.from("site_content").upsert(
        {
          section_key: "collection_packages",
          content: updated,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "section_key" },
      );
    } catch (scErr) {
      console.warn(
        "Notice: Syncing deleted collection to site_content:",
        scErr,
      );
    }

    // 3. Attempt companion delete from relational table
    try {
      if (UUID_REGEX.test(id)) {
        await supabase.from("collection_packages").delete().eq("id", id);
      } else {
        await supabase.from("collection_packages").delete().eq("slug", id);
      }
    } catch (err) {
      console.warn("Notice: Supabase collection delete fallback:", err);
    }

    try {
      await logAdminAction({
        adminEmail: user.email,
        action: "DELETE_COLLECTION_PACKAGE",
        entity: "collection",
        entityId: id,
      });
    } catch {
      // Ignored
    }

    // 4. Invalidate public page caches
    revalidatePath("/collection");
    revalidatePath("/");

    return NextResponse.json({ success: true, id });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
