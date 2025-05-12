import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'

function isNumeric(value: string) {
  return /^\d+$/.test(value)
}

// GET provinsi by id atau slug
export async function GET(_req: NextRequest, { params }: { params: { param: string } }) {
  try {
    const key = params.param
    const query = isNumeric(key)
      ? 'SELECT * FROM provinsi WHERE id = ?'
      : 'SELECT * FROM provinsi WHERE slug = ?'

    const [rows] = await db.connection.query(query, [key])
    const provinsi = (rows as any[])[0]

    if (!provinsi) {
      return NextResponse.json({ message: 'Provinsi tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json({ provinsi }, { status: 200 })
  } catch (error) {
    console.error('[GET DETAIL PROVINSI ERROR]', error)
    return NextResponse.json({ message: 'Gagal mengambil provinsi' }, { status: 500 })
  }
}

// PUT provinsi
export async function PUT(req: NextRequest, { params }: { params: { param: string } }) {
  try {
    const key = params.param
    const { nama } = await req.json()
    const slug = nama.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    const query = isNumeric(key)
      ? 'UPDATE provinsi SET nama = ?, slug = ? WHERE id = ?'
      : 'UPDATE provinsi SET nama = ?, slug = ? WHERE slug = ?'

    const [result] = await db.connection.query(query, [nama, slug, key])
    return NextResponse.json({ message: 'Provinsi berhasil diperbarui' }, { status: 200 })
  } catch (error) {
    console.error('[PUT PROVINSI ERROR]', error)
    return NextResponse.json({ message: 'Gagal mengubah provinsi' }, { status: 500 })
  }
}

// DELETE provinsi
export async function DELETE(_req: NextRequest, { params }: { params: { param: string } }) {
  try {
    const key = params.param
    const query = isNumeric(key)
      ? 'DELETE FROM provinsi WHERE id = ?'
      : 'DELETE FROM provinsi WHERE slug = ?'

    await db.connection.query(query, [key])
    return NextResponse.json({ message: 'Provinsi berhasil dihapus' }, { status: 200 })
  } catch (error) {
    console.error('[DELETE PROVINSI ERROR]', error)
    return NextResponse.json({ message: 'Gagal menghapus provinsi' }, { status: 500 })
  }
}
