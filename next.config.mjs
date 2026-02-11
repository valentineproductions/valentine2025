/** @type {import('next').NextConfig} */
// const nextConfig = {};

export const nextConfig = {
    reactStrictMode: true,
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
