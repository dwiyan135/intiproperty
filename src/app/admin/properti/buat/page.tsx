// src/app/admin/properti/buat/page.tsx
'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useMapEvents, useMap } from 'react-leaflet';
import MapSearchControl from '@/components/MapSearchControl';
import AddressAutocomplete from '@/components/AddressAutoComplete';
import 'leaflet/dist/leaflet.css';
import 'leaflet-geosearch/dist/geosearch.css';
import L from 'leaflet';

// dynamic-import only the components (avoid SSR)
const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer   = dynamic(() => import('react-leaflet').then(m => m.TileLayer),   { ssr: false });
const Marker      = dynamic(() => import('react-leaflet').then(m => m.Marker),      { ssr: false });
const Popup       = dynamic(() => import('react-leaflet').then(m => m.Popup),       { ssr: false });

interface TipeProperti { id: number; nama: string; slug: string; }
interface Provinsi     { id: number; nama: string; slug: string; }
interface Kota         { id: number; id_provinsi: number; nama: string; slug: string; }
interface Kecamatan    { id: number; id_kota: number; nama: string; slug: string; }
interface Kelurahan    { id: number; id_kecamatan: number; nama: string; slug: string; }

/** Helper: setiap `position` berubah, peta akan di‐center ulang */
function RecenterMap({ position }: { position: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(position, map.getZoom());
  }, [position, map]);
  return null;
}

// ➋ Buat instance ikon kustom
const customIcon = L.icon({
  iconUrl: '/icon/marker-icon.webp',  // path relatif dari folder public
  iconSize:     [32, 32],              // ukuran actual ikon, sesuaikan jika perlu
  iconAnchor:   [16, 32],              // titik “dasar” ikon menempel di koordinat (tengah-bawah)
  popupAnchor:  [0, -32],              // posisi popup relatif ke ikon (naik 32px)
});

