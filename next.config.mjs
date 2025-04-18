const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn-01.cms-ap-v2i.applyflow.com',
      },
      {
        protocol: 'https',
        hostname: 'assets.coingecko.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn-images.toolify.ai',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // Add Cloudinary domain here
      },
    ],
  },
};

export default nextConfig;
