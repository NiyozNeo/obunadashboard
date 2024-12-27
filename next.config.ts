import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    BACKEND_URL: process.env.BACKEND_URL,
  },
  images: {
    domains: [(process.env.BACKEND_URL ?? "").replace(/^https?:\/\//, ""), "localhost"],
  },
};

export default nextConfig;
