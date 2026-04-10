import type { Company, Alert, Sensor, TrendPoint } from '@/types'

export const MOCK_STATS = {
  totalSensors:   247,
  sensorDelta:    12,
  totalCompanies: 18,
  newCompanies:   2,
  problemSensors: 7,
  problemDelta:   3,
  totalUsers:     134,
  activeRoles:    4,
  avgSubsidence:  -2.34,
}

/* Wilayah = Kabupaten / Kota di Lampung */
export const MOCK_COMPANIES: Company[] = [
  { id:'1', name:'PT Maju Jaya Tbk',   region:'Bandar Lampung',   sensorCount:34, activeSensors:34, status:'active',     avgSubsidence:-2.41 },
  { id:'2', name:'PT Bumi Raya',        region:'Lampung Selatan',  sensorCount:18, activeSensors:17, status:'evaluation', avgSubsidence:-4.82 },
  { id:'3', name:'PT Tirta Mandiri',    region:'Lampung Tengah',   sensorCount:27, activeSensors:27, status:'active',     avgSubsidence:-1.10 },
  { id:'4', name:'PT Sumber Air',       region:'Lampung Utara',    sensorCount:21, activeSensors:20, status:'active',     avgSubsidence:-3.30 },
  { id:'5', name:'PT Karya Makmur',     region:'Metro',            sensorCount:15, activeSensors:15, status:'active',     avgSubsidence:-0.82 },
  { id:'6', name:'PT Indo Nusantara',   region:'Lampung Timur',    sensorCount:11, activeSensors:11, status:'active',     avgSubsidence:-2.90 },
]

export const MOCK_ALERTS: Alert[] = [
  { id:'1', type:'critical', title:'Subsidence melebihi threshold',        subtitle:'Sensor GN-042 · PT Bumi Raya',     detail:'-4.82 cm/thn · 08:14 WIB', time:'08:14' },
  { id:'2', type:'critical', title:'Sensor offline > 2 jam',               subtitle:'Sensor SW-019 · PT Bumi Raya',     detail:'Last seen 06:02 WIB',        time:'08:02' },
  { id:'3', type:'warning',  title:'Muka air tanah menurun signifikan',     subtitle:'SW-031 · PT Sumber Air',           detail:'-3.2m dari baseline',        time:'07:45' },
  { id:'4', type:'warning',  title:'Batas pengambilan air mendekati kuota', subtitle:'PT Tirta Mandiri · 87% kuota',     detail:'',                           time:'07:30' },
  { id:'5', type:'info',     title:'Kalibrasi sensor terjadwal',            subtitle:'12 sensor · Besok 07:00 WIB',      detail:'',                           time:'Besok'  },
  { id:'6', type:'info',     title:'User baru menunggu verifikasi',         subtitle:'3 akun · PT Karya Makmur',         detail:'',                           time:'06:00'  },
  { id:'7', type:'warning',  title:'Anomali data GNSS terdeteksi',          subtitle:'GN-067 · Spike nilai tiba-tiba',   detail:'',                           time:'05:20'  },
]

/*
  Koordinat titik-titik di Provinsi Lampung:

  Kota / Ibu Kota Kab      Lat        Lng
  ─────────────────────────────────────────
  Bandar Lampung          -5.400     105.265
  Teluk Betung            -5.455     105.261
  Rajabasa                -5.384     105.253
  Kedaton                 -5.381     105.249
  Tanjung Karang          -5.420     105.257
  Sukadanaham             -5.402     105.223
  Natar (Lam-Sel)         -5.249     105.174
  Kalianda (Lam-Sel)      -5.713     105.558
  Kota Agung (Tanggamus)  -5.470     104.630
  Pringsewu               -5.358     104.972
  Metro                   -5.110     105.307
  Bandar Jaya (Lam-Tgh)   -4.882     105.254
  Gunung Sugih (Lam-Tgh)  -4.758     105.343
  Kotabumi (Lam-Ut)       -4.833     104.900
  Bukit Kemuning (Lam-Ut) -4.598     104.762
  Sukadana (Lam-Tim)      -5.070     105.790
  Menggala (Tul. Bawang)  -4.305     105.650
  Blambangan Umpu (Way Kanan) -4.350 104.080
  Pesisir Tengah (Pesibar)-5.160     103.940
  Gedong Tataan (Pesawaran)-5.330    105.060
*/

