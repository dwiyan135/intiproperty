'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginAdminPage() {
  const [login, setLogin] = useState('')
  const [kataSandi, setKataSandi] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const res = await fetch('/api/login-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, kata_sandi: kataSandi })
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.message || 'Gagal login')
        return
      }

      router.push('/admin')
    } catch (err) {
      setError('Terjadi kesalahan, coba lagi')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="w-full max-w-sm">
        <div className="bg-blue-900 text-white py-4 text-center rounded-t-xl">
          <div className="flex justify-center">
            <img src="/intiproperty.webp" alt="Inti Property" width={60} height={60} className="rounded-full" />
          </div>
        </div>
        <form onSubmit={handleLogin} className="bg-white shadow-lg rounded-b-xl px-10 py-8 border border-gray-300">
          <h2 className="text-xl font-bold mb-6 text-blue-900 text-center">Login Admin</h2>

          {error && <p className="text-red-600 mb-4 text-sm text-center">{error}</p>}

          <div className="mb-4">
            <label className="block text-blue-900 font-medium mb-1">Email atau Nama Pengguna</label>
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="w-full border border-blue-900 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-900 text-blue-900"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-blue-900 font-medium mb-1">Kata Sandi</label>
            <input
              type="password"
              value={kataSandi}
              onChange={(e) => setKataSandi(e.target.value)}
              className="w-full border border-blue-900 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-900 text-blue-900"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-900 text-white py-2 rounded hover:bg-blue-800 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}
