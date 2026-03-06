/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Output module instead of CommonJS for better ESM support
  output: 'module',

  // Configure image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'img.pokemondb.net',
      },
      {
        protocol: 'https',
        hostname: 'pokeresources.com',
      },
    ],
  },

  // Enable experimental features for better performance
  experimental: {
    serverActions: true,
  },

  // API proxy settings (useful in production)
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://pokeapi.co/api/v2/:path*',
      },
    ];
  },

  // Enable gzip compression for smaller bundle sizes
  compress: true,
};

module.exports = nextConfig;