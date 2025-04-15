import { NextRequest, NextResponse } from 'next/server'
import { getClientIp } from '@/lib/get-client-ip'
import { getRateLimit, incrementRateLimit, isRateLimited } from '@/lib/rate-limit'

export async function middleware(req: NextRequest) {
  const isLoginAdmin = req.nextUrl.pathname === '/api/login-admin' && req.method === 'POST'

  // Rate limit hanya untuk login
  if (isLoginAdmin) {
    const ip = getClientIp(req)

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { message: 'Terlalu banyak percobaan login. Coba lagi dalam 5 menit.' },
        { status: 429 }
      )
    }

    incrementRateLimit(ip)
  }

  // Proteksi akses ke /admin agar hanya yang punya cookie bisa akses
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const token = req.cookies.get('auth_token')?.value
    const role = req.cookies.get('role')?.value

    const isAuthorized = token === 'secure-admin-token' && role === 'admin'

    if (!isAuthorized) {
      // Redirect ke halaman 404
      return NextResponse.rewrite(new URL('/404', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/login-admin', '/admin/:path*'],
}
