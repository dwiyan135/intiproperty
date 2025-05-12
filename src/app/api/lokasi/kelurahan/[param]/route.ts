import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'

function isNumeric(value: string) {
  return /^\d+$/.test(value)
}

// Ambil kelurahan by ID atau slug
export async function GET(_req: NextRequest, { params }: { params: { param: string } }) {
  try {
    const key = params.param
    const query = isNumeric(key)
      ? 'SELECT * FROM kelurahan WHERE id = ?'
      : 'SELECT * FROM kelurahan WHERE slug = ?'

    const [rows] = await db.connection.query(query, [key])
    const kelurahan = (rows as any[])[0]

    if (!kelurahan) {
      return NextResponse.json({ message: 'Kelurahan tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json({ kelurahan }, { status: 200 })
  } catch (error) {
    console.error('[GET DETAIL KELURAHAN ERROR]', error)
    return NextResponse.json({ message: 'Gagal mengambil kelurahan' }, { status: 500 })
  }
}

// Update kelurahan
export async function PUT(req: NextRequest, { params }: { params: { param: string } }) {
  try {
    const key = params.param
    const { id_kecamatan, nama } = await req.json()
    const slug = nama.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    const query = isNumeric(key)
      ? 'UPDATE kelurahan SET id_kecamatan = ?, nama = ?, slug = ? WHERE id = ?'
      : 'UPDATE kelurahan SET id_kecamatan = ?, nama = ?, slug = ? WHERE slug = ?'

    await db.connection.query(query, [id_kecamatan, nama, slug, key])
    return NextResponse.json({ message: 'Kelurahan berhasil diperbarui' }, { status: 200 })
  } catch (error) {
    console.error('[PUT KELURAHAN ERROR]', error)
    return NextResponse.json({ message: 'Gagal memperbarui kelurahan' }, { status: 500 })
  }
}

// Hapus kelurahan
export async function DELETE(_req: NextRequest, { params }: { params: { param: string } }) {
  try {
    const key = params.param
    const query = isNumeric(key)
      ? 'DELETE FROM kelurahan WHERE id = ?'
      : 'DELETE FROM kelurahan WHERE slug = ?'

    await db.connection.query(query, [key])
    return NextResponse.json({ message: 'Kelurahan berhasil dihapus' }, { status: 200 })
  } catch (error) {
    console.error('[DELETE KELURAHAN ERROR]', error)
    return NextResponse.json({ message: 'Gagal menghapus kelurahan' }, { status: 500 })
  }
}
