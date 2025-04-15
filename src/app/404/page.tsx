export default function NotFound() {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-bold text-red-600 mb-2">404</h1>
        <p className="text-lg text-gray-700 mb-4">Halaman tidak ditemukan atau kamu tidak memiliki akses.</p>
        <a href="/" className="text-blue-600 underline hover:text-blue-800">Kembali ke Beranda</a>
      </div>
    )
  }
  