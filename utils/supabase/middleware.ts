import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const createClient = async (request: NextRequest) => {
  // Create an unmodified response
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const pathname = request.nextUrl.pathname;
  const searchParams = request.nextUrl.searchParams;

  // 1. Intercept any Supabase recovery redirects that landed on the root URL or other pages
  if (pathname === "/") {
    const hasAuthError =
      searchParams.has("error") ||
      searchParams.has("error_code") ||
      searchParams.has("error_description");
    const hasRecoveryParams =
      searchParams.has("code") ||
      (searchParams.has("token_hash") &&
        searchParams.get("type") === "recovery");

    if (hasAuthError || hasRecoveryParams) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/markarchit/admin/reset-password";
      return NextResponse.redirect(redirectUrl);
    }
  }

  // 2. Cloak legacy /admin routes: redirect bots and direct visitors to home (/)
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const homeUrl = request.nextUrl.clone();
    homeUrl.pathname = "/";
    homeUrl.search = "";
    return NextResponse.redirect(homeUrl);
  }

  if (!supabaseUrl || !supabaseKey) {
    // Local UI-only dev fallback: no Supabase project configured, skip
    // auth/session handling entirely instead of throwing on every request.
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  // Refresh user session token
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const adminEmail =
    process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  // 3. Protect /markarchit/admin routes
  if (pathname.startsWith("/markarchit/admin")) {
    const isLoginPage = pathname === "/markarchit/admin/login";
    const isResetPasswordPage = pathname === "/markarchit/admin/reset-password";
    const isAuthenticatedAdmin =
      Boolean(user) &&
      (!adminEmail || user?.email?.toLowerCase() === adminEmail.toLowerCase());

    if (!isAuthenticatedAdmin && !isLoginPage && !isResetPasswordPage) {
      const url = request.nextUrl.clone();
      url.pathname = "/markarchit/admin/login";
      return NextResponse.redirect(url);
    }

    if (isAuthenticatedAdmin && isLoginPage) {
      const url = request.nextUrl.clone();
      url.pathname = "/markarchit/admin";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
};
