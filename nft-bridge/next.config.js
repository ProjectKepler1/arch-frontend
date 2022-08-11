/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // domains: ['raw.githubusercontent.com', 'starknet-ecosystem.com', "","res.cloudinary.com", "live---metadata-5covpqijaa-uc.a.run.app", ""],
    domains: ['*'],
  }
}

module.exports = nextConfig
