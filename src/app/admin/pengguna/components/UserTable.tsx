'use client'

import { useEffect, useState } from 'react'
import ModalTambahPengguna from './ModalTambahPengguna'
import ModalEditPengguna from './ModalEditPengguna'
import ModalHapusPengguna from './ModalHapusPengguna'
import ModalDetailPengguna from './ModalDetailPengguna'
import { toast } from 'react-hot-toast'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Download, FileText } from 'lucide-react'

export default function UserTable() {
  const [pengguna, setPengguna] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [query, setQuery] = useState('')
  const [filterAkun, setFilterAkun] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [sortBy, setSortBy] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [showTambah, setShowTambah] = useState(false)
  const [editData, setEditData] = useState<any | null>(null)
  const [hapusData, setHapusData] = useState<any | null>(null)
  const [detailData, setDetailData] = useState<any | null>(null)

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
        (filterAkun ? p.jenis_akun === filterAkun : true) &&
        (
          p.nama_pengguna.toLowerCase().includes(q) ||
          p.email.toLowerCase().includes(q) ||
          p.jenis_akun.toLowerCase().includes(q)
        )
      )
    )
    setCurrentPage(1)
  }, [query, pengguna, filterAkun])

  const handleSort = (key: string) => {
    // Jika kolom tidak terkait dengan data (misal: Foto Profil), jangan lakukan sorting.
    if (key === 'foto_profil') return

    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(key)
      setSortOrder('asc')
    }
  }

  const sortedData = [...filtered].sort((a, b) => {
    if (!sortBy) return 0
    const valA = a[sortBy]?.toString().toLowerCase()
    const valB = b[sortBy]?.toString().toLowerCase()
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1
    return 0
  })

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filtered.length / itemsPerPage)

  const exportToPDF = () => {
    const doc = new jsPDF()
    const tableColumn = [
      "ID",
      "Foto Profil",
      "Nama",
      "Email",
      "Telepon",
      "Jenis Akun",
      "Membership",
      "Berakhir",
      "Dibuat",
      "Update",
      "Status"
    ]
    const tableRows = filtered.map((p) => [
      p.id,
      p.foto_profil || '-', // menampilkan URL foto atau tanda -
      p.nama_pengguna,
      p.email,
      p.nomor_telepon || '-',
      p.jenis_akun,
      p.paket_membership,
      p.tanggal_berakhir_membership ? new Date(p.tanggal_berakhir_membership).toLocaleDateString() : '-',
      p.dibuat_pada ? new Date(p.dibuat_pada).toLocaleDateString() : '-',
      p.diperbarui_pada ? new Date(p.diperbarui_pada).toLocaleDateString() : '-',
      p.status_akun
    ])
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      margin: { top: 20 }
    })
    doc.save("pengguna.pdf")
  }

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filtered)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Pengguna')
    XLSX.writeFile(workbook, 'pengguna.xlsx')
  }

  // Daftar header yang baru: menambahkan "Foto Profil" setelah "ID"
  const headers = ["ID", "Foto Profil", "Nama", "Email", "Telepon", "Jenis Akun", "Membership", "Berakhir", "Dibuat", "Update", "Status"]

  return (
    <div className="overflow-x-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <div className="flex gap-2 flex-wrap">
          <button
            className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800"
            onClick={() => setShowTambah(true)}
          >
            + Tambah Pengguna
          </button>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
            onClick={exportToExcel}
          >
            <Download className="w-4 h-4" />
            <FileText className="w-4 h-4" />
            Excel
          </button>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center gap-2"
            onClick={exportToPDF}
          >
            <FileText className="w-4 h-4" /> PDF
          </button>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <select
            value={filterAkun}
            onChange={(e) => setFilterAkun(e.target.value)}
            className="px-3 py-2 border border-blue-900 text-blue-900 rounded w-full sm:w-auto"
          >
            <option value="">Semua Akun</option>
            {["admin", "agensi", "agen", "pemilik", "pembeli"].map((jenis) => (
              <option key={jenis} value={jenis}>
                {jenis.charAt(0).toUpperCase() + jenis.slice(1)}
              </option>
            ))}
          </select>
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
      </div>

      <table className="min-w-full bg-white border">
        <thead className="bg-gray-100">
          <tr className="text-blue-900">
            {headers.map((label, index) => {
              // Hanya aktifkan sorting untuk kolom yang memiliki key pada data (kosongkan untuk Foto Profil)
              const key = label.toLowerCase().replace(/ /g, '_')
              return (
                <th
                  key={index}
                  className="py-2 px-4 border cursor-pointer select-none"
                  onClick={() => handleSort(key)}
                >
                  {label} {sortBy === key && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
              )
            })}
            <th className="py-2 px-4 border">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((p) => (
            <tr key={p.id} className="text-sm text-blue-900">
              <td className="py-1 px-3 border">{p.id}</td>
              <td className="py-1 px-3 border">
                {p.foto_profil ? (
                  <img src={p.foto_profil} alt="Profil" className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  '-'
                )}
              </td>
              <td className="py-1 px-3 border">{p.nama_pengguna}</td>
              <td className="py-1 px-3 border">{p.email}</td>
              <td className="py-1 px-3 border">{p.nomor_telepon || '-'}</td>
              <td className="py-1 px-3 border">{p.jenis_akun}</td>
              <td className="py-1 px-3 border">{p.paket_membership}</td>
              <td className="py-1 px-3 border">
                {p.tanggal_berakhir_membership
                  ? new Date(p.tanggal_berakhir_membership).toLocaleDateString()
                  : '-'}
              </td>
              <td className="py-1 px-3 border">
                {p.dibuat_pada ? new Date(p.dibuat_pada).toLocaleDateString() : '-'}
              </td>
              <td className="py-1 px-3 border">
                {p.diperbarui_pada ? new Date(p.diperbarui_pada).toLocaleDateString() : '-'}
              </td>
              <td className="py-1 px-3 border">{p.status_akun}</td>
              <td className="py-1 px-3 border space-y-1 flex flex-col">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
                  onClick={() => setDetailData(p)}
                >
                  Detail
                </button>
                <button
                  className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded"
                  onClick={() => setEditData(p)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                  onClick={() => setHapusData(p)}
                >
                  Hapus
                </button>
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
            className={`px-3 py-1 rounded border ${
              page === currentPage ? 'bg-blue-900 text-white' : 'bg-white text-blue-900 border-blue-900'
            }`}
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

      {detailData && (
        <ModalDetailPengguna data={detailData} onClose={() => setDetailData(null)} />
      )}
    </div>
  )
}
