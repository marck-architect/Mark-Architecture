import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/server/adminAuth";
import { logAdminAction } from "@/lib/server/audit";
import { readLocalTestimonials, writeLocalTestimonials } from "../route";
import type { AdminTestimonial } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

async function handleUpdate(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authResult = await requireAdminAuth();
    if (!authResult.success) return authResult.response;

    const { id } = await params;
    const { supabase, user } = authResult.admin;
    const body = await request.json();

    let updatedItem: AdminTestimonial | null = null;

    try {
      const { data, error } = await supabase
        .from("testimonials")
        .update(body)
        .eq("id", id)
        .select()
        .single();
      if (!error && data) {
        updatedItem = data as AdminTestimonial;
      }
    } catch (dbErr) {
      console.warn("Notice: Updating testimonial in DB fallback:", dbErr);
    }

    // Persist to local JSON file
    const current = readLocalTestimonials();
    let found = false;
    const updatedList = current.map((item) => {
      if (item.id === id) {
        found = true;
        const merged = { ...item, ...body, id };
        if (!updatedItem) updatedItem = merged;
        return merged;
      }
      return item;
    });

    if (!found) {
      const fallbackItem: AdminTestimonial = {
        id,
        client_name: body.client_name || "Client",
        review: body.review || "",
        rating: body.rating || 5,
        is_featured: Boolean(body.is_featured),
        is_published:
          body.is_published !== undefined ? Boolean(body.is_published) : true,
        display_order: body.display_order || 99,
        created_at: new Date().toISOString(),
        ...body,
      };
      if (!updatedItem) updatedItem = fallbackItem;
      updatedList.push(fallbackItem);
    }

    writeLocalTestimonials(updatedList);

    await logAdminAction({
      adminEmail: user.email,
      action: "UPDATE_TESTIMONIAL",
      entity: "testimonial",
      entityId: id,
      metadata: body,
    });

    return NextResponse.json({
      success: true,
      data: updatedItem || { id, ...body },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  return handleUpdate(request, context);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  return handleUpdate(request, context);
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
      const { error } = await supabase
        .from("testimonials")
        .delete()
        .eq("id", id);
      if (error) console.warn("Supabase testimonial delete warning:", error);
    } catch (dbErr) {
      console.warn("Notice: Deleting testimonial in DB fallback:", dbErr);
    }

    // Persist removal from local JSON file
    const current = readLocalTestimonials();
    const updatedList = current.filter((item) => item.id !== id);
    writeLocalTestimonials(updatedList);

    await logAdminAction({
      adminEmail: user.email,
      action: "DELETE_TESTIMONIAL",
      entity: "testimonial",
      entityId: id,
    });

    return NextResponse.json({ success: true, id });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
