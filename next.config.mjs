/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  serverExternalPackages: ['@react-pdf/renderer', '@react-pdf/layout', '@react-pdf/pdfkit', 'pdf-parse'],
};

export default nextConfig;
