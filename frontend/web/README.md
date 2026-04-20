# SIGAT Frontend — Super Admin Dashboard

A modern, responsive admin dashboard application for managing spatial and environmental data across multiple modules including maps, sensors, analytics, users, and system administration.

## 📋 Overview

This is the web frontend application for the **SIGAT-ESDM** (Web Geographic Information System - Environmental Spatial Data Management) project. It provides a comprehensive dashboard for:

- 🗺️ **Spatial Data Management** - Interactive maps with Leaflet integration
- 📊 **Analytics & Visualization** - Real-time data visualization with charts
- 📡 **Sensor Management** - Monitor and manage IoT sensors
- 👥 **User & Company Management** - Admin controls for system users and organizations
- 🔐 **Role-Based Access Control** - Configure permissions and user roles
- 📈 **Reports & Audit Logs** - Track system activities and generate reports
- ⚙️ **System Configuration** - Server settings and system configuration management

---

## 🛠️ Tech Stack

| Package | Version | Kegunaan |
|---------|---------|----------|
| React | 18.3.1 | UI Framework |
| TypeScript | 5.5.3 | Type Safety & Development |
| Vite | 5.4.2 | Build tool & dev server |
| React Router | 6.26.1 | Client-side routing & nested layouts |
| Tailwind CSS | 3.4.11 | Styling dengan design token |
| React Leaflet + Leaflet | 4.2.1 + 1.9.4 | Peta interaktif dengan marker sensor |
| Recharts | 2.12.7 | Grafik & data visualization |
| Zustand | 5.0.0 | Global state management (auth, UI) |
| Lucide React | 0.447.0 | Icon library |
| clsx + tailwind-merge | 2.1.1 + 2.5.2 | Conditional className utilities |
| PostCSS & Autoprefixer | 8.4.45 + 10.4.20 | CSS processing |

---

## 🚀 Prerequisites & Installation

### Requirements
- **Node.js** >= 16.x
- **pnpm** >= 8.x (recommended) or npm/yarn

### Setup Instructions

```bash
# 1. Navigate ke direktori web
cd frontend/web

# 2. Install dependencies
pnpm install

# 3. Configure environment (jika diperlukan)
# Buat .env file dengan konfigurasi API endpoint

# 4. Jalankan development server
pnpm dev
# Server akan berjalan di http://localhost:5173

# 5. Build untuk production
pnpm build

# 6. Preview production build
pnpm preview
```

### Available Scripts

```bash
pnpm dev      # Start development server dengan hot reload
pnpm build    # Build untuk production (TypeScript & Vite)
pnpm preview  # Preview production build di local
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/
│   │   └── index.tsx                    # Reusable UI components
│   │                                    # Badge, StatusPill, StatCard, Panel, NavBadge, LiveDot
│   ├── layout/
│   │   ├── AppShell.tsx                # Layout wrapper dengan <Outlet />
│   │   ├── Sidebar.tsx                 # Sidebar collapsible dengan nav lengkap
│   │   └── Topbar.tsx                  # Topbar breadcrumb + live clock
│   ├── charts/
│   │   └── TrendChart.tsx              # Recharts area chart untuk subsidence trends
│   └── map/
│       └── SensorMap.tsx               # React Leaflet interactive map dengan marker
│
├── pages/
│   ├── superadmin/
│   │   ├── Dashboard.tsx               # Halaman utama Super Admin Landing
│   │   ├── peta/                       # Map & geographic module
│   │   ├── sensor/                     # Sensor management module
│   │   ├── analytics/                  # Analytics & reporting module
│   │   ├── users/                      # User management module
│   │   ├── companies/                  # Company management module
│   │   ├── roles/                      # Role-based access control module
│   │   ├── reports/                    # Reports generation module
│   │   ├── config/                     # System configuration module
│   │   ├── server/                     # Server & API management module
│   │   ├── audit/                      # Audit logs module
│   │   └── sections/
│   │       ├── StatsRow.tsx            # Dashboard stat cards (5 cards)
│   │       ├── MapSection.tsx          # Interactive map section
│   │       ├── AlertPanel.tsx          # Alert & notifications panel
│   │       ├── CompanyTable.tsx        # Company data table (sortable)
│   │       └── TrendSection.tsx        # Trend chart + mini metrics
│   │
│   ├── adminPerusahaan/                # Company admin pages
│   └── PlaceholderPage.tsx             # WIP placeholder untuk route yang belum dibuat
│
├── store/
│   └── index.ts                        # Zustand: UIStore + AuthStore
│
├── constants/
│   └── mockData.ts                     # Data mock: sensor, company, alert, trend
│
├── types/
│   └── index.ts                        # Shared TypeScript type definitions
│
├── lib/
│   └── utils.ts                        # Utility: cn(), formatters, helpers
│
├── assets/                             # Images, icons, static files
│
├── leaflet-dark.css                    # Dark theme override untuk Leaflet
├── leaflet-light.css                   # Light theme override untuk Leaflet
├── index.css                           # Tailwind + custom component classes
├── App.css                             # App-specific styles
├── App.tsx                             # React Router configuration
├── main.tsx                            # Application entry point
└── vite-env.d.ts                       # Vite type definitions
```

