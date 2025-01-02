/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com"], // Ajoutez votre domaine ici
  },
};

module.exports = nextConfig;
