// File: src/app/api/test-db/route.ts

import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import type { RowDataPacket } from 'mysql2'

export async function GET() {
  try {
    const [rows] = await db.query<RowDataPacket[]>('SELECT 1 + 1 AS result')
    return NextResponse.json({ message: 'Database connected!', result: rows[0].result })
  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json({ message: 'Database connection failed', error }, { status: 500 })
  }
}
