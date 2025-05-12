// src/types/properti.ts

/**
 * Semua jenis properti yang tersedia
 */
export type TipeProperti =
  | 'rumah'
  | 'apartemen'
  | 'gedung'
  | 'tanah'
  | 'ruko'
  | 'lainnya';

/**
 * Mapping numeric ID ↔ nama tipe (sama persis dengan DB)
 */
export const TIPE_PROPERTI_MAP: Record<number, TipeProperti> = {
  1: 'rumah',
  2: 'apartemen',
  3: 'gedung',
  4: 'tanah',
  5: 'ruko',
  6: 'lainnya',
};

/**
 * Status iklan properti
 */
export type PropertiStatus =
  | 'draf'
  | 'menunggu'
  | 'aktif'
  | 'ditangguhkan'
  | 'terjual'
  | 'nonaktif';

/**
 * Status hunian / unit
 */
export type StatusHunian =
  | 'dijual'
  | 'disewa'
  | 'sold out'
  | 'dihuni'
  | 'kosong'
  | 'disewakan'
  | 'proyek';

/**
 * Struktur utama sebuah properti
 */
export interface Properti {
  id: number;
  id_pengguna: number;
  id_agensi: number | null;
  agen_pendamping: number | null;
  judul: string;
  slug: string;
  id_tipe_properti: number;
  deskripsi: string;
  harga: number;
  harga_nego: 0 | 1;
  dp_minimal: number | null;
  estimasi_angsuran: number | null;
  id_provinsi: number;
  id_kota: number;
  id_kecamatan: number;
  id_kelurahan: number;
  alamat_lengkap: string;
  kode_pos: string;
  koordinat: string;
  status: 'aktif' | 'nonaktif' | 'draf' | 'menunggu' | 'ditangguhkan' | 'terjual';
  status_hunian: string;
  sold_status: 'dijual' | 'sold_out' | 'disewa';
  verified: 0 | 1;
  highlight: 0 | 1;
  nama_proyek: string | null;
  nama_developer: string | null;
  catatan_internal: string | null;
  tanggal_mulai: Date;
  tanggal_berakhir: Date;
  total_view: number;
  total_simpan: number;
  total_share: number;
  auto_renewal: 0 | 1;
  dihasilkan_ai: 0 | 1;
}


/**
 * Struktur record foto properti
 */
export interface FotoProperti {
  id:           number;
  id_properti:  number;
  url:          string;
  is_utama:     boolean;
}

/**
 * Struktur record video properti (URL saja)
 */
export interface VideoProperti {
  id:           number;
  id_properti:  number;
  url:          string;
}
