export default function AgenDashboardPage() {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Selamat datang di Dashboard Agen</h1>
        <p className="text-gray-700">Di sini kamu bisa mengelola properti, melihat statistik, dan mengakses fitur premium seperti Booster & Sundul.</p>
  
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-lg font-semibold">Total Iklan</h2>
            <p className="text-2xl font-bold text-blue-600">12</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-lg font-semibold">Kuota Booster</h2>
            <p className="text-2xl font-bold text-green-600">8 Sisa</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-lg font-semibold">Leads Baru</h2>
            <p className="text-2xl font-bold text-orange-500">3</p>
          </div>
        </div>
      </div>
    )
  }
  