import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
    ],
  },
};

export default nextConfig;
