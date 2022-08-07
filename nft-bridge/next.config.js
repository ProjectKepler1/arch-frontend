/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['raw.githubusercontent.com', 'starknet-ecosystem.com', "res.cloudinary.com"]
  }
}

module.exports = nextConfig
