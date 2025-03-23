import { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      // Explicitly disable Turbopack by setting an empty object
    } as any, // Type assertion to bypass strict type checks
  },
  webpack: (config) => {
    return config; // Ensure Webpack is used
  },
};

export default nextConfig;
