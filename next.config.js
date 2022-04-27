/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'avatars.githubusercontent.com',
      'pbs.twimg.com',
      'www.gstatic.com'
    ]
  }
}

module.exports = nextConfig
