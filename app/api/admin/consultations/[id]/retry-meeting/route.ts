import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/server/adminAuth";
import { retryConsultationMeeting } from "@/lib/server/google/googleCalendarService";
import { logAdminAction } from "@/lib/server/audit";

export const runtime = "nodejs";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authResult = await requireAdminAuth();
    if (!authResult.success) {
      return authResult.response;
    }

    const { id } = await params;

    let body: Record<string, unknown> = {};
    try {
      body = await req.json();
    } catch {
      // Request body is optional
    }

    const result = await retryConsultationMeeting(id, {
      clientName:
        typeof body.client_name === "string" ? body.client_name : undefined,
      clientEmail:
        typeof body.client_email === "string" ? body.client_email : undefined,
      clientPhone:
        typeof body.client_phone === "string" ? body.client_phone : undefined,
      tierName: typeof body.tier_name === "string" ? body.tier_name : undefined,
      bookingDate:
        typeof body.booking_date === "string" ? body.booking_date : undefined,
      bookingTime:
        typeof body.booking_time === "string" ? body.booking_time : undefined,
      notes: typeof body.notes === "string" ? body.notes : null,
    });

    // Also dispatch the confirmation email with the newly created meeting URL
    let emailStatus: "sent" | "failed" | "skipped" | "not_sent" = "not_sent";
    if (result.meetingUrl) {
      try {
        const {
          retryConsultationConfirmation,
          sendConsultationConfirmation,
        } = await import("@/lib/server/email/emailService");
        if (typeof body.client_email === "string" && body.client_email) {
          const emailRes = await sendConsultationConfirmation({
            consultationId: id,
            clientName:
              (typeof body.client_name === "string" && body.client_name) ||
              "Valued Client",
            clientEmail: body.client_email,
            consultationTitle:
              (typeof body.tier_name === "string" && body.tier_name) ||
              "Online Architectural Consultation",
            date:
              (typeof body.booking_date === "string" && body.booking_date) ||
              new Date().toISOString().split("T")[0],
            startTime:
              (typeof body.booking_time === "string" && body.booking_time) ||
              "14:00",
            timezone: "Pakistan Standard Time (PKT)",
            meetingUrl: result.meetingUrl,
            calendarEventId: result.calendarEventId,
            forceResend: true,
          });
          emailStatus = emailRes.status;
        } else {
          const emailRes = await retryConsultationConfirmation(id, true);
          emailStatus = emailRes.status;
        }
      } catch (emailErr) {
        console.warn("[retry-meeting] Email dispatch notice:", emailErr);
      }
    }

    await logAdminAction({
      adminEmail: authResult.admin.user.email,
      action: "RETRY_MEETING_CREATION",
      entity: "consultation",
      entityId: id,
      metadata: {
        status: result.status,
        meeting_url: result.meetingUrl,
        email_status: emailStatus,
        error: result.error,
      },
    });

    if (!result.success && !result.meetingUrl) {
      return NextResponse.json(
        {
          error:
            result.error ||
            "Failed to create Google Calendar event & Meet meeting.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Google Calendar event and Meet meeting scheduled successfully.",
      data: {
        ...result,
        emailStatus,
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("retry-meeting error:", errorMsg);
    return NextResponse.json(
      { error: errorMsg || "Failed to retry meeting creation" },
      { status: 500 },
    );
  }
}
