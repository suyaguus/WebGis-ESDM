# Dokumen Spesifikasi Sistem
# WebGIS SIPASTI — Sistem Informasi Pengawasan Airtanah

**Versi:** 2.0 (Prototipe Frontend)
**Tanggal:** 17 April 2026
**Status:** Pengembangan Aktif — Data Mock/Statis

---

## Daftar Isi

1. [Gambaran Umum Sistem](#1-gambaran-umum-sistem)
2. [Teknologi & Dependensi](#2-teknologi--dependensi)
3. [Arsitektur Aplikasi](#3-arsitektur-aplikasi)
4. [Sistem Peran (Role)](#4-sistem-peran-role)
5. [Struktur Halaman & Fitur](#5-struktur-halaman--fitur)
6. [Model Data](#6-model-data)
7. [Manajemen State](#7-manajemen-state)
8. [Komponen UI](#8-komponen-ui)
9. [Sistem Desain](#9-sistem-desain)
10. [Struktur File](#10-struktur-file)
11. [Konfigurasi & Build](#11-konfigurasi--build)
12. [Rencana Integrasi](#12-rencana-integrasi)

---

## 1. Gambaran Umum Sistem

### 1.1 Deskripsi

SIPASTI adalah aplikasi WebGIS berbasis web untuk memantau penurunan tanah (*land subsidence*) dan muka airtanah di Provinsi Lampung. Sistem ini digunakan oleh instansi ESDM (Energi dan Sumber Daya Mineral) untuk mengawasi penggunaan airtanah oleh perusahaan-perusahaan yang memiliki izin pengeboran sumur.

### 1.2 Tujuan Sistem

- Memantau data sensor penurunan tanah secara real-time dari berbagai titik pengamatan
- Mengelola kuota pengambilan airtanah per perusahaan
- Memverifikasi data pengukuran lapangan yang dikirim oleh supervisor
- Menghasilkan laporan kepatuhan dan analitik tren subsiden
- Menyediakan peta interaktif sebaran sensor di seluruh Provinsi Lampung

### 1.3 Pengguna Target

| Peran | Cakupan | Keterangan |
|-------|---------|------------|
| Super Admin | Seluruh sistem | Tim IT / pengelola sistem |
| Admin Perusahaan | Satu perusahaan | Penanggung jawab teknis perusahaan |
| Kepala Dinas (Kadis) | Lintas perusahaan | Pejabat pengawas instansi (*direncanakan*) |
| Supervisor | Lapangan | Teknisi pengukur (*tidak ditampilkan di frontend ini*) |

---

## 2. Teknologi & Dependensi

### 2.1 Stack Utama

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| React | 18.3.1 | Framework UI |
| TypeScript | 5.2.2 | Type safety |
| Vite | 5.3.1 | Build tool & dev server |
| Tailwind CSS | 3.4.4 | Utility-first styling |
| React Router DOM | 6.x | Client-side routing |

### 2.2 Dependensi Fitur

| Package | Versi | Fungsi |
|---------|-------|--------|
| Zustand | 4.5.2 | State management global |
| Leaflet | 1.9.4 | Peta interaktif (OpenStreetMap) |
| Chart.js | 4.4.3 | Visualisasi grafik tren |
| Lucide React | 0.383.0 | Library ikon (40+ ikon digunakan) |
| clsx | 2.1.1 | Komposisi class CSS |
| tailwind-merge | 2.3.0 | Resolusi konflik Tailwind |

### 2.3 Dependensi Development

| Package | Fungsi |
|---------|--------|
| ESLint + TypeScript plugin | Linting |
| PostCSS + Autoprefixer | Transformasi CSS |
| @vitejs/plugin-react | HMR & JSX transform |

---

## 3. Arsitektur Aplikasi

### 3.1 Gambaran Arsitektur

```
src/
├── App.tsx              ← Router utama (berbasis peran)
├── store/index.ts       ← Zustand global store
├── types/index.ts       ← TypeScript interfaces
├── constants/
│   └── mockData.ts      ← 21 dataset mock (pengganti API)
├── lib/utils.ts         ← 11 fungsi utilitas
├── components/          ← Komponen reusable
└── pages/               ← Halaman per peran
```

### 3.2 Pola Routing Berbasis Peran

Routing dipisah per peran menggunakan React Router nested routes:

```
/ (root)
├── /superadmin/*       → SuperAdminShell + halaman super admin
└── /adminPerusahaan/*  → AdminPerusahaanShell + halaman admin perusahaan
```

Setiap shell terdiri dari `Sidebar` + `Topbar` + `<Outlet>` (konten halaman).

### 3.3 Pola Halaman Dashboard

Setiap halaman dashboard mengikuti pola komposisi yang konsisten:

```
1. Header           → Judul halaman + deskripsi + indikator status
2. Baris Statistik  → 4–5 kartu KPI dengan warna aksen
3. Konten Utama     → Peta + panel samping, atau tabel + filter
4. Panel Sekunder   → Alert, tren, log aktivitas
```

---

## 4. Sistem Peran (Role)

### 4.1 Definisi Peran

```typescript
type Role = 'superadmin' | 'admin' | 'kadis' | 'supervisor';
```

### 4.2 Matriks Hak Akses

| Fitur | Super Admin | Admin Perusahaan | Kadis | Supervisor |
|-------|:-----------:|:----------------:|:-----:|:----------:|
| Dashboard Sistem | ✓ | — | — | — |
| Dashboard Perusahaan | — | ✓ | — | — |
| Peta Interaktif (semua) | ✓ | — | — | — |
| Peta Sensor (per perusahaan) | — | ✓ | — | — |
| Manajemen Sensor | ✓ | Baca | — | — |
| Manajemen Pengguna | ✓ | — | — | — |
| Manajemen Perusahaan | ✓ | — | — | — |
| Role & Akses | ✓ | — | — | — |
| Verifikasi Data | — | ✓ | — | — |
| Tim Lapangan | — | ✓ | — | — |
| Histori Pengukuran | ✓ | ✓ | — | ✓ |
| Laporan & Ekspor | ✓ | ✓ | ✓ | — |
| Server & API | ✓ | — | — | — |
| Audit Log | ✓ | — | — | — |
| Analitik Tren | ✓ | ✓ | ✓ | — |

### 4.3 RoleSwitcher (Dev-only)

Komponen `RoleSwitcher` di pojok kanan bawah memungkinkan pergantian peran saat development. **Harus dihapus atau dibatasi dengan `import.meta.env.DEV` sebelum production.**

---

## 5. Struktur Halaman & Fitur

### 5.1 Super Admin (11 Halaman)

#### Dashboard (`/superadmin/`)
- **5 kartu statistik:** Total sensor, perusahaan aktif, alert kritis, pengguna aktif, uptime
- **Peta mini:** Sebaran sensor seluruh Lampung
- **Panel alert:** Antrian 7 alert dengan badge severity
- **Tabel perusahaan:** Ringkasan perusahaan + KPI
- **Grafik tren:** Subsiden bulanan vs threshold

#### Peta Interaktif (`/superadmin/peta`)
- Peta Leaflet layar penuh
- Panel filter sidebar (status / tipe sensor / pencarian)
- Marker animasi: pulse (online), blink (alert), statis (offline/maintenance)
- Panel detail sensor saat marker diklik
- Filter: `Semua Status`, `Semua Tipe`

#### Semua Sensor (`/superadmin/sensor`)
- Tabel sensor dengan 7 kolom: ID, nama, tipe, perusahaan, status, subsiden, update terakhir
- Sortir kolom + arah panah
- Pencarian nama/kode
- Modal detail sensor
- Badge indikator: 3 sensor merah (kritis)

#### Analytics (`/superadmin/analytics`)
- Grafik garis multi-series: SW (sumur/water), GNSS, Threshold
- Filter periode bulanan/tahunan
- Perbandingan per perusahaan
- Tombol ekspor (placeholder)

#### Pengguna (`/superadmin/users`)
- Tabel 10 pengguna dengan filter peran & status
- Kolom: nama, email, peran, perusahaan, status, login terakhir
- Aksi: tambah pengguna, menu aksi per baris
- Badge indikator: 12 pengguna amber (pending)

#### Perusahaan (`/superadmin/companies`)
- Tabel perusahaan + sortir
- Panel detail perusahaan di samping (KPI, sensor, kuota)
- 5 perusahaan mock: PT Maju Jaya, PT Bumi Raya, PT Tirta Mandiri, PT Sumber Air, PT Karya Makmur

#### Role & Akses (`/superadmin/roles`)
- Grid 4 peran × matriks izin
- Tampilkan izin: Dashboard, Sensor, Pengguna, Laporan, Audit
- Toggle izin (UI mock)

#### Laporan (`/superadmin/reports`)
- Halaman stub (placeholder)

#### Konfigurasi (`/superadmin/config`)
- Halaman stub (placeholder)

#### Server & API (`/superadmin/server`)
- 6 kartu metrik infrastruktur: CPU, Memory, Disk, Network, DB, latency
- Indikator status: ok / warn / crit

#### Audit Log (`/superadmin/audit`)
- 12 entri log dengan ikon tipe aksi
- Filter: severity, rentang tanggal, pencarian
- Kolom: waktu, pengguna, aksi, target, IP, severity

---

### 5.2 Admin Perusahaan (7 Halaman)

> Semua data dibatasi pada **PT Maju Jaya Tbk** (companyId: 'c1')

#### Dashboard (`/adminPerusahaan/`)
- **4 tombol aksi cepat:** Tambah Pengukuran, Laporan Harian, Verifikasi, Ekspor Data
- **5 kartu statistik:** Total sumur, aktif, maintenance, pengukuran hari ini, kuota terpakai
- **Bar kuota:** 87% (174k/200k m³) dengan indikator warna
- **Peta sensor:** Sensor PT Maju Jaya
- **Panel alert:** Alert scoped ke perusahaan
- **Daftar sensor:** Tabel sensor perusahaan
- **Grafik tren:** Tren subsiden + muka air bulanan
- **Log aktivitas:** 7 aktivitas terbaru

#### Peta Sensor (`/adminPerusahaan/peta`)
- Leaflet map dengan sensor perusahaan saja
- Filter status & pencarian

#### Daftar Sumur (`/adminPerusahaan/sumur`)
- Tabel sensor dengan sortir & pencarian
- Modal detail: koordinat, kedalaman, tipe konstruksi, kondisi fisik
- Aksi: edit, nonaktifkan
- Badge: 2 sensor merah (kritis)

#### Tim Lapangan (`/adminPerusahaan/tim`)
- 4 kartu supervisor dengan:
  - Dot status: online (hijau) / offline (abu) / measuring (biru berputar)
  - Nomor telepon
  - Sensor yang ditugaskan
  - Progress bar pengukuran hari ini (misal: 2/3 selesai)
  - Waktu aktivitas terakhir

#### Verifikasi Data (`/adminPerusahaan/verifikasi`)
- 7 pengukuran dengan status: pending / verified / rejected / draft
- Baris dapat dikembangkan (expandable) menampilkan:
  - Nama & foto avatar supervisor
  - Muka air, nilai subsiden, nilai vertikal
  - Kondisi fisik: baik / rusak_ringan / rusak_berat
  - Jumlah foto lapangan
  - Catatan lapangan
  - Kolom kondisional (hanya jika ada data)
- Aksi: Verifikasi, Tolak
- Badge: 3 data amber (pending)

#### Histori Pengukuran (`/adminPerusahaan/histori`)
- Daftar sensor dengan mini grafik tren inline
- Tampilkan 12 bulan data per sensor
- Filter rentang tanggal

#### Laporan & Ekspor (`/adminPerusahaan/laporan`)
- 4 tipe laporan: Subsiden, Muka Air, Kuota, Kepatuhan
- Selector periode (bulanan/tahunan) & format (PDF/XLSX/CSV)
- Daftar laporan terbaru dengan tombol unduh

---

## 6. Model Data

### 6.1 Tipe Inti

```typescript
type Role         = 'superadmin' | 'admin' | 'kadis' | 'supervisor';
type SensorStatus = 'online' | 'offline' | 'alert' | 'maintenance';
type SensorType   = 'water' | 'gnss';
type AlertSeverity = 'critical' | 'warning' | 'info';
```

### 6.2 Interface Utama

```typescript
// Sensor pengamatan
interface Sensor {
  id: string;
  code: string;
  type: SensorType;
  location: string;
  lat: number;
  lng: number;
  status: SensorStatus;
  subsidence: number;         // cm/tahun, negatif = turun
  waterLevel?: number;        // meter (sumur/water saja)
  verticalValue?: number;     // mm (GNSS saja)
  companyId: string;
  lastUpdate: string;
}

// Perusahaan pemegang izin
interface Company {
  id: string;
  name: string;
  region: string;
  sensorCount: number;
  status: CompanyStatus;
  quota: number;              // m³/tahun (total diizinkan)
  quotaUsed: number;          // m³/tahun (terpakai)
  avgSubsidence: number;      // rata-rata subsiden cm/tahun
}

// Alert & notifikasi
interface Alert {
  id: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  sensorCode?: string;
  companyName?: string;
  timestamp: string;
  isRead: boolean;
}

// Pengukuran lapangan (verifikasi)
interface Measurement {
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

// Tim lapangan (supervisor)
interface SupervisorTask {
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

// Pengguna sistem
interface User {
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

// Audit log
interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  target: string;
  ip: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'critical';
}

// Data tren grafik
interface TrendDataPoint {
  label: string;
  subsidence: number;
  threshold: number;
}
```

### 6.3 Dataset Mock

| Ekspor | Jumlah | Scope |
|--------|--------|-------|
| `MOCK_SENSORS` | 10 | Semua perusahaan |
| `MOCK_COMPANIES` | 5 | Semua perusahaan |
| `MOCK_ALERTS` | 7 | Sistem global |
| `TREND_DATA` | 12 bulan | Tren global |
| `SUPERADMIN_STATS` | 5 kartu | Dashboard super admin |
| `MOCK_USERS` | 10 | Semua pengguna |
| `MOCK_AUDIT_LOGS` | 12 | Audit trail |
| `SERVER_METRICS` | 6 | Infrastruktur |
| `ANALYTICS_MONTHLY` | 12 bulan | Per tipe sensor |
| `COMPANY_SENSORS` | 10 | PT Maju Jaya (c1) |
| `COMPANY_MEASUREMENTS` | 7 | PT Maju Jaya (c1) |
| `SUPERVISOR_TASKS` | 4 | PT Maju Jaya (c1) |
| `COMPANY_ACTIVITY` | 7 | PT Maju Jaya (c1) |
| `COMPANY_TREND_DATA` | 12 bulan | PT Maju Jaya (c1) |

### 6.4 Ambang Batas Subsiden

| Level | Nilai (cm/tahun) | Warna | Status |
|-------|:----------------:|-------|--------|
| Kritis | ≤ −4.0 | Merah | Alert |
| Waspada | −2.5 s/d −4.0 | Amber | Elevated |
| Normal | > −2.5 | Hijau | Aman |

---

## 7. Manajemen State

### 7.1 Zustand Store (`src/store/index.ts`)

```typescript
interface AppState {
  role: Role;                        // Peran aktif pengguna
  activePage: string;                // Key halaman aktif
  sidebarCollapsed: boolean;         // Status sidebar

  setRole: (role: Role) => void;
  setActivePage: (page: string) => void;
  toggleSidebar: () => void;
}
```

**Nilai default:** `role: 'admin'`, `activePage: 'ap-dashboard'`

### 7.2 State Lokal Halaman

Setiap halaman mengelola state-nya sendiri menggunakan React hooks:

- `useState` — filter aktif, item terpilih, state modal
- `useMemo` — data terfilter/terurut (komputasi mahal)
- Tidak ada state form global (form bersifat lokal per komponen)

---

## 8. Komponen UI

### 8.1 Komponen Primitif (`src/components/ui/index.tsx`)

| Komponen | Props Utama | Keterangan |
|----------|-------------|------------|
| `Badge` | `variant: critical\|warning\|info\|success` | Label status berwarna |
| `SeverityBadge` | `severity: AlertSeverity` | Badge khusus severity alert |
| `StatusPill` | `status: SensorStatus` | Pill status sensor (online/offline/dll) |
| `StatCard` | `label, value, sub, color, trend` | Kartu metrik dengan aksen warna |
| `Panel` | `title, icon, children` | Container dengan header |
| `SectionHeader` | `title, subtitle, icon` | Judul seksi halaman |
| `QuotaBar` | `used, total, label` | Bar progress kuota |
| `Divider` | — | Garis pemisah horizontal |
| `NavBadge` | `count, color` | Badge hitungan di sidebar |
| `LiveDot` | — | Dot hijau berdenyut (indikator live) |

### 8.2 Komponen Domain

| Komponen | Path | Keterangan |
|----------|------|------------|
| `SensorMap` | `components/map/SensorMap.tsx` | Leaflet map dengan marker animasi, popup HTML, auto-fit bounds |
| `TrendChart` | `components/charts/TrendChart.tsx` | Chart.js line chart multi-series dengan threshold |

### 8.3 Komponen Section

Setiap dashboard memiliki folder `sections/` berisi komponen komposisi:

**Super Admin sections:**
- `StatsRow` — Baris 5 kartu statistik
- `MapSection` — Container peta + toggle layer
- `AlertPanel` — Panel antrian alert
- `CompanyTable` — Tabel perusahaan ringkas
- `TrendSection` — Container grafik tren

**Admin Perusahaan sections:**
- `StatsRow` — Baris 5 kartu statistik (scoped company)
- `MapSection` — Peta sensor perusahaan
- `AlertPanel` — Alert perusahaan
- `SensorList` — Daftar sensor perusahaan
- `TrendSection` — Grafik tren perusahaan
- `ActivityLog` — Feed aktivitas terbaru

### 8.4 Layout Shells

| Shell | Path | Komponen |
|-------|------|----------|
| Super Admin | `layout/superAdmin/AppShell.tsx` | `Sidebar` (cyan) + `Topbar` + `<Outlet>` |
| Admin Perusahaan | `layout/adminPerusahaan/AppShell.tsx` | `Sidebar` (amber) + `Topbar` + `<Outlet>` |

**Navigasi Super Admin Sidebar:**
- Seksi *Ikhtisar:* Dashboard, Peta Interaktif, Semua Sensor
- Seksi *Manajemen:* Analitik, Pengguna, Perusahaan, Role & Akses
- Seksi *Sistem:* Laporan, Konfigurasi, Server & API, Audit Log

**Navigasi Admin Perusahaan Sidebar:**
- Seksi *Ikhtisar:* Dashboard, Peta Sensor
- Seksi *Operasional:* Daftar Sumur, Tim Lapangan, Verifikasi Data, Histori
- Seksi *Laporan:* Laporan & Ekspor
- Footer: Bar kuota + RoleSwitcher

---

## 9. Sistem Desain

### 9.1 Palet Warna

```
Aksen Super Admin: Cyan
  Primary:    #0891B2  (cyan-600)
  Light:      #E0F7FA  (cyan-50)
  Dark:       #155E75  (cyan-700)

Aksen Admin Perusahaan: Amber
  Primary:    #D97706  (amber-600)

Surface:
  Background: #F0F4F8
  Card:       #FFFFFF
  Sidebar:    #FFFFFF
  Input:      #F8FAFC

Semantik:
  Online:     #22C55E  (emerald-500)
  Kritis:     #EF4444  (red-500)
  Waspada:    #F59E0B  (amber-500)
  Offline:    #94A3B8  (slate-400)
  Info:       #3B82F6  (blue-500)
```

### 9.2 Tipografi

```
Font Utama:  'Inter' (sans-serif)
Font Mono:   'IBM Plex Mono' (monospace) — untuk kode sensor, koordinat, IP

Ukuran:
  Metadata kecil: text-[9px]  — kode teknis
  Label normal:   text-xs      — 12px
  Body:           text-sm      — 14px
  Judul seksi:    text-[15px]
  Judul halaman:  text-[18px] semibold
```

### 9.3 Shadow & Radius

```
shadow-card:       0 1px 3px rgba(0,0,0,0.05)
shadow-card-hover: 0 4px 16px rgba(0,0,0,0.08)
shadow-panel:      0 2px 8px rgba(0,0,0,0.06)

rounded-xl:   12px  — kartu standar
rounded-2xl:  16px  — modal
rounded-full: 9999px — pill & badge
```

### 9.4 Animasi

| Nama | Deskripsi | Durasi |
|------|-----------|--------|
| `pulse-dot` | Opacity pulse untuk indikator live | 2s infinite |
| `blink-alert` | Blink dengan ring shadow untuk sensor kritis | 1.5s infinite |
| `fade-in` | Opacity dari 0 ke 1 (masuk konten) | 0.2s |
| `slide-up` | Translate Y + fade (masuk modal) | 0.2s |

### 9.5 Class CSS Custom (`@layer components`)

Defined di `src/index.css`:

```
.panel, .stat-card, .badge-critical, .badge-warning,
.badge-info, .badge-success, .nav-item, .nav-item-active,
.btn-primary, .btn-secondary, .input-field
```

### 9.6 Desain Token Tailwind

Dikonfigurasi di `tailwind.config.js` — extends theme dengan:
- `colors.brand.*` — cyan primary palette
- `colors.surface.*` — background surfaces
- `colors.status.*` — semantic status colors
- `boxShadow.card`, `boxShadow.panel` — elevation system
- `fontFamily.sans`, `fontFamily.mono` — font stacks

---

## 10. Struktur File

```
frontend/web/
├── public/
├── src/
│   ├── App.tsx                          # Router utama berbasis peran
│   ├── main.tsx                         # Entry point React
│   ├── index.css                        # Global styles, animasi, layer components
│   ├── vite-env.d.ts
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── superAdmin/
│   │   │   │   ├── AppShell.tsx         # Shell super admin
│   │   │   │   ├── Sidebar.tsx          # Navigasi super admin
│   │   │   │   └── Topbar.tsx           # Header super admin
│   │   │   └── adminPerusahaan/
│   │   │       ├── AppShell.tsx         # Shell admin perusahaan
│   │   │       ├── Sidebar.tsx          # Navigasi admin (+ quota bar)
│   │   │       └── Topbar.tsx           # Header admin
│   │   ├── ui/
│   │   │   ├── index.tsx                # Semua primitif UI
│   │   │   └── RoleSwitcher.tsx         # Toggle peran (dev-only)
│   │   ├── map/
│   │   │   └── SensorMap.tsx            # Integrasi Leaflet
│   │   └── charts/
│   │       └── TrendChart.tsx           # Integrasi Chart.js
│   │
│   ├── pages/
│   │   ├── superadmin/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── peta/index.tsx           # Peta interaktif
│   │   │   ├── sensor/index.tsx         # Semua sensor
│   │   │   ├── analytics/index.tsx      # Analitik tren
│   │   │   ├── users/index.tsx          # Manajemen pengguna
│   │   │   ├── companies/index.tsx      # Manajemen perusahaan
│   │   │   ├── roles/index.tsx          # Role & akses
│   │   │   ├── reports/index.tsx        # Laporan (stub)
│   │   │   ├── config/index.tsx         # Konfigurasi (stub)
│   │   │   ├── server/index.tsx         # Server & API
│   │   │   ├── audit/index.tsx          # Audit log
│   │   │   └── sections/
│   │   │       ├── StatsRow.tsx
│   │   │       ├── MapSection.tsx
│   │   │       ├── AlertPanel.tsx
│   │   │       ├── CompanyTable.tsx
│   │   │       └── TrendSection.tsx
│   │   ├── adminPerusahaan/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── peta/index.tsx           # Peta sensor perusahaan
│   │   │   ├── sumur/index.tsx          # Daftar sumur
│   │   │   ├── tim/index.tsx            # Tim lapangan
│   │   │   ├── verifikasi/index.tsx     # Verifikasi data
│   │   │   ├── histori/index.tsx        # Histori pengukuran
│   │   │   ├── laporan/index.tsx        # Laporan & ekspor
│   │   │   └── sections/
│   │   │       ├── StatsRow.tsx
│   │   │       ├── MapSection.tsx
│   │   │       ├── AlertPanel.tsx
│   │   │       ├── SensorList.tsx
│   │   │       ├── TrendSection.tsx
│   │   │       └── ActivityLog.tsx
│   │   └── PlaceholderPage.tsx          # Template halaman stub
│   │
│   ├── store/
│   │   └── index.ts                     # Zustand store
│   ├── types/
│   │   └── index.ts                     # TypeScript interfaces
│   ├── constants/
│   │   └── mockData.ts                  # 21 dataset mock
│   └── lib/
│       └── utils.ts                     # 11 fungsi utilitas
│
├── index.html
├── vite.config.ts                       # Alias @/ → src/
├── tailwind.config.js                   # Design tokens
├── tsconfig.json
├── package.json
├── CLAUDE.md                            # Panduan untuk Claude Code
└── SPESIFIKASI.md                       # Dokumen ini
```

---

## 11. Konfigurasi & Build

### 11.1 Scripts NPM

```bash
npm run dev       # Jalankan dev server Vite (http://localhost:5173)
npm run build     # Type-check (tsc) + production build
npm run preview   # Preview hasil build production
npm run lint      # ESLint check
npm run type-check # TypeScript check tanpa emit
```

### 11.2 Path Alias

Dikonfigurasi di `vite.config.ts`:

```typescript
resolve: {
  alias: { '@': path.resolve(__dirname, 'src') }
}
```

Gunakan `@/` untuk semua import internal (contoh: `import { Badge } from '@/components/ui'`)

### 11.3 Konfigurasi TypeScript

- Target: ES2020
- Strict mode aktif
- Path mapping `@/*` → `src/*`

---

## 12. Rencana Integrasi

### 12.1 Prioritas Tinggi

| Item | Deskripsi |
|------|-----------|
| Autentikasi | Tambah login flow; ganti hardcoded role dengan JWT |
| API Integration | Ganti semua `MOCK_*` dengan panggilan REST API / WebSocket |
| Real-time Update | WebSocket atau polling untuk data sensor live |

### 12.2 Fitur Belum Diimplementasi

| Item | Status | Catatan |
|------|--------|---------|
| Peran Kadis | Direncanakan | Route & halaman belum dibuat |
| Ekspor Laporan | Placeholder | Perlu integrasi library PDF/XLSX |
| Upload Foto | Placeholder | Perlu file upload di verifikasi data |
| Notifikasi Email | Belum ada | Diperlukan untuk alert kritis |
| Dark Mode | Siap | Tailwind config sudah mendukung |
| Halaman Laporan (Super Admin) | Stub | Perlu diimplementasi |
| Halaman Konfigurasi (Super Admin) | Stub | Perlu diimplementasi |

### 12.3 Catatan Production

Sebelum deploy ke production, lakukan:

1. **Hapus atau beri gate** `RoleSwitcher` dengan `import.meta.env.DEV`
2. **Implementasi autentikasi nyata** — ganti `useAuthStore` dengan session/JWT
3. **Hubungkan ke API backend** — ganti seluruh import dari `mockData.ts`
4. **Konfigurasi environment variables** untuk URL API dan kunci peta
5. **Aktifkan code splitting** per peran untuk performa bundle optimal

---

*Dokumen ini dihasilkan dari eksplorasi kodebase pada 17 April 2026.*
*Untuk pertanyaan teknis, hubungi: yudhahero02@gmail.com*