---

## 🧭 Routing Structure

Semua routes nested di bawah prefix `/superadmin`:

```
/                              → Redirect ke /superadmin
/superadmin                    → Dashboard (Landing Page)
/superadmin/peta              → Peta Interaktif & Geographic Data
/superadmin/sensor            → Sensor Management
/superadmin/analytics         → Analytics & Data Insights
/superadmin/users             → User Management
/superadmin/companies         → Company Management
/superadmin/roles             → Role & Access Control
/superadmin/reports           → Reports Generation
/superadmin/config            → System Configuration
/superadmin/server            → Server & API Management
/superadmin/audit             → Audit Logs & Activity Tracking
```

---

## 🎨 Styling & Design Tokens

### Color Palette

```
bg-app      #0b0f1a   ← App background
bg-sidebar  #111827   ← Sidebar & topbar background
bg-card     #1a2235   ← Card surfaces
bg-card2    #1f2b40   ← Nested card background

accent-cyan   #00d4b8  ← Primary accent (Super Admin theme)
accent-blue   #3b82f6  ← Info / GNSS sensor indicator
accent-amber  #f59e0b  ← Warning state
accent-red    #ef4444  ← Critical / Error state
accent-green  #22c55e  ← Success / Online state
accent-purple #a855f7  ← User avatar / Role identifier
accent-teal   #14b8a6  ← Air tanah (groundwater) sensor

text-primary   #f1f5f9 ← Primary text
text-secondary #94a3b8 ← Secondary text
text-muted     #475569 ← Muted/disabled text

border-base  #1e2d45  ← Base border color
border-light #253550  ← Light border color
```

### Responsive Design

- **Desktop**: Full layout dengan sidebar visible
- **Tablet**: Collapsible sidebar (768px - 1919px)
- **Mobile**: Bottom navigation / stacked layout (< 768px)

### Theme Support

- **Light Mode**: `leaflet-light.css`
- **Dark Mode**: `leaflet-dark.css` (default)

---

## 📊 Key Features & Components

### Dashboard (Landing Page)

Menampilkan:
- **StatsRow** - 5 kartu statistik utama
- **MapSection** - Peta interaktif dengan sensor overlay
- **AlertPanel** - Panel notifikasi dan alert real-time
- **CompanyTable** - Tabel data perusahaan yang sortable
- **TrendSection** - Chart trend subsidence dan metrics mini

### Interactive Map (SensorMap)

- Powered by **React Leaflet** + **Leaflet.js**
- Menampilkan marker sensor dan popup info
- Layer switcher untuk berbagai data layers
- Support dark & light theme
- Zoom dan pan controls

### Charts & Analytics (TrendChart)

- Powered by **Recharts**
- Area chart untuk visualisasi trend data
- Responsive dan interactive
- Support untuk multiple metrics

### State Management (Zustand)

Global store mencakup:
- Authentication state
- UI preferences (sidebar collapse, theme toggle)
- User profile information
- System-wide notifications

---

## 📡 Backend Integration

Aplikasi ini didesain untuk bekerja dengan backend API di `../../backend/`:

### Configuration

1. Atur API endpoint di `.env` atau environment variable:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

2. Backend menggunakan **Prisma ORM** untuk database management

3. Pastikan CORS dikonfigurasi dengan benar pada backend

### API Endpoints

Contoh struktur endpoint API yang diharapkan:
```
GET    /api/sensors              # List semua sensors
GET    /api/sensors/:id          # Detail sensor
GET    /api/companies            # List companies
GET    /api/users                # List users
GET    /api/analytics/trends     # Analytics data
GET    /api/audit-logs           # Audit logs
```

### Type Safety

- TypeScript types untuk API responses harus didefinisikan di `src/types/index.ts`
- Gunakan `interface` untuk struktur data
- Enable strict mode di `tsconfig.json`

---

## 🧭 Development Guidelines

### ✅ Adding a New Page/Module

1. **Create Module Folder**
   ```bash
   mkdir -p src/pages/superadmin/[module-name]
   ```

2. **Create Index Component**
   ```tsx
   // src/pages/superadmin/[module-name]/index.tsx
   export default function ModuleName() {
     return (
       <div className="space-y-6">
         {/* Content */}
       </div>
     )
   }
   ```

3. **Register Route in App.tsx**
   ```tsx
   import ModuleName from '@/pages/superadmin/[module-name]'
   
   <Route path="[module-name]" element={<ModuleName />} />
   ```

