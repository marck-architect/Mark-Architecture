import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { logAdminAction } from "@/lib/server/audit";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body?.email?.trim()?.toLowerCase();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid administrator email address is required." },
        { status: 400 },
      );
    }

    const adminEmail = (
      process.env.ADMIN_EMAIL ||
      process.env.NEXT_PUBLIC_ADMIN_EMAIL ||
      ""
    ).toLowerCase();

    // Security check: restrict password reset to configured admin email
    if (adminEmail && email !== adminEmail) {
      return NextResponse.json(
        {
          error:
            "Access denied. This email is not registered as an authorized administrator for MARK Architects.",
        },
        { status: 403 },
      );
    }

    // Determine application origin for redirect
    const origin =
      request.headers.get("origin") ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    const redirectTo = `${origin}/admin/reset-password`;

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      console.error("[Forgot Password] Supabase reset error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to initiate password reset email." },
        { status: 500 },
      );
    }

    // Record audit trail entry
    await logAdminAction({
      adminEmail: email,
      action: "REQUEST_PASSWORD_RESET",
      entity: "auth",
      entityId: email,
      metadata: {
        timestamp: new Date().toISOString(),
        redirectTo,
      },
    });

    return NextResponse.json({
      success: true,
      message: `A password reset link has been dispatched to ${email}. Please check your inbox and spam folders.`,
    });
  } catch (err: unknown) {
    console.error("[Forgot Password] Unexpected error:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "An unexpected server error occurred while requesting password reset.",
      },
      { status: 500 },
    );
  }
}
