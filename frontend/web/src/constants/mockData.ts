import type { Sensor, Company, Alert, TrendDataPoint } from '../../../web/src/types';

export const MOCK_SENSORS: Sensor[] = [
  { id: 's1', code: 'SW-007', type: 'water', location: 'Cengkareng', lat: -6.148, lng: 106.741, status: 'alert', subsidence: -4.82, waterLevel: -38.2, verticalValue: 18.431, companyId: 'c1', lastUpdate: '08:14 WIB' },
  { id: 's2', code: 'GN-022', type: 'gnss', location: 'Penjaringan', lat: -6.123, lng: 106.782, status: 'alert', subsidence: -4.10, verticalValue: 22.14, companyId: 'c1', lastUpdate: '08:20 WIB' },
  { id: 's3', code: 'SW-012', type: 'water', location: 'Latumenten', lat: -6.149, lng: 106.794, status: 'online', subsidence: -2.94, waterLevel: -30.1, verticalValue: 20.762, companyId: 'c2', lastUpdate: '08:05 WIB' },
  { id: 's4', code: 'GN-018', type: 'gnss', location: 'Pluit', lat: -6.117, lng: 106.799, status: 'online', subsidence: -2.41, verticalValue: 16.88, companyId: 'c2', lastUpdate: '07:55 WIB' },
  { id: 's5', code: 'SW-001', type: 'water', location: 'Muara Baru', lat: -6.108, lng: 106.757, status: 'online', subsidence: -1.20, waterLevel: -24.5, verticalValue: 12.30, companyId: 'c3', lastUpdate: '08:00 WIB' },
  { id: 's6', code: 'GN-012', type: 'gnss', location: 'Ancol', lat: -6.131, lng: 106.837, status: 'online', subsidence: -0.88, verticalValue: 9.14, companyId: 'c3', lastUpdate: '07:48 WIB' },
  { id: 's7', code: 'SW-019', type: 'water', location: 'Sunda Kelapa', lat: -6.125, lng: 106.812, status: 'maintenance', subsidence: -1.60, waterLevel: -26.8, verticalValue: 14.22, companyId: 'c4', lastUpdate: '07:30 WIB' },
  { id: 's8', code: 'GN-045', type: 'gnss', location: 'Tanjung Priok', lat: -6.099, lng: 106.872, status: 'online', subsidence: -1.94, verticalValue: 11.55, companyId: 'c4', lastUpdate: '08:10 WIB' },
  { id: 's9', code: 'SW-031', type: 'water', location: 'Kapuk', lat: -6.142, lng: 106.728, status: 'alert', subsidence: -3.50, waterLevel: -35.0, companyId: 'c5', lastUpdate: '08:18 WIB' },
  { id: 's10', code: 'GN-067', type: 'gnss', location: 'Kalideres', lat: -6.157, lng: 106.703, status: 'online', subsidence: -1.12, verticalValue: 8.44, companyId: 'c5', lastUpdate: '08:02 WIB' },
];

export const MOCK_COMPANIES: Company[] = [
  { id: 'c1', name: 'PT Maju Jaya Tbk', region: 'Jakarta Utara', sensorCount: 34, status: 'online', quota: 200000, quotaUsed: 174000, avgSubsidence: -2.71 },
  { id: 'c2', name: 'PT Bumi Raya', region: 'Bekasi', sensorCount: 18, status: 'offline', quota: 150000, quotaUsed: 154500, avgSubsidence: -3.20 },
  { id: 'c3', name: 'PT Tirta Mandiri', region: 'Tangerang', sensorCount: 27, status: 'online', quota: 180000, quotaUsed: 109800, avgSubsidence: -1.85 },
  { id: 'c4', name: 'PT Sumber Air', region: 'Depok', sensorCount: 21, status: 'maintenance', quota: 120000, quotaUsed: 114000, avgSubsidence: -2.15 },
  { id: 'c5', name: 'PT Karya Makmur', region: 'Bogor', sensorCount: 15, status: 'online', quota: 100000, quotaUsed: 48000, avgSubsidence: -1.42 },
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
  { id: 'u1', name: 'Ahmad Fauzi', email: 'ahmad.f@sipasti.go.id', role: 'super_admin', company: 'ESDM Pusat', status: 'active', lastLogin: '08:14 WIB', createdAt: '2024-01-10', avatar: 'AF' },
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
