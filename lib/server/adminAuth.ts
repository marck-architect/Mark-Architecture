import "server-only";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import {
  GATEKEEPER_COOKIE_NAME,
  isValidGatekeeperToken,
} from "./adminGatekeeper";
import { getSupabaseAdminClient } from "./supabaseAdmin";

export interface AuthenticatedAdminResult {
  user: {
    id: string;
    email: string;
  };
  supabase: ReturnType<typeof createClient>;
}

/**
 * Server-side authoritative verification of admin session.
 * Accepts either an authenticated admin Supabase user session or a valid
 * Gatekeeper cookie token, and returns the service-role admin client when
 * available so RLS never blocks admin operations.
 */
export async function requireAdminAuth(): Promise<
  | { success: true; admin: AuthenticatedAdminResult }
  | { success: false; response: NextResponse }
> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const gatekeeperCookie = cookieStore.get(GATEKEEPER_COOKIE_NAME)?.value;
  const isGatekeeper = isValidGatekeeperToken(gatekeeperCookie);

  const adminEmail =
    process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  if (!user && !isGatekeeper) {
    return {
      success: false,
      response: NextResponse.json(
        { error: "Unauthorized: Admin session required" },
        { status: 401 },
      ),
    };
  }

  if (user && adminEmail && user.email?.toLowerCase() !== adminEmail.toLowerCase()) {
    return {
      success: false,
      response: NextResponse.json(
        { error: "Forbidden: Not an authorized administrator" },
        { status: 403 },
      ),
    };
  }

  let dbClient: unknown = supabase;
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      dbClient = getSupabaseAdminClient();
    } catch {
      dbClient = supabase;
    }
  }

  return {
    success: true,
    admin: {
      user: {
        id: user?.id || "gatekeeper_admin",
        email: user?.email || adminEmail || "admin@markarchitects.com",
      },
      supabase: dbClient as any,
    },
  };
}
