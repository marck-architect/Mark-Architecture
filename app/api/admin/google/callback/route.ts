import { NextRequest, NextResponse } from "next/server";
import { handleGoogleCallback } from "@/lib/server/google/googleAuth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    const state = searchParams.get("state");

    const returnUrl = state
      ? decodeURIComponent(state)
      : "/markarchit/admin?tab=consultations";
    const appOrigin =
      process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin;

    if (error) {
      console.warn("[Google OAuth Callback] Error parameter received:", error);
      return NextResponse.redirect(
        `${appOrigin}${returnUrl}&google_error=${encodeURIComponent(error)}`,
      );
    }

    if (!code) {
      return NextResponse.redirect(
        `${appOrigin}${returnUrl}&google_error=missing_code`,
      );
    }

    const { cookies } = await import("next/headers");
    const { createClient } = await import("@/utils/supabase/server");
    const cookieStore = await cookies();
    const supabaseUser = createClient(cookieStore);

    await handleGoogleCallback(code, supabaseUser);

    return NextResponse.redirect(
      `${appOrigin}${returnUrl}&google_status=connected`,
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("[Google OAuth Callback] Error handling callback:", errorMsg);
    const appOrigin =
      process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin;
    return NextResponse.redirect(
      `${appOrigin}/admin?tab=consultations&google_error=${encodeURIComponent(errorMsg)}`,
    );
  }
}
