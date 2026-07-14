/** @type {import('next').NextConfig} */
const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
const apiOrigin = new URL(apiBaseUrl)

const nextConfig = {
  images: {
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
  allowedDevOrigins: ['localhost', '127.0.0.1', '192.168.5.121'],
  outputFileTracingIncludes: {
    '/api/pdf': ['./node_modules/@sparticuz/chromium-min/**'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self)',
          },
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com; worker-src 'self' blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https:;",
          },
        ],
      },
    ]
  },
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
