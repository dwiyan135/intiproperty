import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'

// Ambil semua kecamatan
export async function GET() {
  try {
    const [rows] = await db.connection.query(`
      SELECT kec.*, kota.nama AS nama_kota, kota.slug AS slug_kota
      FROM kecamatan kec
      JOIN kota ON kec.id_kota = kota.id
      ORDER BY kec.nama ASC
    `)
    return NextResponse.json({ kecamatan: rows }, { status: 200 })
  } catch (error) {
    console.error('[GET KECAMATAN ERROR]', error)
    return NextResponse.json({ message: 'Gagal mengambil data kecamatan' }, { status: 500 })
  }
}

// Tambah kecamatan baru
export async function POST(req: NextRequest) {
  try {
    const { id_kota, nama } = await req.json()
    if (!id_kota || !nama) {
      return NextResponse.json({ message: 'Nama dan ID Kota wajib diisi' }, { status: 400 })
    }

    const slug = nama.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    const [exist] = await db.connection.query('SELECT id FROM kecamatan WHERE slug = ?', [slug])
    if ((exist as any[]).length > 0) {
      return NextResponse.json({ message: 'Slug kecamatan sudah digunakan' }, { status: 409 })
    }

    const [result] = await db.connection.query(
      'INSERT INTO kecamatan (id_kota, nama, slug) VALUES (?, ?, ?)',
      [id_kota, nama, slug]
    )

    return NextResponse.json({ id: (result as any).insertId }, { status: 201 })
  } catch (error) {
    console.error('[POST KECAMATAN ERROR]', error)
    return NextResponse.json({ message: 'Gagal menambahkan kecamatan' }, { status: 500 })
  }
}
