// File: src/lib/rate-limit.ts

type RateLimitData = {
    count: number
    lastAttempt: number
  }
  
  const rateLimitMap = new Map<string, RateLimitData>()
  const RATE_LIMIT_DURATION = 5 * 60 * 1000 // 5 menit (dalam milidetik)
  const RATE_LIMIT_MAX_ATTEMPTS = 5
  
  /**
   * Ambil data rate limit untuk IP tertentu
   */
  export function getRateLimit(ip: string): RateLimitData {
    const now = Date.now()
    const data = rateLimitMap.get(ip)
  
    if (!data) {
      return { count: 0, lastAttempt: now }
    }
  
    // Reset jika melebihi durasi
    if (now - data.lastAttempt > RATE_LIMIT_DURATION) {
      return { count: 0, lastAttempt: now }
    }
  
    return data
  }
  
  /**
   * Tambahkan percobaan login untuk IP tertentu
   */
  export function incrementRateLimit(ip: string): void {
    const now = Date.now()
    const data = getRateLimit(ip)
    rateLimitMap.set(ip, {
      count: data.count + 1,
      lastAttempt: now
    })
  }
  
  /**
   * Cek apakah IP sudah melewati batas percobaan login
   */
  export function isRateLimited(ip: string): boolean {
    const data = getRateLimit(ip)
    return data.count >= RATE_LIMIT_MAX_ATTEMPTS
  }
  