// File: src/app/admin/pengguna/components/ModalEditPengguna.tsx
'use client'

import { useState } from 'react'

interface Props {
  data: any
  onClose: () => void
  onSukses: () => void
}

export default function ModalEditPengguna({ data, onClose, onSukses }: Props) {
  const [form, setForm] = useState({
    id: data.id,
    nama_pengguna: data.nama_pengguna,
    email: data.email,
    nomor_telepon: data.nomor_telepon || '',
    jenis_akun: data.jenis_akun,
    kata_sandi: '' // opsional update
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/pengguna', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      onSukses()
    } catch (err: any) {
      setError(err.message || 'Gagal update pengguna')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md">
        <h2 className="text-xl font-bold text-blue-900 mb-4">Edit Pengguna</h2>
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
            name="nomor_telepon"
            placeholder="Nomor Telepon"
            value={form.nomor_telepon}
            onChange={handleChange}
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
            name="kata_sandi"
            type="password"
            placeholder="Kata Sandi Baru (opsional)"
            value={form.kata_sandi}
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
              {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