export default function CreatePropertyPage() {
  const router = useRouter();

  /** 1. Common fields **/
  const [judul, setJudul]                       = useState('');
  const [deskripsi, setDeskripsi]               = useState('');
  const [harga, setHarga]                       = useState('');
  const [dpMinimal, setDpMinimal]               = useState('');
  const [estimasiAngsuran, setEstimasiAngsuran] = useState('');
  const [statusUnit, setStatusUnit]             = useState<'dijual'|'sold_out'|'disewa'>('dijual');
  const [statusHunian, setStatusHunian]         = useState<'dihuni'|'kosong'|'disewakan'|'proyek'>('dihuni');
  const [selectedTipe, setSelectedTipe]         = useState<number>(0);
  const [address, setAddress] = useState<string>('');
  const [selectedProvinsi, setSelectedProvinsi] = useState<number>(0);
  const [selectedKota, setSelectedKota]         = useState<number>(0);
  const [selectedKecamatan, setSelectedKecamatan] = useState<number>(0);
  const [selectedKelurahan, setSelectedKelurahan] = useState<number>(0);
  const [videoLink, setVideoLink]               = useState('');
  const [mediaFiles, setMediaFiles]             = useState<File[]>([]);

  /** 2. Leaflet map & search **/
  const [position, setPosition] = useState<[number,number]>([-6.200000, 106.816666]);
  function LocationMarker() {
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
      }
    });
    return position ? (
      <Marker position={position} 
      icon={customIcon}  
      draggable eventHandlers={{
        dragend: e => {
          const { lat, lng } = e.target.getLatLng();
          setPosition([lat, lng]);
        }
      }}>
        <Popup>{address || 'Pilih lokasi'}</Popup>  // ← Modified
      </Marker>
    ) : null;
  }

  /** 3. Type-specific states **/

  // Rumah (id=1)
  const [r_luasTanah, setR_luasTanah]             = useState('');
  const [r_luasBangunan, setR_luasBangunan]       = useState('');
  const [r_jumlahKamar, setR_jumlahKamar]         = useState('');
  const [r_jumlahKamarMandi, setR_jumlahKamarMandi] = useState('');
  const [r_jumlahLantai, setR_jumlahLantai]       = useState('');
  const [r_carport, setR_carport]                 = useState(false);
  const [r_garasi, setR_garasi]                   = useState(false);
  const [r_dayaListrik, setR_dayaListrik]         = useState('');
  const [r_sertifikat, setR_sertifikat]           = useState<'SHM'|'HGB'|'AJB'|''>('');
  const [r_orientasi, setR_orientasi]             = useState('');
  const [r_aksesJalan, setR_aksesJalan]           = useState('');
  const [r_tahunDibangun, setR_tahunDibangun]     = useState('');
  const [r_bebasBanjir, setR_bebasBanjir]         = useState(false);
  const [r_kondisiBangunan, setR_kondisiBangunan] = useState('');
  const [r_perabotan, setR_perabotan]             = useState<'tidak ada'|'sebagian'|'lengkap'>('tidak ada');
  const [r_kolamRenang, setR_kolamRenang]         = useState(false);
  const [r_taman, setR_taman]                     = useState(false);
  const [r_posisiRumah, setR_posisiRumah]         = useState<'hook'|'tengah'|'pinggir'|''>('');
  const [r_jendelaBesar, setR_jendelaBesar]       = useState(false);
  const [r_pencahayaanAlami, setR_pencahayaanAlami] = useState(false);
  const [r_ruangKeluargaTerbuka, setR_ruangKeluargaTerbuka] = useState(false);
  const [r_dekatFasilitas, setR_dekatFasilitas]   = useState('');
  const [r_lebarJalanDepan, setR_lebarJalanDepan] = useState('');
  const [r_jarakKeJalanUtama, setR_jarakKeJalanUtama] = useState('');

  // Apartemen (id=2)
  const [a_luasBangunan, setA_luasBangunan]              = useState('');
  const [a_jumlahKamar, setA_jumlahKamar]                = useState('');
  const [a_jumlahKamarMandi, setA_jumlahKamarMandi]      = useState('');
  const [a_lantaiUnit, setA_lantaiUnit]                  = useState('');
  const [a_totalLantai, setA_totalLantai]                = useState('');
  const [a_typeUnit, setA_typeUnit]                      = useState<'studio'|'1BR'|'2BR'|'3BR+'|''>('');
  const [a_biayaMaintenance, setA_biayaMaintenance]      = useState('');
  const [a_fasilitasUmum, setA_fasilitasUmum]            = useState('');
  const [a_tahunDibangun, setA_tahunDibangun]            = useState('');
  const [a_perabotan, setA_perabotan]                    = useState<'tidak ada'|'sebagian'|'lengkap'>('tidak ada');
  const [a_viewUnit, setA_viewUnit]                      = useState('');
  const [a_aksesMall, setA_aksesMall]                    = useState(false);
  const [a_aksesTransportasi, setA_aksesTransportasi]    = useState('');
  const [a_acTerpasang, setA_acTerpasang]                = useState(false);
  const [a_aksesLiftPribadi, setA_aksesLiftPribadi]      = useState(false);
  const [a_jumlahUnitPerLantai, setA_jumlahUnitPerLantai]= useState('');

  // Gedung (id=3)
  const [g_luasTanah, setG_luasTanah]             = useState('');
  const [g_luasBangunan, setG_luasBangunan]       = useState('');
  const [g_jumlahLantai, setG_jumlahLantai]       = useState('');
  const [g_kapasitasOrang, setG_kapasitasOrang]   = useState('');
  const [g_fungsi, setG_fungsi]                   = useState<'kantor'|'pabrik'|'gudang'|'sekolah'|'event hall'|''>('');
  const [g_fasilitas, setG_fasilitas]             = useState('');
  const [g_dayaListrik, setG_dayaListrik]         = useState('');
  const [g_tahunDibangun, setG_tahunDibangun]     = useState('');
  const [g_genset, setG_genset]                   = useState(false);
  const [g_sistemPemadam, setG_sistemPemadam]     = useState(false);
  const [g_rooftop, setG_rooftop]                 = useState(false);
  const [g_lift, setG_lift]                       = useState(false);
  const [g_ruangMeeting, setG_ruangMeeting]       = useState(false);
  const [g_areaPenerima, setG_areaPenerima]       = useState(false);
  const [g_aksesAngkutan, setG_aksesAngkutan]     = useState('');

  // Tanah (id=4)
  const [t_luasTanah, setT_luasTanah]             = useState('');
  const [t_jenisTanah, setT_jenisTanah]           = useState<'kavling'|'pertanian'|'pekarangan'|''>('');
  const [t_statusKepemilikan, setT_statusKepemilikan] = useState<'SHM'|'HGB'|'AJB'|'Girik'|''>('');
  const [t_lebarJalanDepan, setT_lebarJalanDepan] = useState('');
  const [t_kontur, setT_kontur]                   = useState<'datar'|'miring'|''>('');
  const [t_bebasBanjir, setT_bebasBanjir]         = useState(false);
  const [t_aksesJalan, setT_aksesJalan]           = useState('');
  const [t_peruntukan, setT_peruntukan]           = useState<'komersial'|'residensial'|'perkebunan'|'lainnya'|''>('');
  const [t_bentukTanah, setT_bentukTanah]         = useState('');
  const [t_orientasiTanah, setT_orientasiTanah]   = useState('');
  const [t_beradaPerumahan, setT_beradaPerumahan] = useState(false);
  const [t_dekatFasilitas, setT_dekatFasilitas]   = useState('');

  // Ruko (id=5)
  const [rk_luasTanah, setRk_luasTanah]           = useState('');
  const [rk_luasBangunan, setRk_luasBangunan]     = useState('');
  const [rk_jumlahLantai, setRk_jumlahLantai]     = useState('');
  const [rk_lebarMuka, setRk_lebarMuka]           = useState('');
  const [rk_dayaListrik, setRk_dayaListrik]       = useState('');
  const [rk_garasi, setRk_garasi]                 = useState(false);
  const [rk_carport, setRk_carport]               = useState(false);
  const [rk_kondisi, setRk_kondisi]               = useState<'baru'|'renovasi'|'lama'|''>('');
  const [rk_sertifikat, setRk_sertifikat]         = useState<'SHM'|'HGB'|'AJB'|''>('');
  const [rk_tahunDibangun, setRk_tahunDibangun]   = useState('');
  const [rk_parkiranUmum, setRk_parkiranUmum]     = useState(false);
  const [rk_toiletPerLantai, setRk_toiletPerLantai]= useState(false);
  const [rk_aksesLoadingDock,setRk_aksesLoadingDock]= useState(false);
  const [rk_terlihatJalan,setRk_terlihatJalan]    = useState(false);
  const [rk_lokasiStrategis,setRk_lokasiStrategis]= useState(false);
  const [rk_peruntukan,setRk_peruntukan]         = useState<'komersial'|'kantor'|'gudang'|'toko'|'lainnya'|''>('');

  // Lainnya (id=6)
  const [l_judulKustom, setL_judulKustom]         = useState('');
  const [l_keterangan, setL_keterangan]           = useState('');
  const [l_fiturKhusus, setL_fiturKhusus]         = useState('');
  const [l_kategori, setL_kategori]               = useState<'gudang'|'kos-kosan'|'industri'|'lainnya'|''>('');
  const [l_izinUsaha, setL_izinUsaha]             = useState('');
  const [l_lingkunganIndustri, setL_lingkunganIndustri] = useState(false);
  const [l_aksesContainer, setL_aksesContainer]   = useState(false);
  const [l_dayaListrik, setL_dayaListrik]         = useState('');

  /** 4. Lookup data **/
  const [tipePropertiList, setTipePropertiList]     = useState<TipeProperti[]>([]);
  const [provinsiList, setProvinsiList]             = useState<Provinsi[]>([]);
  const [kotaListAll, setKotaListAll]               = useState<Kota[]>([]);
  const [kecamatanListAll, setKecamatanListAll]     = useState<Kecamatan[]>([]);
  const [kelurahanListAll, setKelurahanListAll]     = useState<Kelurahan[]>([]);

  const kotaList      = kotaListAll.filter(k => k.id_provinsi === selectedProvinsi);
  const kecamatanList = kecamatanListAll.filter(k => k.id_kota === selectedKota);
  const kelurahanList = kelurahanListAll.filter(k => k.id_kecamatan === selectedKecamatan);

  useEffect(() => {
    fetch('/api/tipe_properti').then(r => r.json()).then(j => setTipePropertiList(j.data || []));
    fetch('/api/lokasi/provinsi').then(r => r.json()).then(j => setProvinsiList(j.data || []));
    fetch('/api/lokasi/kota').then(r => r.json()).then(j => setKotaListAll(j.data || []));
    fetch('/api/lokasi/kecamatan').then(r => r.json()).then(j => setKecamatanListAll(j.data || []));
    fetch('/api/lokasi/kelurahan').then(r => r.json()).then(j => setKelurahanListAll(j.data || []));
  }, []);

  /** 5. Handlers **/
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setMediaFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!judul || !selectedTipe || !harga || !selectedProvinsi || !address) { // ← Modified
      alert('Lengkapi field wajib');
      return;
    }
    const payload: any = {
      judul,
      deskripsi,
      harga: Number(harga),
      dp_minimal: dpMinimal ? Number(dpMinimal) : null,
      estimasi_angsuran: estimasiAngsuran ? Number(estimasiAngsuran) : null,
      status_unit: statusUnit,
      status_hunian: statusHunian,
      id_tipe_properti: selectedTipe,
      id_provinsi: selectedProvinsi,
      id_kota: selectedKota || null,
      id_kecamatan: selectedKecamatan || null,
      id_kelurahan: selectedKelurahan || null,
      alamat_lengkap: address,
      lat: position[0],
      lng: position[1],
      lokasi_json: JSON.stringify({ lat: position[0], lng: position[1] }),
      video_link: videoLink || null
    };

    // attach type-specific fields...
    switch (selectedTipe) {
      case 1:
        Object.assign(payload, {
          luas_tanah: Number(r_luasTanah),
          luas_bangunan: Number(r_luasBangunan),
          jumlah_kamar: Number(r_jumlahKamar),
          jumlah_kamar_mandi: Number(r_jumlahKamarMandi),
          jumlah_lantai: Number(r_jumlahLantai),
          carport: r_carport ? 1 : 0,
          garasi: r_garasi ? 1 : 0,
          daya_listrik: Number(r_dayaListrik),
          sertifikat: r_sertifikat,
          orientasi: r_orientasi,
          akses_jalan: r_aksesJalan,
          tahun_dibangun: r_tahunDibangun,
          bebas_banjir: r_bebasBanjir ? 1 : 0,
          kondisi_bangunan: r_kondisiBangunan,
          perabotan: r_perabotan,
          kolam_renang: r_kolamRenang ? 1 : 0,
          taman: r_taman ? 1 : 0,
          posisi_rumah: r_posisiRumah,
          jendela_besar: r_jendelaBesar ? 1 : 0,
          pencahayaan_alami: r_pencahayaanAlami ? 1 : 0,
          ruang_keluarga_terbuka: r_ruangKeluargaTerbuka ? 1 : 0,
          dekat_fasilitas_umum: r_dekatFasilitas,
          lebar_jalan_depan: r_lebarJalanDepan,
          jarak_ke_jalan_utama: r_jarakKeJalanUtama
        });
        break;
      case 2:
        Object.assign(payload, {
          luas_bangunan: Number(a_luasBangunan),
          jumlah_kamar: Number(a_jumlahKamar),
          jumlah_kamar_mandi: Number(a_jumlahKamarMandi),
          lantai_unit: Number(a_lantaiUnit),
          total_lantai: Number(a_totalLantai),
          type_unit: a_typeUnit,
          biaya_maintenance: Number(a_biayaMaintenance),
          fasilitas_umum: a_fasilitasUmum,
          tahun_dibangun: Number(a_tahunDibangun),
          perabotan: a_perabotan,
          view_unit: a_viewUnit,
          akses_mall: a_aksesMall ? 1 : 0,
          akses_transportasi_umum: a_aksesTransportasi,
          ac_terpasang: a_acTerpasang ? 1 : 0,
          akses_lift_pribadi: a_aksesLiftPribadi ? 1 : 0,
          jumlah_unit_per_lantai: Number(a_jumlahUnitPerLantai)
        });
        break;
      case 3:
        Object.assign(payload, {
          luas_tanah: Number(g_luasTanah),
          luas_bangunan: Number(g_luasBangunan),
          jumlah_lantai: Number(g_jumlahLantai),
          kapasitas_orang: Number(g_kapasitasOrang),
          fungsi: g_fungsi,
          fasilitas: g_fasilitas,
          daya_listrik: Number(g_dayaListrik),
          tahun_dibangun: Number(g_tahunDibangun),
          genset: g_genset ? 1 : 0,
          sistem_pemadam_api: g_sistemPemadam ? 1 : 0,
          rooftop: g_rooftop ? 1 : 0,
          lift: g_lift ? 1 : 0,
          ruang_meeting: g_ruangMeeting ? 1 : 0,
          area_penerima_tamu: g_areaPenerima ? 1 : 0,
          akses_angkutan_umum: g_aksesAngkutan
        });
        break;
      case 4:
        Object.assign(payload, {
          luas_tanah: Number(t_luasTanah),
          jenis_tanah: t_jenisTanah,
          status_kepemilikan: t_statusKepemilikan,
          lebar_jalan_depan: parseFloat(t_lebarJalanDepan),
          kontur_tanah: t_kontur,
          bebas_banjir: t_bebasBanjir ? 1 : 0,
          akses_jalan: t_aksesJalan,
          peruntukan: t_peruntukan,
          bentuk_tanah: t_bentukTanah,
          orientasi_tanah: t_orientasiTanah,
          berada_di_perumahan: t_beradaPerumahan ? 1 : 0,
          dekat_fasilitas_umum: t_dekatFasilitas
        });
        break;
      case 5:
        Object.assign(payload, {
          luas_tanah: Number(rk_luasTanah),
          luas_bangunan: Number(rk_luasBangunan),
          jumlah_lantai: Number(rk_jumlahLantai),
          lebar_muka: parseFloat(rk_lebarMuka),
          daya_listrik: Number(rk_dayaListrik),
          garasi: rk_garasi ? 1 : 0,
          carport: rk_carport ? 1 : 0,
          kondisi: rk_kondisi,
          sertifikat: rk_sertifikat,
          tahun_dibangun: Number(rk_tahunDibangun),
          parkiran_umum: rk_parkiranUmum ? 1 : 0,
          toilet_per_lantai: rk_toiletPerLantai ? 1 : 0,
          akses_loading_dock: rk_aksesLoadingDock ? 1 : 0,
          terlihat_dari_jalan_raya: rk_terlihatJalan ? 1 : 0,
          lokasi_strategis: rk_lokasiStrategis ? 1 : 0,
          peruntukan: rk_peruntukan
        });
        break;
      case 6:
        Object.assign(payload, {
          judul_kustom: l_judulKustom,
          keterangan: l_keterangan,
          fitur_khusus: l_fiturKhusus,
          kategori_lainnya: l_kategori,
          izin_usaha: l_izinUsaha,
          lingkungan_industri: l_lingkunganIndustri ? 1 : 0,
          akses_container: l_aksesContainer ? 1 : 0,
          daya_listrik: Number(l_dayaListrik)
        });
        break;
    }

    // POST to API
    const res = await fetch('/api/properti', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await res.json();
    if (!res.ok) {
      alert(result.error);
      return;
    }
    const newId = result.data.id;

    // upload media
    if (mediaFiles.length) {
      const form = new FormData();
      mediaFiles.forEach(f => form.append('files', f));
      form.append('id_properti', String(newId));
      await fetch('/api/media_properti', { method: 'POST', body: form });
    }

    router.push('/admin/properti');
  };

  return (
    <div className="p-6 bg-white rounded shadow text-blue-900">
      <h1 className="text-2xl font-semibold mb-4">Tambah Properti</h1>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Common fields */}
        <div>
          <label>Judul</label>
          <input
            type="text"
            value={judul}
            onChange={e => setJudul(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label>Deskripsi</label>
          <textarea
            value={deskripsi}
            onChange={e => setDeskripsi(e.target.value)}
            className="w-full border rounded px-3 py-2"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <input
            type="number"
            placeholder="Harga"
            value={harga}
            onChange={e => setHarga(e.target.value)}
            className="border rounded px-3 py-2"
            required
          />
          <input
            type="number"
            placeholder="DP Minimal"
            value={dpMinimal}
            onChange={e => setDpMinimal(e.target.value)}
            className="border rounded px-3 py-2"
          />
          <input
            type="number"
            placeholder="Estimasi Angsuran"
            value={estimasiAngsuran}
            onChange={e => setEstimasiAngsuran(e.target.value)}
            className="border rounded px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <select
            value={statusUnit}
            onChange={e => setStatusUnit(e.target.value as any)}
            className="border rounded px-3 py-2"
          >
            <option value="dijual">Dijual</option>
            <option value="sold_out">Sold Out</option>
            <option value="disewa">Disewa</option>
          </select>
          <select
            value={statusHunian}
            onChange={e => setStatusHunian(e.target.value as any)}
            className="border rounded px-3 py-2"
          >
            <option value="dihuni">Dihuni</option>
            <option value="kosong">Kosong</option>
            <option value="disewakan">Disewakan</option>
            <option value="proyek">Proyek</option>
          </select>
        </div>

        {/* Tipe Properti */}
        <div>
          <label>Tipe Properti</label>
          <select
            value={selectedTipe}
            onChange={e => setSelectedTipe(Number(e.target.value))}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value={0} disabled>Pilih Tipe Properti</option>
            {tipePropertiList.map(t => (
              <option key={t.id} value={t.id}>{t.nama}</option>
            ))}
          </select>
        </div>

        {/* Alamat & Peta dalam satu blok */}
<div className="space-y-4">
  {/* 1. Autocomplete Alamat */}
  <div>
    <label className="block mb-1">Cari Alamat</label>
    <AddressAutocomplete
      value={address}
      onChange={setAddress}
      onSelect={(label, lat, lng) => {
        // Saat user pilih suggestion, pindahkan marker
        setAddress(label);
        setPosition([lat, lng]);
      }}
    />
  </div>

  {/* 2. Map + Search Control */}
  <div>
  <label className="block mb-2">Klik peta atau gunakan kotak di atas untuk mencari lokasi</label>
  <div style={{ height: 300, width: '100%' }}>
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      {/* 1. Tile layer dasar */}
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* 2. Kontrol pencarian di peta */}
      <MapSearchControl onSelect={(lat, lng) => setPosition([lat, lng])} />

      {/* 3. Marker yang bisa di‐drag dan klik */}
      <LocationMarker />

      {/* 4. ← INI DIA: RecenterMap harus di sini, di dalam MapContainer */}
      <RecenterMap position={position} />
    </MapContainer>
  </div>
</div>
</div>

        {/* Dynamic detail per tipe */}
        {selectedTipe === 1 && (
          <div className="border p-4 rounded space-y-3">
            <h2 className="font-medium">Detail Rumah</h2>
            <input type="number" placeholder="Luas Tanah" value={r_luasTanah} onChange={e => setR_luasTanah(e.target.value)} className="w-full border rounded px-3 py-2"/>
            <input type="number" placeholder="Luas Bangunan" value={r_luasBangunan} onChange={e => setR_luasBangunan(e.target.value)} className="w-full border rounded px-3 py-2"/>
            <div className="grid grid-cols-2 gap-4">
              <input type="number" placeholder="Jumlah Kamar" value={r_jumlahKamar} onChange={e => setR_jumlahKamar(e.target.value)} className="border rounded px-3 py-2"/>
              <input type="number" placeholder="Jumlah Kamar Mandi" value={r_jumlahKamarMandi} onChange={e => setR_jumlahKamarMandi(e.target.value)} className="border rounded px-3 py-2"/>
            </div>
            <input type="number" placeholder="Jumlah Lantai" value={r_jumlahLantai} onChange={e => setR_jumlahLantai(e.target.value)} className="w-full border rounded px-3 py-2"/>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center"><input type="checkbox" checked={r_carport} onChange={e => setR_carport(e.target.checked)} className="mr-2"/>Carport</label>
              <label className="flex items-center"><input type="checkbox" checked={r_garasi} onChange={e => setR_garasi(e.target.checked)} className="mr-2"/>Garasi</label>
            </div>
            <input type="number" placeholder="Daya Listrik (W)" value={r_dayaListrik} onChange={e => setR_dayaListrik(e.target.value)} className="w-full border rounded px-3 py-2"/>
            <select value={r_sertifikat} onChange={e => setR_sertifikat(e.target.value as any)} className="w-full border rounded px-3 py-2">
              <option value="">Pilih Sertifikat</option>
              <option value="SHM">SHM</option>
              <option value="HGB">HGB</option>
              <option value="AJB">AJB</option>
            </select>
            <input type="text" placeholder="Orientasi" value={r_orientasi} onChange={e => setR_orientasi(e.target.value)} className="w-full border rounded px-3 py-2"/>
            <input type="text" placeholder="Akses Jalan" value={r_aksesJalan} onChange={e => setR_aksesJalan(e.target.value)} className="w-full border rounded px-3 py-2"/>
            <input type="number" placeholder="Tahun Dibangun" value={r_tahunDibangun} onChange={e => setR_tahunDibangun(e.target.value)} className="w-full border rounded px-3 py-2"/>
            <label className="flex items-center"><input type="checkbox" checked={r_bebasBanjir} onChange={e => setR_bebasBanjir(e.target.checked)} className="mr-2"/>Bebas Banjir</label>
            <input type="text" placeholder="Kondisi Bangunan" value={r_kondisiBangunan} onChange={e => setR_kondisiBangunan(e.target.value)} className="w-full border rounded px-3 py-2"/>
            <select value={r_perabotan} onChange={e => setR_perabotan(e.target.value as any)} className="w-full border rounded px-3 py-2">
              <option value="tidak ada">Tidak Ada</option>
              <option value="sebagian">Sebagian</option>
              <option value="lengkap">Lengkap</option>
            </select>
            <div className="grid grid-cols-3 gap-4">
              <label className="flex items-center"><input type="checkbox" checked={r_kolamRenang} onChange={e => setR_kolamRenang(e.target.checked)} className="mr-2"/>Kolam Renang</label>
              <label className="flex items-center"><input type="checkbox" checked={r_taman} onChange={e => setR_taman(e.target.checked)} className="mr-2"/>Taman</label>
              <select value={r_posisiRumah} onChange={e => setR_posisiRumah(e.target.value as any)} className="border rounded px-3 py-2">
                <option value="">Posisi Rumah</option>
                <option value="hook">Hook</option>
                <option value="tengah">Tengah</option>
                <option value="pinggir">Pinggir</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center"><input type="checkbox" checked={r_jendelaBesar} onChange={e => setR_jendelaBesar(e.target.checked)} className="mr-2"/>Jendela Besar</label>
              <label className="flex items-center"><input type="checkbox" checked={r_pencahayaanAlami} onChange={e => setR_pencahayaanAlami(e.target.checked)} className="mr-2"/>Pencahayaan Alami</label>
            </div>
            <label className="flex items-center"><input type="checkbox" checked={r_ruangKeluargaTerbuka} onChange={e => setR_ruangKeluargaTerbuka(e.target.checked)} className="mr-2"/>Ruang Keluarga Terbuka</label>
            <input type="text" placeholder="Dekat Fasilitas Umum" value={r_dekatFasilitas} onChange={e => setR_dekatFasilitas(e.target.value)} className="w-full border rounded px-3 py-2"/>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Lebar Jalan Depan" value={r_lebarJalanDepan} onChange={e => setR_lebarJalanDepan(e.target.value)} className="border rounded px-3 py-2"/>
              <input type="text" placeholder="Jarak ke Jalan Utama" value={r_jarakKeJalanUtama} onChange={e => setR_jarakKeJalanUtama(e.target.value)} className="border rounded px-3 py-2"/>
            </div>
          </div>
        )}

        {selectedTipe === 2 && (
          <div className="border p-4 rounded space-y-3">
            <h2 className="font-medium">Detail Apartemen</h2>
            <input type="number" placeholder="Luas Bangunan" value={a_luasBangunan} onChange={e => setA_luasBangunan(e.target.value)} className="w-full border rounded px-3 py-2"/>
            <div className="grid grid-cols-2 gap-4">
              <input type="number" placeholder="Jumlah Kamar" value={a_jumlahKamar} onChange={e => setA_jumlahKamar(e.target.value)} className="border rounded px-3 py-2"/>
              <input type="number" placeholder="Jumlah Kamar Mandi" value={a_jumlahKamarMandi} onChange={e => setA_jumlahKamarMandi(e.target.value)} className="border rounded px-3 py-2"/>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input type="number" placeholder="Lantai Unit" value={a_lantaiUnit} onChange={e => setA_lantaiUnit(e.target.value)} className="border rounded px-3 py-2"/>
              <input type="number" placeholder="Total Lantai" value={a_totalLantai} onChange={e => setA_totalLantai(e.target.value)} className="border rounded px-3 py-2"/>
            </div>
            <select value={a_typeUnit} onChange={e => setA_typeUnit(e.target.value as any)} className="w-full border rounded px-3 py-2">
              <option value="">Type Unit</option>
              <option value="studio">Studio</option>
              <option value="1BR">1BR</option>
              <option value="2BR">2BR</option>
              <option value="3BR+">3BR+</option>
            </select>
            <input type="number" placeholder="Biaya Maintenance" value={a_biayaMaintenance} onChange={e => setA_biayaMaintenance(e.target.value)} className="w-full border rounded px-3 py-2"/>
            <textarea placeholder="Fasilitas Umum (JSON)" value={a_fasilitasUmum} onChange={e => setA_fasilitasUmum(e.target.value)} className="w-full border rounded px-3 py-2" rows={2}/>
            <input type="number" placeholder="Tahun Dibangun" value={a_tahunDibangun} onChange={e => setA_tahunDibangun(e.target.value)} className="w-full border rounded px-3 py-2"/>
            <select value={a_perabotan} onChange={e => setA_perabotan(e.target.value as any)} className="w-full border rounded px-3 py-2">
              <option value="tidak ada">Tidak Ada</option>
              <option value="sebagian">Sebagian</option>
              <option value="lengkap">Lengkap</option>
            </select>
            <input type="text" placeholder="View Unit" value={a_viewUnit} onChange={e => setA_viewUnit(e.target.value)} className="w-full border rounded px-3 py-2"/>
            <label className="flex items-center"><input type="checkbox" checked={a_aksesMall} onChange={e => setA_aksesMall(e.target.checked)} className="mr-2"/>Akses Mall</label>
            <textarea placeholder="Akses Transportasi Umum" value={a_aksesTransportasi} onChange={e => setA_aksesTransportasi(e.target.value)} className="w-full border rounded px-3 py-2" rows={2}/>
            <label className="flex items-center"><input type="checkbox" checked={a_acTerpasang} onChange={e => setA_acTerpasang(e.target.checked)} className="mr-2"/>AC Terpasang</label>
            <label className="flex items-center"><input type="checkbox" checked={a_aksesLiftPribadi} onChange={e => setA_aksesLiftPribadi(e.target.checked)} className="mr-2"/>Akses Lift Pribadi</label>
            <input type="number" placeholder="Jumlah Unit per Lantai" value={a_jumlahUnitPerLantai} onChange={e => setA_jumlahUnitPerLantai(e.target.value)} className="w-full border rounded px-3 py-2"/>
          </div>
        )}

        {selectedTipe === 3 && (
          <div className="border p-4 rounded space-y-3">
            <h2 className="font-medium">Detail Gedung</h2>
            <input type="number" placeholder="Luas Tanah" value={g_luasTanah} onChange={e => setG_luasTanah(e.target.value)} className="w-full border rounded px-3 py-2"/>
            <input type="number" placeholder="Luas Bangunan" value={g_luasBangunan} onChange={e => setG_luasBangunan(e.target.value)} className="w-full border rounded px-3 py-2"/>
            <input type="number" placeholder="Jumlah Lantai" value={g_jumlahLantai} onChange={e => setG_jumlahLantai(e.target.value)} className="w-full border rounded px-3 py-2"/>
            <input type="number" placeholder="Kapasitas Orang" value={g_kapasitasOrang} onChange={e => setG_kapasitasOrang(e.target.value)} className="w-full border rounded px-3 py-2"/>
            <select value={g_fungsi} onChange={e => setG_fungsi(e.target.value as any)} className="w-full border rounded px-3 py-2">
              <option value="">Fungsi</option>
              <option value="kantor">Kantor</option>
              <option value="pabrik">Pabrik</option>
              <option value="gudang">Gudang</option>
              <option value="sekolah">Sekolah</option>
              <option value="event hall">Event Hall</option>
            </select>
            <textarea placeholder="Fasilitas (JSON)" value={g_fasilitas} onChange={e => setG_fasilitas(e.target.value)} className="w-full border rounded px-3 py-2" rows={2}/>
            <input type="number" placeholder="Daya Listrik" value={g_dayaListrik} onChange={e => setG_dayaListrik(e.target.value)} className="w-full border rounded px-3 py-2"/>
            <input type="number" placeholder="Tahun Dibangun" value={g_tahunDibangun} onChange={e => setG_tahunDibangun(e.target.value)} className="w-full border rounded px-3 py-2"/>
            <label className="flex items-center"><input type="checkbox" checked={g_genset} onChange={e => setG_genset(e.target.checked)} className="mr-2"/>Genset</label>
            <label className="flex items-center"><input type="checkbox" checked={g_sistemPemadam} onChange={e => setG_sistemPemadam(e.target.checked)} className="mr-2"/>Sistem Pemadam Api</label>
            <label className="flex items-center"><input type="checkbox" checked={g_rooftop} onChange={e => setG_rooftop(e.target.checked)} className="mr-2"/>Rooftop</label>
            <label className="flex items-center"><input type="checkbox" checked={g_lift} onChange={e => setG_lift(e.target.checked)} className="mr-2"/>Lift</label>
            <label className="flex items-center"><input type="checkbox" checked={g_ruangMeeting} onChange={e => setG_ruangMeeting(e.target.checked)} className="mr-2"/>Ruang Meeting</label>
            <label className="flex items-center"><input type="checkbox" checked={g_areaPenerima} onChange={e => setG_areaPenerima(e.target.checked)} className="mr-2"/>Area Penerima Tamu</label>
            <textarea placeholder="Akses Angkutan Umum" value={g_aksesAngkutan} onChange={e => setG_aksesAngkutan(e.target.value)} className="w-full border rounded px-3 py-2" rows={2}/>
          </div>
        )}

        {selectedTipe === 4 && (
          <div className="border p-4 rounded space-y-3">
            <h2 className="font-medium">Detail Tanah</h2>
            <input type="number" placeholder="Luas Tanah" value={t_luasTanah} onChange={e => setT_luasTanah(e.target.value)} className="w-full border rounded px-3 py-2"/>
            <select value={t_jenisTanah} onChange={e => setT_jenisTanah(e.target.value as any)} className="w-full border rounded px-3 py-2">
              <option value="">Jenis Tanah</option>
              <option value="kavling">Kavling</option>
              <option value="pertanian">Pertanian</option>
              <option value="pekarangan">Pekarangan</option>
            </select>
            <select value={t_statusKepemilikan} onChange={e => setT_statusKepemilikan(e.target.value as any)} className="w-full border rounded px-3 py-2">
              <option value="">Status Kepemilikan</option>
              <option value="SHM">SHM</option>
              <option value="HGB">HGB</option>
              <option value="AJB">AJB</option>
              <option value="Girik">Girik</option>
            </select>
            <input type="text" placeholder="Lebar Jalan Depan" value={t_lebarJalanDepan} onChange={e => setT_lebarJalanDepan(e.target.value)} className="w-full border rounded px-3 py-2"/>
            <select value={t_kontur} onChange={e => setT_kontur(e.target.value as any)} className="w-full border rounded px-3 py-2">
              <option value="">Kontur Tanah</option>
              <option value="datar">Datar</option>
              <option value="miring">Miring</option>
            </select>
            <label className="flex items-center"><input type="checkbox" checked={t_bebasBanjir} onChange={e => setT_bebasBanjir(e.target.checked)} className="mr-2"/>Bebas Banjir</label>
            <input type="text" placeholder="Akses Jalan" value={t_aksesJalan} onChange={e => setT_aksesJalan(e.target.value)} className="w-full border rounded px-3 py-2"/>
            <select value={t_peruntukan} onChange={e => setT_peruntukan(e.target.value as any)} className="w-full border rounded px-3 py-2">
              <option value="">Peruntukan</option>
              <option value="komersial">Komersial</option>
              <option value="residensial">Residensial</option>
              <option value="perkebunan">Perkebunan</option>
              <option value="lainnya">Lainnya</option>
            </select>
            <input type="text" placeholder="Bentuk Tanah" value={t_bentukTanah} onChange={e => setT_bentukTanah(e.target.value)} className="w-full border rounded px-3 py-2"/>
            <input type="text" placeholder="Orientasi Tanah" value={t_orientasiTanah} onChange={e => setT_orientasiTanah(e.target.value)} className="w-full border rounded px-3 py-2"/>
            <label className="flex items-center"><input type="checkbox" checked={t_beradaPerumahan} onChange={e => setT_beradaPerumahan(e.target.checked)} className="mr-2"/>Berada di Perumahan</label>
            <input type="text" placeholder="Dekat Fasilitas Umum" value={t_dekatFasilitas} onChange={e => setT_dekatFasilitas(e.target.value)} className="w-full border rounded px-3 py-2"/>
          </div>
        )}

        {selectedTipe === 5 && (
          <div className="border p-4 rounded space-y-3">
            <h2 className="font-medium">Detail Ruko</h2>
            <input type="number" placeholder="Luas Tanah" value={rk_luasTanah} onChange={e => setRk_luasTanah(e.target.value)} className="w-full border rounded px-3 py-2"/>
            <input type="number" placeholder="Luas Bangunan" value={rk_luasBangunan} onChange={e => setRk_luasBangunan(e.target.value)} className="w-full border rounded px-3 py-2"/>
            <input type="number" placeholder="Jumlah Lantai" value={rk_jumlahLantai} onChange={e => setRk_jumlahLantai(e.target.value)} className="w-full border rounded px-3 py-2"/>
            <input type="number" placeholder="Lebar Muka" value={rk_lebarMuka} onChange={e => setRk_lebarMuka(e.target.value)} className="w-full border rounded px-3 py-2"/>
            <input type="number" placeholder="Daya Listrik" value={rk_dayaListrik} onChange={e => setRk_dayaListrik(e.target.value)} className="w-full border rounded px-3 py-2"/>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center"><input type="checkbox" checked={rk_garasi} onChange={e => setRk_garasi(e.target.checked)} className="mr-2"/>Garasi</label>
              <label className="flex items-center"><input type="checkbox" checked={rk_carport} onChange={e => setRk_carport(e.target.checked)} className="mr-2"/>Carport</label>
            </div>
            <select value={rk_kondisi} onChange={e => setRk_kondisi(e.target.value as any)} className="w-full border rounded px-3 py-2">
              <option value="">Kondisi</option>
              <option value="baru">Baru</option>
              <option value="renovasi">Renovasi</option>
              <option value="lama">Lama</option>
            </select>
            <select value={rk_sertifikat} onChange={e => setRk_sertifikat(e.target.value as any)} className="w-full border rounded px-3 py-2">
              <option value="">Sertifikat</option>
              <option value="SHM">SHM</option>
              <option value="HGB">HGB</option>
              <option value="AJB">AJB</option>
            </select>
            <input type="number" placeholder="Tahun Dibangun" value={rk_tahunDibangun} onChange={e => setRk_tahunDibangun(e.target.value)} className="w-full border rounded px-3 py-2"/>
            <label className="flex items-center"><input type="checkbox" checked={rk_parkiranUmum} onChange={e => setRk_parkiranUmum(e.target.checked)} className="mr-2"/>Parkiran Umum</label>
            <label className="flex items-center"><input type="checkbox" checked={rk_toiletPerLantai} onChange={e => setRk_toiletPerLantai(e.target.checked)} className="mr-2"/>Toilet per Lantai</label>
            <label className="flex items-center"><input type="checkbox" checked={rk_aksesLoadingDock} onChange={e => setRk_aksesLoadingDock(e.target.checked)} className="mr-2"/>Akses Loading Dock</label>
            <label className="flex items-center"><input type="checkbox" checked={rk_terlihatJalan} onChange={e => setRk_terlihatJalan(e.target.checked)} className="mr-2"/>Terlihat dari Jalan Raya</label>
            <label className="flex items-center"><input type="checkbox" checked={rk_lokasiStrategis} onChange={e => setRk_lokasiStrategis(e.target.checked)} className="mr-2"/>Lokasi Strategis</label>
            <select value={rk_peruntukan} onChange={e => setRk_peruntukan(e.target.value as any)} className="w-full border rounded px-3 py-2">
              <option value="">Peruntukan</option>
              <option value="komersial">Komersial</option>
              <option value="kantor">Kantor</option>
              <option value="gudang">Gudang</option>
              <option value="toko">Toko</option>
              <option value="lainnya">Lainnya</option>
            </select>
          </div>
        )}

        {selectedTipe === 6 && (
          <div className="border p-4 rounded space-y-3">
            <h2 className="font-medium">Detail Properti Lainnya</h2>
            <input type="text" placeholder="Judul Kustom" value={l_judulKustom} onChange={e => setL_judulKustom(e.target.value)} className="w-full border rounded px-3 py-2"/>
            <textarea placeholder="Keterangan" value={l_keterangan} onChange={e => setL_keterangan(e.target.value)} className="w-full border rounded px-3 py-2" rows={3}/>
            <textarea placeholder="Fitur Khusus (JSON)" value={l_fiturKhusus} onChange={e => setL_fiturKhusus(e.target.value)} className="w-full border rounded px-3 py-2" rows={2}/>
            <select value={l_kategori} onChange={e => setL_kategori(e.target.value as any)} className="w-full border rounded px-3 py-2">
              <option value="">Kategori</option>
              <option value="gudang">Gudang</option>
              <option value="kos-kosan">Kos-kosan</option>
              <option value="industri">Industri</option>
              <option value="lainnya">Lainnya</option>
            </select>
            <textarea placeholder="Izin Usaha" value={l_izinUsaha} onChange={e => setL_izinUsaha(e.target.value)} className="w-full border rounded px-3 py-2" rows={2}/>
            <label className="flex items-center"><input type="checkbox" checked={l_lingkunganIndustri} onChange={e => setL_lingkunganIndustri(e.target.checked)} className="mr-2"/>Lingkungan Industri</label>
            <label className="flex items-center"><input type="checkbox" checked={l_aksesContainer} onChange={e => setL_aksesContainer(e.target.checked)} className="mr-2"/>Akses Container</label>
            <input type="number" placeholder="Daya Listrik" value={l_dayaListrik} onChange={e => setL_dayaListrik(e.target.value)} className="w-full border rounded px-3 py-2"/>
          </div>
        )}

        {/* Location selects */}
        <div>
          <label>Provinsi</label>
          <select value={selectedProvinsi} onChange={e => setSelectedProvinsi(Number(e.target.value))} className="w-full border rounded px-3 py-2" required>
            <option value={0} disabled>Pilih Provinsi</option>
            {provinsiList.map(p => (
              <option key={p.id} value={p.id}>{p.nama}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <select value={selectedKota} onChange={e => setSelectedKota(Number(e.target.value))} className="w-full border rounded px-3 py-2" required>
            <option value={0} disabled>Pilih Kota</option>
            {kotaList.map(k => (
              <option key={k.id} value={k.id}>{k.nama}</option>
            ))}
          </select>
          <select value={selectedKecamatan} onChange={e => setSelectedKecamatan(Number(e.target.value))} className="w-full border rounded px-3 py-2">
            <option value={0} disabled>Pilih Kecamatan</option>
            {kecamatanList.map(c => (
              <option key={c.id} value={c.id}>{c.nama}</option>
            ))}
          </select>
        </div>
        <select value={selectedKelurahan} onChange={e => setSelectedKelurahan(Number(e.target.value))} className="w-full border rounded px-3 py-2">
          <option value={0} disabled>Pilih Kelurahan</option>
          {kelurahanList.map(k => (
            <option key={k.id} value={k.id}>{k.nama}</option>
          ))}
        </select>

        {/* Media & Video */}
        <div>
          <label>Foto Properti (multiple)</label>
          <input type="file" multiple accept="image/*" onChange={handleFileChange} className="w-full"/>
        </div>
        <div>
          <label>Link Video (URL)</label>
          <input type="url" value={videoLink} onChange={e => setVideoLink(e.target.value)} className="w-full border rounded px-3 py-2"/>
        </div>

        {/* Submit */}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Simpan Properti
        </button>
      </form>
    </div>
  );
}
