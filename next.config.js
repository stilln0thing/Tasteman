/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
    // Local uploads stored in public/uploads
    unoptimized: false,
  },
};

module.exports = nextConfig;
