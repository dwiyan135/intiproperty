'use client'

import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Menu, X, Users, Home, FileBarChart2,
  LogOut, Settings, ScrollText, ShieldCheck, LayoutDashboard,
  MapPin, ChevronDown, ChevronUp, Flag, Landmark, Building2, Navigation2
} from 'lucide-react'

export default function Layout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [lokasiOpen, setLokasiOpen] = useState(false)

  const menu = [
    { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard className="w-5 h-5 mr-3" /> },
    { label: 'Manajemen Pengguna', href: '/admin/pengguna', icon: <Users className="w-5 h-5 mr-3" /> },
    { label: 'Properti', href: '/admin/properti', icon: <Home className="w-5 h-5 mr-3" /> },
  ]

  const lokasiSubmenu = [
    { label: 'Provinsi', href: '/admin/lokasi/provinsi', icon: <Flag className="w-4 h-4 mr-2" /> },
    { label: 'Kota/Kabupaten', href: '/admin/lokasi/kota', icon: <Landmark className="w-4 h-4 mr-2" /> },
    { label: 'Kecamatan', href: '/admin/lokasi/kecamatan', icon: <Building2 className="w-4 h-4 mr-2" /> },
    { label: 'Kelurahan', href: '/admin/lokasi/kelurahan', icon: <Navigation2 className="w-4 h-4 mr-2" /> },
  ]

  const lainnya = [
    { label: 'Booster', href: '/admin/booster', icon: <ShieldCheck className="w-5 h-5 mr-3" /> },
    { label: 'Membership', href: '/admin/membership', icon: <ScrollText className="w-5 h-5 mr-3" /> },
    { label: 'Laporan', href: '/admin/laporan', icon: <FileBarChart2 className="w-5 h-5 mr-3" /> },
    { label: 'Log Login Admin', href: '/admin/log-login-admin', icon: <LogOut className="w-5 h-5 mr-3" /> },
    { label: 'Pengaturan', href: '/admin/pengaturan', icon: <Settings className="w-5 h-5 mr-3" /> },
  ]

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/logout-admin', { method: 'POST' })
      const data = await res.json()
      alert(data.message)
      window.location.href = '/login-admin'
    } catch {
      alert('Logout gagal')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <div className="lg:hidden flex justify-between items-center bg-gray-900 text-white px-4 py-3 shadow-md fixed top-0 w-full z-50">
        <h2 className="text-lg font-bold">Admin Panel</h2>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-full w-72 bg-gray-900 text-white p-6
          flex flex-col justify-between transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:relative lg:flex lg:w-72 lg:h-auto
        `}
      >
        <div>
          <h2 className="text-2xl font-bold mb-8 text-center lg:text-left hidden lg:block">
            Admin Panel
          </h2>

          <nav className="space-y-1">
            {menu.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-4 py-2 rounded-md hover:bg-gray-700 transition ${
                  pathname === item.href ? 'bg-gray-800 font-semibold' : 'text-gray-200'
                }`}
              >
                {item.icon}
                <span className="text-sm sm:text-base">{item.label}</span>
              </Link>
            ))}

            {/* Submenu Lokasi */}
            <div className="text-gray-200">
              <button
                onClick={() => setLokasiOpen(!lokasiOpen)}
                className="flex items-center w-full px-4 py-2 rounded-md hover:bg-gray-700 transition"
              >
                <MapPin className="w-5 h-5 mr-3" />
                <span className="flex-1 text-left text-sm sm:text-base">Lokasi</span>
                {lokasiOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {lokasiOpen && (
                <div className="ml-8 mt-1 space-y-1">
                  {lokasiSubmenu.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center px-2 py-1 rounded hover:bg-gray-700 text-sm ${
                        pathname === sub.href ? 'bg-gray-800 font-semibold' : 'text-gray-300'
                      }`}
                    >
                      {sub.icon}
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Menu lainnya */}
            {lainnya.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-4 py-2 rounded-md hover:bg-gray-700 transition ${
                  pathname === item.href ? 'bg-gray-800 font-semibold' : 'text-gray-200'
                }`}
              >
                {item.icon}
                <span className="text-sm sm:text-base">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 w-full text-left px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 transition"
        >
          Keluar
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 bg-gray-50 mt-16 lg:mt-0">
        {children}
      </main>
    </div>
  )
}
