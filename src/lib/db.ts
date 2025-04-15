// src/lib/db.ts
import mysql from 'mysql2/promise'

export const db = mysql.createPool({
  host: 'localhost',        // ganti sesuai kebutuhan
  user: 'root',             // user MySQL kamu
  password: '',             // password MySQL kamu
  database: 'intiproperty', // nama database yang tadi kita buat
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
export default db
