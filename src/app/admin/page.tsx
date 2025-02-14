import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faUsers, faFileAlt, faCog } from "@fortawesome/free-solid-svg-icons";

export default function AdminDashboard() {
  return (
    <div className="p-6">
      {/* Header */}
      <h1 className="text-3xl font-bold text-black flex items-center gap-2">
        <FontAwesomeIcon icon={faChartLine} className="text-blue-500 w-6 h-6" /> Dashboard Admin
      </h1>
      <p className="text-gray-600">Selamat datang di panel admin CMS.</p>

      {/* Statistik Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Card Total Halaman */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
          <FontAwesomeIcon icon={faFileAlt} className="text-blue-500 w-10 h-10" />
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Total Halaman</h3>
            <p className="text-2xl font-bold text-black">12</p>
          </div>
        </div>

        {/* Card Total Pengguna */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
          <FontAwesomeIcon icon={faUsers} className="text-green-500 w-10 h-10" />
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Total Pengguna</h3>
            <p className="text-2xl font-bold text-black">230</p>
          </div>
        </div>

        {/* Card Total Postingan */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
          <FontAwesomeIcon icon={faCog} className="text-purple-500 w-10 h-10" />
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Total Postingan</h3>
            <p className="text-2xl font-bold text-black">45</p>
          </div>
        </div>
      </div>

      {/* Section Manajemen Halaman */}
      <h2 className="text-2xl font-semibold mt-6 mb-4 flex items-center gap-2">
        <FontAwesomeIcon icon={faFileAlt} className="text-blue-500 w-6 h-6" /> Manajemen Halaman
      </h2>

      {/* Tabel Halaman */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="p-3 text-left">Judul</th>
              <th className="p-3 text-left">Slug</th>
            </tr>
          </thead>
          <tbody>
            {/* Contoh Data */}
            {[
              { id: 1, title: "Beranda", slug: "/" },
              { id: 2, title: "Tentang Kami", slug: "/about" },
              { id: 3, title: "Kontak", slug: "/contact" },
            ].map((page) => (
              <tr key={page.id} className="border-b hover:bg-gray-100">
                <td className="p-3">{page.title}</td>
                <td className="p-3 text-gray-500">{page.slug}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
