import "server-only";
import { google } from "googleapis";
import { getSupabaseAdminClient } from "../supabaseAdmin";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const GOOGLE_REDIRECT_URI =
  process.env.GOOGLE_REDIRECT_URI ||
  (process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}/api/admin/google/callback`
    : "http://localhost:3000/api/admin/google/callback");

const CALENDAR_SCOPES = [
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/userinfo.email",
];

/**
 * Creates an OAuth2 client configured with Google Cloud credentials.
 */
export function createOAuth2Client() {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    throw new Error(
      "Google OAuth credentials missing: GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be configured in environment variables.",
    );
  }
  return new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI,
  );
}

/**
 * Generates the Google consent URL for the atelier/admin account.
 */
export function getGoogleAuthUrl(state?: string): string {
  const oauth2Client = createOAuth2Client();
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent", // Force to ensure refresh_token is returned
    scope: CALENDAR_SCOPES,
    state: state || "admin_connect",
  });
}

/**
 * Exchanges authorization code from callback for tokens and saves refresh_token securely in Supabase.
 */
export async function handleGoogleCallback(
  code: string,
  clientOverride?: any,
): Promise<{
  success: boolean;
  accountEmail: string;
}> {
  const oauth2Client = createOAuth2Client();
  const { tokens } = await oauth2Client.getToken(code);

  if (!tokens.refresh_token) {
    console.warn(
      "[Google OAuth] No refresh_token returned in code exchange. Ensure prompt=consent.",
    );
  }

  oauth2Client.setCredentials(tokens);

  // Retrieve user's email address
  const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
  const userInfo = await oauth2.userinfo.get();
  const accountEmail = userInfo.data.email || "unknown@google.com";

  // Use clientOverride if provided, otherwise fallback to server admin client
  const supabase = clientOverride || getSupabaseAdminClient();

  const nowIso = new Date().toISOString();
  const expiresAt = tokens.expiry_date
    ? new Date(tokens.expiry_date).toISOString()
    : null;

  // If refresh_token was received, update row; otherwise only update expires_at if row already exists
  if (tokens.refresh_token) {
    const { error } = await supabase.from("google_integrations").upsert(
      {
        provider: "google",
        account_email: accountEmail,
        refresh_token: tokens.refresh_token,
        scope: tokens.scope || CALENDAR_SCOPES.join(" "),
        expires_at: expiresAt,
        updated_at: nowIso,
      },
      { onConflict: "provider" },
    );

    if (error) {
      if (error.message.includes("row-level security")) {
        throw new Error(
          `Supabase RLS policy blocked saving to 'google_integrations'. Please ensure SUPABASE_SERVICE_ROLE_KEY is set in .env.local or the RLS policy allows authenticated admin access. (${error.message})`,
        );
      }
      throw new Error(`Failed to save Google integration: ${error.message}`);
    }
  } else {
    // Check if we already have a refresh token
    const { data: existing } = await supabase
      .from("google_integrations")
      .select("refresh_token")
      .eq("provider", "google")
      .maybeSingle();

    if (!existing?.refresh_token) {
      throw new Error(
        "Google did not provide a refresh token. Please revoke access in your Google Account security settings and reconnect.",
      );
    }
  }

  return { success: true, accountEmail };
}

/**
 * Checks whether the atelier/admin Google account is authorized.
 */
export async function getGoogleConnectionStatus(): Promise<{
  connected: boolean;
  accountEmail?: string;
  expiresAt?: string;
}> {
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("google_integrations")
      .select("account_email, expires_at, refresh_token")
      .eq("provider", "google")
      .maybeSingle();

    if (error || !data || !data.refresh_token) {
      return { connected: false };
    }

    return {
      connected: true,
      accountEmail: data.account_email,
      expiresAt: data.expires_at || undefined,
    };
  } catch (err) {
    console.warn("[Google OAuth] Error checking connection status:", err);
    return { connected: false };
  }
}

/**
 * Returns an authenticated Google Calendar API client using the stored atelier refresh token.
 */
export async function getAuthorizedCalendarClient() {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("google_integrations")
    .select("refresh_token, account_email")
    .eq("provider", "google")
    .maybeSingle();

  if (error || !data || !data.refresh_token) {
    throw new Error(
      "Google Calendar is not connected. The atelier admin must authorize Google in the Admin Dashboard.",
    );
  }

  const oauth2Client = createOAuth2Client();
  oauth2Client.setCredentials({
    refresh_token: data.refresh_token,
  });

  return {
    calendar: google.calendar({ version: "v3", auth: oauth2Client }),
    accountEmail: data.account_email,
  };
}

/**
 * Disconnects Google integration by removing stored credentials.
 */
export async function disconnectGoogleIntegration(): Promise<void> {
  const supabase = getSupabaseAdminClient();
  await supabase.from("google_integrations").delete().eq("provider", "google");
}
