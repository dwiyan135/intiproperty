import mysql from 'mysql2/promise'

export const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'intiproperty'
})

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
