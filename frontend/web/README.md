# SIGAT Frontend (Web)

Frontend dashboard untuk SIGAT-ESDM dengan fokus pada peta, sensor, analitik, laporan, dan manajemen pengguna berbasis role.

## Ringkasan

Aplikasi ini dibangun untuk memantau dan mengelola data spasial/lingkungan melalui antarmuka web yang responsif.

Fitur utama:
- Peta interaktif (Leaflet)
- Dashboard analitik (chart)
- Monitoring sensor
- Manajemen user, role, perusahaan
- Laporan dan audit log

## Tech Stack

- React + TypeScript
- Vite
- React Router
- Tailwind CSS
- React Leaflet / Leaflet
- Recharts
- Zustand

## Menjalankan Project

Prasyarat:
- Node.js >= 16
- pnpm >= 8

Langkah cepat:

```bash
cd frontend/web
pnpm install
pnpm dev
```

Default dev server: http://localhost:5173

## Scripts

```bash
pnpm dev      # Jalankan development server
pnpm build    # Build production
pnpm preview  # Preview hasil build
```

## Struktur Folder Inti

```text
src/
  components/   # UI, layout, chart, map
  pages/        # Halaman per role/module
  services/     # API service layer
  hooks/        # Custom hooks
  store/        # Zustand global state
  types/        # TypeScript shared types
  constants/    # Mock/static constants
  lib/          # Helper & util
```

## Catatan Routing

- Root mengarah ke dashboard sesuai role
- Modul utama super admin berada di path /superadmin/*
- Halaman role lain (mis. admin perusahaan, kadis) dipisah per folder di src/pages

## Integrasi Backend

Backend ada di folder ../../backend.
Pastikan endpoint API aktif dan CORS backend sudah sesuai origin frontend.

## Alur Development Singkat

- Tambah page baru di folder pages sesuai role/module
- Daftarkan route di App.tsx
- Tambah menu di Sidebar role terkait
- Jalankan pnpm build sebelum commit

## Troubleshooting Cepat

- Port bentrok: jalankan pnpm dev -- --port 3000
- Error dependency: hapus node_modules lalu install ulang
- Build check: jalankan pnpm build

## Versi

- Last updated: April 2026
- Version: 0.1.0
