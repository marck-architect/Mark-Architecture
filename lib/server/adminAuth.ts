import "server-only";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export interface AuthenticatedAdminResult {
  user: {
    id: string;
    email: string;
  };
  supabase: ReturnType<typeof createClient>;
}

/**
 * Server-side authoritative verification of admin session.
 * Rejects requests from non-admins or unauthenticated sessions.
 */
export async function requireAdminAuth(): Promise<
  | { success: true; admin: AuthenticatedAdminResult }
  | { success: false; response: NextResponse }
> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  const adminEmail =
    process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  if (error || !user) {
    return {
      success: false,
      response: NextResponse.json(
        { error: "Unauthorized: Admin session required" },
        { status: 401 },
      ),
    };
  }

  if (adminEmail && user.email?.toLowerCase() !== adminEmail.toLowerCase()) {
    return {
      success: false,
      response: NextResponse.json(
        { error: "Forbidden: Not an authorized administrator" },
        { status: 403 },
      ),
    };
  }

  return {
    success: true,
    admin: {
      user: {
        id: user.id,
        email: user.email || adminEmail || "admin@markarchitects.com",
      },
      supabase: supabase as any,
    },
  };
}
