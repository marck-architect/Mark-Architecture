/**
 * Resolves the application origin dynamically for local development,
 * preview deployments (e.g. Vercel), and live production.
 */
export function getAppOrigin(request?: Request): string {
  // 1. Explicit production / environment URL override (if non-localhost)
  const envUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL;

  if (
    envUrl &&
    !envUrl.includes("localhost") &&
    !envUrl.includes("127.0.0.1")
  ) {
    return envUrl.replace(/\/$/, "");
  }

  // 2. Incoming request headers (reverse proxy / browser origin)
  if (request) {
    const origin = request.headers.get("origin");
    if (origin && !origin.includes("null")) {
      return origin.replace(/\/$/, "");
    }

    const forwardedHost = request.headers.get("x-forwarded-host");
    const forwardedProto = request.headers.get("x-forwarded-proto") || "https";
    if (forwardedHost) {
      return `${forwardedProto}://${forwardedHost}`.replace(/\/$/, "");
    }

    const host = request.headers.get("host");
    if (host) {
      const proto =
        host.includes("localhost") || host.includes("127.0.0.1")
          ? "http"
          : "https";
      return `${proto}://${host}`.replace(/\/$/, "");
    }
  }

  // 3. Vercel cloud deployment environment variables
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.replace(/\/$/, "")}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }

  // 4. Fallback: if in production, default to live domain; else localhost:3000
  if (process.env.NODE_ENV === "production") {
    return (envUrl || "https://markarchitects.com").replace(/\/$/, "");
  }

  return (envUrl || "http://localhost:3000").replace(/\/$/, "");
}
