import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminAuth } from "@/lib/server/adminAuth";
import { logAdminAction } from "@/lib/server/audit";
import { readLocalServices, writeLocalServices } from "../route";
import type { AdminService } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

async function handleUpdate(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authResult = await requireAdminAuth();
    if (!authResult.success) {
      return authResult.response;
    }

    const { id } = await params;
    const { supabase, user } = authResult.admin;
    const body = await request.json();

    const currentServices = readLocalServices();
    let targetService: AdminService = {
      id,
      title: body.title || "Service",
      slug: body.slug || id,
      category: body.category || "General",
      short_description: body.short_description || "",
      detailed_scope: body.detailed_scope || null,
      image_url: body.image_url || "/images/Full House Design Package.png",
      pricing_type: body.pricing_type || "flat",
      popularity_rank: Number(body.popularity_rank) || 99,
      is_active: body.is_active !== undefined ? Boolean(body.is_active) : true,
      tiers: body.tiers || [],
      created_at: new Date().toISOString(),
    };

    let found = false;
    const updatedList: AdminService[] = currentServices.map((s) => {
      if (s.id === id || s.slug === id) {
        found = true;
        targetService = {
          ...s,
          ...body,
          id, // ensure ID is preserved
        };
        return targetService;
      }
      return s;
    });

    if (!found) {
      updatedList.push(targetService);
    }

    // 1. Persist to local JSON file
    writeLocalServices(updatedList);

    // 2. Sync to Supabase site_content
    try {
      await supabase.from("site_content").upsert(
        {
          section_key: "services",
          content: updatedList,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "section_key" },
      );
    } catch (scErr) {
      console.warn("Notice: Updating site_content services:", scErr);
    }

    // 3. Update in dedicated services table
    try {
      const updates = {
        ...body,
        updated_at: new Date().toISOString(),
      };
      const { data, error } = await supabase
        .from("services")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) console.warn("Supabase service update error:", error);
      if (data) {
        targetService = data;
      }
    } catch (dbErr) {
      console.warn("Notice: Updating Supabase table services:", dbErr);
    }

    await logAdminAction({
      adminEmail: user.email,
      action: "UPDATE_SERVICE",
      entity: "service",
      entityId: id,
      metadata: body,
    });

    try {
      revalidatePath("/services");
      revalidatePath("/");
    } catch (revalErr) {
      console.warn("revalidatePath error:", revalErr);
    }

    return NextResponse.json({
      success: true,
      data: targetService,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  params: { params: Promise<{ id: string }> },
) {
  return handleUpdate(request, params);
}

export async function PATCH(
  request: NextRequest,
  params: { params: Promise<{ id: string }> },
) {
  return handleUpdate(request, params);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authResult = await requireAdminAuth();
    if (!authResult.success) {
      return authResult.response;
    }

    const { id } = await params;
    const { supabase, user } = authResult.admin;

    // 1. Remove from local JSON file
    const currentServices = readLocalServices();
    const updatedList = currentServices.filter((s) => s.id !== id && s.slug !== id);
    writeLocalServices(updatedList);

    // 2. Sync to Supabase site_content
    try {
      await supabase.from("site_content").upsert(
        {
          section_key: "services",
          content: updatedList,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "section_key" },
      );
    } catch (scErr) {
      console.warn("Notice: Syncing deleted services to site_content:", scErr);
    }

    // 3. Delete from dedicated services table
    try {
      const { error } = await supabase.from("services").delete().eq("id", id);
      if (error) console.warn("Supabase service delete warning:", error);
    } catch (dbErr) {
      console.warn("Notice: Deleting from Supabase table services:", dbErr);
    }

    await logAdminAction({
      adminEmail: user.email,
      action: "DELETE_SERVICE",
      entity: "service",
      entityId: id,
    });

    try {
      revalidatePath("/services");
      revalidatePath("/");
    } catch (revalErr) {
      console.warn("revalidatePath error:", revalErr);
    }

    return NextResponse.json({ success: true, id });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
