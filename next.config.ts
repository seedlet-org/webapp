import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "paaybohgyurvbnsbjroh.supabase.co",
      },
    ],
  },
};

export default nextConfig;
