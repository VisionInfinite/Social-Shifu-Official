/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.aceternity.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // i18n: {
  //   locales: ['en', 'es', 'fr', 'hi'],
  //   defaultLocale: 'en',
  // },
}

module.exports = nextConfig 