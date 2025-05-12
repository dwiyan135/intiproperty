import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'

// Ambil semua provinsi
export async function GET() {
  try {
    const [rows] = await db.connection.query('SELECT * FROM provinsi ORDER BY nama ASC')
    return NextResponse.json({ provinsi: rows }, { status: 200 })
  } catch (error) {
    console.error('[GET PROVINSI ERROR]', error)
    return NextResponse.json({ message: 'Gagal mengambil data provinsi' }, { status: 500 })
  }
}

// Tambah provinsi
export async function POST(req: NextRequest) {
  try {
    const { nama } = await req.json()
    if (!nama) return NextResponse.json({ message: 'Nama provinsi wajib diisi' }, { status: 400 })

    const slug = nama.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    const [existing] = await db.connection.query('SELECT id FROM provinsi WHERE slug = ?', [slug])
    if ((existing as any[]).length > 0) {
      return NextResponse.json({ message: 'Provinsi sudah ada (slug sama)' }, { status: 409 })
    }

    const [result] = await db.connection.query(
      'INSERT INTO provinsi (nama, slug) VALUES (?, ?)',
      [nama, slug]
    )

    return NextResponse.json({ id: (result as any).insertId }, { status: 201 })
  } catch (error) {
    console.error('[POST PROVINSI ERROR]', error)
    return NextResponse.json({ message: 'Gagal menambahkan provinsi' }, { status: 500 })
  }
}
