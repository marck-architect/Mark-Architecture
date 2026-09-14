import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // 1. Verify User Session & Single-Email Admin Authority
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const adminEmail =
      process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (adminEmail && user.email?.toLowerCase() !== adminEmail.toLowerCase()) {
      return NextResponse.json(
        { error: "Forbidden: Not an authorized administrator" },
        { status: 403 },
      );
    }

    // 2. Parse Body Updates
    const body = await request.json();
    const { meeting_url, admin_notes, payment_status } = body;

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (meeting_url !== undefined) updates.meeting_url = meeting_url;
    if (admin_notes !== undefined) updates.admin_notes = admin_notes;
    if (payment_status !== undefined) updates.payment_status = payment_status;

    // 3. Update Consultation in Supabase
    const { data, error } = await supabase
      .from("consultations")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    console.error("Failed to update consultation:", err);
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}
