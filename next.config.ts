import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  // Disable static optimization for dynamic routes
  experimental: {
    optimizePackageImports: ['framer-motion', 'lottie-react'],
  },
};

export default nextConfig;
