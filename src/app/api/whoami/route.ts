// File: src/app/api/whoami/route.ts
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function GET(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value

  if (!token) {
    return NextResponse.json({ login: false, reason: 'Token tidak ada' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    return NextResponse.json({ login: true, user: decoded })
  } catch (err) {
    return NextResponse.json({ login: false, reason: 'Token invalid' })
  }
}
