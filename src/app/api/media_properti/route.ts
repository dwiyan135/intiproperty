import { NextRequest, NextResponse } from 'next/server';
import formidable, { File } from 'formidable';
import fs from 'fs';
import path from 'path';
import db from '@/lib/db';

// Matikan body parser bawaan Next.js
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper untuk mengubah NextRequest jadi bentuk stream
async function parseForm(req: NextRequest): Promise<{
  fields: formidable.Fields;
  files: formidable.Files;
}> {
  const form = formidable({
    multiples: true,
    uploadDir: path.join(process.cwd(), '/public/uploads'),
    keepExtensions: true,
  });

  return new Promise((resolve, reject) => {
    const reqAny = req as any; // cast ke readable stream
    form.parse(reqAny, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export async function POST(req: NextRequest) {
  try {
    const { fields, files } = await parseForm(req);

    const idProperti = Number(fields.id_properti?.[0] || fields.id_properti);
    const fileList = Array.isArray(files.files) ? files.files : [files.files];

    for (const file of fileList as File[]) {
      const filePath = file.filepath;
      const fileName = path.basename(filePath);
      const url = `/uploads/${fileName}`;

      await db.connection.execute(
        `INSERT INTO \`${db.media_properti}\` (id_properti, tipe_media, url, is_utama) VALUES (?, 'foto', ?, 0)`,
        [idProperti, url]
      );
    }

    return NextResponse.json({ message: 'Upload media berhasil' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
