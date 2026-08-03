import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { unoptimized: false },
  eslint: { ignoreDuringBuilds: true },
  experimental: {
    scrollRestoration: false,
  },
};

export default nextConfig;
