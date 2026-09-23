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

    // Retry only if not already sent
    const result = await retryConsultationConfirmation(id, false);

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
