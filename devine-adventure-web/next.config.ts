import type { NextConfig } from 'next';

/**
 * Static export for Render Static Site (free, no Node server, no sleep).
 * All data still comes from the Nest API via NEXT_PUBLIC_API_URL.
 */
const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Avoid trailing-slash path quirks on static hosts
  trailingSlash: true,
};

export default nextConfig;
