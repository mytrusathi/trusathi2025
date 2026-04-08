import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'trusathi-2025.firebasestorage.app',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;
