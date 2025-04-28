// File: src/app/api/admin/dashboard/route.ts

import { NextResponse } from 'next/server'
import db from '@/lib/db'
import type { RowDataPacket } from 'mysql2'

export async function GET() {
  try {
    const conn = await db.connection

    const [[{ totalPengguna }]] = await conn.query<RowDataPacket[]>(
      `SELECT COUNT(*) AS totalPengguna FROM pengguna`
    )

    const [[{ totalListing }]] = await conn.query<RowDataPacket[]>(
      `SELECT COUNT(*) AS totalListing FROM properti WHERE status = 'dijual' OR status = 'disewakan'`
    )

    const [[{ totalTransaksi }]] = await conn.query<RowDataPacket[]>(
      `SELECT COUNT(*) AS totalTransaksi FROM riwayat_pembayaran WHERE status = 'berhasil'`
    )

    return NextResponse.json({
      totalPengguna,
      totalListing,
      totalTransaksi
    })
  } catch (error) {
    console.error('❌ Error ambil statistik dashboard:', error)
    return NextResponse.json(
      { message: 'Gagal mengambil statistik dashboard', error },
      { status: 500 }
    )
  }
}
