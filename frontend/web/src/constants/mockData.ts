import type { Sensor, Company, Alert, TrendDataPoint } from '../types';

export const MOCK_SENSORS: Sensor[] = [
  // c1 — PT Maju Jaya Tbk (Bandar Lampung)
  { id: 's1',  code: 'SW-007', type: 'water', location: 'Rajabasa',         lat: -5.395, lng: 105.240, status: 'alert',       subsidence: -4.82, waterLevel: -38.2, verticalValue: 18.431, companyId: 'c1', lastUpdate: '08:14 WIB' },
  { id: 's2',  code: 'GN-022', type: 'gnss',  location: 'Tanjung Karang',   lat: -5.433, lng: 105.261, status: 'alert',       subsidence: -4.10, verticalValue: 22.14, companyId: 'c1', lastUpdate: '08:20 WIB' },
  // c2 — PT Bumi Raya (Metro)
  { id: 's3',  code: 'SW-012', type: 'water', location: 'Kota Metro',        lat: -5.114, lng: 105.307, status: 'online',      subsidence: -2.94, waterLevel: -30.1, verticalValue: 20.762, companyId: 'c2', lastUpdate: '08:05 WIB' },
  { id: 's4',  code: 'GN-018', type: 'gnss',  location: 'Metro Pusat',       lat: -5.125, lng: 105.319, status: 'online',      subsidence: -2.41, verticalValue: 16.88, companyId: 'c2', lastUpdate: '07:55 WIB' },
  // c3 — PT Tirta Mandiri (Pringsewu)
  { id: 's5',  code: 'SW-001', type: 'water', location: 'Pringsewu Kota',    lat: -5.360, lng: 104.972, status: 'online',      subsidence: -1.20, waterLevel: -24.5, verticalValue: 12.30, companyId: 'c3', lastUpdate: '08:00 WIB' },
  { id: 's6',  code: 'GN-012', type: 'gnss',  location: 'Gedung Tataan',     lat: -5.349, lng: 105.115, status: 'online',      subsidence: -0.88, verticalValue: 9.14, companyId: 'c3', lastUpdate: '07:48 WIB' },
  // c4 — PT Sumber Air (Tanggamus)
  { id: 's7',  code: 'SW-019', type: 'water', location: 'Kota Agung',        lat: -5.479, lng: 104.638, status: 'maintenance', subsidence: -1.60, waterLevel: -26.8, verticalValue: 14.22, companyId: 'c4', lastUpdate: '07:30 WIB' },
  { id: 's8',  code: 'GN-045', type: 'gnss',  location: 'Talang Padang',     lat: -5.393, lng: 104.871, status: 'online',      subsidence: -1.94, verticalValue: 11.55, companyId: 'c4', lastUpdate: '08:10 WIB' },
  // c5 — PT Karya Makmur (Kotabumi)
  { id: 's9',  code: 'SW-031', type: 'water', location: 'Kotabumi Kota',     lat: -4.826, lng: 104.905, status: 'alert',       subsidence: -3.50, waterLevel: -35.0, companyId: 'c5', lastUpdate: '08:18 WIB' },
  { id: 's10', code: 'GN-067', type: 'gnss',  location: 'Bukit Kemuning',    lat: -4.692, lng: 104.837, status: 'online',      subsidence: -1.12, verticalValue: 8.44, companyId: 'c5', lastUpdate: '08:02 WIB' },
];

export const MOCK_COMPANIES: Company[] = [
  { id: 'c1', name: 'PT Maju Jaya Tbk', region: 'Bandar Lampung', sensorCount: 34, status: 'online', quota: 200000, quotaUsed: 174000, avgSubsidence: -2.71 },
  { id: 'c2', name: 'PT Bumi Raya', region: 'Kota Metro', sensorCount: 18, status: 'offline', quota: 150000, quotaUsed: 154500, avgSubsidence: -3.20 },
  { id: 'c3', name: 'PT Tirta Mandiri', region: 'Pringsewu', sensorCount: 27, status: 'online', quota: 180000, quotaUsed: 109800, avgSubsidence: -1.85 },
  { id: 'c4', name: 'PT Sumber Air', region: 'Tanggamus', sensorCount: 21, status: 'maintenance', quota: 120000, quotaUsed: 114000, avgSubsidence: -2.15 },
  { id: 'c5', name: 'PT Karya Makmur', region: 'Lampung Utara', sensorCount: 15, status: 'online', quota: 100000, quotaUsed: 48000, avgSubsidence: -1.42 },
];

