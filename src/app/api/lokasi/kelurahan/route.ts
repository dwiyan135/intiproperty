import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'

// Ambil semua kelurahan
export async function GET() {
  try {
    const [rows] = await db.connection.query(`
      SELECT kel.*, kec.nama AS nama_kecamatan, kec.slug AS slug_kecamatan
      FROM kelurahan kel
      JOIN kecamatan kec ON kel.id_kecamatan = kec.id
      ORDER BY kel.nama ASC
    `)
    return NextResponse.json({ kelurahan: rows }, { status: 200 })
  } catch (error) {
    console.error('[GET KELURAHAN ERROR]', error)
    return NextResponse.json({ message: 'Gagal mengambil data kelurahan' }, { status: 500 })
  }
}

// Tambah kelurahan
export async function POST(req: NextRequest) {
  try {
    const { id_kecamatan, nama } = await req.json()
    if (!id_kecamatan || !nama) {
      return NextResponse.json({ message: 'Nama dan ID Kecamatan wajib diisi' }, { status: 400 })
    }

    const slug = nama.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    const [exist] = await db.connection.query('SELECT id FROM kelurahan WHERE slug = ?', [slug])
    if ((exist as any[]).length > 0) {
      return NextResponse.json({ message: 'Slug kelurahan sudah digunakan' }, { status: 409 })
    }

    const [result] = await db.connection.query(
      'INSERT INTO kelurahan (id_kecamatan, nama, slug) VALUES (?, ?, ?)',
      [id_kecamatan, nama, slug]
    )

    return NextResponse.json({ id: (result as any).insertId }, { status: 201 })
  } catch (error) {
    console.error('[POST KELURAHAN ERROR]', error)
    return NextResponse.json({ message: 'Gagal menambahkan kelurahan' }, { status: 500 })
  }
}
