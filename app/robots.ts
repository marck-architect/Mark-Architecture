import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.mark-architects.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/markarchit/admin", "/admin", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
