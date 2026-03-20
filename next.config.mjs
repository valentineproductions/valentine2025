/** @type {import('next').NextConfig} */
// const nextConfig = {};

export const nextConfig = {
    reactStrictMode: true,
    trailingSlash: false, // Prevent href mismatch: server /work vs client /work/
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'cdn.sanity.io',
        },
      ],
    },
    async redirects() {
      return [
        {
          source: '/talent',
          destination: '/directors',
          permanent: true,
        },
        {
          source: '/talent/:path*',
          destination: '/directors/:path*',
          permanent: true,
        },
        {
          source: '/about',
          destination: '/information',
          permanent: true,
        },
        {
          source: '/about/:path*',
          destination: '/information/:path*',
          permanent: true,
        },
      ];
    },
  };

export default nextConfig;
