/** @type {import('next').NextConfig} */
const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
const apiOrigin = new URL(apiBaseUrl)

const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: apiOrigin.protocol.replace(':', ''),
        hostname: apiOrigin.hostname,
        ...(apiOrigin.port ? { port: apiOrigin.port } : {}),
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/**',
      },
    ],
  },
  allowedDevOrigins: ['localhost', '127.0.0.1'],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${apiBaseUrl}/:path*`,
      },
    ]
  },
}

export default nextConfig
