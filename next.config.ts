import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin();
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https' as const,
        hostname: '**',
      },
      {
        protocol: 'http' as const,
        hostname: '**',
      },
      {
        protocol: 'http' as const,
        hostname: 'localhost',
      },
    ],
  },
};
 
module.exports = withNextIntl(nextConfig);