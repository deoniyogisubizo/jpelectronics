/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
})

const nextConfig = {
  // other config
  turbopack: {},
  allowedDevOrigins: ['192.168.0.197'],
  images: {
    remotePatterns: [
      {
        hostname: 'loremflickr.com',
      },
    ],
  },
}

module.exports = withPWA(nextConfig)