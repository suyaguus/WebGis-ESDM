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

export const MOCK_COMPANIES: Company[] = [
  { id:'1', name:'PT Maju Jaya Tbk',   region:'Jakarta Utara', sensorCount:34, activeSensors:34, status:'active',     avgSubsidence:-2.41 },
  { id:'2', name:'PT Bumi Raya',        region:'Bekasi',        sensorCount:18, activeSensors:17, status:'evaluation', avgSubsidence:-4.82 },
  { id:'3', name:'PT Tirta Mandiri',    region:'Tangerang',     sensorCount:27, activeSensors:27, status:'active',     avgSubsidence:-1.10 },
  { id:'4', name:'PT Sumber Air',       region:'Depok',         sensorCount:21, activeSensors:20, status:'active',     avgSubsidence:-3.30 },
  { id:'5', name:'PT Karya Makmur',     region:'Bogor',         sensorCount:15, activeSensors:15, status:'active',     avgSubsidence:-0.82 },
  { id:'6', name:'PT Indo Nusantara',   region:'Jakarta Barat', sensorCount:11, activeSensors:11, status:'active',     avgSubsidence:-2.90 },
]

export const MOCK_ALERTS: Alert[] = [
  { id:'1', type:'critical', title:'Subsidence melebihi threshold',          subtitle:'Sensor GN-042 · PT Bumi Raya',       detail:'-4.82 cm/thn · 08:14 WIB', time:'08:14' },
  { id:'2', type:'critical', title:'Sensor offline > 2 jam',                 subtitle:'Sensor SW-019 · PT Bumi Raya',       detail:'Last seen 06:02 WIB',       time:'08:02' },
  { id:'3', type:'warning',  title:'Muka air tanah menurun signifikan',       subtitle:'SW-031 · PT Sumber Air',             detail:'-3.2m dari baseline',       time:'07:45' },
  { id:'4', type:'warning',  title:'Batas pengambilan air mendekati kuota',   subtitle:'PT Tirta Mandiri · 87% kuota',       detail:'',                          time:'07:30' },
  { id:'5', type:'info',     title:'Kalibrasi sensor terjadwal',              subtitle:'12 sensor · Besok 07:00 WIB',        detail:'',                          time:'Besok'  },
  { id:'6', type:'info',     title:'User baru menunggu verifikasi',           subtitle:'3 akun · PT Karya Makmur',           detail:'',                          time:'06:00'  },
  { id:'7', type:'warning',  title:'Anomali data GNSS terdeteksi',            subtitle:'GN-067 · Spike nilai tiba-tiba',     detail:'',                          time:'05:20'  },
]

export const MOCK_SENSORS: Sensor[] = [
  { id:'1', code:'SW-019', type:'air_tanah', companyId:'1', companyName:'PT Maju Jaya', location:'Latumenten, Jak-Bar', lat:-6.155, lng:106.790, status:'critical', value:-3.20, unit:'m',      lastUpdate:'06:00 WIB' },
  { id:'2', code:'GN-042', type:'gnss',      companyId:'2', companyName:'PT Bumi Raya', location:'Penjaringan, Jak-Ut', lat:-6.125, lng:106.792, status:'warning',  value:-4.82, unit:'cm/thn', lastUpdate:'05:30 WIB' },
  { id:'3', code:'SW-001', type:'air_tanah', companyId:'1', companyName:'PT Maju Jaya', location:'Tanjung Priok',       lat:-6.108, lng:106.885, status:'online',   value:-0.85, unit:'m',      lastUpdate:'07:32 WIB' },
  { id:'4', code:'GN-011', type:'gnss',      companyId:'1', companyName:'PT Maju Jaya', location:'Cempaka Putih',       lat:-6.178, lng:106.868, status:'online',   value:-1.22, unit:'cm/thn', lastUpdate:'08:12 WIB' },
  { id:'5', code:'SW-023', type:'air_tanah', companyId:'3', companyName:'PT Tirta',     location:'Kelapa Gading',       lat:-6.158, lng:106.905, status:'online',   value:-1.10, unit:'m',      lastUpdate:'07:45 WIB' },
  { id:'6', code:'SW-031', type:'air_tanah', companyId:'4', companyName:'PT Sumber',    location:'Kemayoran',           lat:-6.152, lng:106.845, status:'warning',  value:-3.20, unit:'m',      lastUpdate:'07:00 WIB' },
  { id:'7', code:'GN-067', type:'gnss',      companyId:'2', companyName:'PT Bumi Raya', location:'Penjaringan Barat',   lat:-6.132, lng:106.780, status:'warning',  value:-3.91, unit:'cm/thn', lastUpdate:'05:00 WIB' },
  { id:'8', code:'SW-045', type:'air_tanah', companyId:'5', companyName:'PT Karya',     location:'Bogor Tengah',        lat:-6.595, lng:106.816, status:'online',   value:-0.41, unit:'m',      lastUpdate:'07:50 WIB' },
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
