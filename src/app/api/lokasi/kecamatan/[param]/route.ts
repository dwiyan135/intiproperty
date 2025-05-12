import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'

function isNumeric(value: string) {
  return /^\d+$/.test(value)
}

// GET kecamatan by id atau slug
export async function GET(_req: NextRequest, { params }: { params: { param: string } }) {
  try {
    const key = params.param
    const query = isNumeric(key)
      ? 'SELECT * FROM kecamatan WHERE id = ?'
      : 'SELECT * FROM kecamatan WHERE slug = ?'

    const [rows] = await db.connection.query(query, [key])
    const kecamatan = (rows as any[])[0]

    if (!kecamatan) {
      return NextResponse.json({ message: 'Kecamatan tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json({ kecamatan }, { status: 200 })
  } catch (error) {
    console.error('[GET DETAIL KECAMATAN ERROR]', error)
    return NextResponse.json({ message: 'Gagal mengambil kecamatan' }, { status: 500 })
  }
}

// PUT kecamatan
export async function PUT(req: NextRequest, { params }: { params: { param: string } }) {
  try {
    const key = params.param
    const { id_kota, nama } = await req.json()
    const slug = nama.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    const query = isNumeric(key)
      ? 'UPDATE kecamatan SET id_kota = ?, nama = ?, slug = ? WHERE id = ?'
      : 'UPDATE kecamatan SET id_kota = ?, nama = ?, slug = ? WHERE slug = ?'

    await db.connection.query(query, [id_kota, nama, slug, key])
    return NextResponse.json({ message: 'Kecamatan berhasil diperbarui' }, { status: 200 })
  } catch (error) {
    console.error('[PUT KECAMATAN ERROR]', error)
    return NextResponse.json({ message: 'Gagal mengubah kecamatan' }, { status: 500 })
  }
}

// DELETE kecamatan
export async function DELETE(_req: NextRequest, { params }: { params: { param: string } }) {
  try {
    const key = params.param
    const query = isNumeric(key)
      ? 'DELETE FROM kecamatan WHERE id = ?'
      : 'DELETE FROM kecamatan WHERE slug = ?'

    await db.connection.query(query, [key])
    return NextResponse.json({ message: 'Kecamatan berhasil dihapus' }, { status: 200 })
  } catch (error) {
    console.error('[DELETE KECAMATAN ERROR]', error)
    return NextResponse.json({ message: 'Gagal menghapus kecamatan' }, { status: 500 })
  }
}
