import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/server/adminAuth";
import { logAdminAction } from "@/lib/server/audit";
import { seedTestimonials } from "@/data/adminSeed";

export const runtime = "nodejs";

export async function GET() {
  try {
    const authResult = await requireAdminAuth();
    if (!authResult.success) return authResult.response;

    const { supabase } = authResult.admin;
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("display_order", { ascending: true });

    if (!error && data && data.length > 0) {
      return NextResponse.json({ success: true, data });
    }
    return NextResponse.json({ success: true, data: seedTestimonials });
  } catch (err: unknown) {
    return NextResponse.json({ success: true, data: seedTestimonials });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAdminAuth();
    if (!authResult.success) return authResult.response;

    const { supabase, user } = authResult.admin;
    const body = await request.json();
    const {
      client_name,
      company,
      position,
      review,
      rating,
      photo_url,
      project_title,
      is_featured,
      is_published,
      display_order,
    } = body;

    if (!client_name || !review) {
      return NextResponse.json(
        { error: "Client name and review text are required." },
        { status: 400 },
      );
    }

    const newTestimonial = {
      client_name,
      company: company || null,
      position: position || null,
      review,
      rating: Number(rating) || 5,
      photo_url: photo_url || "/images/profile.png",
      project_title: project_title || null,
      is_featured: Boolean(is_featured),
      is_published: is_published !== undefined ? Boolean(is_published) : true,
      display_order: Number(display_order) || 99,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("testimonials")
      .insert(newTestimonial)
      .select()
      .single();
    if (error) console.warn("Supabase testimonial insert warning:", error);

    const created = data || { id: `test_${Date.now()}`, ...newTestimonial };

    await logAdminAction({
      adminEmail: user.email,
      action: "CREATE_TESTIMONIAL",
      entity: "testimonial",
      entityId: created.id,
      metadata: { client_name },
    });

    return NextResponse.json({ success: true, data: created });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
