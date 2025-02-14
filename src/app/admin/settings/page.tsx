import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCogs, faPalette, faSave } from "@fortawesome/free-solid-svg-icons";

export default function SettingsPage() {
  return (
    <div className="p-6">
      {/* Header */}
      <h1 className="text-3xl font-bold text-black flex items-center gap-2">
        <FontAwesomeIcon icon={faCogs} className="text-blue-500 w-5 h-5" /> Pengaturan
      </h1>
      <p className="text-black">Atur preferensi dan konfigurasi CMS Anda.</p>

      {/* Formulir Pengaturan */}
      <div className="bg-white p-6 mt-4 rounded-lg shadow-md max-w-lg">
        {/* Nama Website */}
        <label className="block font-semibold text-gray-700 flex items-center gap-2">
          <FontAwesomeIcon icon={faCogs} className="text-gray-600 w-4 h-4" />
          Nama Website
        </label>
        <input
          type="text"
          placeholder="Nama Website"
          className="w-full p-2 border rounded-md mt-2"
        />

        {/* Pilihan Tema */}
        <label className="block font-semibold text-gray-700 mt-4 flex items-center gap-2">
          <FontAwesomeIcon icon={faPalette} className="text-gray-600 w-4 h-4" />
          Tema Warna
        </label>
        <select className="w-full p-2 border rounded-md mt-2">
          <option>Default</option>
          <option>Dark Mode</option>
          <option>Light Mode</option>
        </select>

        {/* Tombol Simpan */}
        <button className="bg-blue-500 text-white px-4 py-2 mt-4 rounded-md flex items-center gap-2">
          <FontAwesomeIcon icon={faSave} className="w-4 h-4" /> Simpan Perubahan
        </button>
      </div>
    </div>
  );
}
