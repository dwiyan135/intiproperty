// File: src/app/admin/log-login-admin/page.tsx

'use client'

import { useEffect, useState } from 'react'

export default function LogLoginPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('/api/log-login-admin')
        const data = await res.json()
        setLogs(data.data || [])
      } catch (error) {
        console.error('Gagal fetch log login:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()
  }, [])

  return (
    <div className="p-4 sm:p-6 text-blue-900">
      <h1 className="text-xl sm:text-2xl font-bold mb-4">Log Login Admin</h1>
      {loading ? (
        <p>Memuat data...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[600px] w-full bg-white shadow-md rounded-lg text-sm sm:text-base">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Nama Admin</th>
                <th className="py-3 px-4 text-left">Login Via</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">IP Address</th>
                <th className="py-3 px-4 text-left">Waktu Login</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="py-2 px-4">{log.nama_admin || '-'}</td>
                  <td className="py-2 px-4">{log.login_via}</td>
                  <td className={`py-2 px-4 font-semibold ${log.status === 'sukses' ? 'text-green-600' : 'text-red-600'}`}>{log.status}</td>
                  <td className="py-2 px-4">{log.ip_address}</td>
                  <td className="py-2 px-4">{new Date(log.waktu_login).toLocaleString()}</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    Tidak ada log login ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
