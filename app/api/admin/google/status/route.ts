import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/server/adminAuth";
import { getGoogleConnectionStatus } from "@/lib/server/google/googleAuth";

export const runtime = "nodejs";

export async function GET() {
  try {
    const authResult = await requireAdminAuth();
    if (!authResult.success) {
      return authResult.response;
    }

    const status = await getGoogleConnectionStatus();
    return NextResponse.json(status);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: errorMsg || "Failed to check Google status" },
      { status: 500 },
    );
  }
}
