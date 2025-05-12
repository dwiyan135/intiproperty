'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { Loader2 } from 'lucide-react'

export default function EditPropertiPage() {
  const { id, slug } = useParams<{ id: string; slug: string }>()
  const router = useRouter()

  const [data, setData] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch(`/api/properti/${id}/${slug}`)
      .then(r => r.json())
      .then(j => {
        if (j.error) throw new Error(j.error)
        setData(j.data)
      })
      .catch(() => toast.error('Gagal memuat properti'))
  }, [id, slug])

  const handleSave = async () => {
    setSaving(true)
    try {
      // asumsikan data sudah kamu modifikasi di state `data`
      const res = await fetch(`/api/properti/${id}/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      const j = await res.json()
      if (res.ok) {
        toast.success('Tersimpan!')
        // jika slug berubah, redirect ke URL baru:
        if (data.slug !== slug) {
          router.push(`/admin/properti/${id}/${data.slug}`)
        }
      } else {
        throw new Error(j.error || 'Gagal menyimpan')
      }
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  if (!data) return <div className="p-4">Memuat…</div>

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Edit Properti #{id}</h1>
      <input
        type="text"
        value={data.judul}
        onChange={e => setData({ ...data, judul: e.target.value })}
        className="w-full p-2 border rounded"
      />
      {/* …tambahkan seluruh form field seperti judul, harga, alamat, dll */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-4 px-4 py-2 bg-blue-700 text-white rounded disabled:opacity-50"
      >
        {saving ? <Loader2 className="animate-spin" /> : 'Simpan Perubahan'}
      </button>
    </div>
  )
}
