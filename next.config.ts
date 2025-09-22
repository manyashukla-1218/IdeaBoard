import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
 images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
    unoptimized: true, // This will fix immediate image issues
  },
  // Disable strict mode to prevent double rendering issues
  reactStrictMode: false,
};

export default nextConfig;