export const MOCK_ALERTS: Alert[] = [
  { id: 'a1', severity: 'critical', title: 'Subsidence melebihi threshold', description: 'Sensor GN-042 mencatat -4.82 cm/thn · PT Maju Jaya', sensorCode: 'GN-042', companyName: 'PT Maju Jaya', timestamp: '08:14 WIB', isRead: false },
  { id: 'a2', severity: 'critical', title: 'Sensor offline > 2 jam', description: 'Sensor SW-019 tidak mengirim data · PT Bumi Raya', sensorCode: 'SW-019', companyName: 'PT Bumi Raya', timestamp: '06:02 WIB', isRead: false },
  { id: 'a3', severity: 'warning', title: 'Muka air tanah menurun signifikan', description: 'SW-031 turun 3.2m dari baseline · PT Sumber Air', sensorCode: 'SW-031', companyName: 'PT Sumber Air', timestamp: '07:45 WIB', isRead: false },
  { id: 'a4', severity: 'warning', title: 'Batas pengambilan air mendekati kuota', description: 'PT Tirta Mandiri mencapai 87% dari kuota tahunan', companyName: 'PT Tirta Mandiri', timestamp: '07:00 WIB', isRead: true },
  { id: 'a5', severity: 'info', title: 'Kalibrasi sensor terjadwal', description: '12 sensor akan dikalibrasi besok pukul 07:00 WIB', timestamp: '06:00 WIB', isRead: true },
  { id: 'a6', severity: 'info', title: 'User baru menunggu verifikasi', description: '3 akun baru dari PT Karya Makmur menunggu approval', companyName: 'PT Karya Makmur', timestamp: '05:30 WIB', isRead: true },
  { id: 'a7', severity: 'warning', title: 'Anomali data GNSS terdeteksi', description: 'Spike nilai mendadak pada GN-067 · perlu investigasi', sensorCode: 'GN-067', timestamp: '04:20 WIB', isRead: true },
];

export const TREND_DATA: TrendDataPoint[] = [
  { label: 'Apr', subsidence: -1.82, threshold: -4.0 },
  { label: 'Mei', subsidence: -1.95, threshold: -4.0 },
  { label: 'Jun', subsidence: -2.10, threshold: -4.0 },
  { label: 'Jul', subsidence: -2.18, threshold: -4.0 },
  { label: 'Agu', subsidence: -2.25, threshold: -4.0 },
  { label: 'Sep', subsidence: -2.31, threshold: -4.0 },
  { label: 'Okt', subsidence: -2.28, threshold: -4.0 },
  { label: 'Nov', subsidence: -2.40, threshold: -4.0 },
  { label: 'Des', subsidence: -2.35, threshold: -4.0 },
  { label: 'Jan', subsidence: -2.50, threshold: -4.0 },
  { label: 'Feb', subsidence: -2.44, threshold: -4.0 },
  { label: 'Mar', subsidence: -2.55, threshold: -4.0 },
];

export const SUPERADMIN_STATS = [
  { label: 'Total Sensor Aktif', value: '247', sub: '↑ 12 bulan ini', trend: 'up', trendValue: '+12', color: 'cyan' },
  { label: 'Perusahaan Terdaftar', value: '18', sub: '↑ 2 baru', trend: 'up', trendValue: '+2', color: 'amber' },
  { label: 'Sensor Bermasalah', value: '7', sub: '↑ 3 dari kemarin', trend: 'down', trendValue: '+3', color: 'red' },
  { label: 'Total Pengguna', value: '134', sub: '4 role aktif', trend: 'neutral', color: 'green' },
  { label: 'Rata-rata Subsidence', value: '-2.34', sub: 'cm/tahun avg regional', trend: 'down', color: 'purple' },
] as const;

