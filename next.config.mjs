/** @type {import('next').NextConfig} */
// const nextConfig = {};

export const nextConfig = {
    reactStrictMode: true,
    distDir: 'next-dist',
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'cdn.sanity.io',
        },
      ],
    },
  };

export default nextConfig;
