/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['images.unsplash.com', 'images.pexels.com', 'via.placeholder.com'],
  },
  async rewrites() {
    const mlUrl = process.env.NEXT_PUBLIC_ML_URL || 'http://localhost:8000';
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8081';
    return [
      {
        source: '/api-ml/:path*',
        destination: mlUrl + '/:path*',
      },
      {
        source: '/api-backend/:path*',
        destination: backendUrl + '/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
