# WebGIS Frontend — Super Admin

## Stack

| Package | Kegunaan |
|---|---|
| Vite + React + TypeScript | Build tool & framework |
| Tailwind CSS v3 | Styling dengan design token |
| React Router v6 | Client-side routing & nested layouts |
| Recharts | Grafik trend subsidence |
| React Leaflet + Leaflet | Peta interaktif dengan marker sensor |
| Zustand | Global state (auth, UI) |
| Lucide React | Icon library |
| clsx + tailwind-merge | Conditional className |

---

## Setup

```bash
# 1. Buat project baru dengan Vite (jika belum ada)
pnpm create vite@latest webgis-frontend --template react-ts
cd webgis-frontend

# 2. Install semua dependencies
pnpm add react-router-dom recharts lucide-react zustand clsx tailwind-merge react-leaflet leaflet
pnpm add -D tailwindcss postcss autoprefixer @types/leaflet

# 3. Init Tailwind
npx tailwindcss init -p

# 4. Salin semua file dari repo ini ke folder project

# 5. Jalankan dev server
pnpm dev
```

---

## Struktur File

```
src/
├── components/
│   ├── ui/
│   │   └── index.tsx          # Badge, StatusPill, StatCard, Panel, NavBadge, LiveDot
│   ├── layout/
│   │   ├── AppShell.tsx       # Layout wrapper <Outlet />
│   │   ├── Sidebar.tsx        # Sidebar collapsible dengan nav lengkap
│   │   └── Topbar.tsx         # Topbar breadcrumb + live clock
│   ├── charts/
│   │   └── TrendChart.tsx     # Recharts area chart subsidence
│   └── map/
│       └── SensorMap.tsx      # React Leaflet + marker + popup + layer switcher
├── pages/
│   ├── superadmin/
│   │   ├── Dashboard.tsx      # Halaman utama Super Admin
│   │   └── sections/
│   │       ├── StatsRow.tsx   # 5 stat cards
│   │       ├── MapSection.tsx # Map wrapper panel
│   │       ├── AlertPanel.tsx # Alert & notifikasi list
│   │       ├── CompanyTable.tsx  # Tabel perusahaan sortable
│   │       └── TrendSection.tsx  # Chart trend + mini metrics
│   └── PlaceholderPage.tsx    # Halaman WIP untuk route belum dibuat
├── store/
│   └── index.ts               # Zustand: UIStore + AuthStore
├── constants/
│   └── mockData.ts            # Data mock sensor, company, alert, trend
├── types/
│   └── index.ts               # Shared TypeScript types
├── lib/
│   └── utils.ts               # cn(), formatters, helpers
├── leaflet-dark.css           # Dark theme override untuk Leaflet popup
├── index.css                  # Tailwind + custom component classes
├── App.tsx                    # React Router setup
└── main.tsx                   # Entry point
```

---

## Routing Structure

```
/                         → redirect ke /superadmin
/superadmin               → Super Admin Dashboard (Landing)
/superadmin/peta          → Peta Interaktif (placeholder)
/superadmin/sensor        → Semua Sensor (placeholder)
/superadmin/analytics     → Analytics (placeholder)
/superadmin/users         → Kelola Pengguna (placeholder)
/superadmin/companies     → Kelola Perusahaan (placeholder)
/superadmin/roles         → Role & Akses (placeholder)
/superadmin/reports       → Laporan (placeholder)
/superadmin/config        → Konfigurasi (placeholder)
/superadmin/server        → Server & API (placeholder)
/superadmin/audit         → Audit Log (placeholder)
```

---

## Design Tokens (Tailwind)

```
bg-app      #0b0f1a   ← App background
bg-sidebar  #111827   ← Sidebar & topbar
bg-card     #1a2235   ← Card surfaces
bg-card2    #1f2b40   ← Nested card

accent-cyan   #00d4b8  ← Primary accent (Super Admin)
accent-blue   #3b82f6  ← Info / GNSS sensor
accent-amber  #f59e0b  ← Warning
accent-red    #ef4444  ← Critical / Error
accent-green  #22c55e  ← Success / Online
accent-purple #a855f7  ← User avatar / Role
accent-teal   #14b8a6  ← Air tanah sensor

text-primary   #f1f5f9
text-secondary #94a3b8
text-muted     #475569

border-base  #1e2d45
border-light #253550
```

---

## Menambah Role Baru

Untuk menambah halaman role baru (misal Admin Perusahaan):

1. Buat folder `src/pages/admin-company/`
2. Buat `Dashboard.tsx` dan `sections/` sesuai kebutuhan
3. Buat layout shell baru di `src/components/layout/` jika sidebar berbeda
4. Tambahkan route di `App.tsx`:
   ```tsx
   <Route path="/admin" element={<AdminShell />}>
     <Route index element={<AdminDashboard />} />
   </Route>
   ```
