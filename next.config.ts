import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'toa.muro.click',
      },
      {
        protocol: 'https',
        hostname: 'turkceoabtdeyiz.com',
      }
    ]
  },
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/api/public/uploads/:path*',
      },
    ];
  },
};

export default nextConfig;
