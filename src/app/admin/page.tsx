import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyAdminToken } from '@/lib/verify-jwt'
import AdminDashboardPage from './AdminDashboardClient'

export default async function AdminPage() {
  const cookieStore = await cookies()
  const token = (cookieStore.get('auth_token') as { value: string } | undefined)?.value

  // Verifikasi token admin
  const decoded = token ? verifyAdminToken(token) : null
  if (!decoded || decoded.role !== 'admin') {
    // Jika tidak terautentikasi sebagai admin, arahkan ke halaman login-admin
    redirect('/login-admin')
  }

  // Jika valid, render komponen AdminDashboardPage
  return <AdminDashboardPage />
}
