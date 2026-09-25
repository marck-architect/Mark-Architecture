import crypto from "crypto";

export const GATEKEEPER_COOKIE_NAME = "mark_admin_gatekeeper";

// Fallback key for development if ADMIN_ACCESS_KEY is not defined in environment
const DEFAULT_DEV_KEY = "mark_atelier_vault_9842";

/**
 * Retrieves the configured secret access key for the admin portal.
 */
export function getAdminAccessKey(): string {
  return process.env.ADMIN_ACCESS_KEY || DEFAULT_DEV_KEY;
}

/**
 * Generates a cryptographic verification token derived from the admin access key.
 */
export function generateGatekeeperToken(key?: string): string {
  const secret = key || getAdminAccessKey();
  return crypto
    .createHash("sha256")
    .update(`mark_gatekeeper_salt_v1:${secret}`)
    .digest("hex");
}

/**
 * Validates an incoming gatekeeper cookie token against the active secret key.
 * Uses constant-time comparison to protect against timing attacks.
 */
export function isValidGatekeeperToken(token?: string | null): boolean {
  if (!token || typeof token !== "string") return false;
  const expected = generateGatekeeperToken();
  if (token.length !== expected.length) return false;

  try {
    return crypto.timingSafeEqual(
      Buffer.from(token, "utf8"),
      Buffer.from(expected, "utf8"),
    );
  } catch {
    return token === expected;
  }
}

/**
 * Validates an incoming URL access key candidate against the configured key.
 * Uses constant-time comparison.
 */
export function isValidAdminAccessKey(candidateKey?: string | null): boolean {
  if (!candidateKey || typeof candidateKey !== "string") return false;
  const expected = getAdminAccessKey();
  if (candidateKey.length !== expected.length) return false;

  try {
    return crypto.timingSafeEqual(
      Buffer.from(candidateKey, "utf8"),
      Buffer.from(expected, "utf8"),
    );
  } catch {
    return candidateKey === expected;
  }
}