4. **Add Navigation Link**
   - Update `Sidebar.tsx` dengan link baru
   - Gunakan icon dari **Lucide React**

### ✅ Adding a New Component

1. **Create Component File**
   ```bash
   # Untuk reusable UI component:
   src/components/ui/MyComponent.tsx
   
   # Untuk module-specific component:
   src/pages/superadmin/[module]/components/SpecificComponent.tsx
   ```

2. **Use TypeScript**
   ```tsx
   import { ReactNode } from 'react'
   
   interface MyComponentProps {
     title: string
     children?: ReactNode
   }
   
   export default function MyComponent({ title, children }: MyComponentProps) {
     return <div>{title}{children}</div>
   }
   ```

3. **Export from UI Index** (jika reusable)
   ```tsx
   // src/components/ui/index.tsx
   export { default as MyComponent } from './MyComponent'
   ```

### ✅ Styling Guidelines

- **Gunakan Tailwind CSS utility classes** untuk styling
- **Kurangi custom CSS** - hindari `<style>` tag dalam component
- Gunakan `clsx` atau `tailwind-merge` untuk conditional classes:
  ```tsx
  import { clsx } from 'clsx'
  
  <div className={clsx(
    'p-4 rounded-lg',
    isActive ? 'bg-cyan-500' : 'bg-gray-700'
  )}>
    Content
  </div>
  ```
- Keep custom CSS di `App.css` atau `index.css`
- Maintain consistency dengan design tokens

### ✅ State Management

Untuk global state, gunakan Zustand:

```tsx
// In src/store/index.ts
import { create } from 'zustand'

export const useUIStore = create((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}))

// Usage dalam component:
const { sidebarOpen, toggleSidebar } = useUIStore()
```

---

## 🐛 Troubleshooting

### ❌ Port Already in Use
```bash
# Gunakan port berbeda
pnpm dev -- --port 3000
```

### ❌ Module Not Found / Import Error
```bash
# Hapus node_modules dan install ulang
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Pastikan path alias (@/) berfungsi
# Seharusnya sudah dikonfigurasi di vite.config.ts
```

### ❌ TypeScript Compilation Error
```bash
# Jalankan build untuk check error
pnpm build

# Lihat detailed error messages
```

### ❌ Styling Issues (Tailwind)

1. Clear Tailwind cache:
   ```bash
   rm -rf node_modules/.vite/@tailwindcss
   ```

2. Restart dev server

3. Ensure `tailwind.config.js` mencakup semua file paths:
   ```js
   content: [
     "./index.html",
     "./src/**/*.{js,ts,jsx,tsx}",
   ]
   ```

### ❌ Map Not Displaying

1. Ensure Leaflet CSS dimuat:
   ```tsx
   import 'leaflet/dist/leaflet.css'
   ```

2. Check browser console untuk error messages

3. Verify API untuk marker data berfungsi

---

## 📚 Resources & Documentation

- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev)
- [React Router Guide](https://reactrouter.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Leaflet Documentation](https://leafletjs.com)
- [Recharts Examples](https://recharts.org)
- [Zustand GitHub](https://github.com/pmndrs/zustand)
- [Lucide Icons](https://lucide.dev)

---

## 🤝 Contributing

Ketika berkontribusi pada project:

1. ✅ Ikuti struktur folder yang sudah ada
2. ✅ Gunakan TypeScript strict mode
3. ✅ Ikuti naming conventions:
   - Components: `PascalCase` (e.g., `MyComponent.tsx`)
   - Utils/hooks: `camelCase` (e.g., `useCustomHook.ts`)
   - Constants: `UPPER_SNAKE_CASE`
4. ✅ Test changes dengan menjalankan `pnpm dev`
5. ✅ Build sebelum commit: `pnpm build`
6. ✅ Gunakan meaningful commit messages

---

## 📋 Adding New Role/User Type

Untuk menambah halaman role baru (misal Admin Perusahaan):

1. **Create Role Folder**
   ```bash
   mkdir -p src/pages/adminPerusahaan
   mkdir -p src/components/layout/AdminPerusahaanShell
   ```

2. **Create Layout Shell**
   ```tsx
   // src/components/layout/AdminPerusahaanShell.tsx
   import { Outlet } from 'react-router-dom'
   
   export default function AdminPerusahaanShell() {
     return (
       <div className="flex">
         {/* Custom Sidebar untuk admin perusahaan */}
         <Outlet />
       </div>
     )
   }
   ```

3. **Register Route in App.tsx**
   ```tsx
   <Route path="/admin-perusahaan" element={<AdminPerusahaanShell />}>
     <Route index element={<AdminPerusahaanDashboard />} />
     {/* Other routes */}
   </Route>
   ```

---

## 📝 License

Part of SIGAT-ESDM project.

---

**Last Updated**: April 2026
**Version**: 0.1.0
