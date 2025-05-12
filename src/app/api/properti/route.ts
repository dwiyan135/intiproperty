// src/app/api/properti/route.ts

import { NextResponse } from 'next/server';
import db from '@/lib/db';
import slugify from 'slugify';
import type { Properti } from '@/types/properti';
import type { RowDataPacket, OkPacket } from 'mysql2';

// GET /api/properti
export async function GET(req: Request) {
  try {
    const sql = `
      SELECT * 
      FROM \`${db.properti}\`
      ORDER BY tanggal_mulai DESC
    `;
    const [rows] = await db.connection.execute<RowDataPacket[]>(sql);
    const data = rows as Properti[];
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Gagal mengambil daftar properti', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/properti
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<Properti>;

    // Validasi minimal
    const required: (keyof Properti)[] = ['judul', 'id_pengguna', 'id_tipe_properti'];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Field ${field} wajib diisi` },
          { status: 400 }
        );
      }
    }

    // Siapkan kolom dan nilai (tanpa slug, dibuat setelahnya)
    const cols = Object.keys(body).filter(k => k !== 'slug');
    const vals = cols.map(k => (body as any)[k]);
    const placeholders = cols.map(() => '?').join(', ');
    const insertSql = `
      INSERT INTO \`${db.properti}\` (${cols.join(', ')})
      VALUES (${placeholders})
    `;
    const [result] = await db.connection.execute<OkPacket>(insertSql, vals);
    const insertId = result.insertId;

    // Generate slug berdasarkan judul dan insertId
    const generatedSlug = slugify(`${body.judul}-${insertId}`, { lower: true });
    await db.connection.execute<OkPacket>(
      `UPDATE \`${db.properti}\` SET slug = ? WHERE id = ?`,
      [generatedSlug, insertId]
    );

    // Ambil record baru lengkap dengan slug
    const [rows] = await db.connection.execute<RowDataPacket[]>(
      `SELECT * FROM \`${db.properti}\` WHERE id = ?`,
      [insertId]
    );
    const newItem = (rows as Properti[])[0];

    return NextResponse.json({ data: newItem }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Gagal membuat properti', details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/properti?id=...
export async function PUT(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Parameter id wajib disertakan' }, { status: 400 });
    }

    const body = (await req.json()) as Partial<Properti>;
    const cols = Object.keys(body);
    if (cols.length === 0) {
      return NextResponse.json({ error: 'Tidak ada data untuk diupdate' }, { status: 400 });
    }

    const assignments = cols.map(col => `\`${col}\` = ?`).join(', ');
    const vals = cols.map(k => (body as any)[k]);
    await db.connection.execute<OkPacket>(
      `UPDATE \`${db.properti}\` SET ${assignments} WHERE id = ?`,
      [...vals, id]
    );

    const [rows] = await db.connection.execute<RowDataPacket[]>(
      `SELECT * FROM \`${db.properti}\` WHERE id = ?`,
      [id]
    );
    const updated = (rows as Properti[])[0];
    return NextResponse.json({ data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Gagal mengupdate properti', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/properti?id=...
export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Parameter id wajib disertakan' }, { status: 400 });
    }

    await db.connection.execute<OkPacket>(
      `DELETE FROM \`${db.properti}\` WHERE id = ?`,
      [id]
    );
    return NextResponse.json({ message: 'Properti berhasil dihapus' });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Gagal menghapus properti', details: error.message },
      { status: 500 }
    );
  }
}
