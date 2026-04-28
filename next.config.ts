import type { NextConfig } from "next";

// @ts-expect-error - next-pwa does not have perfect type definitions
import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ['@react-pdf/renderer'],
};

export default withPWA(nextConfig);
