/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    KICK_USERNAME: process.env.KICK_USERNAME,
    KICK_PASSWORD: process.env.KICK_PASSWORD,
  }
}

module.exports = nextConfig
