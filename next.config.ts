import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
  },
  async redirects() {
    return [
      {
        source: "/services",
        destination: "/consultation",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
