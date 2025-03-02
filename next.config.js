/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: '*.cloudinary.com',
      }
    ],
    domains: ['res.cloudinary.com'],
  },
};

module.exports = nextConfig;