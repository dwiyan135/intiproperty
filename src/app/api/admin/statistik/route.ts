import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import type { RowDataPacket } from 'mysql2'

export async function GET() {
  try {
    const [penggunaRows] = await db.query<RowDataPacket[]>(
      'SELECT COUNT(*) AS total FROM pengguna'
    )
    const [listingRows] = await db.query<RowDataPacket[]>(
      "SELECT COUNT(*) AS total FROM properti WHERE status IN ('dijual', 'disewakan')"
    )
    const [transaksiRows] = await db.query<RowDataPacket[]>(
      "SELECT COUNT(*) AS total FROM riwayat_pembayaran WHERE status = 'berhasil'"
    )

    return NextResponse.json({
      pengguna: penggunaRows[0].total,
      listing: listingRows[0].total,
      transaksi: transaksiRows[0].total
    })
  } catch (error) {
    console.error('❌ Error statistik dashboard:', error)
    return NextResponse.json({ message: 'Gagal mengambil statistik', error }, { status: 500 })
  }
}
