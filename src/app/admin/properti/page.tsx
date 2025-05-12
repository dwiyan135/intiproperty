// src/app/admin/properti/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Properti {
  id: number;
  judul: string;
  harga: number;
  id_tipe_properti: number;
  status_unit: 'dijual' | 'sold_out' | 'disewa';
  slug: string;
}

interface TipeProperti {
  id: number;
  nama: string;
}

export default function AdminPropertiListPage() {
  const [propertiList, setPropertiList] = useState<Properti[]>([]);
  const [tipeList, setTipeList] = useState<TipeProperti[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [resProp, resTipe] = await Promise.all([
          fetch('/api/properti'),
          fetch('/api/tipe_properti'),
        ]);
        const propJson = await resProp.json();
        const tipeJson = await resTipe.json();
        setPropertiList(propJson.data || []);
        setTipeList(tipeJson.data || []);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const getTipeNama = (id: number) => {
    const tipe = tipeList.find(t => t.id === id);
    return tipe ? tipe.nama : '-';
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus properti ini?')) return;
    try {
      const res = await fetch(`/api/properti?id=${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Gagal menghapus properti');
      setPropertiList(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-white rounded shadow text-blue-900">
        <h1 className="text-2xl font-semibold mb-4">Daftar Properti</h1>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded shadow text-blue-900">
      <h1 className="text-2xl font-semibold mb-4">Daftar Properti</h1>
      <div className="mb-4">
        <Link href="/admin/properti/buat">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Tambah Properti
          </button>
        </Link>
      </div>

      {propertiList.length === 0 ? (
        <div className="text-gray-600">Belum ada properti yang ditambahkan.</div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2 text-left">ID</th>
              <th className="border p-2 text-left">Judul</th>
              <th className="border p-2 text-left">Tipe</th>
              <th className="border p-2 text-left">Harga</th>
              <th className="border p-2 text-left">Status</th>
              <th className="border p-2 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {propertiList.map(p => (
              <tr key={p.id}>
                <td className="border p-2">{p.id}</td>
                <td className="border p-2">{p.judul}</td>
                <td className="border p-2">{getTipeNama(p.id_tipe_properti)}</td>
                <td className="border p-2">Rp {p.harga.toLocaleString()}</td>
                <td className="border p-2">{p.status_unit}</td>
                <td className="border p-2 text-center space-x-2">
                  <Link href={`/admin/properti/edit/${p.id}`}>
                    <button className="text-blue-600 hover:underline">Edit</button>
                  </Link>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-red-600 hover:underline"
                  >
                    Hapus
                  </button>
                  <Link href={`/admin/properti/${p.id}/${p.slug}`}>
                    <button className="text-green-600 hover:underline">Detail</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
