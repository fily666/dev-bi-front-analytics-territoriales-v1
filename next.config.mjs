/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['react-chartjs-2', 'chart.js'],
  },
};

export default nextConfig;
