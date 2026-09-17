import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import type { EmailOtpType } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/admin/reset-password";
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // If Supabase returned an explicit error parameter, redirect to reset-password with error
  if (error || errorDescription) {
    const errorMsg = encodeURIComponent(
      errorDescription || error || "Recovery link is invalid or has expired."
    );
    return NextResponse.redirect(`${origin}/admin/reset-password?error=${errorMsg}`);
  }

  // Handle PKCE Code exchange
  if (code) {
    try {
      const cookieStore = await cookies();
      const supabase = createClient(cookieStore);
      const { error: exchangeError } =
        await supabase.auth.exchangeCodeForSession(code);

      if (!exchangeError) {
        return NextResponse.redirect(`${origin}${next}`);
      } else {
        console.error(
          "[Auth Callback] Error exchanging code for session:",
          exchangeError
        );
        const errorMsg = encodeURIComponent(exchangeError.message);
        return NextResponse.redirect(`${origin}/admin/reset-password?error=${errorMsg}`);
      }
    } catch (err) {
      console.error(
        "[Auth Callback] Unexpected error during code exchange:",
        err
      );
    }
  }

  // Handle token_hash verification
  if (tokenHash) {
    try {
      const cookieStore = await cookies();
      const supabase = createClient(cookieStore);
      const { error: verifyError } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: type || "recovery",
      });

      if (!verifyError) {
        return NextResponse.redirect(`${origin}${next}`);
      } else {
        console.error("[Auth Callback] Error verifying token hash:", verifyError);
        const errorMsg = encodeURIComponent(verifyError.message);
        return NextResponse.redirect(`${origin}/admin/reset-password?error=${errorMsg}`);
      }
    } catch (err) {
      console.error("[Auth Callback] Unexpected error during token verification:", err);
    }
  }

  // If no server-readable code/token_hash was found (e.g. hash fragment was used in browser),
  // NEVER redirect to login; redirect directly to the reset-password page so client-side auth can process it!
  return NextResponse.redirect(`${origin}/admin/reset-password`);
}
