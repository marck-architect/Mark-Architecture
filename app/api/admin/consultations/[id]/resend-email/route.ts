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

    // Force resend even if previously sent
    const result = await retryConsultationConfirmation(id, true);

    await logAdminAction({
      adminEmail: authResult.admin.user.email,
      action: "RESEND_CONFIRMATION_EMAIL",
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
            result.error || "Failed to resend confirmation email via Resend.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Confirmation email resent successfully via Resend.",
      data: result,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("resend-email error:", errorMsg);
    return NextResponse.json(
      { error: errorMsg || "Failed to resend confirmation email" },
      { status: 500 },
    );
  }
}
