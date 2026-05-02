/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/",
          destination: "/trust-layer-preview.html"
        }
      ]
    };
  }
};

export default nextConfig;
