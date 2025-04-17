'use client'
import { useEffect, useState } from 'react'

export default function CekToken() {
  const [status, setStatus] = useState<any>(null)

  useEffect(() => {
    fetch('/api/whoami', { credentials: 'include' })
      .then(res => res.json())
      .then(setStatus)
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Cek Token</h1>
      <pre className="mt-4 bg-gray-100 p-3 rounded">
        {JSON.stringify(status, null, 2)}
      </pre>
    </div>
  )
}