export const MOCK_SENSORS: Sensor[] = [
  /* ── Bandar Lampung cluster ─────────────────────────── */
  { id:'1',  code:'SW-019', type:'air_tanah', companyId:'1', companyName:'PT Maju Jaya',   location:'Teluk Betung Utara, Bandar Lampung',   lat:-5.455, lng:105.261, status:'critical', value:-3.20, unit:'m',       lastUpdate:'06:00 WIB' },
  { id:'2',  code:'GN-042', type:'gnss',      companyId:'1', companyName:'PT Maju Jaya',   location:'Rajabasa, Bandar Lampung',              lat:-5.384, lng:105.253, status:'warning',  value:-4.82, unit:'cm/thn',  lastUpdate:'05:30 WIB' },
  { id:'3',  code:'SW-001', type:'air_tanah', companyId:'1', companyName:'PT Maju Jaya',   location:'Kedaton, Bandar Lampung',               lat:-5.381, lng:105.249, status:'online',   value:-0.85, unit:'m',       lastUpdate:'07:32 WIB' },
  { id:'4',  code:'GN-011', type:'gnss',      companyId:'1', companyName:'PT Maju Jaya',   location:'Tanjung Karang Pusat, Bandar Lampung',  lat:-5.420, lng:105.257, status:'online',   value:-1.22, unit:'cm/thn',  lastUpdate:'08:12 WIB' },
  { id:'5',  code:'SW-007', type:'air_tanah', companyId:'1', companyName:'PT Maju Jaya',   location:'Sukadanaham, Bandar Lampung',           lat:-5.402, lng:105.223, status:'online',   value:-1.05, unit:'m',       lastUpdate:'07:58 WIB' },

  /* ── Lampung Selatan cluster ─────────────────────────── */
  { id:'6',  code:'SW-023', type:'air_tanah', companyId:'4', companyName:'PT Sumber Air',  location:'Natar, Lampung Selatan',                lat:-5.249, lng:105.174, status:'online',   value:-1.10, unit:'m',       lastUpdate:'07:45 WIB' },
  { id:'7',  code:'GN-067', type:'gnss',      companyId:'2', companyName:'PT Bumi Raya',   location:'Kalianda, Lampung Selatan',             lat:-5.713, lng:105.558, status:'warning',  value:-3.91, unit:'cm/thn',  lastUpdate:'05:00 WIB' },
  { id:'8',  code:'SW-031', type:'air_tanah', companyId:'2', companyName:'PT Bumi Raya',   location:'Sidomulyo, Lampung Selatan',            lat:-5.558, lng:105.401, status:'offline',  value:-2.80, unit:'m',       lastUpdate:'03:10 WIB' },

  /* ── Tanggamus & Pringsewu cluster ─────────────────── */
  { id:'9',  code:'SW-045', type:'air_tanah', companyId:'3', companyName:'PT Tirta',       location:'Kota Agung, Tanggamus',                 lat:-5.470, lng:104.630, status:'online',   value:-0.71, unit:'m',       lastUpdate:'07:50 WIB' },
  { id:'10', code:'GN-055', type:'gnss',      companyId:'3', companyName:'PT Tirta',       location:'Pringsewu Kota',                        lat:-5.358, lng:104.972, status:'online',   value:-1.44, unit:'cm/thn',  lastUpdate:'08:00 WIB' },

  /* ── Metro & Lampung Tengah cluster ─────────────────── */
  { id:'11', code:'SW-061', type:'air_tanah', companyId:'5', companyName:'PT Karya',       location:'Metro Pusat, Kota Metro',               lat:-5.110, lng:105.307, status:'online',   value:-0.55, unit:'m',       lastUpdate:'07:42 WIB' },
  { id:'12', code:'GN-072', type:'gnss',      companyId:'3', companyName:'PT Tirta',       location:'Bandar Jaya, Lampung Tengah',           lat:-4.882, lng:105.254, status:'online',   value:-1.88, unit:'cm/thn',  lastUpdate:'07:55 WIB' },
  { id:'13', code:'SW-075', type:'air_tanah', companyId:'3', companyName:'PT Tirta',       location:'Gunung Sugih, Lampung Tengah',          lat:-4.758, lng:105.343, status:'online',   value:-0.92, unit:'m',       lastUpdate:'07:20 WIB' },

  /* ── Lampung Utara cluster ───────────────────────────── */
  { id:'14', code:'SW-081', type:'air_tanah', companyId:'4', companyName:'PT Sumber Air',  location:'Kotabumi, Lampung Utara',               lat:-4.833, lng:104.900, status:'warning',  value:-3.20, unit:'m',       lastUpdate:'07:00 WIB' },
  { id:'15', code:'GN-090', type:'gnss',      companyId:'4', companyName:'PT Sumber Air',  location:'Bukit Kemuning, Lampung Utara',         lat:-4.598, lng:104.762, status:'online',   value:-2.05, unit:'cm/thn',  lastUpdate:'07:10 WIB' },

  /* ── Lampung Timur cluster ───────────────────────────── */
  { id:'16', code:'SW-095', type:'air_tanah', companyId:'6', companyName:'PT Indo Nusa',   location:'Sukadana, Lampung Timur',               lat:-5.070, lng:105.790, status:'online',   value:-1.25, unit:'m',       lastUpdate:'07:50 WIB' },
  { id:'17', code:'GN-099', type:'gnss',      companyId:'6', companyName:'PT Indo Nusa',   location:'Menggala, Tulang Bawang',               lat:-4.305, lng:105.650, status:'online',   value:-1.65, unit:'cm/thn',  lastUpdate:'06:45 WIB' },

  /* ── Pesawaran & Pesisir Barat ──────────────────────── */
  { id:'18', code:'SW-102', type:'air_tanah', companyId:'1', companyName:'PT Maju Jaya',   location:'Gedong Tataan, Pesawaran',              lat:-5.330, lng:105.060, status:'online',   value:-1.42, unit:'m',       lastUpdate:'07:25 WIB' },
  { id:'19', code:'GN-108', type:'gnss',      companyId:'5', companyName:'PT Karya',       location:'Pesisir Tengah, Pesisir Barat',         lat:-5.160, lng:103.940, status:'online',   value:-0.95, unit:'cm/thn',  lastUpdate:'06:50 WIB' },

  /* ── Way Kanan ──────────────────────────────────────── */
  { id:'20', code:'SW-115', type:'air_tanah', companyId:'4', companyName:'PT Sumber Air',  location:'Blambangan Umpu, Way Kanan',            lat:-4.350, lng:104.080, status:'online',   value:-1.80, unit:'m',       lastUpdate:'07:15 WIB' },
]

export const MOCK_TREND: TrendPoint[] = [
  { month:'Apr', value:-1.82, threshold:-4 },
  { month:'Mei', value:-1.95, threshold:-4 },
  { month:'Jun', value:-2.10, threshold:-4 },
  { month:'Jul', value:-2.18, threshold:-4 },
  { month:'Agu', value:-2.25, threshold:-4 },
  { month:'Sep', value:-2.31, threshold:-4 },
  { month:'Okt', value:-2.28, threshold:-4 },
  { month:'Nov', value:-2.40, threshold:-4 },
  { month:'Des', value:-2.35, threshold:-4 },
  { month:'Jan', value:-2.50, threshold:-4 },
  { month:'Feb', value:-2.44, threshold:-4 },
  { month:'Mar', value:-2.55, threshold:-4 },
]