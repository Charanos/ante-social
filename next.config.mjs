/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
    ],
  },
  turbopack: {},
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ...(config.watchOptions || {}),
        ignored: [
          "**/backend/**",
          "**/.nx/**",
          "**/dist/**",
          "**/*.log",
          "**/tsconfig.tsbuildinfo",
        ],
      };
    }

    return config;
  },
};

export default nextConfig;
