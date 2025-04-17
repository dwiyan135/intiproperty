'use client'

import { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import Cookies from 'js-cookie'

interface DecodedToken {
  id: number
  role: string
  iat: number
  exp: number
}

export default function AdminDebugPage() {
  const [tokenInfo, setTokenInfo] = useState<DecodedToken | null>(null)
  const [adminId, setAdminId] = useState<string | undefined>('')

  useEffect(() => {
    const token = Cookies.get('auth_token')
    const admin_id = Cookies.get('admin_id')
    setAdminId(admin_id)

    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token)
        setTokenInfo(decoded)
      } catch (err) {
        console.error('❌ Gagal decode token:', err)
      }
    }
  }, [])

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4 text-blue-900">🧪 Debug Info Admin</h1>

      <div className="bg-white shadow rounded-xl p-4 border border-gray-200 space-y-3">
        <div>
          <strong className="text-blue-900">Admin ID dari Cookie:</strong>
          <p className="text-blue-900">{adminId || 'Tidak ditemukan'}</p>
        </div>

        <div>
          <strong className="text-blue-900">Token:</strong>
          <p className="text-blue-900 break-all">{Cookies.get('auth_token') || 'Tidak ditemukan'}</p>
        </div>

        {tokenInfo ? (
          <div>
            <strong className="text-blue-900">Hasil Decode Token:</strong>
            <pre className="bg-gray-100 p-3 rounded text-sm text-blue-900">
              {JSON.stringify(tokenInfo, null, 2)}
            </pre>
          </div>
        ) : (
          <p className="text-red-600">Token tidak valid atau belum login</p>
        )}
      </div>
    </div>
  )
}
