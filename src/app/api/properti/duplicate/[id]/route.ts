// src/app/api/properti/duplicate/[id]/route.ts
import { NextResponse } from 'next/server'
import db from '@/lib/db'
import type { RowDataPacket, OkPacket } from 'mysql2'
import type { Properti } from '@/types/properti'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    // ambil properti asli
    const [origRows] = await db.connection.execute<RowDataPacket[]>(
      `SELECT * FROM \`${db.properti}\` WHERE id = ?`,
      [id]
    )
    const original = (origRows as Properti[])[0]
    if (!original) return NextResponse.json({ error: 'Properti tidak ditemukan' }, { status: 404 })

    // duplikasi properti (kecuali id dan timestamps)
    const cols = Object.keys(original).filter(c => !['id', 'dibuat_pada', 'diperbarui_pada'].includes(c))
    const vals = cols.map(c => (original as any)[c])
    const placeholders = cols.map(() => '?')
    const insertSql = `
      INSERT INTO \`${db.properti}\` (${cols.join(',')})
      VALUES (${placeholders.join(',')})
    `
    const [result] = await db.connection.execute<OkPacket>(insertSql, vals)
    const newId = result.insertId

    // duplikasi media
    const [mediaRows] = await db.connection.execute<RowDataPacket[]>(
      `SELECT * FROM \`${db.media_properti}\` WHERE id_properti = ?`,
      [id]
    )
    const media = mediaRows as any[]
    for (const m of media) {
      await db.connection.execute<OkPacket>(
        `INSERT INTO \`${db.media_properti}\` (id_properti, tipe_media, url, is_utama)
         VALUES (?, ?, ?, ?)`,
        [newId, m.tipe_media, m.url, m.is_utama]
      )
    }

    // ambil properti baru
    const [newRows] = await db.connection.execute<RowDataPacket[]>(
      `SELECT * FROM \`${db.properti}\` WHERE id = ?`,
      [newId]
    )
    const newItem = (newRows as Properti[])[0]
    return NextResponse.json({ data: newItem }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menduplikasi properti', details: (error as any).message }, { status: 500 })
  }
}
