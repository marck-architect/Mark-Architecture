import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/server/adminAuth";
import { disconnectGoogleIntegration } from "@/lib/server/google/googleAuth";
import { logAdminAction } from "@/lib/server/audit";

export const runtime = "nodejs";

export async function POST() {
  try {
    const authResult = await requireAdminAuth();
    if (!authResult.success) {
      return authResult.response;
    }

    await disconnectGoogleIntegration();

    await logAdminAction({
      adminEmail: authResult.admin.user.email,
      action: "DISCONNECT_GOOGLE_INTEGRATION",
      entity: "google_integrations",
      entityId: "google",
      metadata: { timestamp: new Date().toISOString() },
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: errorMsg || "Failed to disconnect Google integration" },
      { status: 500 },
    );
  }
}
