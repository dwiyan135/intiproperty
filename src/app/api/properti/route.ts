// File: src/app/api/properti/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import type { RowDataPacket, ResultSetHeader } from 'mysql2'

// ✅ GET - Ambil semua properti (Kode Baru)
export async function GET(req: NextRequest) {
  try {
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT * FROM properti ORDER BY dibuat_pada DESC'
    )
    return NextResponse.json(rows)
  } catch (error) {
    console.error('❌ Error saat GET properti:', error)
    return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 })
  }
}

// ✅ POST - Tambah properti (Kode Baru)
export async function POST(req: NextRequest) {
  try {
    const {
      // Kolom umum
      judul, slug, deskripsi, harga, lokasi, alamat,
      id_provinsi, id_kota, id_kecamatan, id_kelurahan,
      id_tipe_properti, id_pengguna, dibuat_oleh,
      garis_lintang, garis_bujur,

      // Rumah
      jenis_properti_rumah, luas_tanah, luas_bangunan,
      jumlah_kamar_tidur, jumlah_kamar_mandi, jumlah_lantai,
      garasi, carport, daya_listrik, sumber_air, tahun_dibangun,
      orientasi_bangunan, fasilitas_tambahan, kondisi_properti,
      furnishing, sertifikat_rumah, akses_jalan, lebar_jalan_depan,
      jarak_jalan_utama, bebas_banjir,

      // Apartemen
      tower, lantai, tipe_unit, luas_unit, biaya_perawatan,
      akses_lift, jumlah_unit_per_lantai, view,
      fasilitas_gedung, akses_keamanan, sertifikat_apartemen,

      // Gedung
      jumlah_lantai_gedung, kapasitas_parkir, peruntukan_gedung,
      akses_transportasi, tahun_dibangun_gedung, sistem_keamanan,
      luas_bangunan_total, fasilitas_gedung_tambahan,

      // Tanah
      lebar_depan, kontur_tanah, akses_jalan_tanah,
      vegetasi, peruntukan_tanah, fasilitas_di_sekitar,
      sertifikat_tanah,

      // Ruko
      jumlah_lantai_ruko, luas_tanah_ruko, luas_bangunan_ruko,
      akses_kendaraan, jam_operasional, peruntukan_ruko,
      sistem_keamanan_ruko, fasilitas_ruko_tambahan,

      // Lainnya
      tipe_khusus, deskripsi_tambahan
    } = await req.json()

    if (!judul || !slug || !harga || !lokasi || !id_tipe_properti || !id_pengguna || !dibuat_oleh) {
      return NextResponse.json({ message: 'Field wajib tidak boleh kosong' }, { status: 400 })
    }

    const [result] = await db.query<ResultSetHeader>(
      `INSERT INTO properti (
        judul, slug, deskripsi, harga, lokasi, alamat,
        id_provinsi, id_kota, id_kecamatan, id_kelurahan,
        id_tipe_properti, id_pengguna, dibuat_oleh,
        garis_lintang, garis_bujur,

        jenis_properti_rumah, luas_tanah, luas_bangunan,
        jumlah_kamar_tidur, jumlah_kamar_mandi, jumlah_lantai,
        garasi, carport, daya_listrik, sumber_air, tahun_dibangun,
        orientasi_bangunan, fasilitas_tambahan, kondisi_properti,
        furnishing, sertifikat_rumah, akses_jalan, lebar_jalan_depan,
        jarak_jalan_utama, bebas_banjir,

        tower, lantai, tipe_unit, luas_unit, biaya_perawatan,
        akses_lift, jumlah_unit_per_lantai, view,
        fasilitas_gedung, akses_keamanan, sertifikat_apartemen,

        jumlah_lantai_gedung, kapasitas_parkir, peruntukan_gedung,
        akses_transportasi, tahun_dibangun_gedung, sistem_keamanan,
        luas_bangunan_total, fasilitas_gedung_tambahan,

        lebar_depan, kontur_tanah, akses_jalan_tanah,
        vegetasi, peruntukan_tanah, fasilitas_di_sekitar,
        sertifikat_tanah,

        jumlah_lantai_ruko, luas_tanah_ruko, luas_bangunan_ruko,
        akses_kendaraan, jam_operasional, peruntukan_ruko,
        sistem_keamanan_ruko, fasilitas_ruko_tambahan,

        tipe_khusus, deskripsi_tambahan
      ) VALUES (
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?,

        ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?,

        ?, ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?,

        ?, ?, ?,
        ?, ?, ?,
        ?, ?,

        ?, ?, ?,
        ?, ?, ?,
        ?,

        ?, ?, ?,
        ?, ?, ?,
        ?, ?,

        ?, ?
      )`,
      [
        judul, slug, deskripsi, harga, lokasi, alamat,
        id_provinsi, id_kota, id_kecamatan, id_kelurahan,
        id_tipe_properti, id_pengguna, dibuat_oleh,
        garis_lintang, garis_bujur,

        jenis_properti_rumah, luas_tanah, luas_bangunan,
        jumlah_kamar_tidur, jumlah_kamar_mandi, jumlah_lantai,
        garasi, carport, daya_listrik, sumber_air, tahun_dibangun,
        orientasi_bangunan, JSON.stringify(fasilitas_tambahan ?? []), kondisi_properti,
        furnishing, sertifikat_rumah, akses_jalan, lebar_jalan_depan,
        jarak_jalan_utama, bebas_banjir,

        tower, lantai, tipe_unit, luas_unit, biaya_perawatan,
        akses_lift, jumlah_unit_per_lantai, view,
        JSON.stringify(fasilitas_gedung ?? []), JSON.stringify(akses_keamanan ?? []), sertifikat_apartemen,

        jumlah_lantai_gedung, kapasitas_parkir, peruntukan_gedung,
        JSON.stringify(akses_transportasi ?? []), tahun_dibangun_gedung,
        JSON.stringify(sistem_keamanan ?? []), luas_bangunan_total,
        JSON.stringify(fasilitas_gedung_tambahan ?? []),

        lebar_depan, kontur_tanah, akses_jalan_tanah,
        vegetasi, peruntukan_tanah, JSON.stringify(fasilitas_di_sekitar ?? []),
        sertifikat_tanah,

        jumlah_lantai_ruko, luas_tanah_ruko, luas_bangunan_ruko,
        akses_kendaraan, jam_operasional, peruntukan_ruko,
        JSON.stringify(sistem_keamanan_ruko ?? []),
        JSON.stringify(fasilitas_ruko_tambahan ?? []),

        tipe_khusus, deskripsi_tambahan
      ]
    )

    return NextResponse.json({
      message: 'Properti berhasil ditambahkan',
      id: result.insertId
    }, { status: 201 })
  } catch (error) {
    console.error('❌ Error saat tambah properti:', error)
    return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 })
  }
}

