import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTachometerAlt, faFile, faCogs } from "@fortawesome/free-solid-svg-icons";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white h-screen p-5">
      <h2 className="text-xl font-bold">CMS Panel</h2>
      <ul className="mt-6 space-y-2">
        <li>
          <Link href="/admin" className="block p-3 rounded-lg hover:bg-gray-700 flex items-center gap-2">
            <FontAwesomeIcon icon={faTachometerAlt} className="w-5 h-5" /> Dashboard
          </Link>
        </li>
        <li>
          <Link href="/admin/pages" className="block p-3 rounded-lg hover:bg-gray-700 flex items-center gap-2">
            <FontAwesomeIcon icon={faFile} className="w-5 h-5" /> Manajemen Halaman
          </Link>
        </li>
        <li>
          <Link href="/admin/settings" className="block p-3 rounded-lg hover:bg-gray-700 flex items-center gap-2">
            <FontAwesomeIcon icon={faCogs} className="w-5 h-5" /> Pengaturan
          </Link>
        </li>
      </ul>
    </aside>
  );
}