/* ── Extended mock data for all pages ─────────────────────── */

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin_perusahaan' | 'kepala_instansi' | 'supervisor';
  company: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
  createdAt: string;
  avatar: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  target: string;
  ip: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface ServerMetric {
  label: string;
  value: number;
  unit: string;
  status: 'ok' | 'warn' | 'crit';
}

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Ahmad Fauzi', email: 'ahmad.f@sigat.go.id', role: 'super_admin', company: 'ESDM Pusat', status: 'active', lastLogin: '08:14 WIB', createdAt: '2024-01-10', avatar: 'AF' },
  { id: 'u2', name: 'Budi Santoso', email: 'budi.s@majujaya.co.id', role: 'admin_perusahaan', company: 'PT Maju Jaya Tbk', status: 'active', lastLogin: '07:55 WIB', createdAt: '2024-02-14', avatar: 'BS' },
  { id: 'u3', name: 'Citra Dewi', email: 'citra.d@bumiraya.co.id', role: 'admin_perusahaan', company: 'PT Bumi Raya', status: 'active', lastLogin: '06:30 WIB', createdAt: '2024-03-01', avatar: 'CD' },
  { id: 'u4', name: 'Deni Kurniawan', email: 'deni.k@dinas.go.id', role: 'kepala_instansi', company: 'Dinas ESDM DKI', status: 'active', lastLogin: 'Kemarin', createdAt: '2024-01-20', avatar: 'DK' },
  { id: 'u5', name: 'Eka Prasetya', email: 'eka.p@majujaya.co.id', role: 'supervisor', company: 'PT Maju Jaya Tbk', status: 'active', lastLogin: '08:01 WIB', createdAt: '2024-04-05', avatar: 'EP' },
  { id: 'u6', name: 'Fitri Handayani', email: 'fitri.h@tirtamandiri.co.id', role: 'admin_perusahaan', company: 'PT Tirta Mandiri', status: 'inactive', lastLogin: '3 hari lalu', createdAt: '2024-02-28', avatar: 'FH' },
  { id: 'u7', name: 'Gilang Ramadhan', email: 'gilang.r@sumberair.co.id', role: 'supervisor', company: 'PT Sumber Air', status: 'active', lastLogin: '07:40 WIB', createdAt: '2024-05-12', avatar: 'GR' },
  { id: 'u8', name: 'Hana Wijaya', email: 'hana.w@karyamakmur.co.id', role: 'supervisor', company: 'PT Karya Makmur', status: 'pending', lastLogin: '-', createdAt: '2026-04-14', avatar: 'HW' },
  { id: 'u9', name: 'Indra Setiawan', email: 'indra.s@karyamakmur.co.id', role: 'supervisor', company: 'PT Karya Makmur', status: 'pending', lastLogin: '-', createdAt: '2026-04-14', avatar: 'IS' },
  { id: 'u10', name: 'Joko Widodo', email: 'joko.w@bumiraya.co.id', role: 'supervisor', company: 'PT Bumi Raya', status: 'active', lastLogin: '07:20 WIB', createdAt: '2024-06-01', avatar: 'JW' },
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: 'al1', userId: 'u1', userName: 'Ahmad Fauzi', action: 'LOGIN', target: 'Sistem', ip: '103.44.12.5', timestamp: '08:14:22 WIB', severity: 'info' },
  { id: 'al2', userId: 'u1', userName: 'Ahmad Fauzi', action: 'UPDATE_SENSOR', target: 'SW-007', ip: '103.44.12.5', timestamp: '08:16:05 WIB', severity: 'info' },
  { id: 'al3', userId: 'u2', userName: 'Budi Santoso', action: 'EXPORT_REPORT', target: 'Laporan Q1 2026', ip: '202.55.31.88', timestamp: '07:58:11 WIB', severity: 'info' },
  { id: 'al4', userId: 'u3', userName: 'Citra Dewi', action: 'LOGIN_FAILED', target: 'Sistem', ip: '180.244.100.22', timestamp: '07:45:44 WIB', severity: 'warning' },
  { id: 'al5', userId: 'u3', userName: 'Citra Dewi', action: 'LOGIN_FAILED', target: 'Sistem', ip: '180.244.100.22', timestamp: '07:45:57 WIB', severity: 'warning' },
  { id: 'al6', userId: 'u3', userName: 'Citra Dewi', action: 'LOGIN', target: 'Sistem', ip: '202.55.31.10', timestamp: '07:46:30 WIB', severity: 'info' },
  { id: 'al7', userId: 'u1', userName: 'Ahmad Fauzi', action: 'CREATE_USER', target: 'Hana Wijaya', ip: '103.44.12.5', timestamp: '07:30:00 WIB', severity: 'info' },
  { id: 'al8', userId: 'u1', userName: 'Ahmad Fauzi', action: 'DELETE_SENSOR', target: 'SW-099 (test)', ip: '103.44.12.5', timestamp: '07:10:15 WIB', severity: 'critical' },
  { id: 'al9', userId: 'u5', userName: 'Eka Prasetya', action: 'SUBMIT_MEASUREMENT', target: 'SW-007', ip: '114.4.55.200', timestamp: '06:55:08 WIB', severity: 'info' },
  { id: 'al10', userId: 'u4', userName: 'Deni Kurniawan', action: 'APPROVE_PERMIT', target: 'Izin #IZN-2026-014', ip: '36.85.10.77', timestamp: '06:40:00 WIB', severity: 'info' },
  { id: 'al11', userId: 'u2', userName: 'Budi Santoso', action: 'UPDATE_COMPANY', target: 'PT Maju Jaya Tbk', ip: '202.55.31.88', timestamp: '06:22:34 WIB', severity: 'info' },
  { id: 'al12', userId: 'u1', userName: 'Ahmad Fauzi', action: 'CONFIG_CHANGE', target: 'Threshold Subsidence', ip: '103.44.12.5', timestamp: '05:50:00 WIB', severity: 'critical' },
];

