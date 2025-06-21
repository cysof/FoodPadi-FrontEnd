import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL('https://foodpadi-d0xo.onrender.com/**')],
  }
};

export default nextConfig;
