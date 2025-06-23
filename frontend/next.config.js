/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed 'export' output to enable API routes
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
