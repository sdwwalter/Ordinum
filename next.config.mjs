import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  transpilePackages: ['@react-pdf/renderer'],

  turbopack: {},

  webpack: (config) => {
    // Resolve problema ESM do react-pdf
    config.resolve = config.resolve || {}
    config.resolve.alias = config.resolve.alias || {}

    return config
  },
}

export default withBundleAnalyzer(nextConfig)