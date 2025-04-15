'use client'

import { useState } from 'react'
import axios from 'axios'

export default function BuatIklanAgenPage() {
  // --- State untuk field utama ---
  const [judul, setJudul] = useState('')
  const [harga, setHarga] = useState('')
  const [lokasi, setLokasi] = useState('')
  const [deskripsi, setDeskripsi] = useState('')
  const [alamat, setAlamat] = useState('')

  // --- State untuk ID lokasi (prov/kota/kec/kel) ---
  const [idProvinsi, setIdProvinsi] = useState<number | null>(null)
  const [idKota, setIdKota] = useState<number | null>(null)
  const [idKecamatan, setIdKecamatan] = useState<number | null>(null)
  const [idKelurahan, setIdKelurahan] = useState<number | null>(null)

  // --- State untuk tipe properti & data lain (min. required) ---
  const [idTipeProperti, setIdTipeProperti] = useState<number>(1) // misalnya default 1
  const [idPengguna, setIdPengguna] = useState<number>(2)         // misalnya agen user_id = 2

  // --- State untuk loading & success feedback ---
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Fungsi submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)

    try {
      // Bentuk slug dari judul
      const slug = judul.toLowerCase().replace(/\s+/g, '-')

      // Panggil endpoint POST /api/properti
      await axios.post('/api/properti', {
        judul,
        slug,
        deskripsi,
        harga: Number(harga),
        lokasi,
        alamat,

        id_provinsi: idProvinsi,
        id_kota: idKota,
        id_kecamatan: idKecamatan,
        id_kelurahan: idKelurahan,

        id_tipe_properti: idTipeProperti,
        id_pengguna: idPengguna,

        // Role agen
        dibuat_oleh: 'agen'
      })

      // Jika berhasil, kosongkan form & tampilkan pesan sukses
      setSuccess(true)
      setJudul('')
      setHarga('')
      setLokasi('')
      setDeskripsi('')
      setAlamat('')
      setIdProvinsi(null)
      setIdKota(null)
      setIdKecamatan(null)
      setIdKelurahan(null)
      // ... dsb

    } catch (error) {
      console.error('❌ Gagal menyimpan properti:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Buat Iklan Properti (Agen)</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Judul */}
        <div>
          <label className="block font-medium">Judul Iklan</label>
          <input
            type="text"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        {/* Harga */}
        <div>
          <label className="block font-medium">Harga</label>
          <input
            type="number"
            value={harga}
            onChange={(e) => setHarga(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        {/* Lokasi umum (mis. nama kota) */}
        <div>
          <label className="block font-medium">Lokasi (Umum)</label>
          <input
            type="text"
            value={lokasi}
            onChange={(e) => setLokasi(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        {/* Alamat detail */}
        <div>
          <label className="block font-medium">Alamat Lengkap</label>
          <input
            type="text"
            value={alamat}
            onChange={(e) => setAlamat(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* ID Provinsi, Kota, Kecamatan, Kelurahan */}
        <div>
          <label className="block font-medium">ID Provinsi</label>
          <input
            type="number"
            value={idProvinsi || ''}
            onChange={(e) => setIdProvinsi(e.target.value ? Number(e.target.value) : null)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium">ID Kota</label>
          <input
            type="number"
            value={idKota || ''}
            onChange={(e) => setIdKota(e.target.value ? Number(e.target.value) : null)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium">ID Kecamatan</label>
          <input
            type="number"
            value={idKecamatan || ''}
            onChange={(e) => setIdKecamatan(e.target.value ? Number(e.target.value) : null)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium">ID Kelurahan</label>
          <input
            type="number"
            value={idKelurahan || ''}
            onChange={(e) => setIdKelurahan(e.target.value ? Number(e.target.value) : null)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Deskripsi */}
        <div>
          <label className="block font-medium">Deskripsi</label>
          <textarea
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            className="w-full border rounded px-3 py-2"
            rows={4}
            required
          />
        </div>

        {/* Tombol Simpan */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Menyimpan...' : 'Simpan Iklan'}
        </button>

        {/* Pesan Sukses */}
        {success && (
          <p className="text-green-600 font-semibold mt-2">
            ✅ Iklan berhasil ditambahkan!
          </p>
        )}
      </form>
    </div>
  )
}
