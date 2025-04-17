import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Fungsi untuk simpan log login
async function simpanLogLogin(
  id_pengguna: number | null,
  status: 'sukses' | 'gagal',
  login_via: string,
  ip: string
) {
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

    // ✅ Berhasil login
    await simpanLogLogin(admin.id, 'sukses', login, ip)

    // 🔐 Buat token JWT
    const token = jwt.sign(
      { id: admin.id, role: admin.jenis_akun },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    const response = NextResponse.json({
      message: 'Login berhasil',
      pengguna: {
        id: admin.id,
        nama: admin.nama_pengguna,
        email: admin.email,
        role: admin.jenis_akun
      }
    })

    // Set cookie auth_token (httpOnly)
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    })

    // ✅ Tambahkan admin_id cookie agar bisa dibaca client-side (khusus debug)
    response.cookies.set('admin_id', admin.id.toString(), {
      httpOnly: false,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    })

    return response
  } catch (error) {
    console.error('[API ERROR] Login Admin:', error)
    return NextResponse.json({ message: 'Terjadi kesalahan saat login' }, { status: 500 })
  }
}
