import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // можно 5mb, 10mb, 20mb
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        // Если изображения могут находиться в разных подпутях, можно добавить pathname
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "avatarko.ru",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "il90rw5i14.ufs.sh",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
