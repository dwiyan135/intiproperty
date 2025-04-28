'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Pencil, Trash2, Copy, Eye } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface Properti {
  id: number
  judul: string
  harga: number
  slug: string
  status: string
  highlight: number
  verified: number
  tanggal_mulai: string
  foto_utama: string | null
}

export default function AdminPropertiPage() {
  const [propertis, setPropertis] = useState<Properti[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/properti')
      .then(res => res.json())
      .then(data => {
        setPropertis(data)
        setLoading(false)
      })
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus properti ini?')) return
    const res = await fetch(`/api/properti/${id}`, { method: 'DELETE' })
    if (res.ok) {
      toast.success('Properti berhasil dihapus')
      setPropertis(prev => prev.filter(p => p.id !== id))
    } else {
      toast.error('Gagal menghapus properti')
    }
  }

  const handleDuplicate = async (id: number) => {
    const res = await fetch(`/api/properti/duplicate/${id}`, { method: 'POST' })
    if (res.ok) {
      toast.success('Duplikat berhasil')
      location.reload()
    } else {
      toast.error('Gagal menduplikat')
    }
  }

  const handleStatusChange = async (id: number, status: string) => {
    const res = await fetch(`/api/properti/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })

    if (res.ok) {
      toast.success('Status berhasil diubah')
      setPropertis(prev =>
        prev.map(p => (p.id === id ? { ...p, status } : p))
      )
    } else {
      toast.error('Gagal mengubah status')
    }
  }

  if (loading) return <div className="p-4 text-blue-900">Memuat data properti...</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-6 text-blue-900">Manajemen Properti</h1>
      <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table className="min-w-full text-sm bg-white">
          <thead className="bg-gray-50 text-blue-900 font-semibold border-b">
            <tr>
              <th className="p-3 text-left">Foto</th>
              <th className="p-3 text-left">Judul</th>
              <th className="p-3 text-left">Harga</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Unggulan</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {propertis.map((p) => (
              <tr key={p.id} className="border-t hover:bg-blue-50/30 transition">
                <td className="p-3">
                  {p.foto_utama ? (
                    <Image
                      src={p.foto_utama}
                      alt="Foto Utama"
                      width={60}
                      height={40}
                      className="object-cover rounded shadow-sm"
                    />
                  ) : (
                    <div className="w-[60px] h-[40px] bg-gray-200 flex items-center justify-center text-xs text-gray-500 rounded">
                      No Image
                    </div>
                  )}
                </td>
                <td className="p-3 text-blue-900 font-medium">{p.judul}</td>
                <td className="p-3 text-blue-900">Rp {p.harga.toLocaleString('id-ID')}</td>
                <td className="p-3">
                  <select
                    value={p.status}
                    onChange={e => handleStatusChange(p.id, e.target.value)}
                    className="border rounded p-1 text-xs text-blue-900"
                  >
                    <option value="draf">Draf</option>
                    <option value="menunggu">Menunggu</option>
                    <option value="aktif">Aktif</option>
                    <option value="ditangguhkan">Ditangguhkan</option>
                    <option value="terjual">Terjual</option>
                  </select>
                </td>
                <td className="p-3 text-center text-blue-900">{p.highlight ? '✅' : '-'}</td>
                <td className="p-3 space-x-2 text-center">
                  <Link href={`/admin/properti/edit/${p.id}`}>
                    <Pencil className="inline w-4 h-4 text-blue-700 hover:scale-110 transition-transform" />
                  </Link>
                  <button onClick={() => handleDelete(p.id)}>
                    <Trash2 className="inline w-4 h-4 text-red-600 hover:scale-110 transition-transform" />
                  </button>
                  <button onClick={() => handleDuplicate(p.id)}>
                    <Copy className="inline w-4 h-4 text-green-600 hover:scale-110 transition-transform" />
                  </button>
                  <Link href={`/properti/${p.slug}`} target="_blank">
                    <Eye className="inline w-4 h-4 text-gray-600 hover:scale-110 transition-transform" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
