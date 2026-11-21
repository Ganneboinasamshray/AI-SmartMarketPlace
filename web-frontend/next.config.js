/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['images.unsplash.com', 'images.pexels.com', 'via.placeholder.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api-ml/:path*',
        destination: 'http://localhost:8000/:path*',
      },
      {
        source: '/api-backend/:path*',
        destination: 'http://localhost:8081/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
