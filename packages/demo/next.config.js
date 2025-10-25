/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['hesitation-detector'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
}

module.exports = nextConfig
