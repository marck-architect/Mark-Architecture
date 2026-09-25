import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/server/adminAuth";
import { getGoogleAuthUrl } from "@/lib/server/google/googleAuth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAdminAuth();
    if (!authResult.success) {
      return authResult.response;
    }

    const { searchParams } = new URL(req.url);
    const returnUrl =
      searchParams.get("returnUrl") || "/markarchit/admin?tab=consultations";

    const authUrl = getGoogleAuthUrl(encodeURIComponent(returnUrl));
    return NextResponse.redirect(authUrl);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("[Google OAuth] Failed to initiate authorization:", errorMsg);
    return NextResponse.json(
      { error: errorMsg || "Failed to initiate Google authorization" },
      { status: 500 },
    );
  }
}
