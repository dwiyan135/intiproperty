import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({
    message: 'Logout berhasil',
  })

  response.cookies.set('auth_token', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    expires: new Date(0), // expired segera
    path: '/',
  })

  return response
}
