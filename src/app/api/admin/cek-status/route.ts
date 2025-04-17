import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')

  if (!id) {
    return NextResponse.json({ message: 'ID tidak ditemukan' }, { status: 400 })
  }

  try {
    const [rows]: any = await db.query(
      'SELECT status_akun FROM pengguna WHERE id = ? AND jenis_akun = "admin"',
      [id]
    )

    const admin = rows[0]
    return NextResponse.json({
      status: admin?.status_akun || 'tidak ditemukan'
    })
  } catch (err) {
    console.error('❌ Error ambil status admin:', err)
    return NextResponse.json({ message: 'Gagal ambil status' }, { status: 500 })
  }
}
