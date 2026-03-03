/** @type {import('next').NextConfig} */

const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: false, // Disable to prevent auth loops
  reloadOnOnline: true,
  swcMinify: true,
  disable: false, // Enable PWA in development too
  workboxOptions: {
    disableDevLogs: true,
    // Don't cache authentication routes
    navigateFallbackDenylist: [/^\/login/, /^\/register/, /^\/error/],
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'supabase-cache',
          networkTimeoutSeconds: 10,
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 5 * 60, // 5 minutes
          },
        },
      },
    ],
  },
});

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  turbopack: {}, // Enable Turbopack with default settings
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

module.exports = withPWA(nextConfig);
