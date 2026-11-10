import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/**",
      },
    ],
    // Default deviceSizes/imageSizes (8 + 8 widths) combined with multiple
    // formats/qualities let a single image fan out into 30+ distinct cache
    // entries — each one a ~2s cold transform on first request, not a fast
    // cache hit. Trimmed to the widths the site's grids actually render at
    // (see `sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw,
    // 33vw"` on the portfolio/collection cards) so far fewer variants ever
    // need a cold miss. Single format (webp) halves that further — webp has
    // near-universal browser support and the gain from also serving avif
    // doesn't justify doubling the transform count.
    minimumCacheTTL: 2678400, // 31 days — project photos don't change often
    formats: ["image/webp"],
    deviceSizes: [640, 828, 1080, 1920],
    imageSizes: [64, 128, 256, 384],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  async redirects() {
    return [
      {
        source: "/services/:path*",
        destination: "/pricing",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
