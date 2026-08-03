import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { unoptimized: false },
  experimental: {
    scrollRestoration: false,
  },
};

export default nextConfig;
