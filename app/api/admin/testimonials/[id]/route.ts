import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
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

    const dbUpdateQuote: Record<string, any> = {};
    if (body.client_name !== undefined) dbUpdateQuote.client_name = body.client_name;
    if (body.company !== undefined) dbUpdateQuote.company = body.company;
    if (body.position !== undefined) dbUpdateQuote.client_role = body.position;
    if (body.review !== undefined) dbUpdateQuote.quote = body.review;
    if (body.rating !== undefined) dbUpdateQuote.rating = Number(body.rating);
    if (body.photo_url !== undefined) dbUpdateQuote.avatar_url = body.photo_url;
    if (body.project_title !== undefined) dbUpdateQuote.project_title = body.project_title;
    if (body.is_featured !== undefined) dbUpdateQuote.is_featured = Boolean(body.is_featured);
    if (body.is_published !== undefined) dbUpdateQuote.is_published = Boolean(body.is_published);
    if (body.display_order !== undefined) dbUpdateQuote.display_order = Number(body.display_order);

    const dbUpdateReview: Record<string, any> = {};
    if (body.client_name !== undefined) dbUpdateReview.client_name = body.client_name;
    if (body.company !== undefined) dbUpdateReview.company = body.company;
    if (body.position !== undefined) dbUpdateReview.position = body.position;
    if (body.review !== undefined) dbUpdateReview.review = body.review;
    if (body.rating !== undefined) dbUpdateReview.rating = Number(body.rating);
    if (body.photo_url !== undefined) dbUpdateReview.photo_url = body.photo_url;
    if (body.project_title !== undefined) dbUpdateReview.project_title = body.project_title;
    if (body.is_featured !== undefined) dbUpdateReview.is_featured = Boolean(body.is_featured);
    if (body.is_published !== undefined) dbUpdateReview.is_published = Boolean(body.is_published);
    if (body.display_order !== undefined) dbUpdateReview.display_order = Number(body.display_order);

    try {
      let { data, error } = await supabase
        .from("testimonials")
        .update(dbUpdateQuote)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        const retry = await supabase
          .from("testimonials")
          .update(dbUpdateReview)
          .eq("id", id)
          .select()
          .single();
        if (!retry.error && retry.data) {
          data = retry.data;
          error = null;
        }
      }

      if (!error && data) {
        updatedItem = {
          id: String(data.id),
          client_name: data.client_name,
          company: data.company,
          position: data.position || data.client_role || body.position,
          review: data.review || data.quote || body.review,
          rating: Number(data.rating) || 5,
          photo_url: data.photo_url || data.avatar_url || body.photo_url,
          project_title: data.project_title || body.project_title,
          is_featured: Boolean(data.is_featured),
          is_published: data.is_published !== false,
          display_order: Number(data.display_order) || 0,
          created_at: data.created_at,
        };
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

    // Also sync to Supabase site_content for complete database consistency
    try {
      await supabase.from("site_content").upsert(
        {
          section_key: "testimonials",
          content: updatedList,
        },
        { onConflict: "section_key" },
      );
    } catch (scErr) {
      console.warn("Notice: Updating site_content testimonials on update:", scErr);
    }

    await logAdminAction({
      adminEmail: user.email,
      action: "UPDATE_TESTIMONIAL",
      entity: "testimonial",
      entityId: id,
      metadata: body,
    });

    try {
      revalidatePath("/");
      revalidatePath("/admin/testimonials");
    } catch (revalErr) {
      console.warn("revalidatePath error:", revalErr);
    }

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

    // Also sync to Supabase site_content for complete database consistency
    try {
      await supabase.from("site_content").upsert(
        {
          section_key: "testimonials",
          content: updatedList,
        },
        { onConflict: "section_key" },
      );
    } catch (scErr) {
      console.warn("Notice: Updating site_content testimonials on delete:", scErr);
    }

    await logAdminAction({
      adminEmail: user.email,
      action: "DELETE_TESTIMONIAL",
      entity: "testimonial",
      entityId: id,
    });

    try {
      revalidatePath("/");
      revalidatePath("/admin/testimonials");
    } catch (revalErr) {
      console.warn("revalidatePath error:", revalErr);
    }

    return NextResponse.json({ success: true, id });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
