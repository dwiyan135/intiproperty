'use client'

import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { Pencil, Trash2, Loader2 } from 'lucide-react'

interface Kota {
  id: number
  nama: string
  slug: string
  id_provinsi: number
  nama_provinsi: string
}

interface Provinsi {
  id: number
  nama: string
}

export default function AdminKotaPage() {
  const [kotas, setKotas] = useState<Kota[]>([])
  const [provinsiList, setProvinsiList] = useState<Provinsi[]>([])

  const [nama, setNama] = useState('')
  const [idProvinsi, setIdProvinsi] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchKota = async () => {
    const res = await fetch('/api/lokasi/kota')
    const data = await res.json()
    setKotas(data.kota || [])
  }

  const fetchProvinsi = async () => {
    const res = await fetch('/api/lokasi/provinsi')
    const data = await res.json()
    setProvinsiList(data.provinsi || [])
  }

  useEffect(() => {
    fetchKota()
    fetchProvinsi()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const method = editingId ? 'PUT' : 'POST'
    const endpoint = editingId ? `/api/lokasi/kota/${editingId}` : '/api/lokasi/kota'
    const res = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nama, id_provinsi: idProvinsi })
    })

    if (res.ok) {
      toast.success(editingId ? 'Kota diperbarui' : 'Kota ditambahkan')
      setNama('')
      setIdProvinsi('')
      setEditingId(null)
      fetchKota()
    } else {
      toast.error('Gagal menyimpan data kota')
    }

    setLoading(false)
  }

  const handleEdit = (kota: Kota) => {
    setNama(kota.nama)
    setIdProvinsi(kota.id_provinsi.toString())
    setEditingId(kota.id)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus kota ini?')) return
    const res = await fetch(`/api/lokasi/kota/${id}`, { method: 'DELETE' })
    if (res.ok) {
      toast.success('Kota dihapus')
      fetchKota()
    } else {
      toast.error('Gagal menghapus kota')
    }
  }

  return (
    <main className="max-w-4xl mx-auto p-4 text-blue-900">
      <h1 className="text-2xl font-semibold mb-6">Manajemen Kota/Kabupaten</h1>

      {/* Form Tambah / Edit */}
      <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-4 mb-6">
        <select
          value={idProvinsi}
          onChange={e => setIdProvinsi(e.target.value)}
          className="border p-2 rounded"
          required
        >
          <option value="">Pilih Provinsi</option>
          {provinsiList.map((p) => (
            <option key={p.id} value={p.id}>{p.nama}</option>
          ))}
        </select>
        <input
          type="text"
          value={nama}
          onChange={e => setNama(e.target.value)}
          placeholder="Nama kota/kabupaten"
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

      {/* Tabel Daftar Kota */}
      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-blue-100">
            <th className="p-2 text-left">Nama Kota</th>
            <th className="p-2 text-left">Provinsi</th>
            <th className="p-2 text-left">Slug</th>
            <th className="p-2 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {kotas.length === 0 ? (
            <tr>
              <td colSpan={4} className="p-4 text-center text-gray-500">Belum ada data kota</td>
            </tr>
          ) : (
            kotas.map((k) => (
              <tr key={k.id} className="border-t">
                <td className="p-2">{k.nama}</td>
                <td className="p-2">{k.nama_provinsi}</td>
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
