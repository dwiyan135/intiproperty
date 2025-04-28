'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { Loader2 } from 'lucide-react'

export default function BuatPropertiPage() {
  const router = useRouter()

  // State Management
  const [users, setUsers]                         = useState<{ id: number; nama_pengguna: string }[]>([])
  const [idPengguna, setIdPengguna]               = useState('')
  const [idAgensi, setIdAgensi]                   = useState('')      // hidden
  const [agenPendamping, setAgenPendamping]       = useState('')
  const [judul, setJudul]                         = useState('')
  const [slug, setSlug]                           = useState('')
  const [tipe, setTipe]                           = useState('')
  const [deskripsi, setDeskripsi]                 = useState('')
  const [deskripsiEn, setDeskripsiEn]             = useState('')
  const [deskripsiAi, setDeskripsiAi]             = useState('')
  const [harga, setHarga]                         = useState('')
  const [hargaNego, setHargaNego]                 = useState(false)
  const [dpMinimal, setDpMinimal]                 = useState('')
  const [estimasiAngsuran, setEstimasiAngsuran]   = useState('')
  const [provinsi, setProvinsi]                   = useState('')
  const [kota, setKota]                           = useState('')
  const [kecamatan, setKecamatan]                 = useState('')
  const [kelurahan, setKelurahan]                 = useState('')
  const [alamatLengkap, setAlamatLengkap]         = useState('')
  const [kodePos, setKodePos]                     = useState('')
  const [koordinat, setKoordinat]                 = useState('')
  const [status, setStatus]                       = useState('aktif')
  const [statusHunian, setStatusHunian]           = useState('dihuni')
  const [verified, setVerified]                   = useState(false)
  const [highlight, setHighlight]                 = useState(false)
  const [namaProyek, setNamaProyek]               = useState('')
  const [namaDeveloper, setNamaDeveloper]         = useState('')
  const [videoLink, setVideoLink]                 = useState('')
  const [linkVirtualTour, setLinkVirtualTour]     = useState('')
  const [catatanInternal, setCatatanInternal]     = useState('')
  const [tanggalBerakhir, setTanggalBerakhir]     = useState('')
  const [autoRenewal, setAutoRenewal]             = useState(false)
  const [fotoUtama, setFotoUtama]                 = useState<File | null>(null)
  const [galeri, setGaleri]                       = useState<File[]>([])
  const [videoUpload, setVideoUpload]             = useState<File | null>(null)
  const [detail, setDetail]                       = useState<any>({})
  const [loading, setLoading]                     = useState(false)

  // Fetch users for dropdown
  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch('/api/pengguna?limit=1000')
        const { pengguna } = await res.json()
        setUsers(pengguna)
      } catch {
        toast.error('Gagal memuat daftar pengguna')
      }
    })()
  }, [])

  // Auto-generate slug
  useEffect(() => {
    setSlug(
      judul
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\-]/g, '')
    )
  }, [judul])

  // Handle gallery file selection
  const handleGaleri = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setGaleri(Array.from(e.target.files))
  }

  // Render detail form based on selected type
  function renderFormDetail() {
    switch (tipe) {
      case '1': // Rumah
        return (
          <section className="bg-gray-50 p-4 rounded-lg space-y-3">
            <h2 className="text-lg font-semibold text-blue-900">Detail Rumah</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Luas Tanah (m²)"
                value={detail.luas_tanah || ''}
                onChange={e => setDetail({ ...detail, luas_tanah: e.target.value })}
                className="w-full p-2 border border-blue-900 rounded-md text-blue-900"
              />
              <input
                type="number"
                placeholder="Luas Bangunan (m²)"
                value={detail.luas_bangunan || ''}
                onChange={e => setDetail({ ...detail, luas_bangunan: e.target.value })}
                className="w-full p-2 border border-blue-900 rounded-md text-blue-900"
              />
              <input
                type="number"
                placeholder="Jumlah Kamar Tidur"
                value={detail.jumlah_kamar || ''}
                onChange={e => setDetail({ ...detail, jumlah_kamar: e.target.value })}
                className="w-full p-2 border border-blue-900 rounded-md text-blue-900"
              />
              <input
                type="number"
                placeholder="Jumlah Kamar Mandi"
                value={detail.jumlah_kamar_mandi || ''}
                onChange={e => setDetail({ ...detail, jumlah_kamar_mandi: e.target.value })}
                className="w-full p-2 border border-blue-900 rounded-md text-blue-900"
              />
              <input
                type="number"
                placeholder="Jumlah Lantai"
                value={detail.jumlah_lantai || ''}
                onChange={e => setDetail({ ...detail, jumlah_lantai: e.target.value })}
                className="w-full p-2 border border-blue-900 rounded-md text-blue-900"
              />
              {/* Carport as numeric field */}
              <input
                type="number"
                placeholder="Jumlah Carport"
                value={detail.carport || ''}
                onChange={e => setDetail({ ...detail, carport: e.target.value })}
                className="w-full p-2 border border-blue-900 rounded-md text-blue-900"
              />
              {/* Garasi */}
              <input
                type="number"
                placeholder="Jumlah Garasi"
                value={detail.garasi || ''}
                onChange={e => setDetail({ ...detail, garasi: e.target.value })}
                className="w-full p-2 border border-blue-900 rounded-md text-blue-900"
              />
              <input
                placeholder="Daya Listrik (VA)"
                value={detail.daya_listrik || ''}
                onChange={e => setDetail({ ...detail, daya_listrik: e.target.value })}
                className="w-full p-2 border border-blue-900 rounded-md text-blue-900"
              />
              <select
                value={detail.sertifikat || ''}
                onChange={e => setDetail({ ...detail, sertifikat: e.target.value })}
                className="w-full p-2 border border-blue-900 rounded-md text-blue-900"
              >
                <option value="">Sertifikat</option>
                <option value="SHM">SHM</option>
                <option value="HGB">HGB</option>
                <option value="AJB">AJB</option>
                <option value="Girik">Girik</option>
                <option value="PPJB">PPJB</option>
              </select>
              <select
                value={detail.orientasi || ''}
                onChange={e => setDetail({ ...detail, orientasi: e.target.value })}
                className="w-full p-2 border border-blue-900 rounded-md text-blue-900"
              >
                <option value="">Orientasi</option>
                <option value="timur">Timur</option>
                <option value="barat">Barat</option>
                <option value="utara">Utara</option>
                <option value="selatan">Selatan</option>
                <option value="timur laut">Timur Laut</option>
                <option value="barat daya">Barat Daya</option>
              </select>
              <input
                placeholder="Tahun Dibangun"
                value={detail.tahun_dibangun || ''}
                onChange={e => setDetail({ ...detail, tahun_dibangun: e.target.value })}
                className="w-full p-2 border border-blue-900 rounded-md text-blue-900"
              />
            </div>
          </section>
        )
      case '2': // Apartemen
        return (
          <section className="bg-gray-50 p-4 rounded-lg space-y-3">
            <h2 className="text-lg font-semibold text-blue-900">Detail Apartemen</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                placeholder="Luas Bangunan (m²)"
                value={detail.luas_bangunan || ''}
                onChange={e => setDetail({ ...detail, luas_bangunan: e.target.value })}
                className="w-full p-2 border border-blue-900 rounded-md text-blue-900"
              />
              <input
                placeholder="Jumlah Kamar"
                value={detail.jumlah_kamar || ''}
                onChange={e => setDetail({ ...detail, jumlah_kamar: e.target.value })}
                className="w-full p-2 border border-blue-900 rounded-md text-blue-900"
              />
              <input
                placeholder="Jumlah Kamar Mandi"
                value={detail.jumlah_kamar_mandi || ''}
                onChange={e => setDetail({ ...detail, jumlah_kamar_mandi: e.target.value })}
                className="w-full p-2 border border-blue-900 rounded-md text-blue-900"
              />
              <input
                placeholder="Lantai Unit"
                value={detail.lantai_unit || ''}
                onChange={e => setDetail({ ...detail, lantai_unit: e.target.value })}
                className="w-full p-2 border border-blue-900 rounded-md text-blue-900"
              />
              <input
                placeholder="Total Lantai"
                value={detail.total_lantai || ''}
                onChange={e => setDetail({ ...detail, total_lantai: e.target.value })}
                className="w-full p-2 border border-blue-900 rounded-md text-blue-900"
              />
              <select
                value={detail.type_unit || ''}
                onChange={e => setDetail({ ...detail, type_unit: e.target.value })}
                className="w-full p-2 border border-blue-900 rounded-md text-blue-900"
              >
                <option value="">Type Unit</option>
                <option value="studio">Studio</option>
                <option value="1BR">1BR</option>
                <option value="2BR">2BR</option>
                <option value="3BR+">3BR+</option>
              </select>
              <input
                placeholder="Biaya Maintenance"
                value={detail.biaya_maintenance || ''}
                onChange={e => setDetail({ ...detail, biaya_maintenance: e.target.value })}
                className="w-full p-2 border border-blue-900 rounded-md text-blue-900"
              />
              <textarea
                placeholder="Fasilitas Umum (JSON)"
                rows={2}
                value={detail.fasilitas_umum || ''}
                onChange={e => setDetail({ ...detail, fasilitas_umum: e.target.value })}
                className="w-full p-2 border border-blue-900 rounded-md text-blue-900"
              />
            </div>
          </section>
        )
      case '3': // Gedung
        return (
          <section className="bg-gray-50 p-4 rounded-lg space-y-3">
            <h2 className="text-lg font-semibold text-blue-900">Detail Gedung</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                placeholder="Luas Tanah (m²)"
                value={detail.luas_tanah || ''}
                onChange={e => setDetail({ ...detail, luas_tanah: e.target.value })}
                className="w-full p-2 border border-blue-900 rounded-md text-blue-900"
              />
              <input
                placeholder="Luas Bangunan (m²)"
                value={detail.luas_bangunan || ''}
                onChange={e => setDetail({ ...detail, luas_bangunan: e.target.value })}
                className="w-full p-2 border border-blue-900 rounded-md text-blue-900"
              />
              <input
                placeholder="Jumlah Lantai"
                value={detail.jumlah_lantai || ''}
                onChange={e => setDetail({ ...detail, jumlah_lantai: e.target.value })}
                className="w-full p-2 border border-blue-900 rounded-md text-blue-900"
              />
              <input
                placeholder="Kapasitas Orang"
                value={detail.kapasitas_orang || ''}
                onChange={e => setDetail({ ...detail, kapasitas_orang: e.target.value })}
                className="w-full p-2 border border-blue-900 rounded-md text-blue-900"
              />
              <select
                value={detail.fungsi || ''}
                onChange={e => setDetail({ ...detail, fungsi: e.target.value })}
                className="w-full p-2 border border-blue-900 rounded-md text-blue-900"
              >
                <option value="">Fungsi</option>
                <option value="kantor">Kantor</option>
                <option value="pabrik">Pabrik</option>
                <option value="gudang">Gudang</option>
                <option value="sekolah">Sekolah</option>
                <option value="event hall">Event Hall</option>
              </select>
              <textarea
                placeholder="Fasilitas (JSON)"
                rows={2}
                value={detail.fasilitas || ''}
                onChange={e => setDetail({ ...detail, fasilitas: e.target.value })}
                className="w-full p-2 border border-blue-900 rounded-md text-blue-900"
              />
              <input
                placeholder="Daya Listrik (VA)"
                value={detail.daya_listrik || ''}
                onChange={e => setDetail({ ...detail, daya_listrik: e.target.value })}
                className="w-full p-2 border border-blue-900 rounded-md text-blue-900"
              />
              <input
                placeholder="Tahun Dibangun"
                value={detail.tahun_dibangun || ''}
                onChange={e => setDetail({ ...detail, tahun_dibangun: e.target.value })}
                className="w-full p-2 border border-blue-900 rounded-md text-blue-900"
              />
              <label className="flex items-center gap-2 text-blue-900">
                <input
                  type="checkbox"
                  checked={detail.genset || false}
                  onChange={e => setDetail({ ...detail, genset: e.target.checked })}
                  className="text-blue-900"
                /> Genset
              </label>
              <label className="flex items-center gap-2 text-blue-900">
                <input
                  type="checkbox"
                  checked={detail.sistem_pemadam_api || false}
                  onChange={e => setDetail({ ...detail, sistem_pemadam_api: e.target.checked })}
                  className="text-blue-900"
                /> Sistem Pemadam Api
              </label>
              <label className="flex items-center gap-2 text-blue-900">
                <input
                  type="checkbox"
                  checked={detail.rooftop || false}
                  onChange={e => setDetail({ ...detail, rooftop: e.target.checked })}
                  className="text-blue-900"
                /> Rooftop
              </label>
              <label className="flex items-center gap-2 text-blue-900">
                <input
                  type="checkbox"
                  checked={detail.lift || false}
                  onChange={e => setDetail({ ...detail, lift: e.target.checked })}
                  className="text-blue-900"
                /> Lift
              </label>
              <label className="flex items-center gap-2 text-blue-900">
                <input
                  type="checkbox"
                  checked={detail.ruang_meeting || false}
                  onChange={e => setDetail({ ...detail, ruang_meeting: e.target.checked })}
                  className="text-blue-900"
                /> Ruang Meeting
              </label>
              <label className="flex items-center gap-2 text-blue-900">
                <input
                  type="checkbox"
                  checked={detail.area_penerima_tamu || false}
                  onChange={e => setDetail({ ...detail, area_penerima_tamu: e.target.checked })}
                  className="text-blue-900"
                /> Area Penerima Tamu
              </label>
              <textarea
                placeholder="Akses Angkutan Umum"
                rows={2}
                value={detail.akses_angkutan_umum || ''}
                onChange={e => setDetail({ ...detail, akses_angkutan_umum: e.target.value })}
                className="w-full p-2 border border-blue-900 rounded-md text-blue-900"
              />
            </div>
          </section>
        )
      // cases 4,5,6 same pattern...
      default:
        return null
    }
  }

  // Submit handler
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const formData = new FormData()
      // Base
      formData.append('id_pengguna', idPengguna)
      formData.append('id_agensi', idAgensi)
      formData.append('agen_pendamping', agenPendamping)
      formData.append('judul', judul)
      formData.append('slug', slug)
      formData.append('id_tipe_properti', tipe)
      formData.append('deskripsi', deskripsi)
      formData.append('deskripsi_en', deskripsiEn)
      formData.append('deskripsi_ai', deskripsiAi)
      // Finansial
      formData.append('harga', harga)
      formData.append('harga_nego', hargaNego ? '1' : '0')
      formData.append('dp_minimal', dpMinimal)
      formData.append('estimasi_angsuran', estimasiAngsuran)
      // Lokasi
      formData.append('id_provinsi', provinsi)
      formData.append('id_kota', kota)
      formData.append('id_kecamatan', kecamatan)
      formData.append('id_kelurahan', kelurahan)
      formData.append('alamat_lengkap', alamatLengkap)
      formData.append('kode_pos', kodePos)
      formData.append('koordinat', koordinat)
      // Status
      formData.append('status', status)
      formData.append('status_hunian', statusHunian)
      formData.append('verified', verified ? '1' : '0')
      formData.append('highlight', highlight ? '1' : '0')
      formData.append('nama_proyek', namaProyek)
      formData.append('nama_developer', namaDeveloper)
      formData.append('video_link', videoLink)
      formData.append('link_virtual_tour', linkVirtualTour)
      formData.append('catatan_internal', catatanInternal)
      formData.append('tanggal_berakhir', tanggalBerakhir)
      formData.append('auto_renewal', autoRenewal ? '1' : '0')
      // Detail
      formData.append('detail', JSON.stringify(detail))
      // Media
      if (fotoUtama) formData.append('foto_properti[]', fotoUtama)
      galeri.forEach(file => formData.append('foto_properti[]', file))
      if (videoUpload) formData.append('video_properti[]', videoUpload)

      const res = await fetch('/api/properti', { method: 'POST', body: formData })
      const result = await res.json()
      if (res.ok) {
        toast.success('Properti berhasil ditambahkan')
        router.push(`/admin/properti/edit/${result.id}`)
      } else {
        toast.error(result.message || 'Gagal menambahkan properti')
      }
    } catch {
      toast.error('Terjadi kesalahan saat submit')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="text-blue-900 max-w-6xl mx-auto py-10 px-4 md:px-8">
      {/* HEADER */}
      <header className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold">Tambah Properti</h1>
        <p className="mt-2 text-sm">Lengkapi detail properti di bawah ini.</p>
      </header>

      {/* FORM */}
      <form onSubmit={handleSubmitForm} className="bg-white shadow-lg rounded-2xl p-6 md:p-10 space-y-8">
        {/* Informasi Umum */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Informasi Umum</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <select
              name="id_pengguna"
              value={idPengguna}
              onChange={e => setIdPengguna(e.target.value)}
              required
              className="w-full p-2 rounded-md border border-blue-900 bg-white text-blue-900"
            >
              <option value="">Pilih Pengguna*</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.nama_pengguna}</option>
              ))}
            </select>
            <input
              name="id_agensi"
              value={idAgensi}
              onChange={e => setIdAgensi(e.target.value)}
              type="hidden"
            />
            <input
              name="agen_pendamping"
              value={agenPendamping}
              onChange={e => setAgenPendamping(e.target.value)}
              placeholder="Agen Pendamping"
              className="w-full p-2 rounded-md border border-blue-900 text-blue-900"
            />
            <input
              name="judul"
              value={judul}
              onChange={e => setJudul(e.target.value)}
              placeholder="Judul Properti*"
              required
              className="w-full p-2 rounded-md border border-blue-900 text-blue-900"
            />
            <input
              name="slug"
              value={slug}
              readOnly
              disabled
              placeholder="Slug"
              className="w-full p-2 rounded-md border border-blue-900 bg-gray-100 text-gray-400"
            />
            <select
              name="id_tipe_properti"
              value={tipe}
              onChange={e => setTipe(e.target.value)}
              required
              className="w-full p-2 rounded-md border border-blue-900 text-blue-900"
            >
              <option value="">Tipe Properti*</option>
              <option value="1">Rumah</option>
              <option value="2">Apartemen</option>
              <option value="3">Gedung</option>
              <option value="4">Tanah</option>
              <option value="5">Ruko</option>
              <option value="6">Lainnya</option>
            </select>
          </div>
          <textarea
            name="deskripsi"
            rows={3}
            value={deskripsi}
            onChange={e => setDeskripsi(e.target.value)}
            placeholder="Deskripsi"
            className="mt-4 w-full p-2 rounded-md border border-blue-900 text-blue-900"
          />
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <textarea
              name="deskripsi_en"
              rows={2}
              value={deskripsiEn}
              onChange={e => setDeskripsiEn(e.target.value)}
              placeholder="Deskripsi (EN)"
              className="w-full p-2 rounded-md border border-blue-900 text-blue-900"
            />
            <textarea
              name="deskripsi_ai"
              rows={2}
              value={deskripsiAi}
              onChange={e => setDeskripsiAi(e.target.value)}
              placeholder="Deskripsi AI"
              className="w-full p-2 rounded-md border border-blue-900 text-blue-900"
            />
          </div>
        </section>

        {/* Dynamic Detail Form */}
        {renderFormDetail()}

        {/* Harga & Finansial */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Harga & Finansial</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <input
              type="number"
              name="harga"
              value={harga}
              onChange={e => setHarga(e.target.value)}
              placeholder="Harga"
              className="w-full p-2 rounded-md border border-blue-900 text-blue-900"
            />
            <label className="flex items-center gap-2 text-blue-900">
              <input
                type="checkbox"
                name="harga_nego"
                checked={hargaNego}
                onChange={e => setHargaNego(e.target.checked)}
                className="text-blue-900"
              />
              Harga Nego
            </label>
            <input
              type="number"
              name="dp_minimal"
              value={dpMinimal}
              onChange={e => setDpMinimal(e.target.value)}
              placeholder="DP Minimal"
              className="w-full p-2 rounded-md border border-blue-900 text-blue-900"
            />
            <input
              type="number"
              name="estimasi_angsuran"
              value={estimasiAngsuran}
              onChange={e => setEstimasiAngsuran(e.target.value)}
              placeholder="Estimasi Angsuran"
              className="w-full p-2 rounded-md border border-blue-900 text-blue-900"
            />
          </div>
        </section>

        {/* Lokasi */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Lokasi</h2>
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <input
              name="id_provinsi"
              value={provinsi}
              onChange={e => setProvinsi(e.target.value)}
              placeholder="ID Provinsi"
              className="w-full p-2 rounded-md border border-blue-900 text-blue-900"
            />
            <input
              name="id_kota"
              value={kota}
              onChange={e => setKota(e.target.value)}
              placeholder="ID Kota"
              className="w-full p-2 rounded-md border border-blue-900 text-blue-900"
            />
            <input
              name="id_kecamatan"
              value={kecamatan}
              onChange={e => setKecamatan(e.target.value)}
              placeholder="ID Kecamatan"
              className="w-full p-2 rounded-md border border-blue-900 text-blue-900"
            />
            <input
              name="id_kelurahan"
              value={kelurahan}
              onChange={e => setKelurahan(e.target.value)}
              placeholder="ID Kelurahan"
              className="w-full p-2 rounded-md border border-blue-900 text-blue-900"
            />
          </div>
          <textarea
            name="alamat_lengkap"
            rows={2}
            value={alamatLengkap}
            onChange={e => setAlamatLengkap(e.target.value)}
            placeholder="Alamat Lengkap"
            className="w-full p-2 rounded-md border border-blue-900 text-blue-900"
          />
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <input
              name="kode_pos"
              value={kodePos}
              onChange={e => setKodePos(e.target.value)}
              placeholder="Kode Pos"
              className="w-full p-2 rounded-md border border-blue-900 text-blue-900"
            />
            <input
              name="koordinat"
              value={koordinat}
              onChange={e => setKoordinat(e.target.value)}
              placeholder="Koordinat (lat,lng)"
              className="w-full p-2 rounded-md border border-blue-900 text-blue-900"
            />
          </div>
        </section>

        {/* Status & Detail Tambahan */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Status & Detail Tambahan</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <select
              name="status"
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="w-full p-2 rounded-md border border-blue-900 text-blue-900"
            >
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Nonaktif</option>
            </select>
            <select
              name="status_hunian"
              value={statusHunian}
              onChange={e => setStatusHunian(e.target.value)}
              className="w-full p-2 rounded-md border border-blue-900 text-blue-900"
            >
              <option value="dihuni">Dihuni</option>
              <option value="kosong">Kosong</option>
              <option value="disewakan">Disewakan</option>
              <option value="proyek">Proyek</option>
            </select>
            <label className="flex items-center gap-2 text-blue-900">
              <input
                name="verified"
                type="checkbox"
                checked={verified}
                onChange={e => setVerified(e.target.checked)}
                className="text-blue-900"
              /> Verified
            </label>
            <label className="flex items-center gap-2 text-blue-900">
              <input
                name="highlight"
                type="checkbox"
                checked={highlight}
                onChange={e => setHighlight(e.target.checked)}
                className="text-blue-900"
              /> Highlight
            </label>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <input
              name="nama_proyek"
              value={namaProyek}
              onChange={e => setNamaProyek(e.target.value)}
              placeholder="Nama Proyek"
              className="w-full p-2 rounded-md border border-blue-900 text-blue-900"
            />
            <input
              name="nama_developer"
              value={namaDeveloper}
              onChange={e => setNamaDeveloper(e.target.value)}
              placeholder="Nama Developer"
              className="w-full p-2 rounded-md border border-blue-900 text-blue-900"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <input
              name="video_link"
              value={videoLink}
              onChange={e => setVideoLink(e.target.value)}
              placeholder="Video Link"
              className="w-full p-2 rounded-md border border-blue-900 text-blue-900"
            />
            <input
              name="link_virtual_tour"
              value={linkVirtualTour}
              onChange={e => setLinkVirtualTour(e.target.value)}
              placeholder="Link Virtual Tour"
              className="w-full p-2 rounded-md border border-blue-900 text-blue-900"
            />
          </div>
          <textarea
            name="catatan_internal"
            rows={2}
            value={catatanInternal}
            onChange={e => setCatatanInternal(e.target.value)}
            placeholder="Catatan Internal"
            className="w-full p-2 rounded-md border border-blue-900 text-blue-900"
          />
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <input
              name="tanggal_berakhir"
              type="date"
              value={tanggalBerakhir}
              onChange={e => setTanggalBerakhir(e.target.value)}
              className="w-full p-2 rounded-md border border-blue-900 text-blue-900"
            />
            <label className="flex items-center gap-2 text-blue-900">
              <input
                name="auto_renewal"
                type="checkbox"
                checked={autoRenewal}
                onChange={e => setAutoRenewal(e.target.checked)}
                className="text-blue-900"
              /> Perpanjang Otomatis
            </label>
          </div>
        </section>

        {/* Media */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Media</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Foto Utama</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => setFotoUtama(e.target.files?.[0] || null)}
                className="block w-full text-sm border border-blue-900 rounded-md file:mr-4 file:rounded file:border-0 file:bg-blue-900 file:text-white file:py-2 file:px-4 hover:file:bg-blue-950"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Galeri Foto</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleGaleri}
                className="block w-full text-sm border border-blue-900 rounded-md file:mr-4 file:rounded file:border-0 file:bg-blue-900 file:text-white file:py-2 file:px-4 hover:file:bg-blue-950"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Upload Video</label>
              <input
                type="file"
                accept="video/*"
                onChange={e => setVideoUpload(e.target.files?.[0] || null)}
                className="block w-full text-sm border border-blue-900 rounded-md file:mr-4 file:rounded file:border-0 file:bg-blue-900 file:text-white file:py-2 file:px-4 hover:file:bg-blue-950"
              />
            </div>
          </div>
        </section>

        {/* Submit */}
        <div className="pt-6 text-right">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-blue-900 hover:bg-blue-950 text-white px-6 py-3 rounded-lg shadow transition disabled:opacity-50"
          >
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            Simpan Properti
          </button>
        </div>
      </form>
    </main>
  )
}
