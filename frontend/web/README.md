# SIGAT Frontend (Web)

Dashboard WebGIS SIGAT-ESDM — monitoring sensor subsidence & muka air tambang/energi wilayah Lampung. Dibangun dengan React 18 + TypeScript + Vite + Tailwind CSS.

---

## Daftar Isi

1. [Quick Start](#1-quick-start)
2. [Struktur Proyek](#2-struktur-proyek)
3. [Sistem Role & Routing](#3-sistem-role--routing)
4. [Mode Mock vs Real API](#4-mode-mock-vs-real-api)
5. [Integrasi Backend — Kontrak API](#5-integrasi-backend--kontrak-api)
6. [Kontrak Response & Error](#6-kontrak-response--error)
7. [CORS & Header](#7-cors--header)
8. [Type Definitions (Frontend → Backend)](#8-type-definitions-frontend--backend)
9. [Checklist Backend Siap Integrasi](#9-checklist-backend-siap-integrasi)
10. [Deploy](#10-deploy)
11. [Troubleshooting](#11-troubleshooting)

---

## 1. Quick Start

**Prasyarat:** Node.js >= 18, npm >= 9

```bash
# Dari root repo
cd frontend/web

npm install
npm run dev        # Dev server → http://localhost:5173
npm run build      # Type-check + production build → dist/
npm run preview    # Preview build lokal
npm run type-check # Validasi TypeScript tanpa build
```

---

## 2. Struktur Proyek

```
src/
├── lib/
│   ├── api.ts          # Axios instance tunggal — base URL, interceptor token & 401
│   └── queryClient.ts  # React Query client (staleTime 30 s, retry 1x)
├── services/           # Satu file per resource — semua panggilan API ada di sini
│   ├── auth.service.ts
│   ├── sensor.service.ts
│   ├── measurement.service.ts
│   ├── company.service.ts
│   ├── user.service.ts
│   ├── alert.service.ts
│   ├── analytics.service.ts
│   └── report.service.ts
├── hooks/              # Custom hooks berbasis React Query per resource
├── store/              # Zustand: useAuthStore, useAppStore, useUIStore
├── types/
│   └── index.ts        # Domain types (Sensor, Company, Alert, dll.)
├── constants/
│   ├── mockData.ts     # Data mock Super Admin
│   └── kadisData.ts    # Data mock Kadis
├── pages/              # Halaman per role
│   ├── public/         # Landing, Beranda, Informasi, Kontak
│   ├── auth/           # Login, Register
│   ├── superadmin/
│   ├── adminPerusahaan/
│   ├── kadis/
│   └── surveyor/
└── components/
    ├── layout/         # AppShell per role (sidebar + topbar)
    ├── map/            # SensorMap (react-leaflet), PublicSensorMap
    ├── charts/         # TrendChart (chart.js)
    └── ui/             # StatCard, Panel, Badge, StatusPill, dll.
```

---

## 3. Sistem Role & Routing

Frontend menggunakan **custom router** berbasis `window.location` (bukan React Router). Navigasi antar halaman dalam dashboard menggunakan Zustand store (`activePage`), bukan URL path.

| Role | Akses | Default page key |
|------|-------|-----------------|
| `superadmin` | Manajemen penuh (sensor, user, perusahaan, audit) | `dashboard` |
| `admin` | Admin Perusahaan — sensor milik perusahaan sendiri | `ap-dashboard` |
| `kadis` | Kepala Dinas — view analitik & persetujuan laporan | `kadis-dashboard` |
| `surveyor` | Survei lapangan — input pengukuran & kirim dokumen | `sv-dashboard` |

**Route URL publik:**

| Path | Keterangan |
|------|-----------|
| `/` atau `/peta` | Landing page (peta publik) |
| `/beranda` | Beranda |
| `/informasi` | Info aplikasi |
| `/kontak` | Kontak |
| `/login` | Halaman login |
| `/register` | Registrasi admin perusahaan |
| `/dashboard` | Dashboard (redirect ke role masing-masing) |

Setelah login berhasil, role user menentukan tampilan dashboard. Perubahan halaman di dalam dashboard **tidak mengubah URL** — semua dihandle oleh `activePage` di store.

---

## 4. Mode Mock vs Real API

Frontend mendukung dua mode melalui environment variable `VITE_USE_MOCK`.

### Setup `.env`

Buat file `.env` di `frontend/web/` (jangan di-commit):

```env
# Untuk development real API:
VITE_API_URL=http://localhost:8000/api
VITE_USE_MOCK=false

# Untuk development tanpa backend (data mock):
# VITE_USE_MOCK=true
```

> **`VITE_API_URL` default:** `http://localhost:8000/api` (jika tidak di-set, nilai ini dipakai otomatis).

### Akun Mock (VITE_USE_MOCK=true)

| Email | Password | Role |
|-------|----------|------|
| admin@sigat.go.id | sigat123 | superadmin |
| kadis@dinas.go.id | sigat123 | kadis |
| admin@majujaya.co.id | sigat123 | admin (Admin Perusahaan) |
| surveyor@lapangan.go.id | sigat123 | surveyor |

---

## 5. Integrasi Backend — Kontrak API

Base URL semua endpoint: `VITE_API_URL` (contoh: `http://localhost:8000/api`).

Semua request terproteksi mengirim header:
```
Authorization: Bearer <token>
```

Token disimpan di `localStorage` dengan key **`sigat_token`**. Jika backend mengembalikan `401`, frontend otomatis menghapus token dan reload halaman ke flow login.

Timeout request: **15 detik**.

---

### 5.1 Auth

| Method | Endpoint | Keterangan | Auth |
|--------|----------|-----------|------|
| `POST` | `/auth/login` | Login, kembalikan token + user | — |
| `POST` | `/auth/register-admin` | Daftarkan Admin Perusahaan baru | — |
| `POST` | `/auth/logout` | Invalidate token di server | Bearer |
| `GET` | `/auth/me` | Profil user dari token aktif | Bearer |
| `POST` | `/auth/refresh` | Perbarui JWT sebelum kedaluwarsa | Bearer |

**POST `/auth/login` — Request body:**
```json
{ "email": "string", "password": "string" }
```

**POST `/auth/login` — Response yang diharapkan frontend:**
```json
{
  "token": "eyJhbGci...",
  "expiresIn": 86400,
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "superadmin | admin | kadis | surveyor",
    "avatar": "string (inisial 2 huruf)",
    "companyId": "string (opsional, wajib ada jika role admin/surveyor)"
  }
}
```

**POST `/auth/register-admin` — Request body:**
```json
{
  "name": "string",
  "companyName": "string",
  "email": "string",
  "password": "string"
}
```
Response: sama dengan `/auth/login`.

**GET `/auth/me` — Response:**
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "role": "superadmin | admin | kadis | surveyor",
  "avatar": "string",
  "companyId": "string (opsional)"
}
```

**POST `/auth/refresh` — Response:**
```json
{ "token": "string", "expiresIn": 86400 }
```

---

### 5.2 Sensors

| Method | Endpoint | Keterangan | Role |
|--------|----------|-----------|------|
| `GET` | `/sensors` | List sensor (mendukung filter) | Semua |
| `GET` | `/sensors/:id` | Detail satu sensor | Semua |
| `GET` | `/sensors/:id/history` | Riwayat pengukuran sensor | Semua |
| `POST` | `/sensors` | Tambah sensor baru | superadmin |
| `PUT` | `/sensors/:id` | Update sensor | superadmin |
| `DELETE` | `/sensors/:id` | Hapus sensor | superadmin |

**Query params GET `/sensors`:**

| Param | Tipe | Keterangan |
|-------|------|-----------|
| `status` | `online \| offline \| alert \| maintenance` | Filter by status |
| `type` | `water \| gnss` | Filter by tipe sensor |
| `companyId` | `string` | Filter by perusahaan |
| `search` | `string` | Pencarian by kode atau lokasi |

**Sensor object:**
```json
{
  "id": "string",
  "code": "string",
  "type": "water | gnss",
  "location": "string",
  "lat": 0.0,
  "lng": 0.0,
  "status": "online | offline | alert | maintenance",
  "subsidence": 0.0,
  "waterLevel": 0.0,
  "verticalValue": 0.0,
  "companyId": "string",
  "lastUpdate": "ISO 8601 string"
}
```

---

### 5.3 Measurements (Pengukuran Lapangan)

| Method | Endpoint | Keterangan | Role |
|--------|----------|-----------|------|
| `GET` | `/measurements` | List pengukuran (mendukung filter) | admin, superadmin |
| `GET` | `/measurements/:id` | Detail satu pengukuran | admin, superadmin |
| `POST` | `/measurements` | Submit pengukuran baru | surveyor |
| `PUT` | `/measurements/:id/verify` | Verifikasi / tolak pengukuran | admin |

**Query params GET `/measurements`:**

| Param | Tipe | Keterangan |
|-------|------|-----------|
| `companyId` | `string` | Filter by perusahaan |
| `status` | `pending \| verified \| rejected \| draft` | Filter by status |
| `startDate` | `YYYY-MM-DD` | Tanggal mulai |
| `endDate` | `YYYY-MM-DD` | Tanggal akhir |

**POST `/measurements` — multipart/form-data:**

Frontend mengirim `FormData`. Field yang dikirim:
- Semua field teks di-append sebagai string
- `photos` (multiple): satu entry per file `File`

```
Content-Type: multipart/form-data
```

**PUT `/measurements/:id/verify` — Request body:**
```json
{
  "status": "verified | rejected",
  "note": "string (opsional)"
}
```

---

### 5.4 Companies (Perusahaan)

| Method | Endpoint | Keterangan | Role |
|--------|----------|-----------|------|
| `GET` | `/companies` | List semua perusahaan | Semua |
| `GET` | `/companies/:id` | Detail perusahaan | Semua |
| `POST` | `/companies` | Tambah perusahaan | superadmin |
| `PUT` | `/companies/:id` | Update perusahaan | superadmin |
| `DELETE` | `/companies/:id` | Hapus perusahaan | superadmin |

**Company object:**
```json
{
  "id": "string",
  "name": "string",
  "region": "string",
  "sensorCount": 0,
  "status": "online | offline | maintenance",
  "quota": 0,
  "quotaUsed": 0,
  "avgSubsidence": 0.0
}
```

---

### 5.5 Users

| Method | Endpoint | Keterangan | Role |
|--------|----------|-----------|------|
| `GET` | `/users` | List semua user | superadmin |
| `GET` | `/users/:id` | Detail user | superadmin |
| `POST` | `/users` | Tambah user | superadmin |
| `PUT` | `/users/:id` | Update user | superadmin |
| `DELETE` | `/users/:id` | Hapus user | superadmin |

---

### 5.6 Analytics

| Method | Endpoint | Keterangan |
|--------|----------|-----------|
| `GET` | `/analytics/trend` | Data tren subsidence per bulan |
| `GET` | `/analytics/company-summary` | Ringkasan per perusahaan |

**Query params GET `/analytics/trend`:**

| Param | Tipe | Keterangan |
|-------|------|-----------|
| `period` | `6m \| 1y \| 2y` | Rentang waktu |
| `companyId` | `string` | Filter by perusahaan (opsional) |

**GET `/analytics/trend` — Response:**
```json
[
  { "label": "Jan", "sw": 12.5, "gnss": 10.2, "threshold": 15.0 }
]
```

**GET `/analytics/company-summary` — Response:**
```json
[
  {
    "companyId": "string",
    "companyName": "string",
    "avgSubsidence": 0.0,
    "quotaUsed": 0,
    "quotaTotal": 0,
    "sensorCount": 0
  }
]
```

---

### 5.7 Alerts

| Method | Endpoint | Keterangan |
|--------|----------|-----------|
| `GET` | `/alerts` | List alert (mendukung filter) |
| `GET` | `/alerts/unread-count` | Jumlah alert belum dibaca |
| `PUT` | `/alerts/:id/read` | Tandai satu alert sebagai dibaca |
| `PUT` | `/alerts/read-all` | Tandai semua alert sebagai dibaca |

**Query params GET `/alerts`:**

| Param | Tipe | Keterangan |
|-------|------|-----------|
| `severity` | `critical \| warning \| info` | Filter by tingkat |
| `isRead` | `boolean` | Filter by status baca |
| `companyId` | `string` | Filter by perusahaan |
| `startDate` | `YYYY-MM-DD` | Tanggal mulai |
| `endDate` | `YYYY-MM-DD` | Tanggal akhir |

**GET `/alerts/unread-count` — Response:**
```json
{ "count": 5 }
```

**Alert object:**
```json
{
  "id": "string",
  "severity": "critical | warning | info",
  "title": "string",
  "description": "string",
  "sensorCode": "string (opsional)",
  "companyName": "string (opsional)",
  "timestamp": "ISO 8601 string",
  "isRead": false
}
```

---

### 5.8 Reports

| Method | Endpoint | Keterangan |
|--------|----------|-----------|
| `GET` | `/reports` | List semua laporan |
| `POST` | `/reports/generate` | Generate laporan baru (async) |
| `GET` | `/reports/status/:jobId` | Cek status pembuatan laporan |
| `GET` | `/reports/:id/download` | Download file laporan |

**POST `/reports/generate` — Response:**
```json
{ "jobId": "string" }
```

**GET `/reports/status/:jobId` — Response:**
```json
{
  "status": "generating | done | error",
  "reportId": "string (ada jika status done)"
}
```

**GET `/reports/:id/download`** — Backend harus mengembalikan file stream dengan header:
```
Content-Disposition: attachment; filename="nama-file.pdf"
Content-Type: application/pdf  (atau sesuai format)
```

Frontend membuat URL download langsung:
```
{VITE_API_URL}/reports/{reportId}/download
```
Pastikan endpoint ini menerima Bearer token (via query param `?token=` atau cookie jika tidak bisa lewat header pada `<a href>`).

---

## 6. Kontrak Response & Error

### Response sukses

Frontend mengekstrak field `data` dari response Axios secara langsung. Backend cukup mengembalikan object/array sesuai kontrak tanpa wrapper tambahan, **atau** dengan wrapper — pilih salah satu dan konsisten.

Contoh tanpa wrapper (lebih sederhana, yang dipakai services):
```json
{ "id": "s1", "code": "SW-001", ... }
```

Contoh dengan wrapper (jika ingin tambah metadata):
```json
{
  "data": { "id": "s1", ... },
  "message": "ok"
}
```
> Jika pakai wrapper, services perlu diupdate untuk baca `response.data.data`.

### Response error

Frontend hanya membaca `error.response.data.message` untuk menampilkan pesan error ke user.

```json
{
  "message": "Email atau password salah"
}
```

Untuk validasi form:
```json
{
  "message": "Validation error",
  "errors": {
    "email": ["Email wajib diisi"],
    "password": ["Password minimal 8 karakter"]
  }
}
```

### HTTP Status Code yang dipakai frontend

| Status | Perlakuan Frontend |
|--------|-------------------|
| `200`, `201` | Sukses |
| `401` | Auto logout + reload halaman |
| `400`, `403`, `404`, `409`, `422`, `500` | Tampil pesan error dari `response.data.message` |

---

## 7. CORS & Header

Backend **wajib** mengizinkan:

**Origins:**
```
http://localhost:5173       # Dev Vite
http://localhost:4173       # Preview build lokal
https://<domain-produksi>  # Sesuaikan saat deploy
```

**Headers:**
```
Authorization
Content-Type
```

**Methods:**
```
GET, POST, PUT, PATCH, DELETE, OPTIONS
```

**Credentials:** Tidak diperlukan (frontend pakai Bearer token, bukan cookie).

---

## 8. Type Definitions (Frontend → Backend)

Tipe utama ada di `src/types/index.ts`. Di bawah ini ringkasan untuk referensi backend.

```ts
type Role = 'superadmin' | 'admin' | 'kadis' | 'surveyor';
type SensorStatus = 'online' | 'offline' | 'alert' | 'maintenance';
type SensorType = 'water' | 'gnss';
type CompanyStatus = 'online' | 'offline' | 'maintenance';
type AlertSeverity = 'critical' | 'warning' | 'info';
```

**LocalStorage keys yang dipakai frontend:**

| Key | Isi |
|-----|-----|
| `sigat_token` | JWT token string |
| `sigat_auth` | JSON Zustand persist (berisi token + user) |

---

## 9. Checklist Backend Siap Integrasi

Lakukan langkah ini sebelum integrasi penuh:

- [ ] Set `VITE_API_URL` di `.env` mengarah ke backend yang aktif
- [ ] Set `VITE_USE_MOCK=false`
- [ ] CORS sudah dikonfigurasi untuk `http://localhost:5173`
- [ ] `POST /auth/login` mengembalikan `{ token, expiresIn, user }` dengan field `role` yang valid
- [ ] `GET /auth/me` mengembalikan profil user dari token Bearer
- [ ] `GET /sensors` merespons array Sensor (boleh kosong `[]`)
- [ ] `GET /companies` merespons array Company
- [ ] `GET /alerts/unread-count` merespons `{ count: number }`
- [ ] Upload measurement `POST /measurements` menerima `multipart/form-data`
- [ ] Semua error mengembalikan HTTP status yang benar + `{ message: "..." }`
- [ ] `GET /reports/:id/download` mengembalikan file stream

### Urutan integrasi yang disarankan

1. **Auth** (login, me) — unlock semua halaman
2. **Sensors + Companies** — data utama dashboard
3. **Alerts** — indikator notifikasi navbar
4. **Measurements** — alur Surveyor → Admin verifikasi
5. **Analytics** — chart tren subsidence
6. **Reports** — generate & download laporan

---

## 10. Deploy

### Build produksi

```bash
npm run build
# Output: dist/  (static files siap serve)
```

### Environment produksi

Buat `.env.production` di `frontend/web/`:

```env
VITE_API_URL=https://api.sigat.go.id/api
VITE_USE_MOCK=false
```

Atau inject saat build:
```bash
VITE_API_URL=https://api.sigat.go.id/api VITE_USE_MOCK=false npm run build
```

### Serve static files

Folder `dist/` berisi SPA. Konfigurasi server untuk redirect semua path ke `index.html`:

**Nginx:**
```nginx
server {
    root /var/www/sigat/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Docker (dengan Nginx):**
```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

### Verifikasi build

```bash
npm run type-check  # Pastikan tidak ada error TypeScript
npm run build       # Build gagal jika ada error
npm run preview     # Test build di http://localhost:4173
```

---

## 11. Troubleshooting

| Masalah | Solusi |
|---------|--------|
| Port 5173 bentrok | `npm run dev -- --port 3000` |
| Error `Cannot find module` | Hapus `node_modules`, jalankan `npm install` ulang |
| Build gagal TypeScript | Jalankan `npm run type-check` untuk detail error |
| CORS error di browser | Cek konfigurasi CORS backend, pastikan origin & header diizinkan |
| 401 loop (login terus) | Pastikan `GET /auth/me` mengembalikan user valid dari token yang dikirim |
| Foto tidak ter-upload | Pastikan backend menerima `multipart/form-data` dan field `photos` (multiple) |
| Map tidak muncul | Pastikan Leaflet CSS dimuat — cek `src/leaflet-light.css` dan `leaflet-dark.css` |

---

**Version:** 2.0.0 | **Last updated:** April 2026
