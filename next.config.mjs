/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '192.168.5.117',
        port: '8000',
        pathname: '/**',
      },
    ],
  },
  allowedDevOrigins: ['localhost', '127.0.0.1', '192.168.5.121'],
  async rewrites() {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
    return [
      {
        source: '/api/:path*',
        destination: `${apiBaseUrl}/:path*`,
      },
    ]
  },
}

export default nextConfig