export const SERVER_METRICS: ServerMetric[] = [
  { label: 'CPU Usage', value: 34, unit: '%', status: 'ok' },
  { label: 'Memory', value: 62, unit: '%', status: 'ok' },
  { label: 'Disk Usage', value: 78, unit: '%', status: 'warn' },
  { label: 'Network In', value: 142, unit: 'Mbps', status: 'ok' },
  { label: 'Network Out', value: 88, unit: 'Mbps', status: 'ok' },
  { label: 'DB Connections', value: 45, unit: '/100', status: 'ok' },
];

export const ANALYTICS_MONTHLY = [
  { month: 'Apr', sw: -1.9, gnss: -2.1, threshold: -4.0 },
  { month: 'Mei', sw: -2.0, gnss: -2.2, threshold: -4.0 },
  { month: 'Jun', sw: -2.1, gnss: -2.3, threshold: -4.0 },
  { month: 'Jul', sw: -2.2, gnss: -2.4, threshold: -4.0 },
  { month: 'Agu', sw: -2.3, gnss: -2.5, threshold: -4.0 },
  { month: 'Sep', sw: -2.2, gnss: -2.4, threshold: -4.0 },
  { month: 'Okt', sw: -2.3, gnss: -2.5, threshold: -4.0 },
  { month: 'Nov', sw: -2.4, gnss: -2.6, threshold: -4.0 },
  { month: 'Des', sw: -2.3, gnss: -2.5, threshold: -4.0 },
  { month: 'Jan', sw: -2.5, gnss: -2.7, threshold: -4.0 },
  { month: 'Feb', sw: -2.4, gnss: -2.6, threshold: -4.0 },
  { month: 'Mar', sw: -2.6, gnss: -2.8, threshold: -4.0 },
];

/* ══════════════════════════════════════════════════════════
   ADMIN PERUSAHAAN — PT Maju Jaya Tbk (companyId: 'c1')
   ══════════════════════════════════════════════════════════ */

export interface Measurement {
  id: string;
  sensorCode: string;
  sensorId: string;
  supervisorName: string;
  supervisorAvatar: string;
  waterLevel: number;
  subsidence: number;
  verticalValue: number;
  kondisiFisik: 'baik' | 'rusak_ringan' | 'rusak_berat';
  catatan: string;
  fotoCount: number;
  submittedAt: string;
  verifiedAt?: string;
  status: 'pending' | 'verified' | 'rejected' | 'draft';
  location: string;
}

export interface SupervisorTask {
  id: string;
  supervisorId: string;
  supervisorName: string;
  supervisorAvatar: string;
  phone: string;
  status: 'online' | 'offline' | 'measuring';
  assignedSensors: string[];
  completedToday: number;
  totalToday: number;
  lastActivity: string;
  location: string;
}

export interface ActivityItem {
  id: string;
  type: 'measurement' | 'alert' | 'sensor' | 'report' | 'user';
  title: string;
  desc: string;
  time: string;
  actor?: string;
}

