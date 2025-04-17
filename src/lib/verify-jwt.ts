export function verifyAdminToken(token: string): { id: number; role: string } | null {
  try {
    const base64Payload = token.split('.')[1]
    const payload = JSON.parse(Buffer.from(base64Payload, 'base64').toString())
    return payload
  } catch (err) {
    console.error('❌ Gagal parse token:', err)
    return null
  }
}
