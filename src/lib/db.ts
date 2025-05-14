import mysql from 'mysql2/promise'

// Ambil variabel dari environment
const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME
} = process.env

// Validasi: semua variabel harus ada
if (!DB_HOST || !DB_PORT || !DB_USER || !DB_NAME) {
  throw new Error('❌ Environment variables DB_HOST, DB_PORT, DB_USER, and DB_NAME are required')
}

// Koneksi ke MySQL
export const connection = await mysql.createConnection({
  host: DB_HOST,
  port: Number(DB_PORT),
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
})

// Definisi alias tabel
const db = {
  connection,
  properti: 'properti',
  properti_rumah: 'properti_rumah',
  properti_apartemen: 'properti_apartemen',
  properti_ruko: 'properti_ruko',
  properti_gedung: 'properti_gedung',
  properti_tanah: 'properti_tanah',
  properti_lainnya: 'properti_lainnya',
  media_properti: 'media_properti',
  tipe_properti: 'tipe_properti',
}

export default db
