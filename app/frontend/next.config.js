/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    WHATSAPP_API_URL: process.env.WHATSAPP_API_URL,
    API_URL: process.env.API_URL,
  }
}

module.exports = nextConfig
