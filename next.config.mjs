/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // Trailing slash keeps routing predictable on Vercel.
  trailingSlash: true,
};

export default nextConfig;
