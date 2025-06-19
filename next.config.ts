import type { NextConfig } from "next";
import { withContentlayer } from "next-contentlayer2";
const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(isDev && {
    experimental: {
      allowDevelopmentBuild: true,
    },
  }),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.pexels.com",
      },
      {
        protocol: "https",
        hostname: "pixabay.com",
      },
    ],
  },
};

export default withContentlayer(nextConfig);
