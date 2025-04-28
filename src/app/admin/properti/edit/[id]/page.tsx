'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { Loader2 } from 'lucide-react'

export default function EditPropertiPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [data, setData] = useState<any>({
    id_pengguna: '',
    id_agensi: '',
    agen_pendamping: '',
    judul: '',
    slug: '',
    id_tipe_properti: '',
    deskripsi: '',
    deskripsi_en: '',
    deskripsi_ai: '',
    harga: '',
    harga_nego: 0,
    dp_minimal: '',
    estimasi_angsuran: '',
    id_provinsi: '',
    id_kota: '',
    id_kecamatan: '',
    id_kelurahan: '',
    alamat_lengkap: '',
    kode_pos: '',
    koordinat: '',
    status: 'aktif',
    status_hunian: 'draf',
    verified: 0,
    highlight: 0,
    nama_proyek: '',
    nama_developer: '',
    video_link: '',
    link_virtual_tour: '',
    catatan_internal: '',
    tanggal_berakhir: '',
    auto_renewal: 0,
    detail: {}
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/properti/${id}`)
        if (!res.ok) throw new Error()
        const json = await res.json()
        setData({
          ...json,
          harga: json.harga?.toString() || '',
          dp_minimal: json.dp_minimal?.toString() || '',
          estimasi_angsuran: json.estimasi_angsuran?.toString() || '',
          harga_nego: json.harga_nego ? 1 : 0,
          verified: json.verified ? 1 : 0,
          highlight: json.highlight ? 1 : 0,
          auto_renewal: json.auto_renewal ? 1 : 0,
          tanggal_berakhir: json.tanggal_berakhir?.split('T')[0] || '',
          detail: json.detail || {}
        })
      } catch {
        toast.error('Gagal memuat data properti')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const handleBaseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, type, value, checked } = e.target as any
    setData((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    }))
  }

  const handleDetailChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, type, value, checked } = e.target as any
    setData((prev: any) => ({
      ...prev,
      detail: {
        ...prev.detail,
        [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
      }
    }))
  }

  const renderFormDetail = () => {
    const d = data.detail || {}
    switch (data.id_tipe_properti) {
      case 1: // Rumah
        return (
          <section className="bg-gray-50 p-4 rounded-lg space-y-3">
            <h2 className="text-lg font-semibold text-blue-900">Detail Rumah</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <input name="luas_tanah" type="number" value={d.luas_tanah||''} onChange={handleDetailChange}
                placeholder="Luas Tanah" className="w-full p-2 border border-blue-900 rounded-md text-blue-900" />
              <input name="luas_bangunan" type="number" value={d.luas_bangunan||''} onChange={handleDetailChange}
                placeholder="Luas Bangunan" className="w-full p-2 border border-blue-900 rounded-md text-blue-900" />
              <input name="jumlah_kamar" type="number" value={d.jumlah_kamar||''} onChange={handleDetailChange}
                placeholder="Jumlah Kamar" className="w-full p-2 border border-blue-900 rounded-md text-blue-900" />
              <input name="jumlah_kamar_mandi" type="number" value={d.jumlah_kamar_mandi||''} onChange={handleDetailChange}
                placeholder="Kamar Mandi" className="w-full p-2 border border-blue-900 rounded-md text-blue-900" />
              <input name="jumlah_lantai" type="number" value={d.jumlah_lantai||''} onChange={handleDetailChange}
                placeholder="Jumlah Lantai" className="w-full p-2 border border-blue-900 rounded-md text-blue-900" />
              <label className="flex items-center gap-2 text-blue-900">
                <input name="carport" type="checkbox" checked={!!d.carport} onChange={handleDetailChange} />
                Carport
              </label>
              <label className="flex items-center gap-2 text-blue-900">
                <input name="garasi" type="checkbox" checked={!!d.garasi} onChange={handleDetailChange} />
                Garasi
              </label>
              <input name="daya_listrik" placeholder="Daya Listrik" value={d.daya_listrik||''} onChange={handleDetailChange}
                className="w-full p-2 border border-blue-900 rounded-md text-blue-900" />
              <select name="sertifikat" value={d.sertifikat||''} onChange={handleDetailChange}
                className="w-full p-2 border border-blue-900 rounded-md text-blue-900">
                <option value="">Sertifikat</option>
                <option value="SHM">SHM</option>
                <option value="HGB">HGB</option>
                <option value="AJB">AJB</option>
                <option value="Girik">Girik</option>
                <option value="PPJB">PPJB</option>
              </select>
              <select name="orientasi" value={d.orientasi||''} onChange={handleDetailChange}
                className="w-full p-2 border border-blue-900 rounded-md text-blue-900">
                <option value="">Orientasi</option>
                <option value="timur">Timur</option>
                <option value="barat">Barat</option>
                <option value="utara">Utara</option>
                <option value="selatan">Selatan</option>
                <option value="timur laut">Timur Laut</option>
                <option value="barat daya">Barat Daya</option>
              </select>
              <input name="tahun_dibangun" type="number" value={d.tahun_dibangun||''} onChange={handleDetailChange}
                placeholder="Tahun Dibangun" className="w-full p-2 border border-blue-900 rounded-md text-blue-900" />
            </div>
          </section>
        )
      case 2: // Apartemen
        return (
          <section className="bg-gray-50 p-4 rounded-lg space-y-3">
            <h2 className="text-lg font-semibold text-blue-900">Detail Apartemen</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <input name="luas_bangunan" type="number" value={d.luas_bangunan||''} onChange={handleDetailChange}
                placeholder="Luas Bangunan" className="w-full p-2 border border-blue-900 rounded-md text-blue-900" />
              <input name="jumlah_kamar" type="number" value={d.jumlah_kamar||''} onChange={handleDetailChange}
                placeholder="Jumlah Kamar" className="w-full p-2 border border-blue-900 rounded-md text-blue-900" />
              <input name="jumlah_kamar_mandi" type="number" value={d.jumlah_kamar_mandi||''} onChange={handleDetailChange}
                placeholder="Kamar Mandi" className="w-full p-2 border border-blue-900 rounded-md text-blue-900" />
              <input name="lantai_unit" type="number" value={d.lantai_unit||''} onChange={handleDetailChange}
                placeholder="Lantai Unit" className="w-full p-2 border border-blue-900 rounded-md text-blue-900" />
              <input name="total_lantai" type="number" value={d.total_lantai||''} onChange={handleDetailChange}
                placeholder="Total Lantai" className="w-full p-2 border border-blue-900 rounded-md text-blue-900" />
              <select name="type_unit" value={d.type_unit||''} onChange={handleDetailChange}
                className="w-full p-2 border border-blue-900 rounded-md text-blue-900">
                <option value="">Type Unit</option>
                <option value="studio">Studio</option>
                <option value="1BR">1BR</option>
                <option value="2BR">2BR</option>
                <option value="3BR+">3BR+</option>
              </select>
              <input name="biaya_maintenance" type="number" value={d.biaya_maintenance||''} onChange={handleDetailChange}
                placeholder="Biaya Maintenance" className="w-full p-2 border border-blue-900 rounded-md text-blue-900" />
              <textarea name="fasilitas_umum" rows={2} value={d.fasilitas_umum||''} onChange={handleDetailChange}
                placeholder="Fasilitas Umum (JSON)" className="w-full p-2 border border-blue-900 rounded-md text-blue-900" />
            </div>
          </section>
        )
      case 3: // Gedung
        return (
          <section className="bg-gray-50 p-4 rounded-lg space-y-3">
            <h2 className="text-lg font-semibold text-blue-900">Detail Gedung</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <input name="luas_tanah" type="number" value={d.luas_tanah||''} onChange={handleDetailChange}
                placeholder="Luas Tanah" className="w-full p-2 border border-blue-900 rounded-md text-blue-900" />
              <input name="luas_bangunan" type="number" value={d.luas_bangunan||''} onChange={handleDetailChange}
                placeholder="Luas Bangunan" className="w-full p-2 border border-blue-900 rounded-md text-blue-900" />
              <input name="jumlah_lantai" type="number" value={d.jumlah_lantai||''} onChange={handleDetailChange}
                placeholder="Jumlah Lantai" className="w-full p-2 border border-blue-900 rounded-md text-blue-900" />
              <input name="kapasitas_orang" type="number" value={d.kapasitas_orang||''} onChange={handleDetailChange}
                placeholder="Kapasitas Orang" className="w-full p-2 border border-blue-900 rounded-md text-blue-900" />
              <select name="fungsi" value={d.fungsi||''} onChange={handleDetailChange}
                className="w-full p-2 border border-blue-900 rounded-md text-blue-900">
                <option value="">Fungsi</option>
                <option value="kantor">Kantor</option>
                <option value="pabrik">Pabrik</option>
                <option value="gudang">Gudang</option>
                <option value="sekolah">Sekolah</option>
                <option value="event hall">Event Hall</option>
              </select>
              <textarea name="fasilitas" rows={2} value={d.fasilitas||''} onChange={handleDetailChange}
                placeholder="Fasilitas (JSON)" className="w-full p-2 border border-blue-900 rounded-md text-blue-900" />
              <input name="daya_listrik" placeholder="Daya Listrik" value={d.daya_listrik||''} onChange={handleDetailChange}
                className="w-full p-2 border border-blue-900 rounded-md text-blue-900" />
              <input name="tahun_dibangun" placeholder="Tahun Dibangun" value={d.tahun_dibangun||''} onChange={handleDetailChange}
                className="w-full p-2 border border-blue-900 rounded-md text-blue-900" />
              <label className="flex items-center gap-2 text-blue-900">
                <input name="genset" type="checkbox" checked={!!d.genset} onChange={handleDetailChange} /> Genset
              </label>
              <label className="flex items-center gap-2 text-blue-900">
                <input name="sistem_pemadam_api" type="checkbox" checked={!!d.sistem_pemadam_api} onChange={handleDetailChange} /> Pemadam Api
              </label>
              <label className="flex items-center gap-2 text-blue-900">
                <input name="rooftop" type="checkbox" checked={!!d.rooftop} onChange={handleDetailChange} /> Rooftop
              </label>
              <label className="flex items-center gap-2 text-blue-900">
                <input name="lift" type="checkbox" checked={!!d.lift} onChange={handleDetailChange} /> Lift
              </label>
              <label className="flex items-center gap-2 text-blue-900">
                <input name="ruang_meeting" type="checkbox" checked={!!d.ruang_meeting} onChange={handleDetailChange} /> Meeting
              </label>
              <label className="flex items-center gap-2 text-blue-900">
                <input name="area_penerima_tamu" type="checkbox" checked={!!d.area_penerima_tamu} onChange={handleDetailChange} /> Area Tamu
              </label>
              <textarea name="akses_angkutan_umum" rows={2} value={d.akses_angkutan_umum||''} onChange={handleDetailChange}
                placeholder="Akses Umum" className="w-full p-2 border border-blue-900 rounded-md text-blue-900" />
            </div>
          </section>
        )
      case 4: // Tanah
        return (
          <section className="bg-gray-50 p-4 rounded-lg space-y-3">
            <h2 className="text-lg font-semibold text-blue-900">Detail Tanah</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <input name="luas_tanah" type="number" value={d.luas_tanah||''} onChange={handleDetailChange}
                placeholder="Luas Tanah" className="w-full p-2 border border-blue-900 rounded-md text-blue-900" />
              <select name="jenis_tanah" value={d.jenis_tanah||''} onChange={handleDetailChange}
                className="w-full p-2 border border-blue-900 rounded-md text-blue-900">
                <option value="">Jenis Tanah</option>
                <option value="kavling">Kavling</option>
                <option value="pertanian">Pertanian</option>
                <option value="pekarangan">Pekarangan</option>
              </select>
              <select name="status_kepemilikan" value={d.status_kepemilikan||''} onChange={handleDetailChange}
                className="w-full p-2 border border-blue-900 rounded-md text-blue-900">
                <option value="">Status Kepemilikan</option>
                <option value="SHM">SHM</option>
                <option value="HGB">HGB</option>
                <option value="AJB">AJB</option>
                <option value="Girik">Girik</option>
              </select>
              <input name="lebar_jalan_depan" placeholder="Lebar Jalan" value={d.lebar_jalan_depan||''} onChange={handleDetailChange}
                className="w-full p-2 border border-blue-900 rounded-md text-blue-900" />
              <select name="kontur_tanah" value={d.kontur_tanah||''} onChange={handleDetailChange}
                className="w-full p-2 border border-blue-900 rounded-md text-blue-900">
                <option value="">Kontur</option>
                <option value="datar">Datar</option>
                <option value="miring">Miring</option>
              </select>
              <label className="flex items-center gap-2 text-blue-900">
                <input name="bebas_banjir" type="checkbox" checked={!!d.bebas_banjir} onChange={handleDetailChange} /> Bebas Banjir
              </label>
              <input name="akses_jalan" placeholder="Akses Jalan" value={d.akses_jalan||''} onChange={handleDetailChange}
                className="w-full p-2 border border-blue-900 rounded-md text-blue-900" />
              <select name="peruntukan" value={d.peruntukan||''} onChange={handleDetailChange}
                className="w-full p-2 border border-blue-900 rounded-md text-blue-900">
                <option value="">Peruntukan</option>
                <option value="komersial">Komersial</option>
                <option value="residensial">Residensial</option>
                <option value="perkebunan">Perkebunan</option>
                <option value="lainnya">Lainnya</option>
              </select>
              <input name="bentuk_tanah" placeholder="Bentuk Tanah" value={d.bentuk_tanah||''} onChange={handleDetailChange}
                className="w-full p-2 border border-blue-900 rounded-md text-blue-900" />
              <input name="orientasi_tanah" placeholder="Orientasi Tanah" value={d.orientasi_tanah||''} onChange={handleDetailChange}
                className="w-full p-2 border border-blue-900 rounded-md text-blue-900" />
              <label className="flex items-center gap-2 text-blue-900">
                <input name="berada_di_perumahan" type="checkbox" checked={!!d.berada_di_perumahan} onChange={handleDetailChange} /> Perumahan
              </label>
              <textarea name="dekat_fasilitas_umum" rows={2} value={d.dekat_fasilitas_umum||''} onChange={handleDetailChange}
                placeholder="Dekat Fasilitas" className="w-full p-2 border border-blue-900 rounded-md text-blue-900" />
            </div>
          </section>
        )
      case 5: // Ruko
        return (
          <section className="bg-gray-50 p-4 rounded-lg space-y-3">
            <h2 className="text-lg font-semibold text-blue-900">Detail Ruko</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <input name="luas_tanah" type="number" value={d.luas_tanah||''} onChange={handleDetailChange}
                placeholder="Luas Tanah" className="w-full p-2 border border-blue-900 rounded-md text-blue-900" />
              <input name="luas_bangunan" type="number" value={d.luas_bangunan||''} onChange={handleDetailChange}
                placeholder="Luas Bangunan" className="w-full p-2 border border-blue-900 rounded-md text-blue-900" />
              <input name="jumlah_lantai" type="number" value={d.jumlah_lantai||''} onChange={handleDetailChange}
                placeholder="Jumlah Lantai" className="w-full p-2 border border-blue-900 rounded-md text-blue-900" />
              <input name="lebar_muka" placeholder="Lebar Muka" value={d.lebar_muka||''} onChange={handleDetailChange}
                className="w-full p-2 border border-blue-900 rounded-md text-blue-900" />
              <input name="daya_listrik" placeholder="Daya Listrik" value={d.daya_listrik||''} onChange={handleDetailChange}
                className="w-full p-2 border border-blue-900 rounded-md text-blue-900" />
              <label className="flex items-center gap-2 text-blue-900">
                <input name="garasi" type="checkbox" checked={!!d.garasi} onChange={handleDetailChange} /> Garasi
              </label>
              <label className="flex items-center gap-2 text-blue-900">
                <input name="carport" type="checkbox" checked={!!d.carport} onChange={handleDetailChange} /> Carport
              </label>
              <select name="kondisi" value={d.kondisi||''} onChange={handleDetailChange}
                className="w-full p-2 border border-blue-900 rounded-md text-blue-900">
                <option value="">Kondisi</option>
                <option value="baru">Baru</option>
                <option value="renovasi">Renovasi</option>
                <option value="lama">Lama</option>
              </select>
              <select name="sertifikat" value={d.sertifikat||''} onChange={handleDetailChange}
                className="w-full p-2 border border-blue-900 rounded-md text-blue-900">
                <option value="">Sertifikat</option>
                <option value="SHM">SHM</option>
                <option value="HGB">HGB</option>
                <option value="AJB">AJB</option>
              </select>
              <input name="tahun_dibangun" placeholder="Tahun Dibangun" value={d.tahun_dibangun||''} onChange={handleDetailChange}
                className="w-full p-2 border border-blue-900 rounded-md text-blue-900" />
              <label className="flex items-center gap-2 text-blue-900">
                <input name="parkiran_umum" type="checkbox" checked={!!d.parkiran_umum} onChange={handleDetailChange} /> Parkiran Umum
              </label>
              <label className="flex items-center gap-2 text-blue-900">
                <input name="toilet_per_lantai" type="checkbox" checked={!!d.toilet_per_lantai} onChange={handleDetailChange} /> Toilet/Lantai
              </label>
              <label className="flex items-center gap-2 text-blue-900">
                <input name="akses_loading_dock" type="checkbox" checked={!!d.akses_loading_dock} onChange={handleDetailChange} /> Loading Dock
              </label>
              <label className="flex items-center gap-2 text-blue-900">
                <input name="terlihat_dari_jalan_raya" type="checkbox" checked={!!d.terlihat_dari_jalan_raya} onChange={handleDetailChange} /> Terlihat Jalan
              </label>
              <label className="flex items-center gap-2 text-blue-900">
                <input name="lokasi_strategis" type="checkbox" checked={!!d.lokasi_strategis} onChange={handleDetailChange} /> Strategis
              </label>
              <select name="peruntukan" value={d.peruntukan||''} onChange={handleDetailChange}
                className="w-full p-2 border border-blue-900 rounded-md text-blue-900">
                <option value="">Peruntukan</option>
                <option value="komersial">Komersial</option>
                <option value="kantor">Kantor</option>
                <option value="gudang">Gudang</option>
                <option value="toko">Toko</option>
                <option value="lainnya">Lainnya</option>
              </select>
            </div>
          </section>
        )
      case 6: // Lainnya
        return (
          <section className="bg-gray-50 p-4 rounded-lg space-y-3">
            <h2 className="text-lg font-semibold text-blue-900">Detail Lainnya</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <input name="judul_kustom" placeholder="Judul Kustom" value={d.judul_kustom||''} onChange={handleDetailChange}
                className="w-full p-2 border border-blue-900 rounded-md text-blue-900" />
              <textarea name="keterangan" rows={2} placeholder="Keterangan" value={d.keterangan||''} onChange={handleDetailChange}
                className="w-full p-2 border border-blue-900 rounded-md text-blue-900" />
              <textarea name="fitur_khusus" rows={2} placeholder="Fitur Khusus (JSON)" value={d.fitur_khusus||''} onChange={handleDetailChange}
                className="w-full p-2 border border-blue-900 rounded-md text-blue-900" />
              <select name="kategori_lainnya" value={d.kategori_lainnya||''} onChange={handleDetailChange}
                className="w-full p-2 border border-blue-900 rounded-md text-blue-900">
                <option value="">Kategori</option>
                <option value="gudang">Gudang</option>
                <option value="kos-kosan">Kos-kosan</option>
                <option value="industri">Industri</option>
                <option value="lainnya">Lainnya</option>
              </select>
              <textarea name="izin_usaha" rows={2} placeholder="Izin Usaha" value={d.izin_usaha||''} onChange={handleDetailChange}
                className="w-full p-2 border border-blue-900 rounded-md text-blue-900" />
              <label className="flex items-center gap-2 text-blue-900">
                <input name="lingkungan_industri" type="checkbox" checked={!!d.lingkungan_industri} onChange={handleDetailChange} /> Lingkungan Industri
              </label>
              <label className="flex items-center gap-2 text-blue-900">
                <input name="akses_container" type="checkbox" checked={!!d.akses_container} onChange={handleDetailChange} /> Akses Container
              </label>
              <input name="daya_listrik" placeholder="Daya Listrik" value={d.daya_listrik||''} onChange={handleDetailChange}
                className="w-full p-2 border border-blue-900 rounded-md text-blue-900" />
            </div>
          </section>
        )
      default:
        return null
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = { ...data }
      delete payload.id
      delete payload.tanggal_mulai
      delete payload.total_view
      delete payload.total_simpan
      delete payload.total_share

      const res = await fetch(`/api/properti/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw await res.json()
      toast.success('Properti berhasil diperbarui')
      router.push('/admin/properti')
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-4 text-blue-900">Memuat data properti...</div>

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold text-blue-900">Edit Properti #{id}</h1>
      <form onSubmit={e => { e.preventDefault(); handleSave() }} className="space-y-8">
        {/* Base fields */}
        <div className="grid md:grid-cols-2 gap-4">
          <input name="id_pengguna" type="number" value={data.id_pengguna||''} onChange={handleBaseChange}
            placeholder="ID Pengguna" className="w-full p-2 border border-blue-900 rounded-md text-blue-900" />
          <input name="id_agensi" type="number" value={data.id_agensi||''} onChange={handleBaseChange}
            placeholder="ID Agensi" className="w-full p-2 border border-blue-900 rounded-md text-blue-900" />
          <input name="agen_pendamping" type="number" value={data.agen_pendamping||''} onChange={handleBaseChange}
            placeholder="Agen Pendamping" className="w-full p-2 border border-blue-900 rounded-md text-blue-900" />
          <input name="judul" type="text" value={data.judul||''} onChange={handleBaseChange}
            placeholder="Judul" className="w-full p-2 border border-blue-900 rounded-md text-blue-900" />
          <input name="slug" type="text" value={data.slug||''} readOnly disabled
            className="w-full p-2 border border-blue-900 bg-gray-100 rounded-md text-gray-400 cursor-not-allowed" />
          <select name="id_tipe_properti" value={data.id_tipe_properti||''} onChange={handleBaseChange}
            className="w-full p-2 border border-blue-900 rounded-md text-blue-900">
            <option value="">Tipe Properti</option>
            <option value="1">Rumah</option>
            <option value="2">Apartemen</option>
            <option value="3">Gedung</option>
            <option value="4">Tanah</option>
            <option value="5">Ruko</option>
            <option value="6">Lainnya</option>
          </select>
        </div>

        <textarea name="deskripsi" rows={3} value={data.deskripsi||''} onChange={handleBaseChange}
          placeholder="Deskripsi" className="w-full p-2 border border-blue-900 rounded-md text-blue-900" />
        <div className="grid md:grid-cols-2 gap-4">
          <textarea name="deskripsi_en" rows={2} value={data.deskripsi_en||''} onChange={handleBaseChange}
            placeholder="Deskripsi (EN)" className="w-full p-2 border border-blue-900 rounded-md text-blue-900" />
          <textarea name="deskripsi_ai" rows={2} value={data.deskripsi_ai||''} onChange={handleBaseChange}
            placeholder="Deskripsi AI" className="w-full p-2 border border-blue-900 rounded-md text-blue-900" />
        </div>

        {/* Dynamic detail */}
        {renderFormDetail()}

        {/* Continue base fields */}
        <div className="grid md:grid-cols-4 gap-4">
          <input name="harga" type="number" value={data.harga||''} onChange={handleBaseChange}
            placeholder="Harga" className="p-2 border border-blue-900 rounded-md text-blue-900" />
          <label className="flex items-center gap-2 text-blue-900">
            <input name="harga_nego" type="checkbox" checked={data.harga_nego===1} onChange={handleBaseChange} /> Harga Nego
          </label>
          <input name="dp_minimal" type="number" value={data.dp_minimal||''} onChange={handleBaseChange}
            placeholder="DP Minimal" className="p-2 border border-blue-900 rounded-md text-blue-900" />
          <input name="estimasi_angsuran" type="number" value={data.estimasi_angsuran||''} onChange={handleBaseChange}
            placeholder="Estimasi Angsuran" className="p-2 border border-blue-900 rounded-md text-blue-900" />
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <input name="id_provinsi" type="number" value={data.id_provinsi||''} onChange={handleBaseChange}
            placeholder="ID Provinsi" className="p-2 border border-blue-900 rounded-md text-blue-900" />
          <input name="id_kota" type="number" value={data.id_kota||''} onChange={handleBaseChange}
            placeholder="ID Kota" className="p-2 border border-blue-900 rounded-md text-blue-900" />
          <input name="id_kecamatan" type="number" value={data.id_kecamatan||''} onChange={handleBaseChange}
            placeholder="ID Kecamatan" className="p-2 border border-blue-900 rounded-md text-blue-900" />
          <input name="id_kelurahan" type="number" value={data.id_kelurahan||''} onChange={handleBaseChange}
            placeholder="ID Kelurahan" className="p-2 border border-blue-900 rounded-md text-blue-900" />
        </div>

        <textarea name="alamat_lengkap" rows={2} value={data.alamat_lengkap||''} onChange={handleBaseChange}
          placeholder="Alamat Lengkap" className="w-full p-2 border border-blue-900 rounded-md text-blue-900" />

        <div className="grid md:grid-cols-2 gap-4">
          <input name="kode_pos" type="text" value={data.kode_pos||''} onChange={handleBaseChange}
            placeholder="Kode Pos" className="p-2 border border-blue-900 rounded-md text-blue-900" />
          <input name="koordinat" type="text" value={data.koordinat||''} onChange={handleBaseChange}
            placeholder="Koordinat" className="p-2 border border-blue-900 rounded-md text-blue-900" />
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <select name="status" value={data.status||''} onChange={handleBaseChange}
            className="p-2 border border-blue-900 rounded-md text-blue-900">
            <option value="aktif">Aktif</option>
            <option value="nonaktif">Nonaktif</option>
          </select>
          <select name="status_hunian" value={data.status_hunian||''} onChange={handleBaseChange}
            className="p-2 border border-blue-900 rounded-md text-blue-900">
            <option value="draf">Draf</option>
            <option value="menunggu">Menunggu</option>
            <option value="aktif">Aktif</option>
            <option value="ditangguhkan">Ditangguhkan</option>
            <option value="terjual">Terjual</option>
          </select>
          <label className="flex items-center gap-2 text-blue-900">
            <input name="verified" type="checkbox" checked={data.verified===1} onChange={handleBaseChange} /> Verified
          </label>
          <label className="flex items-center gap-2 text-blue-900">
            <input name="highlight" type="checkbox" checked={data.highlight===1} onChange={handleBaseChange} /> Highlight
          </label>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <input name="nama_proyek" type="text" value={data.nama_proyek||''} onChange={handleBaseChange}
            placeholder="Nama Proyek" className="p-2 border border-blue-900 rounded-md text-blue-900" />
          <input name="nama_developer" type="text" value={data.nama_developer||''} onChange={handleBaseChange}
            placeholder="Nama Developer" className="p-2 border border-blue-900 rounded-md text-blue-900" />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <input name="video_link" type="text" value={data.video_link||''} onChange={handleBaseChange}
            placeholder="Video Link" className="p-2 border border-blue-900 rounded-md text-blue-900" />
          <input name="link_virtual_tour" type="text" value={data.link_virtual_tour||''} onChange={handleBaseChange}
            placeholder="Virtual Tour" className="p-2 border border-blue-900 rounded-md text-blue-900" />
        </div>
        <textarea name="catatan_internal" rows={2} value={data.catatan_internal||''} onChange={handleBaseChange}
          placeholder="Catatan Internal" className="w-full p-2 border border-blue-900 rounded-md text-blue-900" />

        {/* Submit */}
        <div className="pt-6 text-right">
          <button type="submit" disabled={saving}
            className="inline-flex items-center gap-2 bg-blue-900 hover:bg-blue-950 text-white px-6 py-3 rounded-lg shadow transition disabled:opacity-50">
            {saving && <Loader2 className="w-5 h-5 animate-spin" />}
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  )
}
