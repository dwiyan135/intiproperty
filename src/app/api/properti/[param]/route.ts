// 📁 File: app/api/properti/[param]/route.ts

import { NextResponse } from 'next/server'
import db from '@/lib/db'

const tableMap: Record<number, string> = {
  1: 'properti_rumah',
  2: 'properti_apartemen',
  3: 'properti_gedung',
  4: 'properti_tanah',
  5: 'properti_ruko',
  6: 'properti_lainnya'
}

export async function GET(
  _req: Request,
  { params }: { params: { param: string } }
) {
  const key = params.param
  const conn = db.connection

  const sql = isNaN(+key)
    ? 'SELECT * FROM properti WHERE slug = ? LIMIT 1'
    : 'SELECT * FROM properti WHERE id = ? LIMIT 1'
  const [rows]: any = await conn.execute(sql, [key])
  if (!rows.length) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const properti = rows[0]
  const detailTbl = tableMap[properti.id_tipe_properti]
  if (detailTbl) {
    const [det]: any = await conn.execute(
      `SELECT * FROM ${detailTbl} WHERE id_properti = ? LIMIT 1`,
      [properti.id]
    )
    properti.detail = det?.[0] ?? null
  }

  return NextResponse.json(properti)
}

export async function PUT(
  request: Request,
  { params }: { params: { param: string } }
) {
  const key = params.param
  const idOrSlug = isNaN(Number(key))
    ? { field: 'slug', val: key }
    : { field: 'id', val: Number(key) }

  const body = await request.json()
  const { detail = null, foto_properti = null, video_properti = null, ...base } = body

  const baseFields = [
    'id_pengguna','id_agensi','agen_pendamping','judul','slug',
    'id_tipe_properti','deskripsi','deskripsi_en','deskripsi_ai',
    'harga','harga_nego','dp_minimal','estimasi_angsuran',
    'id_provinsi','id_kota','id_kecamatan','id_kelurahan',
    'alamat_lengkap','kode_pos','koordinat','status','status_hunian',
    'verified','highlight','nama_proyek','nama_developer','video_link',
    'link_virtual_tour','catatan_internal','tanggal_mulai','tanggal_berakhir',
    'total_view','total_simpan','total_share','label_otomatis','mode_rahasia',
    'audit_score','prediksi_terjual_dalam_hari','auto_renewal','dihasilkan_ai'
  ]
  const setClause = baseFields.map(f => `\`${f}\` = ?`).join(', ')
  const values = baseFields.map(f => base[f] ?? null).concat(idOrSlug.val)

  await db.connection.execute(
    `UPDATE properti SET ${setClause} WHERE \`${idOrSlug.field}\` = ?`,
    values
  )

  const [main]: any = await db.connection.execute(
    'SELECT id FROM properti WHERE ?? = ? LIMIT 1',
    [idOrSlug.field, idOrSlug.val]
  )

  if (main.length) {
    const id_properti = main[0].id
    const tbl = tableMap[base.id_tipe_properti]

    if (detail && tbl) {
      const detKeys = Object.keys(detail)
      if (detKeys.length) {
        const detSet = detKeys.map(k => `\`${k}\` = ?`).join(', ')
        const detVal = detKeys.map(k => detail[k]).concat(id_properti)
        await db.connection.execute(
          `UPDATE ${tbl} SET ${detSet} WHERE id_properti = ?`,
          detVal
        )
      }
    }

    if (foto_properti) {
      await db.connection.execute('DELETE FROM foto_properti WHERE id_properti = ?', [id_properti])
      let isUtamaFound = false
      for (let i = 0; i < foto_properti.length; i++) {
        const foto = { ...foto_properti[i] }
        if (!isUtamaFound && foto.is_utama == 1) isUtamaFound = true
        if (!isUtamaFound && i === 0) {
          foto.is_utama = 1
          isUtamaFound = true
        }
        await db.connection.execute(
          'INSERT INTO foto_properti SET ?', [{ ...foto, id_properti }]
        )
      }
    }

    if (video_properti) {
      await db.connection.execute('DELETE FROM video_properti WHERE id_properti = ?', [id_properti])
      for (const video of video_properti) {
        await db.connection.execute(
          'INSERT INTO video_properti SET ?', [{ ...video, id_properti }]
        )
      }
    }
  }

  return NextResponse.json({ message: 'Updated' })
}

export async function DELETE(
  _req: Request,
  { params }: { params: { param: string } }
) {
  const key = params.param
  const idOrSlug = isNaN(Number(key))
    ? { field: 'slug', val: key }
    : { field: 'id', val: Number(key) }

  await db.connection.execute(
    `DELETE FROM properti WHERE \`${idOrSlug.field}\` = ?`,
    [idOrSlug.val]
  )
  return NextResponse.json({ message: 'Deleted' })
}