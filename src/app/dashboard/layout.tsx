'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const menuByRole: Record<string, { label: string; href: string }[]> = {
  agen: [
    { label: 'Dashboard', href: '/dashboard/agen' },
    { label: 'Properti Saya', href: '#' },
    { label: 'Buat Iklan', href: '#' },
    { label: 'Booster & Sundul', href: '#' },
    { label: 'Leads', href: '#' },
    { label: 'Riwayat Pembayaran', href: '#' },
    { label: 'Profil Saya', href: '#' }
  ],
  agensi: [
    { label: 'Dashboard', href: '/dashboard/agensi' },
    { label: 'Properti Agensi', href: '#' },
    { label: 'Buat Iklan', href: '#' },
    { label: 'Booster & Sundul', href: '#' },
    { label: 'Leads', href: '#' },
    { label: 'Riwayat Pembayaran', href: '#' },
    { label: 'Profil Agensi', href: '#' }
  ],
  pemilik: [
    { label: 'Dashboard', href: '/dashboard/pemilik' },
    { label: 'Properti Saya', href: '#' },
    { label: 'Buat Iklan', href: '#' },
    { label: 'Booster & Sundul', href: '#' },
    { label: 'Leads', href: '#' },
    { label: 'Riwayat Pembayaran', href: '#' },
    { label: 'Profil Saya', href: '#' }
  ]
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  // Role contoh
  const role = 'agen'
  const menu = menuByRole[role] || []
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen">
      {/* Sidebar dengan background silver & teks biru dongker */}
      <aside className="w-64 bg-[#ECECEC] p-4 border-r border-gray-300 text-[#001F3F]">
        <h2 className="text-xl font-bold mb-6">Dashboard {role}</h2>
        <nav className="space-y-2">
          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                block px-3 py-2 rounded
                hover:bg-gray-200
                ${
                  pathname === item.href
                    ? 'bg-gray-300 font-semibold'
                    : ''
                }
              `}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Konten utama */}
      <main className="flex-1 p-6 bg-white">
        {children}
      </main>
    </div>
  )
}
