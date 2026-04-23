import type { Sensor } from '../types';

export const SURVEYOR_PROFILE = {
  id: 'u5',
  name: 'Eka Prasetya',
  initials: 'EP',
  phone: '0812-3456-7890',
  company: 'PT Maju Jaya Tbk',
  companyId: 'c1',
  role: 'SURVEYOR',
  region: 'Rajabasa & Sekitarnya',
};

export const SURVEYOR_SENSORS: Sensor[] = [
  {
    id: 's1',
    code: 'SW-007',
    type: 'water',
    location: 'Rajabasa',
    lat: -5.395,
    lng: 105.240,
    status: 'alert',
    subsidence: -4.82,
    waterLevel: -38.2,
    verticalValue: 18.431,
    companyId: 'c1',
    lastUpdate: '08:14 WIB',
  },
  {
    id: 's16',
    code: 'SW-021',
    type: 'water',
    location: 'Kemiling',
    lat: -5.376,
    lng: 105.218,
    status: 'online',
    subsidence: -2.45,
    waterLevel: -31.8,
    verticalValue: 15.220,
    companyId: 'c1',
    lastUpdate: '08:02 WIB',
  },
  {
    id: 's17',
    code: 'GN-055',
    type: 'gnss',
    location: 'Labuhan Ratu',
    lat: -5.352,
    lng: 105.277,
    status: 'online',
    subsidence: -2.01,
    verticalValue: 13.560,
    companyId: 'c1',
    lastUpdate: '08:08 WIB',
  },
];

export type MeasurementStatus = 'pending' | 'verified' | 'rejected';

export interface SurveyorMeasurement {
  id: string;
  sensorCode: string;
  sensorId: string;
  waterLevel: number;
  debit: number;
  pH: number;
  tds: number;
  kekeruhan: number;
  kondisiFisik: 'baik' | 'rusak_ringan' | 'rusak_berat';
  catatan: string;
  fotoCount: number;
  submittedAt: string;
  date: string;
  status: MeasurementStatus;
  verifiedAt?: string;
  verifiedBy?: string;
  rejectionNote?: string;
}

export const SURVEYOR_MEASUREMENTS: SurveyorMeasurement[] = [
  {
    id: 'sm1',
    sensorCode: 'SW-007',
    sensorId: 's1',
    waterLevel: -38.2,
    debit: 124.5,
    pH: 7.1,
    tds: 320,
    kekeruhan: 2.4,
    kondisiFisik: 'baik',
    catatan: 'Sensor berfungsi normal, nilai subsidence tinggi perlu monitoring ketat.',
    fotoCount: 4,
    submittedAt: '08:14 WIB',
    date: '20 Apr 2026',
    status: 'pending',
  },
  {
    id: 'sm2',
    sensorCode: 'GN-055',
    sensorId: 's17',
    waterLevel: 0,
    debit: 0,
    pH: 0,
    tds: 0,
    kekeruhan: 0,
    kondisiFisik: 'baik',
    catatan: 'GNSS stabil, data koordinat konsisten.',
    fotoCount: 3,
    submittedAt: '08:08 WIB',
    date: '20 Apr 2026',
    status: 'pending',
  },
  {
    id: 'sm3',
    sensorCode: 'SW-007',
    sensorId: 's1',
    waterLevel: -37.9,
    debit: 121.0,
    pH: 7.0,
    tds: 315,
    kekeruhan: 2.2,
    kondisiFisik: 'baik',
    catatan: 'Normal, tidak ada anomali visual.',
    fotoCount: 3,
    submittedAt: '07:55 WIB',
    date: '19 Apr 2026',
    status: 'verified',
    verifiedAt: '09:12 WIB',
    verifiedBy: 'Budi Santoso',
  },
  {
    id: 'sm4',
    sensorCode: 'SW-021',
    sensorId: 's16',
    waterLevel: -31.8,
    debit: 98.3,
    pH: 6.9,
    tds: 290,
    kekeruhan: 1.8,
    kondisiFisik: 'baik',
    catatan: 'Muka air sedikit turun dari pengukuran sebelumnya.',
    fotoCount: 4,
    submittedAt: '08:30 WIB',
    date: '19 Apr 2026',
    status: 'verified',
    verifiedAt: '10:00 WIB',
    verifiedBy: 'Budi Santoso',
  },
  {
    id: 'sm5',
    sensorCode: 'GN-055',
    sensorId: 's17',
    waterLevel: 0,
    debit: 0,
    pH: 0,
    tds: 0,
    kekeruhan: 0,
    kondisiFisik: 'rusak_ringan',
    catatan: 'Ada sedikit gangguan sinyal GPS, koordinat masih dalam batas toleransi.',
    fotoCount: 2,
    submittedAt: '09:10 WIB',
    date: '18 Apr 2026',
    status: 'rejected',
    verifiedAt: '11:00 WIB',
    verifiedBy: 'Budi Santoso',
    rejectionNote: 'Data tidak lengkap, mohon ulangi pengukuran.',
  },
  {
    id: 'sm6',
    sensorCode: 'SW-007',
    sensorId: 's1',
    waterLevel: -37.5,
    debit: 118.7,
    pH: 7.2,
    tds: 308,
    kekeruhan: 2.0,
    kondisiFisik: 'baik',
    catatan: 'Pengukuran rutin, semua parameter normal.',
    fotoCount: 4,
    submittedAt: '08:00 WIB',
    date: '17 Apr 2026',
    status: 'verified',
    verifiedAt: '09:45 WIB',
    verifiedBy: 'Budi Santoso',
  },
];

export interface SurveyorTask {
  sensorCode: string;
  sensorId: string;
  location: string;
  type: 'water' | 'gnss';
  status: 'belum' | 'selesai' | 'terlambat';
  targetTime: string;
  submittedAt?: string;
}

export const TODAY_TASKS: SurveyorTask[] = [
  { sensorCode: 'SW-007', sensorId: 's1',  location: 'Rajabasa',     type: 'water', status: 'selesai', targetTime: '08:00', submittedAt: '08:14 WIB' },
  { sensorCode: 'SW-021', sensorId: 's16', location: 'Kemiling',     type: 'water', status: 'belum',   targetTime: '10:00' },
  { sensorCode: 'GN-055', sensorId: 's17', location: 'Labuhan Ratu', type: 'gnss',  status: 'selesai', targetTime: '08:30', submittedAt: '08:08 WIB' },
];
