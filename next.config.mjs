/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@react-pdf/renderer'],
  webpack: (config) => {
    // Resolve o problema de ESM com @react-pdf/renderer
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    return config;
  },
};

export default nextConfig;
