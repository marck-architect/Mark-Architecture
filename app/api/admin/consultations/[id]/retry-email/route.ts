import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/server/adminAuth";
import { retryConsultationConfirmation } from "@/lib/server/email/emailService";
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
      // Optional body
    }

    let result;
    if (typeof body.client_email === "string" && body.client_email) {
      const { sendConsultationConfirmation } = await import(
        "@/lib/server/email/emailService"
      );
      result = await sendConsultationConfirmation({
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
        meetingUrl:
          typeof body.meeting_url === "string" ? body.meeting_url : undefined,
        forceResend: true,
      });
    } else {
      result = await retryConsultationConfirmation(id, true);
    }

    await logAdminAction({
      adminEmail: authResult.admin.user.email,
      action: "RETRY_CONFIRMATION_EMAIL",
      entity: "consultation",
      entityId: id,
      metadata: {
        status: result.status,
        messageId: result.messageId,
        error: result.error,
      },
    });

    if (!result.success) {
      return NextResponse.json(
        {
          error:
            result.error || "Failed to send confirmation email via Resend.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Confirmation email sent successfully via Resend.",
      data: result,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("retry-email error:", errorMsg);
    return NextResponse.json(
      { error: errorMsg || "Failed to retry email dispatch" },
      { status: 500 },
    );
  }
}
