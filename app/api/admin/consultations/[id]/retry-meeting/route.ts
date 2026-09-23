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

    const result = await retryConsultationMeeting(id);

    await logAdminAction({
      adminEmail: authResult.admin.user.email,
      action: "RETRY_MEETING_CREATION",
      entity: "consultation",
      entityId: id,
      metadata: {
        status: result.status,
        meeting_url: result.meetingUrl,
        error: result.error,
      },
    });

    if (!result.success) {
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
      data: result,
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
