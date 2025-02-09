import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.mapbox.com',
      },
      {
        protocol: 'https',
        hostname: '*.tiles.mapbox.com',
      },
    ],
  },
  // Enable webpack config for Mapbox GL
  webpack: (config) => {
    // Resolve Mapbox GL JS issues
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },
};

export default nextConfig;