// Extended sensors scoped to c1 (PT Maju Jaya Tbk)
export const COMPANY_SENSORS: (typeof MOCK_SENSORS[0])[] = [
  { id: 's1',  code: 'SW-007', type: 'water', location: 'Rajabasa',           lat: -5.395, lng: 105.240, status: 'alert',       subsidence: -4.82, waterLevel: -38.2, verticalValue: 18.431, companyId: 'c1', lastUpdate: '08:14 WIB' },
  { id: 's2',  code: 'GN-022', type: 'gnss',  location: 'Tanjung Karang',     lat: -5.433, lng: 105.261, status: 'alert',       subsidence: -4.10, verticalValue: 22.14, companyId: 'c1', lastUpdate: '08:20 WIB' },
  { id: 's11', code: 'SW-014', type: 'water', location: 'Kedaton',             lat: -5.413, lng: 105.274, status: 'online',      subsidence: -2.18, waterLevel: -28.4, verticalValue: 14.80, companyId: 'c1', lastUpdate: '08:05 WIB' },
  { id: 's12', code: 'SW-021', type: 'water', location: 'Panjang',             lat: -5.503, lng: 105.289, status: 'online',      subsidence: -1.94, waterLevel: -25.0, verticalValue: 12.10, companyId: 'c1', lastUpdate: '07:58 WIB' },
  { id: 's13', code: 'GN-031', type: 'gnss',  location: 'Sukabumi',            lat: -5.473, lng: 105.291, status: 'online',      subsidence: -1.42, verticalValue: 9.88, companyId: 'c1', lastUpdate: '08:02 WIB' },
  { id: 's14', code: 'SW-033', type: 'water', location: 'Labuhan Ratu',        lat: -5.375, lng: 105.289, status: 'online',      subsidence: -2.55, waterLevel: -31.6, verticalValue: 16.22, companyId: 'c1', lastUpdate: '07:50 WIB' },
  { id: 's15', code: 'GN-044', type: 'gnss',  location: 'Kemiling',            lat: -5.407, lng: 105.224, status: 'maintenance', subsidence: -1.88, verticalValue: 11.44, companyId: 'c1', lastUpdate: '07:30 WIB' },
  { id: 's16', code: 'SW-048', type: 'water', location: 'Teluk Betung',        lat: -5.466, lng: 105.266, status: 'online',      subsidence: -1.25, waterLevel: -22.8, verticalValue: 10.34, companyId: 'c1', lastUpdate: '08:10 WIB' },
  { id: 's17', code: 'GN-055', type: 'gnss',  location: 'Tanjung Seneng',      lat: -5.442, lng: 105.304, status: 'online',      subsidence: -2.01, verticalValue: 13.56, companyId: 'c1', lastUpdate: '08:08 WIB' },
  { id: 's18', code: 'SW-062', type: 'water', location: 'Natar',               lat: -5.303, lng: 105.220, status: 'online',      subsidence: -1.68, waterLevel: -26.2, verticalValue: 11.90, companyId: 'c1', lastUpdate: '08:00 WIB' },
];

