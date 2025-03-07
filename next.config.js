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
        hostname: 'res.cloudinary.com',
      }
    ],
    domains: [
      'res.cloudinary.com',
      'images.unsplash.com',
      'plus.unsplash.com',
      'firebasestorage.googleapis.com',
    ],
  },
  webpack: (config, { isServer }) => {
    // Fix for undici compatibility issues
    if (!isServer) {
      // Add fallbacks for Node.js core modules
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        url: require.resolve('url/'),
        zlib: require.resolve('browserify-zlib'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        assert: require.resolve('assert/'),
        os: require.resolve('os-browserify/browser'),
        path: require.resolve('path-browserify'),
        util: require.resolve('util/'),
        buffer: require.resolve('buffer/'),
      };
      
      // Exclude problematic dependencies from client bundle
      config.module.rules.push({
        test: /node_modules[\/\\](firebase|@firebase)[\/\\].*\.m?js$/,
        resolve: {
          fullySpecified: false,
        },
      });
    }
    
    return config;
  },
  transpilePackages: ['firebase', '@firebase/auth'],
  experimental: {
    serverComponentsExternalPackages: ['firebase-admin'],
  },
};

module.exports = nextConfig;