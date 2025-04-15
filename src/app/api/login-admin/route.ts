import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'
import bcrypt from 'bcryptjs'

// Fungsi untuk simpan log login
async function simpanLogLogin(id_pengguna: number | null, status: 'sukses' | 'gagal', login_via: string, ip: string) {
  await db.query(
    `INSERT INTO log_login_admin (id_pengguna, login_via, status, ip_address) VALUES (?, ?, ?, ?)`,
    [id_pengguna, login_via, status, ip]
  )
}

export async function POST(req: NextRequest) {
  try {
    const { login, kata_sandi } = await req.json()
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'

    const [rows]: any = await db.query(
      'SELECT * FROM pengguna WHERE (email = ? OR nama_pengguna = ?) AND jenis_akun = "admin"',
      [login, login]
    )

    if (!rows || rows.length === 0) {
      await simpanLogLogin(null, 'gagal', login, ip)
      return NextResponse.json({ message: 'Akun admin tidak ditemukan' }, { status: 401 })
    }

    const admin = rows[0]
    const isMatch = await bcrypt.compare(kata_sandi, admin.kata_sandi)

    if (!isMatch) {
      await simpanLogLogin(admin.id, 'gagal', login, ip)
      return NextResponse.json({ message: 'Kata sandi salah' }, { status: 401 })
    }

    // Berhasil login
    await simpanLogLogin(admin.id, 'sukses', login, ip)

    return NextResponse.json({
      message: 'Login berhasil',
      pengguna: {
        id: admin.id,
        nama: admin.nama_pengguna,
        email: admin.email,
        role: admin.jenis_akun,
      }
    })
  } catch (error) {
    console.error('[API ERROR] Login Admin:', error)
    return NextResponse.json({ message: 'Terjadi kesalahan saat login' }, { status: 500 })
  }
}
