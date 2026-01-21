import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc', // Já existia (Avatares)
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // NOVO (Fotos do Explorar)
      },
    ],
  },
};

export default nextConfig;