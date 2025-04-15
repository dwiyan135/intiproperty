// File: src/app/api/log-login-admin/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import type { RowDataPacket } from 'mysql2'

export async function GET(req: NextRequest) {
  try {
    const [rows] = await db.query<RowDataPacket[]>(
      `
      SELECT l.id, l.login_via, l.status, l.ip_address, l.waktu_login,
             p.nama_pengguna AS nama_admin, p.email
      FROM log_login_admin l
      LEFT JOIN pengguna p ON l.id_pengguna = p.id
      ORDER BY l.waktu_login DESC
      LIMIT 100
      `
    )

    return NextResponse.json({ data: rows }, { status: 200 })
  } catch (error) {
    console.error('[LOG LOGIN ERROR]:', error)
    return NextResponse.json({ message: 'Gagal mengambil data log login' }, { status: 500 })
  }
}
