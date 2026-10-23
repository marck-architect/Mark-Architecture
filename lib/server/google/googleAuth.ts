import "server-only";
import fs from "fs";
import path from "path";
import os from "os";
import { google } from "googleapis";
import {
  getSupabaseAdminClient,
  getServerSupabaseClient,
} from "../supabaseAdmin";

const LOCAL_TOKEN_CACHE_PATH = path.join(
  os.tmpdir(),
  "mark-architects-google-oauth.json",
);

interface CachedGoogleAuth {
  account_email: string;
  refresh_token: string;
  scope?: string;
  expires_at?: string | null;
  updated_at?: string;
}

function readLocalGoogleToken(): CachedGoogleAuth | null {
  try {
    if (fs.existsSync(LOCAL_TOKEN_CACHE_PATH)) {
      const raw = fs.readFileSync(LOCAL_TOKEN_CACHE_PATH, "utf-8");
      const parsed = JSON.parse(raw) as CachedGoogleAuth;
      if (parsed?.refresh_token) return parsed;
    }
  } catch {
    // Ignore file cache read errors
  }
  return null;
}

function writeLocalGoogleToken(tokenData: CachedGoogleAuth | null): void {
  try {
    if (!tokenData) {
      if (fs.existsSync(LOCAL_TOKEN_CACHE_PATH)) {
        fs.unlinkSync(LOCAL_TOKEN_CACHE_PATH);
      }
      return;
    }
    fs.writeFileSync(
      LOCAL_TOKEN_CACHE_PATH,
      JSON.stringify(tokenData, null, 2),
      "utf-8",
    );
  } catch {
    // Ignore file cache write errors
  }
}

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

  // Use clientOverride if provided, otherwise use server cookie/admin client
  const supabase = clientOverride || (await getServerSupabaseClient());

  const nowIso = new Date().toISOString();
  const expiresAt = tokens.expiry_date
    ? new Date(tokens.expiry_date).toISOString()
    : null;

  // If refresh_token was received, update row; otherwise only update expires_at if row already exists
  if (tokens.refresh_token) {
    const tokenPayload: CachedGoogleAuth = {
      account_email: accountEmail,
      refresh_token: tokens.refresh_token,
      scope: tokens.scope || CALENDAR_SCOPES.join(" "),
      expires_at: expiresAt,
      updated_at: nowIso,
    };

    // Always persist to local cache & site_content fallback so missing table never breaks OAuth
    writeLocalGoogleToken(tokenPayload);

    const { error } = await supabase.from("google_integrations").upsert(
      {
        provider: "google",
        ...tokenPayload,
      },
      { onConflict: "provider" },
    );

    if (error) {
      console.warn(
        "[Google OAuth] Primary google_integrations upsert notice, saving to site_content fallback:",
        error.message,
      );
      try {
        await supabase.from("site_content").upsert(
          {
            section_key: "google_integration",
            content: tokenPayload,
            updated_at: nowIso,
          },
          { onConflict: "section_key" },
        );
      } catch {
        // Local token cache already written above
      }
    }
  } else {
    // Check if we already have a refresh token
    const existingStatus = await getGoogleConnectionStatus();
    if (!existingStatus.connected) {
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
    const supabase = await getServerSupabaseClient();
    let { data, error } = await supabase
      .from("google_integrations")
      .select("account_email, expires_at, refresh_token")
      .eq("provider", "google")
      .maybeSingle();

    if (error || !data) {
      const fb = await getSupabaseAdminClient()
        .from("google_integrations")
        .select("account_email, expires_at, refresh_token")
        .eq("provider", "google")
        .maybeSingle();
      if (fb.data) {
        data = fb.data;
        error = null;
      }
    }

    if (!data?.refresh_token) {
      // Check site_content fallback
      const { data: scData } = await supabase
        .from("site_content")
        .select("content")
        .eq("section_key", "google_integration")
        .maybeSingle();
      const scContent = scData?.content as CachedGoogleAuth | undefined;
      if (scContent?.refresh_token) {
        data = {
          account_email: scContent.account_email,
          expires_at: scContent.expires_at || null,
          refresh_token: scContent.refresh_token,
        };
      }
    }

    if (!data?.refresh_token) {
      const localToken = readLocalGoogleToken();
      if (localToken?.refresh_token) {
        data = {
          account_email: localToken.account_email,
          expires_at: localToken.expires_at || null,
          refresh_token: localToken.refresh_token,
        };
      }
    }

    if (!data || !data.refresh_token) {
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
  const supabase = await getServerSupabaseClient();
  let { data, error } = await supabase
    .from("google_integrations")
    .select("refresh_token, account_email")
    .eq("provider", "google")
    .maybeSingle();

  if (error || !data) {
    const fb = await getSupabaseAdminClient()
      .from("google_integrations")
      .select("refresh_token, account_email")
      .eq("provider", "google")
      .maybeSingle();
    if (fb.data) {
      data = fb.data;
      error = null;
    }
  }

  if (!data?.refresh_token) {
    const { data: scData } = await supabase
      .from("site_content")
      .select("content")
      .eq("section_key", "google_integration")
      .maybeSingle();
    const scContent = scData?.content as CachedGoogleAuth | undefined;
    if (scContent?.refresh_token) {
      data = {
        account_email: scContent.account_email,
        refresh_token: scContent.refresh_token,
      };
    }
  }

  if (!data?.refresh_token) {
    const localToken = readLocalGoogleToken();
    if (localToken?.refresh_token) {
      data = {
        account_email: localToken.account_email,
        refresh_token: localToken.refresh_token,
      };
    }
  }

  if (!data || !data.refresh_token) {
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
  writeLocalGoogleToken(null);
  const supabase = await getServerSupabaseClient();
  await supabase.from("google_integrations").delete().eq("provider", "google");
  try {
    await supabase
      .from("site_content")
      .delete()
      .eq("section_key", "google_integration");
  } catch {}
}
