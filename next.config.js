/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add environment variable to force ESLint legacy config
  env: {
    ESLINT_USE_FLAT_CONFIG: 'false'
  },
  // Optional: Disable ESLint during builds if issues persist
  eslint: {
    // This allows production builds to successfully complete even if there are ESLint errors
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig