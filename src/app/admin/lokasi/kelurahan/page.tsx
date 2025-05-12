'use client'

import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { Pencil, Trash2, Loader2 } from 'lucide-react'

interface Kelurahan {
  id: number
  nama: string
  slug: string
  id_kecamatan: number
  nama_kecamatan: string
}

interface Kecamatan {
  id: number
  nama: string
}

export default function AdminKelurahanPage() {
  const [kelurahans, setKelurahans] = useState<Kelurahan[]>([])
  const [kecamatanList, setKecamatanList] = useState<Kecamatan[]>([])

  const [nama, setNama] = useState('')
  const [idKecamatan, setIdKecamatan] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchKelurahan = async () => {
    const res = await fetch('/api/lokasi/kelurahan')
    const data = await res.json()
    setKelurahans(data.kelurahan || [])
  }

  const fetchKecamatan = async () => {
    const res = await fetch('/api/lokasi/kecamatan')
    const data = await res.json()
    setKecamatanList(data.kecamatan || [])
  }

  useEffect(() => {
    fetchKelurahan()
    fetchKecamatan()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const method = editingId ? 'PUT' : 'POST'
    const endpoint = editingId ? `/api/lokasi/kelurahan/${editingId}` : '/api/lokasi/kelurahan'
    const res = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nama, id_kecamatan: idKecamatan })
    })

    if (res.ok) {
      toast.success(editingId ? 'Kelurahan diperbarui' : 'Kelurahan ditambahkan')
      setNama('')
      setIdKecamatan('')
      setEditingId(null)
      fetchKelurahan()
    } else {
      toast.error('Gagal menyimpan kelurahan')
    }

    setLoading(false)
  }

  const handleEdit = (kel: Kelurahan) => {
    setNama(kel.nama)
    setIdKecamatan(kel.id_kecamatan.toString())
    setEditingId(kel.id)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus kelurahan ini?')) return
    const res = await fetch(`/api/lokasi/kelurahan/${id}`, { method: 'DELETE' })
    if (res.ok) {
      toast.success('Kelurahan dihapus')
      fetchKelurahan()
    } else {
      toast.error('Gagal menghapus kelurahan')
    }
  }

  return (
    <main className="max-w-4xl mx-auto p-4 text-blue-900">
      <h1 className="text-2xl font-semibold mb-6">Manajemen Kelurahan</h1>

      {/* Form Tambah / Edit */}
      <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-4 mb-6">
        <select
          value={idKecamatan}
          onChange={e => setIdKecamatan(e.target.value)}
          className="border p-2 rounded"
          required
        >
          <option value="">Pilih Kecamatan</option>
          {kecamatanList.map((k) => (
            <option key={k.id} value={k.id}>{k.nama}</option>
          ))}
        </select>
        <input
          type="text"
          value={nama}
          onChange={e => setNama(e.target.value)}
          placeholder="Nama kelurahan"
          className="border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-900 text-white rounded px-4 py-2 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin w-4 h-4" /> : editingId ? 'Update' : 'Tambah'}
        </button>
      </form>

      {/* Tabel Daftar Kelurahan */}
      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-blue-100">
            <th className="p-2 text-left">Nama Kelurahan</th>
            <th className="p-2 text-left">Kecamatan</th>
            <th className="p-2 text-left">Slug</th>
            <th className="p-2 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {kelurahans.length === 0 ? (
            <tr>
              <td colSpan={4} className="p-4 text-center text-gray-500">Belum ada data kelurahan</td>
            </tr>
          ) : (
            kelurahans.map((k) => (
              <tr key={k.id} className="border-t">
                <td className="p-2">{k.nama}</td>
                <td className="p-2">{k.nama_kecamatan}</td>
                <td className="p-2">{k.slug}</td>
                <td className="p-2 text-center space-x-2">
                  <button onClick={() => handleEdit(k)} className="text-blue-700">
                    <Pencil className="inline w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(k.id)} className="text-red-600">
                    <Trash2 className="inline w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </main>
  )
}
