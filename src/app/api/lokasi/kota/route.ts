import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'

// Ambil semua kota
export async function GET() {
  try {
    const [rows] = await db.connection.query(`
      SELECT k.*, p.nama AS nama_provinsi, p.slug AS slug_provinsi
      FROM kota k
      JOIN provinsi p ON k.id_provinsi = p.id
      ORDER BY k.nama ASC
    `)
    return NextResponse.json({ kota: rows }, { status: 200 })
  } catch (error) {
    console.error('[GET KOTA ERROR]', error)
    return NextResponse.json({ message: 'Gagal mengambil data kota' }, { status: 500 })
  }
}

// Tambah kota baru
export async function POST(req: NextRequest) {
  try {
    const { id_provinsi, nama } = await req.json()

    if (!id_provinsi || !nama) {
      return NextResponse.json({ message: 'Nama dan ID Provinsi wajib diisi' }, { status: 400 })
    }

    const slug = nama.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    const [exist] = await db.connection.query('SELECT id FROM kota WHERE slug = ?', [slug])
    if ((exist as any[]).length > 0) {
      return NextResponse.json({ message: 'Slug kota sudah digunakan' }, { status: 409 })
    }

    const [result] = await db.connection.query(
      'INSERT INTO kota (id_provinsi, nama, slug) VALUES (?, ?, ?)',
      [id_provinsi, nama, slug]
    )

    return NextResponse.json({ id: (result as any).insertId }, { status: 201 })
  } catch (error) {
    console.error('[POST KOTA ERROR]', error)
    return NextResponse.json({ message: 'Gagal menambahkan kota' }, { status: 500 })
  }
}
