import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // Default to password reset page if coming from recovery, or admin dashboard
  const next = searchParams.get("next") ?? "/admin/reset-password";

  if (code) {
    try {
      const cookieStore = await cookies();
      const supabase = createClient(cookieStore);
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        return NextResponse.redirect(`${origin}${next}`);
      } else {
        console.error(
          "[Auth Callback] Error exchanging code for session:",
          error,
        );
      }
    } catch (err) {
      console.error(
        "[Auth Callback] Unexpected error during code exchange:",
        err,
      );
    }
  }

  // If there's an error or no code, redirect to login with notification
  return NextResponse.redirect(`${origin}/admin/login?error=auth-code-error`);
}
