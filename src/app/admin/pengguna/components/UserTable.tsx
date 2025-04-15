// File: src/app/admin/pengguna/components/UserTable.tsx
'use client'

import { useEffect, useState } from 'react'
import ModalTambahPengguna from './ModalTambahPengguna'
import ModalEditPengguna from './ModalEditPengguna'
import ModalHapusPengguna from './ModalHapusPengguna'
import { toast } from 'react-hot-toast'

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
const isValidPhone = (phone: string) => /^\d+$/.test(phone)

export default function UserTable() {
  const [pengguna, setPengguna] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [query, setQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [showTambah, setShowTambah] = useState(false)
  const [editData, setEditData] = useState<any | null>(null)
  const [hapusData, setHapusData] = useState<any | null>(null)

  const fetchData = async () => {
    try {
      const res = await fetch('/api/pengguna')
      const data = await res.json()
      setPengguna(data.pengguna || [])
      setFiltered(data.pengguna || [])
    } catch (error) {
      toast.error('Gagal mengambil data pengguna')
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    const q = query.toLowerCase()
    setFiltered(
      pengguna.filter((p) =>
        p.nama_pengguna.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.jenis_akun.toLowerCase().includes(q)
      )
    )
    setCurrentPage(1)
  }, [query, pengguna])

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filtered.length / itemsPerPage)

  return (
    <div className="overflow-x-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <button
          className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800"
          onClick={() => setShowTambah(true)}
        >
          + Tambah Pengguna
        </button>

        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Cari nama, email, atau jenis akun..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-blue-900 rounded-lg text-blue-900 placeholder:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-900 shadow-sm"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-blue-900 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
          </svg>
        </div>
      </div>

      <table className="min-w-full bg-white border">
        <thead className="bg-gray-100">
          <tr className="text-blue-900">
            <th className="py-2 px-4 border">ID</th>
            <th className="py-2 px-4 border">Nama</th>
            <th className="py-2 px-4 border">Email</th>
            <th className="py-2 px-4 border">Telepon</th>
            <th className="py-2 px-4 border">Jenis Akun</th>
            <th className="py-2 px-4 border">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((p) => (
            <tr key={p.id} className="text-sm text-blue-900">
              <td className="py-1 px-3 border">{p.id}</td>
              <td className="py-1 px-3 border">{p.nama_pengguna}</td>
              <td className="py-1 px-3 border">{p.email}</td>
              <td className="py-1 px-3 border">{p.nomor_telepon || '-'}</td>
              <td className="py-1 px-3 border">{p.jenis_akun}</td>
              <td className="py-1 px-3 border space-x-2">
                <button
                  className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded"
                  onClick={() => setEditData(p)}
                >Edit</button>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                  onClick={() => setHapusData(p)}
                >Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-center items-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 rounded border ${page === currentPage ? 'bg-blue-900 text-white' : 'bg-white text-blue-900 border-blue-900'}`}
          >
            {page}
          </button>
        ))}
      </div>

      {showTambah && (
        <ModalTambahPengguna
          onClose={() => setShowTambah(false)}
          onSukses={() => {
            fetchData()
            setShowTambah(false)
            toast.success('Pengguna berhasil ditambahkan')
          }}
        />
      )}

      {editData && (
        <ModalEditPengguna
          data={editData}
          onClose={() => setEditData(null)}
          onSukses={() => {
            fetchData()
            setEditData(null)
            toast.success('Pengguna berhasil diperbarui')
          }}
        />
      )}

      {hapusData && (
        <ModalHapusPengguna
          data={hapusData}
          onClose={() => setHapusData(null)}
          onSukses={() => {
            fetchData()
            setHapusData(null)
            toast.success('Pengguna berhasil dihapus')
          }}
        />
      )}
    </div>
  )
}
4