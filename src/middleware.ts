// File: src/middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { getClientIp } from '@/lib/get-client-ip'
import { incrementRateLimit, isRateLimited } from '@/lib/rate-limit'
import { verifyAdminToken } from '@/lib/verify-jwt'


export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  // ✅ Izinkan akses publik ke halaman login-admin
  if (pathname === '/login-admin') {
    return NextResponse.next()
  }

  // 🚫 Rate limit percobaan login POST
  if (pathname === '/api/login-admin' && req.method === 'POST') {
    const ip = getClientIp(req)
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { message: 'Terlalu banyak percobaan login. Coba lagi dalam 5 menit.' },
        { status: 429 }
      )
    }
    incrementRateLimit(ip)
  }

  // 🔒 Proteksi akses halaman admin
  if (pathname.startsWith('/admin')) {
    const token = req.cookies.get('auth_token')?.value
    if (!token) {
      console.log('❌ Tidak ada token, redirect ke 404')
      return NextResponse.rewrite(new URL('/404', req.url))
    }

    try {
      const decoded = verifyAdminToken(token)
      if (!decoded || decoded.role !== 'admin') {
        console.log('❌ Token tidak valid atau bukan admin')
        return NextResponse.rewrite(new URL('/404', req.url))
      }
    } catch (err) {
      console.error('❌ Gagal verifikasi token:', err)
      return NextResponse.rewrite(new URL('/404', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/login-admin', '/admin/:path*', '/login-admin'],
}
