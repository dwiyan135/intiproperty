import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'

function isNumeric(value: string) {
  return /^\d+$/.test(value)
}

// GET kota by ID atau slug
export async function GET(_req: NextRequest, { params }: { params: { param: string } }) {
  try {
    const key = params.param
    const query = isNumeric(key)
      ? 'SELECT * FROM kota WHERE id = ?'
      : 'SELECT * FROM kota WHERE slug = ?'

    const [rows] = await db.connection.query(query, [key])
    const kota = (rows as any[])[0]

    if (!kota) {
      return NextResponse.json({ message: 'Kota tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json({ kota }, { status: 200 })
  } catch (error) {
    console.error('[GET DETAIL KOTA ERROR]', error)
    return NextResponse.json({ message: 'Gagal mengambil data kota' }, { status: 500 })
  }
}

// PUT kota
export async function PUT(req: NextRequest, { params }: { params: { param: string } }) {
  try {
    const key = params.param
    const { id_provinsi, nama } = await req.json()
    const slug = nama.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    const query = isNumeric(key)
      ? 'UPDATE kota SET id_provinsi = ?, nama = ?, slug = ? WHERE id = ?'
      : 'UPDATE kota SET id_provinsi = ?, nama = ?, slug = ? WHERE slug = ?'

    await db.connection.query(query, [id_provinsi, nama, slug, key])

    return NextResponse.json({ message: 'Kota berhasil diperbarui' }, { status: 200 })
  } catch (error) {
    console.error('[PUT KOTA ERROR]', error)
    return NextResponse.json({ message: 'Gagal memperbarui kota' }, { status: 500 })
  }
}

// DELETE kota
export async function DELETE(_req: NextRequest, { params }: { params: { param: string } }) {
  try {
    const key = params.param
    const query = isNumeric(key)
      ? 'DELETE FROM kota WHERE id = ?'
      : 'DELETE FROM kota WHERE slug = ?'

    await db.connection.query(query, [key])
    return NextResponse.json({ message: 'Kota berhasil dihapus' }, { status: 200 })
  } catch (error) {
    console.error('[DELETE KOTA ERROR]', error)
    return NextResponse.json({ message: 'Gagal menghapus kota' }, { status: 500 })
  }
}
