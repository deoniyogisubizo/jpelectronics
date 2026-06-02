/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'jptech-route-cache',
        expiration: { maxEntries: 100, maxAgeSeconds: 86400 },
        networkTimeoutSeconds: 5,
      },
    },
    {
      urlPattern: /\.(?:js|css)$/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'jptech-static-assets',
        expiration: { maxEntries: 60, maxAgeSeconds: 31536000 },
      },
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|gif|webp|avif|svg|ico)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'jptech-images',
        expiration: { maxEntries: 100, maxAgeSeconds: 31536000 },
      },
    },
  ],
});

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https://loremflickr.com https://placehold.co;
  font-src 'self';
  connect-src 'self' https://*.mongodb.net;
  frame-src 'none';
  object-src 'none';
  base-uri 'self';
`;

const nextConfig = {
  reactCompiler: true,
  turbopack: {
    resolveAlias: {},
  },
  allowedDevOrigins: ['192.168.0.197'],
  compress: true,
  images: {
    minimumCacheTTL: 31536000,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [420, 640, 768, 1024, 1280, 1536],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'loremflickr.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
    ],
  },
  headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/favicon(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

module.exports = withPWA(nextConfig);
