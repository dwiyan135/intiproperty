'use client'

import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { Pencil, Trash2, Loader2 } from 'lucide-react'

interface Kecamatan {
  id: number
  nama: string
  slug: string
  id_kota: number
  nama_kota: string
}

interface Kota {
  id: number
  nama: string
}

export default function AdminKecamatanPage() {
  const [kecamatans, setKecamatans] = useState<Kecamatan[]>([])
  const [kotaList, setKotaList] = useState<Kota[]>([])

  const [nama, setNama] = useState('')
  const [idKota, setIdKota] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchKecamatan = async () => {
    const res = await fetch('/api/lokasi/kecamatan')
    const data = await res.json()
    setKecamatans(data.kecamatan || [])
  }

  const fetchKota = async () => {
    const res = await fetch('/api/lokasi/kota')
    const data = await res.json()
    setKotaList(data.kota || [])
  }

  useEffect(() => {
    fetchKecamatan()
    fetchKota()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const method = editingId ? 'PUT' : 'POST'
    const endpoint = editingId ? `/api/lokasi/kecamatan/${editingId}` : '/api/lokasi/kecamatan'
    const res = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nama, id_kota: idKota })
    })

    if (res.ok) {
      toast.success(editingId ? 'Kecamatan diperbarui' : 'Kecamatan ditambahkan')
      setNama('')
      setIdKota('')
      setEditingId(null)
      fetchKecamatan()
    } else {
      toast.error('Gagal menyimpan kecamatan')
    }

    setLoading(false)
  }

  const handleEdit = (item: Kecamatan) => {
    setNama(item.nama)
    setIdKota(item.id_kota.toString())
    setEditingId(item.id)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus kecamatan ini?')) return
    const res = await fetch(`/api/lokasi/kecamatan/${id}`, { method: 'DELETE' })
    if (res.ok) {
      toast.success('Kecamatan dihapus')
      fetchKecamatan()
    } else {
      toast.error('Gagal menghapus kecamatan')
    }
  }

  return (
    <main className="max-w-4xl mx-auto p-4 text-blue-900">
      <h1 className="text-2xl font-semibold mb-6">Manajemen Kecamatan</h1>

      {/* Form Tambah / Edit */}
      <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-4 mb-6">
        <select
          value={idKota}
          onChange={e => setIdKota(e.target.value)}
          className="border p-2 rounded"
          required
        >
          <option value="">Pilih Kota/Kabupaten</option>
          {kotaList.map((k) => (
            <option key={k.id} value={k.id}>{k.nama}</option>
          ))}
        </select>
        <input
          type="text"
          value={nama}
          onChange={e => setNama(e.target.value)}
          placeholder="Nama kecamatan"
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

      {/* Tabel Daftar Kecamatan */}
      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-blue-100">
            <th className="p-2 text-left">Nama Kecamatan</th>
            <th className="p-2 text-left">Kota/Kabupaten</th>
            <th className="p-2 text-left">Slug</th>
            <th className="p-2 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {kecamatans.length === 0 ? (
            <tr>
              <td colSpan={4} className="p-4 text-center text-gray-500">Belum ada data kecamatan</td>
            </tr>
          ) : (
            kecamatans.map((k) => (
              <tr key={k.id} className="border-t">
                <td className="p-2">{k.nama}</td>
                <td className="p-2">{k.nama_kota}</td>
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
