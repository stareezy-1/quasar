/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export — fully client-side, no server required.
  output: "export",
  images: {
    unoptimized: true,
  },
  // Trailing slash keeps static hosting (and offline SW) routing predictable.
  trailingSlash: true,
};

export default nextConfig;
