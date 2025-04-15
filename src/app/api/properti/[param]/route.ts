// File: src/app/api/properti/[param]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import type { RowDataPacket, ResultSetHeader } from 'mysql2'

export async function GET(req: NextRequest) {
    const url = new URL(req.url)
    const param = url.pathname.split('/').pop() || ''
    const isNumeric = /^\d+$/.test(param)
  
    const [rows] = await db.query<RowDataPacket[]>(
      isNumeric
        ? 'SELECT * FROM properti WHERE id = ?'
        : 'SELECT * FROM properti WHERE slug = ?',
      [param]
    )
  
    if (rows.length === 0) {
      return NextResponse.json({ message: 'Properti tidak ditemukan' }, { status: 404 })
    }
  
    return NextResponse.json(rows[0])
  }

export async function PUT(req: NextRequest, { params }: { params: { param: string } }) {
  const { param } = params
  const isNumeric = /^\d+$/.test(param)
  if (!isNumeric) return NextResponse.json({ message: 'Update hanya bisa via ID' }, { status: 400 })

  const body = await req.json()
  const [update] = await db.query<ResultSetHeader>(
    'UPDATE properti SET ? WHERE id = ?',
    [body, param]
  )

  return NextResponse.json({ message: 'Berhasil diupdate', affected: update.affectedRows })
}

export async function DELETE(req: NextRequest, { params }: { params: { param: string } }) {
  const { param } = params
  const isNumeric = /^\d+$/.test(param)
  if (!isNumeric) return NextResponse.json({ message: 'Delete hanya bisa via ID' }, { status: 400 })

  const [hapus] = await db.query<ResultSetHeader>(
    'DELETE FROM properti WHERE id = ?',
    [param]
  )

  return NextResponse.json({ message: 'Berhasil dihapus', affected: hapus.affectedRows })
}
