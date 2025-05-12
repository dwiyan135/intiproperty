// src/app/api/properti/[id]/[slug]/route.ts
import { NextResponse } from 'next/server'
import db from '@/lib/db'
import type { Properti } from '@/types/properti'
import type { RowDataPacket, OkPacket } from 'mysql2'

// GET detail properti
export async function GET(req: Request, { params }: { params: { id: string; slug: string } }) {
  try {
    const { id } = params
    const [rows] = await db.connection.execute<RowDataPacket[]>(
      `SELECT * FROM \`${db.properti}\` WHERE id = ?`,
      [id]
    )
    const item = (rows as Properti[])[0]
    if (!item) return NextResponse.json({ error: 'Properti tidak ditemukan' }, { status: 404 })
    return NextResponse.json({ data: item })
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil detail properti', details: (error as any).message }, { status: 500 })
  }
}

// PUT update properti
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await req.json()
    const cols = Object.keys(body)
    const vals = Object.values(body)
    if (cols.length === 0) {
      return NextResponse.json({ error: 'Tidak ada data untuk diupdate' }, { status: 400 })
    }
    const assignments = cols.map(col => `\`${col}\` = ?`).join(', ')
    const updateSql = `
      UPDATE \`${db.properti}\`
      SET ${assignments}
      WHERE id = ?
    `
    await db.connection.execute<OkPacket>(updateSql, [...vals, id])
    // ambil data terupdate
    const [rows] = await db.connection.execute<RowDataPacket[]>(
      `SELECT * FROM \`${db.properti}\` WHERE id = ?`,
      [id]
    )
    const updated = (rows as Properti[])[0]
    return NextResponse.json({ data: updated })
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengupdate properti', details: (error as any).message }, { status: 500 })
  }
}

// DELETE properti
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const deleteSql = `DELETE FROM \`${db.properti}\` WHERE id = ?`
    await db.connection.execute<OkPacket>(deleteSql, [id])
    return NextResponse.json({ message: 'Properti berhasil dihapus' })
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menghapus properti', details: (error as any).message }, { status: 500 })
  }
}
