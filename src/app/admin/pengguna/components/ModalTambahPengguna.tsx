'use client'

import { useState } from 'react'

interface Props {
  onClose: () => void
  onSukses: () => void
}

export default function ModalTambahPengguna({ onClose, onSukses }: Props) {
  const [form, setForm] = useState<{
    nama_pengguna: string
    email: string
    nomor_telepon: string
    jenis_akun: string
    kata_sandi: string
    paket_membership: string
    tanggal_berakhir_membership: string
    id_agensi?: string
    // untuk menyimpan file yang diunggah
    foto_profil?: File | null
  }>({
    nama_pengguna: '',
    email: '',
    nomor_telepon: '',
    jenis_akun: 'pembeli',
    kata_sandi: '',
    paket_membership: 'Freemium',
    tanggal_berakhir_membership: '',
    id_agensi: ''
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, foto_profil: e.target.files[0] })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Gunakan FormData untuk mengirim file beserta field-field lainnya
      const formData = new FormData()
      formData.append('nama_pengguna', form.nama_pengguna)
      formData.append('email', form.email)
      formData.append('kata_sandi', form.kata_sandi)
      formData.append('nomor_telepon', form.nomor_telepon)
      formData.append('jenis_akun', form.jenis_akun)
      formData.append('paket_membership', form.paket_membership)
      formData.append('tanggal_berakhir_membership', form.tanggal_berakhir_membership)
      formData.append('id_agensi', form.id_agensi || '')
      // Jika foto_profil diunggah, masukkan file-nya
      if (form.foto_profil) {
        formData.append('foto_profil', form.foto_profil)
      }

      // Jangan set header Content-Type, browser akan melakukannya otomatis
      const res = await fetch('/api/pengguna', {
        method: 'POST',
        body: formData
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      onSukses()
    } catch (err: any) {
      setError(err.message || 'Gagal menambah pengguna')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md">
        <h2 className="text-xl font-bold text-blue-900 mb-4">Tambah Pengguna</h2>
        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="nama_pengguna"
            placeholder="Nama Pengguna"
            value={form.nama_pengguna}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-blue-900"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-blue-900"
            required
          />
          <input
            name="kata_sandi"
            type="password"
            placeholder="Kata Sandi"
            value={form.kata_sandi}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-blue-900"
            required
          />
          <input
            name="nomor_telepon"
            placeholder="Nomor Telepon"
            value={form.nomor_telepon}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-blue-900"
          />
          {/* Input untuk file foto_profil */}
          <input
            name="foto_profil"
            type="file"
            accept="image/jpeg, image/png, image/webp, image/jpg"
            onChange={handleFileChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-blue-900"
          />
          <select
            name="jenis_akun"
            value={form.jenis_akun}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-blue-900"
          >
            <option value="pembeli">Pembeli</option>
            <option value="agen">Agen</option>
            <option value="agensi">Agensi</option>
            <option value="pemilik">Pemilik</option>
            <option value="admin">Admin</option>
          </select>
          <input
            name="id_agensi"
            type="number"
            placeholder="ID Agensi (Opsional)"
            value={form.id_agensi}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-blue-900"
          />
          <input
            name="paket_membership"
            placeholder="Paket Membership"
            value={form.paket_membership}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-blue-900"
            required
          />
          <input
            name="tanggal_berakhir_membership"
            type="date"
            value={form.tanggal_berakhir_membership}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-blue-900"
          />
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800"
            >
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
