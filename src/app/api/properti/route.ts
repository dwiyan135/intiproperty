// 📁 File: app/api/properti/route.ts

import { NextResponse } from 'next/server'
import db from '@/lib/db'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('user_id')
  const status = searchParams.get('status')
  const q = searchParams.get('q')

  let query = `
    SELECT p.*, f.url AS foto_utama
    FROM properti p
    LEFT JOIN foto_properti f ON f.id_properti = p.id AND f.is_utama = 1
  `

  let where: string[] = []
  let params: any[] = []

  if (userId) {
    where.push('p.id_pengguna = ?')
    params.push(userId)
  }
  if (status) {
    where.push('p.status = ?')
    params.push(status)
  }
  if (q) {
    where.push('p.judul LIKE ?')
    params.push(`%${q}%`)
  }

  if (where.length > 0) {
    query += ' WHERE ' + where.join(' AND ')
  }

  query += ' ORDER BY p.tanggal_mulai DESC'

  const [rows] = await db.connection.execute(query, params)
  return NextResponse.json(rows)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const dataProperti = {
      id_pengguna: body.id_pengguna,
      id_agensi: body.id_agensi || null,
      agen_pendamping: body.agen_pendamping || null,
      judul: body.judul,
      slug: body.slug,
      id_tipe_properti: body.id_tipe_properti,
      deskripsi: body.deskripsi,
      harga: body.harga,
      harga_nego: body.harga_nego || 0,
      dp_minimal: body.dp_minimal || null,
      estimasi_angsuran: body.estimasi_angsuran || null,
      id_provinsi: body.id_provinsi,
      id_kota: body.id_kota,
      id_kecamatan: body.id_kecamatan,
      id_kelurahan: body.id_kelurahan,
      alamat_lengkap: body.alamat_lengkap,
      kode_pos: body.kode_pos,
      koordinat: body.koordinat,
      status: 'aktif',
      status_hunian: body.status_hunian,
      verified: 0,
      highlight: body.highlight || 0,
      nama_proyek: body.nama_proyek || null,
      nama_developer: body.nama_developer || null,
      video_link: body.video_link || null,
      link_virtual_tour: body.link_virtual_tour || null,
      catatan_internal: body.catatan_internal || null,
      tanggal_mulai: new Date(),
      tanggal_berakhir: body.tanggal_berakhir || new Date(),
      total_view: 0,
      total_simpan: 0,
      total_share: 0,
      label_otomatis: null,
      mode_rahasia: 0,
      audit_score: 0,
      prediksi_terjual_dalam_hari: null,
      auto_renewal: 0,
      dihasilkan_ai: 0
    }

    const [result]: any = await db.connection.execute(
      `INSERT INTO ${db.properti} SET ?`, [dataProperti]
    )
    const id_properti = result.insertId

    const tipe = body.tipe
    if (tipe === 'rumah' && body.rumah) {
      await db.connection.execute(
        `INSERT INTO ${db.properti_rumah} SET ?`, [{ ...body.rumah, id_properti }]
      )
    } else if (tipe === 'apartemen' && body.apartemen) {
      await db.connection.execute(
        `INSERT INTO ${db.properti_apartemen} SET ?`, [{ ...body.apartemen, id_properti }]
      )
    } else if (tipe === 'ruko' && body.ruko) {
      await db.connection.execute(
        `INSERT INTO ${db.properti_ruko} SET ?`, [{ ...body.ruko, id_properti }]
      )
    } else if (tipe === 'gedung' && body.gedung) {
      await db.connection.execute(
        `INSERT INTO ${db.properti_gedung} SET ?`, [{ ...body.gedung, id_properti }]
      )
    } else if (tipe === 'tanah' && body.tanah) {
      await db.connection.execute(
        `INSERT INTO ${db.properti_tanah} SET ?`, [{ ...body.tanah, id_properti }]
      )
    } else if (tipe === 'lainnya' && body.lainnya) {
      await db.connection.execute(
        `INSERT INTO ${db.properti_lainnya} SET ?`, [{ ...body.lainnya, id_properti }]
      )
    }

    if (body.foto_properti) {
      let isUtamaFound = false
      for (let i = 0; i < body.foto_properti.length; i++) {
        const foto = { ...body.foto_properti[i] }
        if (!isUtamaFound && foto.is_utama == 1) isUtamaFound = true
        if (!isUtamaFound && i === 0) {
          foto.is_utama = 1
          isUtamaFound = true
        }
        await db.connection.execute(
          `INSERT INTO ${db.foto_properti} SET ?`, [{ ...foto, id_properti }]
        )
      }
    }

    if (body.video_properti) {
      for (const video of body.video_properti) {
        await db.connection.execute(
          `INSERT INTO ${db.video_properti} SET ?`, [{ ...video, id_properti }]
        )
      }
    }

    return NextResponse.json({ message: 'Properti berhasil ditambahkan', id: id_properti })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Terjadi kesalahan saat menambahkan properti' }, { status: 500 })
  }
}