/* 
  -- KODE LAMA (disertakan sebagai komentar) --

  import type { NextRequest, NextResponse } from 'next/server'
  import { db } from '@/lib/db'
  import { RowDataPacket, ResultSetHeader } from 'mysql2'

  export async function GET(req: NextRequest) {
    try {
      const [rows] = await db.query<RowDataPacket[]>(
        'SELECT * FROM properti ORDER BY dibuat_pada DESC'
      )
      return NextResponse.json(rows)
    } catch (error) {
      console.error('❌ Error saat GET properti:', error)
      return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 })
    }
  }

  // Method POST -> tambah data properti
  export async function POST {
    const {
      // --- Kolom umum ---
      judul,
      slug,
      deskripsi,
      harga,
      lokasi,
      alamat,
      id_provinsi,
      id_kota,
      id_kecamatan,
      id_kelurahan,
      id_tipe_properti,
      id_pengguna,
      dibuat_oleh,
      garis_lintang,
      garis_bujur,

      // --- Kolom Rumah ---
      jenis_properti_rumah,
      luas_tanah,
      luas_bangunan,
      jumlah_kamar_tidur,
      jumlah_kamar_mandi,
      jumlah_lantai,
      garasi,
      carport,
      daya_listrik,
      sumber_air,
      tahun_dibangun,
      orientasi_bangunan,
      fasilitas_tambahan,
      kondisi_properti,
      furnishing,
      sertifikat_rumah,
      akses_jalan,
      lebar_jalan_depan,
      jarak_jalan_utama,
      bebas_banjir,

      // --- Kolom Apartemen ---
      tower,
      lantai,
      tipe_unit,
      luas_unit,
      biaya_perawatan,
      akses_lift,
      jumlah_unit_per_lantai,
      view,
      fasilitas_gedung,
      akses_keamanan,
      sertifikat_apartemen,

      // --- Kolom Gedung ---
      jumlah_lantai_gedung,
      kapasitas_parkir,
      peruntukan_gedung,
      akses_transportasi,
      tahun_dibangun_gedung,
      sistem_keamanan,
      luas_bangunan_total,
      fasilitas_gedung_tambahan,

      // --- Kolom Tanah ---
      lebar_depan,
      kontur_tanah,
      akses_jalan_tanah,
      vegetasi,
      peruntukan_tanah,
      fasilitas_di_sekitar,
      sertifikat_tanah,

      // --- Kolom Ruko ---
      jumlah_lantai_ruko,
      luas_tanah_ruko,
      luas_bangunan_ruko,
      akses_kendaraan,
      jam_operasional,
      peruntukan_ruko,
      sistem_keamanan_ruko,
      fasilitas_ruko_tambahan,

      // --- Kolom lainnya ---
      tipe_khusus,
      deskripsi_tambahan
    } = req.body

    // Validasi sederhana untuk field wajib
    if (!judul || !slug || !harga || !lokasi || !id_tipe_properti || !id_pengguna || !dibuat_oleh) {
      return res.status(400).json({ message: 'Field wajib tidak boleh kosong' })
    }

    // Lakukan penyisipan data ...
    // ...
    return res.status(201).json({ message: 'Properti berhasil ditambahkan', id: result.insertId })
  }

  // Jika method selain GET dan POST
  return res.status(405).json({ message: 'Method Not Allowed' })
}
*/

// ✅ Handler untuk method lain (mirip dengan kode lama yang menolak selain GET/POST).
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
