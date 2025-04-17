import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyAdminToken } from '@/lib/verify-jwt'
import LoginAdminPage from './LoginAdminClient'

export default async function LoginPage() {
  const cookieStore = await cookies()
  const token = (cookieStore.get('auth_token') as { value: string } | undefined)?.value

  const decoded = token ? verifyAdminToken(token) : null

  // 🔐 Jika sudah login → redirect ke dashboard
  if (decoded) {
    redirect('/admin')
  }

  return <LoginAdminPage />
}
