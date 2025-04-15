// File: src/app/api/booster/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import type { ResultSetHeader, RowDataPacket } from 'mysql2'

// GET: Ambil semua booster (Kode Baru, tidak diubah)
export async function GET() {
  try {
    const [rows] = await db.query<RowDataPacket[]>(`
      SELECT *
      FROM booster
      ORDER BY updated_at DESC
    `)
    return NextResponse.json(rows)
  } catch (error) {
    console.error('❌ Error Booster GET:', error)
    return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 })
  }
}

// POST: Tambah data booster (Kode Baru, tidak diubah)
export async function POST(req: NextRequest) {
  try {
    const { id_properti, id_pengguna, gunakan_sekarang } = await req.json()

    if (!id_properti || !id_pengguna) {
      return NextResponse.json(
        { message: 'id_properti dan id_pengguna wajib diisi' },
        { status: 400 }
      )
    }

    const sekarang = new Date()
    const satuBulan = new Date(sekarang)
    satuBulan.setMonth(sekarang.getMonth() + 1)

    const tigaBulan = new Date(sekarang)
    tigaBulan.setMonth(sekarang.getMonth() + 3)

    const digunakan = gunakan_sekarang === true
    const tanggal_mulai = digunakan ? sekarang : null
    const tanggal_expired = digunakan ? satuBulan : tigaBulan

    const [result] = await db.query<ResultSetHeader>(
      `
        INSERT INTO booster (
          id_properti,
          id_pengguna,
          digunakan,
          tanggal_mulai,
          tanggal_expired
        )
        VALUES (?, ?, ?, ?, ?)
      `,
      [id_properti, id_pengguna, digunakan, tanggal_mulai, tanggal_expired]
    )

    return NextResponse.json(
      {
        message: 'Booster berhasil ditambahkan',
        id: result.insertId,
        aktif: digunakan
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('❌ Error Booster POST:', error)
    return NextResponse.json(
      { message: 'Internal Server Error', error },
      { status: 500 }
    )
  }
}

// Fallback untuk method selain GET dan POST (mirip dengan kode lama)
export async function PUT(req: NextRequest) {
  console.error('❌ Method Not Allowed')
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 })
}
export async function DELETE(req: NextRequest) {
  console.error('❌ Method Not Allowed')
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 })
}
export async function PATCH(req: NextRequest) {
  console.error('❌ Method Not Allowed')
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 })
}

/* 
  -- KODE LAMA (disertakan sebagai komentar, tidak diubah sedikit pun) --

  import type { NextApiRequest, NextApiResponse } from 'next'
  import { db } from '@/lib/db'
  import { ResultSetHeader } from 'mysql2'

  export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
      // 1) Method GET -> Ambil semua data booster
      if (req.method === 'GET') {
        // Misalnya urutkan dari yg terbaru berdasarkan updated_at
        const [rows] = await db.query(`
          SELECT *
          FROM booster
          ORDER BY updated_at DESC
        `)

        return res.status(200).json(rows)
      }

      // 2) Method POST -> Tambah data ke tabel booster
      if (req.method === 'POST') {
        const { id_properti, id_pengguna, gunakan_sekarang } = req.body

        // Validasi sederhana
        if (!id_properti || !id_pengguna) {
          return res.status(400).json({
            message: 'id_properti dan id_pengguna wajib diisi'
          })
        }

        // Persiapan tanggal
        const sekarang = new Date()
        const satuBulan = new Date(sekarang)
        satuBulan.setMonth(sekarang.getMonth() + 1)

        const tigaBulan = new Date(sekarang)
        tigaBulan.setMonth(sekarang.getMonth() + 3)

        // "digunakan" menandakan booster langsung aktif
        const digunakan = gunakan_sekarang === true

        // Jika booster langsung digunakan, tanggal_mulai = sekarang, tanggal_expired = 1 bulan
        // Jika tidak langsung digunakan, tanggal_mulai = NULL, tanggal_expired = 3 bulan (default)
        const tanggal_mulai = digunakan ? sekarang : null
        const tanggal_expired = digunakan ? satuBulan : tigaBulan

        // Simpan ke tabel booster
        // Asumsikan kolom: id, id_properti, id_pengguna, digunakan, tanggal_mulai, tanggal_expired, created_at, updated_at
        // catatan: 'created_at' dan 'updated_at' mengandalkan default/timestamp di level DB
        const [result] = await db.query<ResultSetHeader>(
          \`
            INSERT INTO booster (
              id_properti,
              id_pengguna,
              digunakan,
              tanggal_mulai,
              tanggal_expired
            )
            VALUES (?, ?, ?, ?, ?)
          \`,
          [id_properti, id_pengguna, digunakan, tanggal_mulai, tanggal_expired]
        )

        // Kembalikan response
        return res.status(201).json({
          message: 'Booster berhasil ditambahkan',
          id: result.insertId,
          aktif: digunakan
        })
      }

      // 3) Jika method selain GET & POST, tolak
      return res.status(405).json({ message: 'Method Not Allowed' })
    } catch (error) {
      console.error('❌ Error Booster:', error)
      return res.status(500).json({
        message: 'Internal Server Error',
        error
      })
    }
  }
*/
