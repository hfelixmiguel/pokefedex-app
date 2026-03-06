/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable server components by default (available in Next.js 14+)
  reactStrictMode: true,

  // Output module format for better ESM support on Vercel
  output: 'standalone',

  // Configure image optimization for Pokemon assets
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.raw.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '*.img.pokemondb.net',
      },
      {
        protocol: 'https',
        hostname: '*.pokeresources.com',
      },
    ],
  },

  // API proxy settings for Pokemon data fetching
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://pokeapi.co/api/v2/:path*',
      },
    ];
  },
};

module.exports = nextConfig;