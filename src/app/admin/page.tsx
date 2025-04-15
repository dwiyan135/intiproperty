'use client'

import { useEffect, useState } from 'react'

export default function AdminDashboardPage() {
  const [data, setData] = useState({
    totalPengguna: 0,
    totalListing: 0,
    totalTransaksi: 0
  })

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('/api/admin/dashboard')
      const json = await res.json()
      setData(json)
    }
    fetchData()
  }, [])

  return (
    <div className="max-w-screen-xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold text-blue-900 mb-2 sm:mb-4">
        Selamat datang di Dashboard Admin
      </h1>
      <p className="text-sm sm:text-base text-blue-900 mb-6">
        Kelola seluruh data pengguna, properti, membership, dan sistem portal properti dari satu tempat.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl shadow p-4 sm:p-5">
          <h2 className="text-sm sm:text-base font-semibold text-blue-900">Total Pengguna</h2>
          <p className="text-xl font-bold text-blue-900">{data.totalPengguna}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 sm:p-5">
          <h2 className="text-sm sm:text-base font-semibold text-blue-900">Listing Aktif</h2>
          <p className="text-xl font-bold text-blue-900">{data.totalListing}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 sm:p-5">
          <h2 className="text-sm sm:text-base font-semibold text-blue-900">Transaksi Membership</h2>
          <p className="text-xl font-bold text-blue-900">{data.totalTransaksi}</p>
        </div>
      </div>
    </div>
  )
}
