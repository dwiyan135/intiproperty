// File: src/app/admin/pengguna/page.tsx

'use client'

import UserTable from './components/UserTable'

export default function PenggunaAdminPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-blue-900 mb-4">Manajemen Pengguna</h1>
      <UserTable />
    </div>
  )
}