export const COMPANY_MEASUREMENTS: Measurement[] = [
  { id: 'm1', sensorCode: 'SW-007', sensorId: 's1',  supervisorName: 'Eka Prasetya', supervisorAvatar: 'EP', waterLevel: -38.2, subsidence: -4.82, verticalValue: 18.431, kondisiFisik: 'baik', catatan: 'Sensor berfungsi normal, nilai subsidence tinggi perlu monitoring ketat', fotoCount: 4, submittedAt: '08:14 WIB', status: 'pending',  location: 'Cengkareng' },
  { id: 'm2', sensorCode: 'GN-022', sensorId: 's2',  supervisorName: 'Rudi Hermawan',  supervisorAvatar: 'RH', waterLevel: 0,     subsidence: -4.10, verticalValue: 22.14, kondisiFisik: 'baik', catatan: 'GNSS signal stabil, data konsisten', fotoCount: 3, submittedAt: '08:20 WIB', status: 'verified', verifiedAt: '08:45 WIB', location: 'Penjaringan' },
  { id: 'm3', sensorCode: 'SW-014', sensorId: 's11', supervisorName: 'Sinta Wulandari', supervisorAvatar: 'SW', waterLevel: -28.4, subsidence: -2.18, verticalValue: 14.80, kondisiFisik: 'baik', catatan: 'Normal, tidak ada anomali', fotoCount: 4, submittedAt: '08:05 WIB', status: 'verified', verifiedAt: '08:30 WIB', location: 'Kamal Muara' },
  { id: 'm4', sensorCode: 'SW-021', sensorId: 's12', supervisorName: 'Eka Prasetya', supervisorAvatar: 'EP', waterLevel: -25.0, subsidence: -1.94, verticalValue: 12.10, kondisiFisik: 'rusak_ringan', catatan: 'Ada sedikit karat pada casing, perlu pengecekan lanjut bulan depan', fotoCount: 4, submittedAt: '07:58 WIB', status: 'pending',  location: 'Pluit' },
  { id: 'm5', sensorCode: 'SW-033', sensorId: 's14', supervisorName: 'Rudi Hermawan', supervisorAvatar: 'RH', waterLevel: -31.6, subsidence: -2.55, verticalValue: 16.22, kondisiFisik: 'baik', catatan: 'OK', fotoCount: 4, submittedAt: '07:50 WIB', status: 'verified', verifiedAt: '08:20 WIB', location: 'Pademangan' },
  { id: 'm6', sensorCode: 'SW-048', sensorId: 's16', supervisorName: 'Sinta Wulandari', supervisorAvatar: 'SW', waterLevel: -22.8, subsidence: -1.25, verticalValue: 10.34, kondisiFisik: 'baik', catatan: 'Hasil pengukuran normal', fotoCount: 4, submittedAt: '08:10 WIB', status: 'rejected', location: 'Tanjung Priok' },
  { id: 'm7', sensorCode: 'GN-055', sensorId: 's17', supervisorName: 'Eka Prasetya', supervisorAvatar: 'EP', waterLevel: 0, subsidence: -2.01, verticalValue: 13.56, kondisiFisik: 'baik', catatan: 'GNSS stabil', fotoCount: 3, submittedAt: '08:08 WIB', status: 'pending', location: 'Koja' },
];

export const SUPERVISOR_TASKS: SupervisorTask[] = [
  { id: 'st1', supervisorId: 'u5', supervisorName: 'Eka Prasetya',   supervisorAvatar: 'EP', phone: '0812-3456-7890', status: 'measuring', assignedSensors: ['SW-007','SW-021','GN-055'], completedToday: 2, totalToday: 3, lastActivity: '08:14 WIB',  location: 'Cengkareng' },
  { id: 'st2', supervisorId: 'u11',supervisorName: 'Rudi Hermawan',  supervisorAvatar: 'RH', phone: '0813-5678-9012', status: 'online',    assignedSensors: ['GN-022','SW-033'],          completedToday: 2, totalToday: 2, lastActivity: '08:20 WIB',  location: 'Penjaringan' },
  { id: 'st3', supervisorId: 'u12',supervisorName: 'Sinta Wulandari',supervisorAvatar: 'SW', phone: '0857-9012-3456', status: 'online',    assignedSensors: ['SW-014','SW-048'],          completedToday: 2, totalToday: 2, lastActivity: '08:10 WIB',  location: 'Kamal Muara' },
  { id: 'st4', supervisorId: 'u13',supervisorName: 'Dian Permata',   supervisorAvatar: 'DP', phone: '0821-2345-6789', status: 'offline',   assignedSensors: ['GN-031','GN-044','SW-062'], completedToday: 0, totalToday: 3, lastActivity: 'Kemarin',    location: '-' },
];

