import type { NextRequest } from 'next/server'

export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) {
    // Jika ada beberapa IP (proxy), ambil yang pertama (asli)
    const ip = forwarded.split(',')[0].trim()
    if (ip) return ip
  }

  // Jika tidak ada header, fallback ke IPv6 localhost
  return '::1'
}
