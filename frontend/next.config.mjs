/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://web-production-c085a.up.railway.app',
  },
  // Ensure environment variables are available at build time
  experimental: {
    serverActions: true,
  },
  // Force fresh build
  generateBuildId: async () => {
    return `build-${Date.now()}`
  },
}

export default nextConfig