export const COMPANY_ACTIVITY: ActivityItem[] = [
  { id: 'ac1', type: 'alert',       title: 'Alert kritis terdeteksi',     desc: 'SW-007 subsidence -4.82 cm/thn melebihi threshold',       time: '08:14 WIB', actor: 'Sistem' },
  { id: 'ac2', type: 'measurement', title: 'Data pengukuran masuk',        desc: 'Eka Prasetya submit data SW-007 — menunggu verifikasi',    time: '08:14 WIB', actor: 'Eka Prasetya' },
  { id: 'ac3', type: 'measurement', title: 'Verifikasi selesai',           desc: 'GN-022 oleh Rudi Hermawan — diverifikasi',                time: '08:45 WIB', actor: 'Budi Santoso' },
  { id: 'ac4', type: 'sensor',      title: 'Sensor masuk maintenance',     desc: 'GN-044 di Sunter dijadwalkan kalibrasi rutin',             time: '07:30 WIB', actor: 'Sistem' },
  { id: 'ac5', type: 'measurement', title: 'Data pengukuran masuk',        desc: 'Sinta Wulandari submit data SW-014 — diverifikasi',       time: '08:05 WIB', actor: 'Sinta Wulandari' },
  { id: 'ac6', type: 'report',      title: 'Laporan Q1 digenerate',        desc: 'Laporan subsidence Q1 2026 tersedia untuk diunduh',       time: '07:00 WIB', actor: 'Budi Santoso' },
  { id: 'ac7', type: 'measurement', title: 'Data ditolak',                 desc: 'SW-048 data dari Sinta Wulandari — foto tidak lengkap',   time: '08:10 WIB', actor: 'Budi Santoso' },
];

export const COMPANY_TREND_DATA = [
  { label: 'Apr', subsidence: -2.41, waterLevel: -32.1, threshold: -4.0 },
  { label: 'Mei', subsidence: -2.52, waterLevel: -33.4, threshold: -4.0 },
  { label: 'Jun', subsidence: -2.55, waterLevel: -34.0, threshold: -4.0 },
  { label: 'Jul', subsidence: -2.60, waterLevel: -34.8, threshold: -4.0 },
  { label: 'Agu', subsidence: -2.58, waterLevel: -34.2, threshold: -4.0 },
  { label: 'Sep', subsidence: -2.63, waterLevel: -35.0, threshold: -4.0 },
  { label: 'Okt', subsidence: -2.65, waterLevel: -35.5, threshold: -4.0 },
  { label: 'Nov', subsidence: -2.71, waterLevel: -36.4, threshold: -4.0 },
  { label: 'Des', subsidence: -2.68, waterLevel: -36.0, threshold: -4.0 },
  { label: 'Jan', subsidence: -2.75, waterLevel: -37.0, threshold: -4.0 },
  { label: 'Feb', subsidence: -2.72, waterLevel: -36.8, threshold: -4.0 },
  { label: 'Mar', subsidence: -2.71, waterLevel: -38.2, threshold: -4.0 },
];

export const ADMIN_COMPANY = MOCK_COMPANIES[0]; // PT Maju Jaya Tbk

/* ══════════════════════════════════════════════════════════
   KEPALA DINAS — Provinsi Lampung
   ══════════════════════════════════════════════════════════ */

export const KADIS_STATS = [
  { label: 'Perusahaan Dipantau', value: '18',    sub: '5 kab/kota Lampung',     color: 'green'  },
  { label: 'Total Sensor Aktif',  value: '247',   sub: '238 online · 9 masalah', color: 'cyan'   },
  { label: 'Perusahaan Kritis',   value: '2',     sub: '↑ 1 dari bulan lalu',    color: 'red'    },
  { label: 'Melebihi Kuota',      value: '1',     sub: 'PT Bumi Raya 103%',      color: 'amber'  },
  { label: 'Subsidence Regional', value: '-2.27', sub: 'cm/tahun rata-rata',      color: 'purple' },
] as const;

export const KADIS_RECENT_REPORTS = [
  { id: 'kr1', name: 'Laporan Kepatuhan Provinsi Q1 2026',     type: 'Kepatuhan',  date: '15 Apr 2026', size: '3.8 MB', format: 'PDF',  status: 'done'       },
  { id: 'kr2', name: 'Rekapitulasi Kuota Tahunan 2025',        type: 'Kuota',      date: '02 Jan 2026', size: '2.1 MB', format: 'XLSX', status: 'done'       },
  { id: 'kr3', name: 'Laporan Subsidence Regional Q4 2025',    type: 'Subsidence', date: '20 Jan 2026', size: '4.2 MB', format: 'PDF',  status: 'done'       },
  { id: 'kr4', name: 'Ringkasan Pengawasan Feb 2026',          type: 'Pengawasan', date: '28 Feb 2026', size: '1.6 MB', format: 'PDF',  status: 'done'       },
  { id: 'kr5', name: 'Ekspor Data Seluruh Perusahaan Apr 2026', type: 'Custom',    date: '17 Apr 2026', size: '-',      format: 'CSV',  status: 'generating' },
];
