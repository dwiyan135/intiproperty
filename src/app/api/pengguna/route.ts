// File: src/app/api/pengguna/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import type { RowDataPacket, ResultSetHeader } from 'mysql2'
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Mengambil data (tidak menyertakan kata_sandi)
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT 
         id, 
         nama_pengguna, 
         email, 
         nomor_telepon, 
         foto_profil, 
         jenis_akun, 
         paket_membership,
         tanggal_berakhir_membership,
         dibuat_pada,
         diperbarui_pada,
         status_akun
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
    // Gunakan req.formData() untuk membaca data ketika menggunakan FormData
    const formData = await req.formData()

    // Ambil field-field form dari FormData
    const nama_pengguna = formData.get('nama_pengguna')?.toString() || ''
    const email = formData.get('email')?.toString() || ''
    const kata_sandi = formData.get('kata_sandi')?.toString() || ''
    const nomor_telepon = formData.get('nomor_telepon')?.toString() || null
    const jenis_akun = formData.get('jenis_akun')?.toString() || ''
    const id_agensi = formData.get('id_agensi')?.toString() || null
    const paket_membership = formData.get('paket_membership')?.toString() || 'Freemium'
    const tanggal_berakhir_membership = formData.get('tanggal_berakhir_membership')?.toString() || null
    // Field status_akun akan menggunakan default 'aktif' pada database
    const status_akun = 'aktif'

    // Validasi field wajib
    if (!nama_pengguna || !email || !kata_sandi || !jenis_akun || !paket_membership) {
      return NextResponse.json({ message: 'Field wajib tidak boleh kosong' }, { status: 400 })
    }

    // Proses file foto_profil jika ada
    let foto_profil_path = ''
    const fotoFile = formData.get('foto_profil') as File | null
    if (fotoFile && fotoFile.size > 0) {
      // Ubah file menjadi buffer
      const buffer = Buffer.from(await fotoFile.arrayBuffer())
      // Konversi buffer gambar ke format WebP dengan sharp
      const webpBuffer = await sharp(buffer).webp().toBuffer()
      // Buat nama file unik; misalnya dengan timestamp dan nama file asli (tanpa ekstensi)
      const fileName = `${Date.now()}_${fotoFile.name.split('.')[0]}.webp`
      // Tentukan folder penyimpanan, misalnya di "public/uploads"
      const uploadDir = path.join(process.cwd(), 'public', 'uploads')
      // Jika folder belum ada, buat folder tersebut
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
      }
      const filePath = path.join(uploadDir, fileName)
      // Simpan file hasil konversi ke disk
      await fs.promises.writeFile(filePath, webpBuffer)
      // Set path untuk disimpan di database (akses file dari public)
      foto_profil_path = `/uploads/${fileName}`
    }

    // Lakukan query INSERT ke database dengan foto_profil_path
    const [result] = await db.query<ResultSetHeader>(
      `INSERT INTO pengguna 
         (nama_pengguna, email, kata_sandi, nomor_telepon, foto_profil, jenis_akun, id_agensi, paket_membership, tanggal_berakhir_membership, status_akun)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nama_pengguna,
        email,
        kata_sandi,
        nomor_telepon,
        foto_profil_path,
        jenis_akun,
        id_agensi,
        paket_membership,
        tanggal_berakhir_membership,
        status_akun
      ]
    )

    return NextResponse.json({ message: 'Pengguna berhasil ditambahkan', id: result.insertId })
  } catch (error) {
    console.error('❌ Error tambah pengguna:', error)
    return NextResponse.json({ message: 'Gagal menambah pengguna', error }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    // Mengambil data melalui FormData (bukan JSON)
    const formData = await req.formData()

    // Ekstrak field-field dari FormData
    const id = formData.get('id')?.toString()
    const nama_pengguna = formData.get('nama_pengguna')?.toString() || ''
    const email = formData.get('email')?.toString() || ''
    const nomor_telepon = formData.get('nomor_telepon')?.toString() || null
    const jenis_akun = formData.get('jenis_akun')?.toString() || ''
    const paket_membership = formData.get('paket_membership')?.toString() || 'Freemium'
    const tanggal_berakhir_membership = formData.get('tanggal_berakhir_membership')?.toString() || null
    const kata_sandi = formData.get('kata_sandi')?.toString() || ''

    // Validasi field wajib
    if (!id || !nama_pengguna || !email || !jenis_akun || !paket_membership) {
      return NextResponse.json(
        { message: 'Field wajib tidak boleh kosong' },
        { status: 400 }
      )
    }

    // Proses file foto_profil jika ada
    let foto_profil_path = ''
    const fotoFile = formData.get('foto_profil') as File | null
    if (fotoFile && fotoFile.size > 0) {
      // Ubah file menjadi buffer
      const buffer = Buffer.from(await fotoFile.arrayBuffer())
      // Konversi buffer ke format WebP
      const webpBuffer = await sharp(buffer).webp().toBuffer()
      // Buat nama file unik
      const fileName = `${Date.now()}_${fotoFile.name.split('.')[0]}.webp`
      // Tentukan folder penyimpanan (misal: public/uploads)
      const uploadDir = path.join(process.cwd(), 'public', 'uploads')
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
      }
      const filePath = path.join(uploadDir, fileName)
      await fs.promises.writeFile(filePath, webpBuffer)
      // Set path untuk disimpan di database
      foto_profil_path = `/uploads/${fileName}`
    }
  
    // Tentukan query dan parameter yang akan diupdate, 
    // tergantung apakah kata_sandi dan/atau foto_profil di-update
    let query = ''
    let params: any[] = []

    if (kata_sandi) {
      // Update termasuk kata_sandi
      if (foto_profil_path) {
        query = `UPDATE pengguna SET 
          nama_pengguna = ?, 
          email = ?, 
          nomor_telepon = ?, 
          kata_sandi = ?, 
          jenis_akun = ?, 
          paket_membership = ?, 
          tanggal_berakhir_membership = ?,
          foto_profil = ?
          WHERE id = ?`
        params = [
          nama_pengguna,
          email,
          nomor_telepon,
          kata_sandi,
          jenis_akun,
          paket_membership,
          tanggal_berakhir_membership,
          foto_profil_path,
          id
        ]
      } else {
        query = `UPDATE pengguna SET 
          nama_pengguna = ?, 
          email = ?, 
          nomor_telepon = ?, 
          kata_sandi = ?, 
          jenis_akun = ?, 
          paket_membership = ?, 
          tanggal_berakhir_membership = ?
          WHERE id = ?`
        params = [
          nama_pengguna,
          email,
          nomor_telepon,
          kata_sandi,
          jenis_akun,
          paket_membership,
          tanggal_berakhir_membership,
          id
        ]
      }
    } else {
      // Tidak mengubah kata_sandi
      if (foto_profil_path) {
        query = `UPDATE pengguna SET 
          nama_pengguna = ?, 
          email = ?, 
          nomor_telepon = ?, 
          jenis_akun = ?, 
          paket_membership = ?, 
          tanggal_berakhir_membership = ?,
          foto_profil = ?
          WHERE id = ?`
        params = [
          nama_pengguna,
          email,
          nomor_telepon,
          jenis_akun,
          paket_membership,
          tanggal_berakhir_membership,
          foto_profil_path,
          id
        ]
      } else {
        query = `UPDATE pengguna SET 
          nama_pengguna = ?, 
          email = ?, 
          nomor_telepon = ?, 
          jenis_akun = ?, 
          paket_membership = ?, 
          tanggal_berakhir_membership = ?
          WHERE id = ?`
        params = [
          nama_pengguna,
          email,
          nomor_telepon,
          jenis_akun,
          paket_membership,
          tanggal_berakhir_membership,
          id
        ]
      }
    
}
  
    const [result] = await db.query<ResultSetHeader>(query, params)
    return NextResponse.json({
      message: 'Pengguna berhasil diperbarui',
      affected: result.affectedRows
    })
  } catch (error) {
    console.error('❌ Error update pengguna:', error)
    return NextResponse.json(
      { message: 'Gagal memperbarui pengguna', error },
      { status: 500 }
    )
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
    return NextResponse.json({ message: 'Pengguna berhasil dihapus', affected: result.affectedRows })
  } catch (error) {
    console.error('❌ Error hapus pengguna:', error)
    return NextResponse.json({ message: 'Gagal menghapus pengguna', error }, { status: 500 })
  }
}
