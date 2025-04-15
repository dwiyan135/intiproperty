// File: src/app/api/pengguna/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import type { RowDataPacket, ResultSetHeader } from 'mysql2'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT id, nama_pengguna, email, jenis_akun, nomor_telepon, kata_sandi
       FROM pengguna
       ORDER BY id DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    )

    const [countRows] = await db.query<RowDataPacket[]>(`SELECT COUNT(*) as total FROM pengguna`)
    const total = countRows[0].total

    return NextResponse.json({ pengguna: rows, total })
  } catch (error) {
    console.error('❌ Error ambil data pengguna:', error)
    return NextResponse.json({ message: 'Gagal mengambil data pengguna', error }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      nama_pengguna,
      email,
      jenis_akun,
      nomor_telepon,
      kata_sandi
    } = body

    if (!nama_pengguna || !email || !kata_sandi || !jenis_akun) {
      return NextResponse.json({ message: 'Field wajib tidak boleh kosong' }, { status: 400 })
    }

    const [result] = await db.query<ResultSetHeader>(
      `INSERT INTO pengguna (nama_pengguna, email, jenis_akun, nomor_telepon, kata_sandi)
       VALUES (?, ?, ?, ?, ?)`,
      [nama_pengguna, email, jenis_akun, nomor_telepon || '', kata_sandi]
    )

    return NextResponse.json({ message: 'Pengguna berhasil ditambahkan', id: result.insertId })
  } catch (error) {
    console.error('❌ Error tambah pengguna:', error)
    return NextResponse.json({ message: 'Gagal menambah pengguna', error }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const {
      id,
      nama_pengguna,
      email,
      jenis_akun,
      nomor_telepon,
      kata_sandi // opsional jika ingin update password
    } = body

    if (!id || !nama_pengguna || !email || !jenis_akun) {
      return NextResponse.json({ message: 'Field wajib tidak boleh kosong' }, { status: 400 })
    }

    const query = kata_sandi
      ? `UPDATE pengguna SET nama_pengguna = ?, email = ?, jenis_akun = ?, nomor_telepon = ?, kata_sandi = ? WHERE id = ?`
      : `UPDATE pengguna SET nama_pengguna = ?, email = ?, jenis_akun = ?, nomor_telepon = ? WHERE id = ?`

    const params = kata_sandi
      ? [nama_pengguna, email, jenis_akun, nomor_telepon || '', kata_sandi, id]
      : [nama_pengguna, email, jenis_akun, nomor_telepon || '', id]

    const [result] = await db.query<ResultSetHeader>(query, params)

    return NextResponse.json({ message: 'Pengguna berhasil diperbarui', affected: result.affectedRows })
  } catch (error) {
    console.error('❌ Error update pengguna:', error)
    return NextResponse.json({ message: 'Gagal memperbarui pengguna', error }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ message: 'ID pengguna wajib diisi' }, { status: 400 })
    }

    const [result] = await db.query<ResultSetHeader>('DELETE FROM pengguna WHERE id = ?', [id])

    return NextResponse.json({
      message: 'Pengguna berhasil dihapus',
      affected: result.affectedRows
    })
  } catch (error) {
    console.error('❌ Error hapus pengguna:', error)
    return NextResponse.json({ message: 'Gagal menghapus pengguna', error }, { status: 500 })
  }
}
