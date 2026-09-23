import "server-only";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "";

let cachedAdminClient: SupabaseClient | null = null;

/**
 * Returns an authoritative server-side Supabase client.
 * Uses SUPABASE_SERVICE_ROLE_KEY when available to bypass RLS for internal workflows,
 * or falls back to publishable key in development.
 */
export function getSupabaseAdminClient(): SupabaseClient {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Supabase configuration missing: NEXT_PUBLIC_SUPABASE_URL and key must be set.",
    );
  }

  if (!cachedAdminClient) {
    cachedAdminClient = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });
  }

  return cachedAdminClient;
}
