// 📁 File: app/api/properti/duplicate/[id]/route.ts

import { NextResponse } from 'next/server'
import db from '@/lib/db'

function generateNewSlug(original: string, existingSlugs: string[]): string {
  const base = `${original}-copy`
  if (!existingSlugs.includes(base)) return base

  let count = 2
  while (existingSlugs.includes(`${base}-${count}`)) {
    count++
  }
  return `${base}-${count}`
}

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id)
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })

  const [rows]: any = await db.connection.execute(
    'SELECT * FROM properti WHERE id = ?', [id]
  )
  if (!rows.length) return NextResponse.json({ error: 'Properti tidak ditemukan' }, { status: 404 })

  const original = rows[0]
  delete original.id

  const [slugRows]: any = await db.connection.execute(
    'SELECT slug FROM properti WHERE slug LIKE ?', [`${original.slug}%`]
  )
  const existingSlugs = slugRows.map((r: any) => r.slug)
  const newSlug = generateNewSlug(original.slug, existingSlugs)

  const now = new Date()
  const newData = {
    ...original,
    slug: newSlug,
    tanggal_mulai: now,
    tanggal_berakhir: now,
    total_view: 0,
    total_simpan: 0,
    total_share: 0,
    status: 'draf',
    highlight: 0,
    verified: 0
  }

  const [insert]: any = await db.connection.execute(
    'INSERT INTO properti SET ?', [newData]
  )
  const newId = insert.insertId

  const tipeTable: Record<number, string> = {
    1: 'properti_rumah',
    2: 'properti_apartemen',
    3: 'properti_gedung',
    4: 'properti_tanah',
    5: 'properti_ruko',
    6: 'properti_lainnya'
  }

  const detailTable = tipeTable[original.id_tipe_properti]
  if (detailTable) {
    const [detail]: any = await db.connection.execute(
      `SELECT * FROM ${detailTable} WHERE id_properti = ?`, [id]
    )
    if (detail.length) {
      const detailData = { ...detail[0] }
      delete detailData.id_properti
      await db.connection.execute(
        `INSERT INTO ${detailTable} SET ?`, [{ ...detailData, id_properti: newId }]
      )
    }
  }

  const [fotos]: any = await db.connection.execute(
    'SELECT * FROM foto_properti WHERE id_properti = ?', [id]
  )
  for (const foto of fotos) {
    const { id, ...rest } = foto
    await db.connection.execute(
      'INSERT INTO foto_properti SET ?', [{ ...rest, id_properti: newId }]
    )
  }

  const [videos]: any = await db.connection.execute(
    'SELECT * FROM video_properti WHERE id_properti = ?', [id]
  )
  for (const video of videos) {
    const { id, ...rest } = video
    await db.connection.execute(
      'INSERT INTO video_properti SET ?', [{ ...rest, id_properti: newId }]
    )
  }

  return NextResponse.json({ message: 'Duplikat berhasil', id_baru: newId })
}
