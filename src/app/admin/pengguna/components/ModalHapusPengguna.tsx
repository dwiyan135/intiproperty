'use client'

import { useState } from 'react'

interface Props {
  data: any
  onClose: () => void
  onSukses: () => void
}

export default function ModalHapusPengguna({ data, onClose, onSukses }: Props) {
  const [loading, setLoading] = useState(false)

  const handleHapus = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/pengguna', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: data.id })
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.message)
      onSukses()
    } catch (error) {
      alert('Gagal menghapus pengguna')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
        <h2 className="text-2xl font-semibold text-red-600 text-center mb-4">
          Konfirmasi Penghapusan
        </h2>
        <p className="text-gray-800 mb-4 text-center">
          Apakah Anda yakin ingin menghapus pengguna{' '}
          <span className="font-bold text-red-600">{data.nama_pengguna}</span>?
        </p>
        <p className="text-gray-600 text-sm text-center mb-6">
          Tindakan ini tidak dapat dibatalkan. Data pengguna akan dihapus secara
          permanen dari sistem.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-200 ease-in-out"
          >
            Batal
          </button>
          <button
            onClick={handleHapus}
            disabled={loading}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 ease-in-out"
          >
            {loading ? 'Menghapus...' : 'Hapus'}
          </button>
        </div>
      </div>
    </div>
  )
}
