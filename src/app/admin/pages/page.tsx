import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus, faFileAlt } from "@fortawesome/free-solid-svg-icons";

export default function PageManagement() {
  return (
    <div className="p-6">
      {/* Header */}
      <h1 className="text-3xl font-bold text-black flex items-center gap-2">
        <FontAwesomeIcon icon={faFileAlt} className="text-blue-500 w-5 h-5" /> Manajemen Halaman
      </h1>
      <p className="text-gray-600">Kelola halaman website dengan mudah.</p>

      {/* Tombol Tambah Halaman */}
      <div className="mt-4">
        <button className="bg-green-500 text-white px-4 py-2 rounded-md flex items-center gap-2">
          <FontAwesomeIcon icon={faPlus} className="w-4 h-4" /> Tambah Halaman
        </button>
      </div>

      {/* Tabel Manajemen Halaman */}
      <div className="bg-white p-6 mt-6 rounded-lg shadow-md">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="p-3 text-left">Judul</th>
              <th className="p-3 text-left">Slug</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {/* Contoh Data */}
            {[
              { id: 1, title: "Beranda", slug: "/beranda" },
              { id: 2, title: "Tentang Kami", slug: "/about" },
              { id: 3, title: "Kontak", slug: "/contact" },
            ].map((page) => (
              <tr key={page.id} className="border-b hover:bg-gray-100">
                <td className="p-3">{page.title}</td>
                <td className="p-3 text-gray-500">{page.slug}</td>
                <td className="p-3 flex justify-center gap-2">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded-md flex items-center gap-1">
                    <FontAwesomeIcon icon={faEdit} className="w-4 h-4" /> Edit
                  </button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded-md flex items-center gap-1">
                    <FontAwesomeIcon icon={faTrash} className="w-4 h-4" /> Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
