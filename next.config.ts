import type { NextConfig } from 'next'
import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'
import bundleAnalyzer from '@next/bundle-analyzer'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')
const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === 'true' })

const isDev = process.env.NODE_ENV !== 'production'
const turnstile = 'https://challenges.cloudflare.com'

// CSP: Next.js и админка Payload используют инлайн-скрипты гидрации, поэтому 'unsafe-inline'.
// TODO(spec): перейти на nonce-CSP, когда Payload admin будет его поддерживать.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : ''} ${turnstile}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "media-src 'self' blob: https:",
  `connect-src 'self' ${isDev ? 'ws: wss:' : ''} ${turnstile}`,
  `frame-src ${turnstile} https://www.openstreetmap.org https://www.google.com`,
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
]
  .join('; ')
  .replace(/\s{2,}/g, ' ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  ...(isDev
    ? []
    : [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }]),
]

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 480, 640, 768, 1024, 1280, 1440, 1920, 2400],
    imageSizes: [64, 96, 128, 200, 256, 320, 400],
    qualities: [70, 75, 85],
    localPatterns: [{ pathname: '/api/media/file/**' }, { pathname: '/placeholders/**' }, { pathname: '/**' }],
  },
  experimental: {
    globalNotFound: true,
    serverActions: {
      // Заявка «на заказ»: до 5 файлов по 10 МБ
      bodySizeLimit: '55mb',
    },
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
}

export default withBundleAnalyzer(withPayload(withNextIntl(nextConfig), { devBundleServerPackages: false }))
