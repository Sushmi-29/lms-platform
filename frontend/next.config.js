const nextConfig = {
    images: {
      domains: ["img.youtube.com"],
    },
  
    eslint: {
      ignoreDuringBuilds: true,
    },
  
    typescript: {
      ignoreBuildErrors: true,
    },
  };
  
  module.exports = nextConfig;