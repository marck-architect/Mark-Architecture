import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminAuth } from "@/lib/server/adminAuth";
import { logAdminAction } from "@/lib/server/audit";
import { readLocalCollection, writeLocalCollection } from "../route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

    const updates = {
      ...body,
      updated_at: new Date().toISOString(),
    };

    let targetPackage: any = {
      id,
      name: body.name || "Package",
      slug: body.slug || id,
      subtitle: body.subtitle || "",
      tag: body.tag || "Standard Package",
      price_pkr: Number(body.price_pkr) || 25000,
      turnaround_weeks: body.turnaround_weeks || "3–5 Days",
      cover_image: body.cover_image || "/images/Full House Design Package.png",
      gallery_urls: body.gallery_urls || [],
      deliverables: body.deliverables || [],
      is_published: body.is_published !== false,
      display_order: Number(body.display_order) || 1,
      ...updates,
    };

    try {
      const { data, error } = await supabase
        .from("collection_packages")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (!error && data) {
        targetPackage = data;
      }
    } catch (err) {
      console.warn("Supabase collection update fallback:", err);
    }

    // Persist to local JSON
    const current = readLocalCollection();
    let found = false;
    const updatedList = current.map((p) => {
      if (p.id === id || p.slug === id) {
        found = true;
        targetPackage = {
          ...p,
          ...targetPackage,
          id: p.id,
        };
        return targetPackage;
      }
      return p;
    });

    if (!found) {
      updatedList.push(targetPackage);
    }

    writeLocalCollection(updatedList);

    await logAdminAction({
      adminEmail: user.email,
      action: "UPDATE_COLLECTION_PACKAGE",
      entity: "collection",
      entityId: id,
      metadata: updates,
    });

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

    try {
      await supabase.from("collection_packages").delete().eq("id", id);
    } catch (err) {
      console.warn("Supabase collection delete fallback:", err);
    }

    // Persist to local JSON
    const current = readLocalCollection();
    const updated = current.filter((p) => p.id !== id && p.slug !== id);
    writeLocalCollection(updated);

    await logAdminAction({
      adminEmail: user.email,
      action: "DELETE_COLLECTION_PACKAGE",
      entity: "collection",
      entityId: id,
    });

    revalidatePath("/collection");
    revalidatePath("/");

    return NextResponse.json({ success: true, id });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
