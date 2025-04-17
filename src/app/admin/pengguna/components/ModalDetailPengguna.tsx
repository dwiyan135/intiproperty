'use client'

interface Props {
  data: any
  onClose: () => void
}

export default function ModalDetailPengguna({ data, onClose }: Props) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-8">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b pb-4 mb-6">
          <h2 className="text-2xl font-bold text-blue-900">Detail Pengguna</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition text-3xl">&times;</button>
        </div>

        {/* Konten Detail */}
        <div className="space-y-6">
          {/* Foto Profil jika ada */}
          {data.foto_profil && (
            <div className="flex justify-center">
              <img
                src={data.foto_profil}
                alt="Foto Profil"
                className="w-32 h-32 object-cover rounded-full border"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="font-semibold text-blue-800">ID:</p>
              <p className="text-blue-900">{data.id}</p>
            </div>
            {data.id_agensi && (
              <div>
                <p className="font-semibold text-blue-800">ID Agensi:</p>
                <p className="text-blue-900">{data.id_agensi}</p>
              </div>
            )}
            <div>
              <p className="font-semibold text-blue-800">Nama Pengguna:</p>
              <p className="text-blue-900">{data.nama_pengguna}</p>
            </div>
            <div>
              <p className="font-semibold text-blue-800">Email:</p>
              <p className="text-blue-900">{data.email}</p>
            </div>
            <div>
              <p className="font-semibold text-blue-800">Nomor Telepon:</p>
              <p className="text-blue-900">{data.nomor_telepon || '-'}</p>
            </div>
            <div>
              <p className="font-semibold text-blue-800">Jenis Akun:</p>
              <p className="text-blue-900">{data.jenis_akun}</p>
            </div>
            <div>
              <p className="font-semibold text-blue-800">Paket Membership:</p>
              <p className="text-blue-900">{data.paket_membership}</p>
            </div>
            <div>
              <p className="font-semibold text-blue-800">Status Akun:</p>
              <p className="text-blue-900">{data.status_akun}</p>
            </div>
            <div>
              <p className="font-semibold text-blue-800">Tanggal Berakhir:</p>
              <p className="text-blue-900">
                {data.tanggal_berakhir_membership
                  ? new Date(data.tanggal_berakhir_membership).toLocaleDateString()
                  : '-'}
              </p>
            </div>
            <div>
              <p className="font-semibold text-blue-800">Dibuat Pada:</p>
              <p className="text-blue-900">
                {data.dibuat_pada ? new Date(data.dibuat_pada).toLocaleDateString() : '-'}
              </p>
            </div>
            <div>
              <p className="font-semibold text-blue-800">Diperbarui Pada:</p>
              <p className="text-blue-900">
                {data.diperbarui_pada ? new Date(data.diperbarui_pada).toLocaleDateString() : '-'}
              </p>
            </div>
          </div>
        </div>

        {/* Tombol Tutup */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-900 text-white rounded hover:bg-blue-800 transition duration-200 ease-in-out"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}
