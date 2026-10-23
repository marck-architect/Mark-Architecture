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

    // 1. Verify User Session & Single-Email Admin Authority (or Gatekeeper cookie)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { GATEKEEPER_COOKIE_NAME, isValidGatekeeperToken } = await import(
      "@/lib/server/adminGatekeeper"
    );
    const gatekeeperCookie = cookieStore.get(GATEKEEPER_COOKIE_NAME)?.value;
    const isGatekeeper = isValidGatekeeperToken(gatekeeperCookie);

    const adminEmail =
      process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL;

    if (!user && !isGatekeeper) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (
      user &&
      adminEmail &&
      user.email?.toLowerCase() !== adminEmail.toLowerCase()
    ) {
      return NextResponse.json(
        { error: "Forbidden: Not an authorized administrator" },
        { status: 403 },
      );
    }

    // 2. Parse Body Updates
    const body = await request.json();
    const {
      meeting_url,
      admin_notes,
      payment_status,
      booking_date,
      booking_time,
      confirm_payment,
    } = body;

    const nowIso = new Date().toISOString();
    const updates: Record<string, unknown> = {
      updated_at: nowIso,
    };

    if (meeting_url !== undefined) updates.meeting_url = meeting_url;
    if (admin_notes !== undefined) updates.admin_notes = admin_notes;
    if (booking_date !== undefined) updates.booking_date = booking_date;
    if (booking_time !== undefined) updates.booking_time = booking_time;
    if (payment_status !== undefined) updates.payment_status = payment_status;

    const isConfirmingPaid =
      confirm_payment === true || payment_status === "paid";

    if (isConfirmingPaid) {
      updates.payment_status = "paid";
    }

    // 3. Update Consultation in Supabase
    // Only update guaranteed core schema columns so PostgREST never rejects with PGRST204
    const { getSupabaseAdminClient } = await import(
      "@/lib/server/supabaseAdmin"
    );
    const supabaseAdmin = getSupabaseAdminClient();

    let { data, error } = await supabaseAdmin
      .from("consultations")
      .update(updates)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error || !data) {
      const fbResult = await supabase
        .from("consultations")
        .update(updates)
        .eq("id", id)
        .select()
        .maybeSingle();
      if (fbResult.error && error) {
        throw fbResult.error;
      }
      if (fbResult.data) {
        data = fbResult.data;
        error = null;
      } else if (error) {
        throw error;
      }
    }

    // 4. If payment was just confirmed as paid, run the post-payment consultation workflow
    // (Google Meet creation + Resend confirmation email) non-fatally
    let workflowResult = null;
    if (isConfirmingPaid) {
      try {
        const { processPaidConsultation } = await import(
          "@/lib/server/consultationWorkflow"
        );
        workflowResult = await processPaidConsultation(id, undefined, true);
        const { data: refreshed } = await supabase
          .from("consultations")
          .select("*")
          .eq("id", id)
          .maybeSingle();
        if (refreshed) {
          data = refreshed;
        } else {
          const { data: fbRefreshed } = await supabaseAdmin
            .from("consultations")
            .select("*")
            .eq("id", id)
            .maybeSingle();
          if (fbRefreshed) {
            data = fbRefreshed;
          }
        }
      } catch (wfErr) {
        console.warn(
          "[Consultation Admin Confirm] Post-payment workflow notice:",
          wfErr,
        );
      }
    }

    const resolvedMeetingUrl =
      workflowResult?.meetingUrl || data?.meeting_url || updates.meeting_url;
    const resolvedCalendarEventId =
      workflowResult?.calendarEventId || data?.calendar_event_id;
    const resolvedMeetingStatus =
      workflowResult?.meetingStatus === "skipped"
        ? "scheduled"
        : workflowResult?.meetingStatus ||
          data?.meeting_status ||
          (resolvedMeetingUrl ? "scheduled" : undefined);
    const resolvedEmailStatus =
      workflowResult?.emailStatus === "skipped"
        ? "sent"
        : workflowResult?.emailStatus || data?.email_status;

    const finalData = {
      ...(data || { id }),
      ...updates,
      ...(resolvedMeetingUrl ? { meeting_url: resolvedMeetingUrl } : {}),
      ...(resolvedCalendarEventId
        ? { calendar_event_id: resolvedCalendarEventId }
        : {}),
      ...(resolvedMeetingStatus
        ? { meeting_status: resolvedMeetingStatus }
        : {}),
      ...(resolvedEmailStatus ? { email_status: resolvedEmailStatus } : {}),
    };

    return NextResponse.json({
      success: true,
      data: finalData,
      workflow: workflowResult,
    });
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
