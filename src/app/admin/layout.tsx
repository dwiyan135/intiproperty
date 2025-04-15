'use client'

import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import {
  Menu, X, Users, Home, FileBarChart2,
  LogOut, Settings, ScrollText, ShieldCheck, LayoutDashboard
} from 'lucide-react'

export default function Layout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const menu = [
    { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard className="w-4 h-4 mr-2" /> },
    { label: 'Manajemen Pengguna', href: '/admin/pengguna', icon: <Users className="w-4 h-4 mr-2" /> },
    { label: 'Properti', href: '/admin/properti', icon: <Home className="w-4 h-4 mr-2" /> },
    { label: 'Booster', href: '/admin/booster', icon: <ShieldCheck className="w-4 h-4 mr-2" /> },
    { label: 'Membership', href: '/admin/membership', icon: <ScrollText className="w-4 h-4 mr-2" /> },
    { label: 'Laporan', href: '/admin/laporan', icon: <FileBarChart2 className="w-4 h-4 mr-2" /> },
    { label: 'Log Login Admin', href: '/admin/log-login-admin', icon: <LogOut className="w-4 h-4 mr-2" /> },
    { label: 'Pengaturan', href: '/admin/pengaturan', icon: <Settings className="w-4 h-4 mr-2" /> },
  ]

  const handleLogout = () => {
    Cookies.remove('auth_token')
    Cookies.remove('role')
    router.push('/login-admin')
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
      <aside className={`
        fixed top-0 left-0 z-40 h-full w-64 bg-gray-900 text-white p-4
        flex flex-col justify-between transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:relative lg:flex lg:w-64 lg:h-auto
      `}>
        <div>
          <h2 className="text-xl font-bold mb-6 text-center lg:text-left hidden lg:block">Admin Panel</h2>
          <nav className="space-y-2">
            {menu.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-3 py-2 rounded hover:bg-gray-700 transition text-sm sm:text-base ${
                  pathname === item.href ? 'bg-gray-800 font-semibold' : ''
                }`}
              >
                {item.icon} {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="mt-6 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded text-sm transition w-full"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 bg-gray-50 mt-16 lg:mt-0">
        {children}
      </main>
    </div>
  )
}
