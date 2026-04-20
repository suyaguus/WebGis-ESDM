# SIGAT Frontend (Web)

Frontend dashboard SIGAT-ESDM untuk peta, sensor, analitik, laporan, dan manajemen pengguna berbasis role.

## Quick Start

Prasyarat:
- Node.js >= 16
- pnpm >= 8

Jalankan:

```bash
cd frontend/web
pnpm install
pnpm dev
```

Default: http://localhost:5173

Scripts:

```bash
pnpm dev
pnpm build
pnpm preview
```

## Struktur Inti

```text
src/
  components/  # UI, layout, chart, map
  pages/       # Halaman per role/module
  services/    # Layer request API
  hooks/       # Custom hooks
  store/       # Zustand state
  types/       # Shared types
  lib/api.ts   # Axios instance + auth interceptor
```

## Integrasi Backend (Penting)

Backend source ada di ../../backend.

### 1) Environment Frontend

Buat .env di frontend/web:

```env
VITE_API_URL=http://localhost:8000/api
VITE_USE_MOCK=false
```

Catatan:
- Saat VITE_USE_MOCK=true, frontend memakai data mock.
- Untuk test integrasi real API, wajib set VITE_USE_MOCK=false.

### 2) Kontrak Auth yang Harus Didukung Backend

Frontend mengirim token sebagai Bearer token pada header Authorization.

Endpoint minimum:
- POST /auth/login
- POST /auth/logout
- GET /auth/me
- POST /auth/refresh

Perilaku penting:
- Login mengembalikan token dan data user.
- Jika API mengembalikan 401, frontend otomatis hapus token dan reload ke flow login.

### 3) Kontrak Response API (Disarankan Konsisten)

Sukses (contoh):

```json
{
  "data": {},
  "message": "ok"
}
```

Error (contoh):

```json
{
  "message": "Validation error",
  "errors": {
    "email": ["Email wajib diisi"]
  }
}
```

Minimal backend selalu kirim:
- HTTP status code yang benar
- message pada body error

### 4) Endpoint Minimum per Modul Frontend

Auth:
- POST /auth/login
- POST /auth/logout
- GET /auth/me
- POST /auth/refresh

Sensors:
- GET /sensors
- GET /sensors/:id
- POST /sensors
- PUT /sensors/:id
- DELETE /sensors/:id

Measurements:
- GET /measurements
- GET /measurements/:id
- POST /measurements (multipart/form-data untuk upload foto)
- PUT /measurements/:id/verify

Companies:
- GET /companies
- GET /companies/:id
- POST /companies
- PUT /companies/:id
- DELETE /companies/:id

Users:
- GET /users
- GET /users/:id
- POST /users
- PUT /users/:id
- DELETE /users/:id

Analytics:
- GET /analytics/trend
- GET /analytics/company-summary

Alerts:
- GET /alerts
- GET /alerts/unread-count
- PUT /alerts/:id/read
- PUT /alerts/read-all

Reports:
- GET /reports
- POST /reports/generate
- GET /reports/status/:jobId
- GET /reports/:id/download

### 5) CORS & Header Checklist

Izinkan origin frontend dev:
- http://localhost:5173

Izinkan header:
- Authorization
- Content-Type

Izinkan method:
- GET, POST, PUT, PATCH, DELETE, OPTIONS

### 6) Checklist Backend Siap Integrasi

- VITE_API_URL mengarah ke backend yang aktif
- VITE_USE_MOCK=false
- Login sukses mengembalikan token
- Endpoint GET /auth/me mengembalikan user dari token valid
- Endpoint list utama (sensors, companies, users) sudah merespons data
- Upload measurement multipart/form-data sudah berfungsi
- Error API mengembalikan status + message yang konsisten

## Troubleshooting Singkat

- Port bentrok: pnpm dev -- --port 3000
- Dependency error: hapus node_modules lalu install ulang
- Validasi build: pnpm build

## Versi

- Last updated: April 2026
- Version: 0.1.1
