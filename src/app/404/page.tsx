export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center text-center px-4">
      <div className="bg-white shadow-2xl rounded-lg p-8 max-w-md w-full">
        <h1 className="text-6xl font-extrabold text-blue-900 mb-4">404</h1>
        <p className="text-xl text-blue-900 mb-6">
          Oops! Halaman yang Anda cari tidak ditemukan atau Anda tidak memiliki akses.
        </p>
        <a
          href="/"
          className="inline-block bg-blue-900 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-800 transition-colors duration-300"
        >
          Kembali ke Beranda
        </a>
      </div>
      <div className="mt-8">
        <p className="text-sm text-blue-900">
          Inti Property © {new Date().getFullYear()} - Temukan Properti Impian Anda
        </p>
      </div>
    </div>
  );
}