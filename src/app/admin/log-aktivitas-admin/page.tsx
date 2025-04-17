// File: src/app/admin/log-aktivitas-admin/page.tsx
'use client'

import { useEffect, useState } from 'react'

export default function LogAktivitasAdminPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch('/api/admin/log-aktivitas-admin')
        const data = await res.json()
        setLogs(data.logs || [])
      } catch (err: any) {
        setError('Gagal memuat log aktivitas admin')
      } finally {
        setLoading(false)
      }
    }
    fetchLogs()
  }, [])

  return (
    <div className="max-w-screen-xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold text-blue-900 mb-4">Log Aktivitas Admin</h1>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      {loading ? (
        <p className="text-blue-900">Memuat data...</p>
      ) : (
        <div className="overflow-x-auto border rounded-xl shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100 text-blue-900">
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Admin</th>
                <th className="px-4 py-2 text-left">Aksi</th>
                <th className="px-4 py-2 text-left">Detail</th>
                <th className="px-4 py-2 text-left">Waktu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm text-blue-900">
              {logs.map((log) => (
                <tr key={log.id}>
                  <td className="px-4 py-2">{log.id}</td>
                  <td className="px-4 py-2">{log.admin_nama || '-'}</td>
                  <td className="px-4 py-2 font-semibold">{log.aksi}</td>
                  <td className="px-4 py-2">{log.detail}</td>
                  <td className="px-4 py-2">{new Date(log.waktu).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
