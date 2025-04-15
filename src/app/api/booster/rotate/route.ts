// File: src/app/api/booster-rotasi/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import type { RowDataPacket, ResultSetHeader } from 'mysql2'

// Hanya method POST yang diperbolehkan (Kode Baru, tidak diubah sama sekali)
export async function POST(req: NextRequest) {
  try {
    const limit = 10
    const now = new Date()

    // Ambil data booster yang sedang aktif dan perlu dirotasi
    const [rows] = await db.query<RowDataPacket[]>(
      `
        SELECT b.id, b.id_properti
        FROM booster b
        WHERE b.digunakan = 1
          AND b.tanggal_mulai <= ?
          AND b.tanggal_berakhir >= ?
        ORDER BY b.updated_at ASC
        LIMIT ?
      `,
      [now, now, limit]
    )

    const ids = rows.map((r: any) => r.id)

    if (ids.length > 0) {
      await db.query<ResultSetHeader>(
        `
          UPDATE booster
          SET updated_at = ?
          WHERE id IN (${ids.map(() => '?').join(',')})
        `,
        [now, ...ids]
      )
    }

    return NextResponse.json({
      message: 'Rotasi booster berhasil',
      total_rotated: ids.length,
      ids
    }, { status: 200 })
  } catch (error) {
    console.error('❌ Error rotasi booster:', error)
    return NextResponse.json({
      message: 'Internal Server Error',
      error
    }, { status: 500 })
  }
}

// Fallback: Method selain POST ditolak (405)
export async function GET() {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 })
}
export async function PUT() {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 })
}
export async function DELETE() {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 })
}
export async function PATCH() {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 })
}

/* 
  -- KODE LAMA (disertakan sebagai komentar, tidak diubah sedikit pun) --

  import type { NextApiRequest, NextApiResponse } from 'next'
  import { db } from '@/lib/db'

  export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
      // Batas jumlah booster yang dirotasi per panggilan
      const limit = 10

      // Current date/time untuk membandingkan kolom tanggal_mulai & tanggal_berakhir
      const now = new Date()

      // 1. Ambil booster yang sedang aktif:
      //    - digunakan = 1
      //    - tanggal_mulai <= now
      //    - tanggal_berakhir >= now
      //    Urutkan berdasarkan updated_at paling lama (ASC),
      //    lalu batasi jumlahnya sebanyak 'limit'.
      const [rows]: any[] = await db.query(
        \`
          SELECT b.id, b.id_properti
          FROM booster b
          WHERE b.digunakan = 1
            AND b.tanggal_mulai <= ?
            AND b.tanggal_berakhir >= ?
          ORDER BY b.updated_at ASC
          LIMIT ?
        \`,
        [now, now, limit]
      )

      // Buat array ID booster yang terambil
      const ids = rows.map((r: any) => r.id)

      // 2. Update kolom updated_at untuk ID-ID tersebut, agar terjadi "rotasi" 
      //    (boosternya dianggap terbaru).
      if (ids.length > 0) {
        await db.query(
          \`
            UPDATE booster
            SET updated_at = ?
            WHERE id IN (\${ids.map(() => '?').join(',')})
          \`,
          [now, ...ids]
        )
      }

      // 3. Kembalikan respon
      return res.status(200).json({
        message: 'Rotasi booster berhasil',
        total_rotated: ids.length,
        ids
      })
    } catch (error) {
      console.error('❌ Error rotasi booster:', error)
      return res.status(500).json({
        message: 'Internal Server Error',
        error
      })
    }
  }
*/
