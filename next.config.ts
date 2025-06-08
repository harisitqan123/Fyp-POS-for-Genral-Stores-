// @ts-nocheck
/* eslint-disable */

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // ✅ disables type checking during build
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ disables linting during build
  },
  images: {
    domains: ["ik.imagekit.io"],
  },
};

export default nextConfig;
