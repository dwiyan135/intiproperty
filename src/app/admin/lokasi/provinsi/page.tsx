'use client'

import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { Trash2, Pencil, Loader2 } from 'lucide-react'

interface Provinsi {
  id: number
  nama: string
  slug: string
}

export default function AdminProvinsiPage() {
  const [provinsi, setProvinsi] = useState<Provinsi[]>([])
  const [nama, setNama] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchProvinsi = async () => {
    const res = await fetch('/api/lokasi/provinsi')
    const data = await res.json()
    setProvinsi(data.provinsi || [])
  }

  useEffect(() => {
    fetchProvinsi()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const method = editingId ? 'PUT' : 'POST'
    const endpoint = editingId ? `/api/lokasi/provinsi/${editingId}` : '/api/lokasi/provinsi'
    const res = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nama })
    })

    if (res.ok) {
      toast.success(editingId ? 'Berhasil diperbarui' : 'Provinsi ditambahkan')
      setNama('')
      setEditingId(null)
      fetchProvinsi()
    } else {
      toast.error('Gagal menyimpan data')
    }
    setLoading(false)
  }

  const handleEdit = (prov: Provinsi) => {
    setNama(prov.nama)
    setEditingId(prov.id)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus provinsi ini?')) return
    const res = await fetch(`/api/lokasi/provinsi/${id}`, { method: 'DELETE' })
    if (res.ok) {
      toast.success('Provinsi dihapus')
      fetchProvinsi()
    } else {
      toast.error('Gagal menghapus')
    }
  }

  return (
    <main className="max-w-3xl mx-auto p-4 text-blue-900">
      <h1 className="text-2xl font-semibold mb-6">Manajemen Provinsi</h1>

      {/* Form Tambah / Edit */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          type="text"
          value={nama}
          onChange={e => setNama(e.target.value)}
          placeholder="Nama provinsi"
          className="flex-1 border border-blue-900 p-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-900 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin w-4 h-4" /> : editingId ? 'Update' : 'Tambah'}
        </button>
      </form>

      {/* Tabel Daftar Provinsi */}
      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-blue-100">
            <th className="p-2 text-left">Nama</th>
            <th className="p-2 text-left">Slug</th>
            <th className="p-2 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {provinsi.length === 0 ? (
            <tr>
              <td colSpan={3} className="p-4 text-center text-gray-500">
                Belum ada data provinsi
              </td>
            </tr>
          ) : (
            provinsi.map(p => (
              <tr key={p.id} className="border-t">
                <td className="p-2">{p.nama}</td>
                <td className="p-2">{p.slug}</td>
                <td className="p-2 text-center space-x-2">
                  <button onClick={() => handleEdit(p)} className="text-blue-700">
                    <Pencil className="inline w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-600">
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
