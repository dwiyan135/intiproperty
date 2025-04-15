// File: src/app/admin/pengguna/components/ModalHapusPengguna.tsx
'use client'

interface Props {
  data: any
  onClose: () => void
  onSukses: () => void
}

export default function ModalHapusPengguna({ data, onClose, onSukses }: Props) {
  const handleHapus = async () => {
    try {
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
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md">
        <h2 className="text-xl font-bold text-blue-900 mb-4">Hapus Pengguna</h2>
        <p className="text-blue-900">Apakah kamu yakin ingin menghapus pengguna <strong>{data.nama_pengguna}</strong>?</p>

        <div className="flex justify-end space-x-2 pt-6">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
          >
            Batal
          </button>
          <button
            onClick={handleHapus}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  )
}
