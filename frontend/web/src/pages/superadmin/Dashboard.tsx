import StatsRow     from '@/pages/superadmin/sections/StatsRow';
import MapSection   from '@/pages/superadmin/sections/MapSection';
import AlertPanel   from '@/pages/superadmin/sections/AlertPanel';
import CompanyTable from '@/pages/superadmin/sections/CompanyTable';
import TrendSection from '@/pages/superadmin/sections/TrendSection';

export default function SuperAdminDashboard() {
  return (
    <div className="p-3 sm:p-5 pb-8 space-y-4 w-full">
      {/* Page heading */}
      <div className="flex items-center justify-between gap-2 min-w-0">
        <div className="min-w-0">
          <h1 className="text-[16px] sm:text-[18px] font-semibold text-slate-800 leading-tight">
            Dashboard Sistem
          </h1>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5 hidden sm:block">
            Pemantauan penuh seluruh sensor, perusahaan, dan pengguna
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot flex-shrink-0" />
          <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap hidden sm:inline">Realtime · 30s</span>
        </div>
      </div>

      {/* ① Stats Row */}
      <StatsRow />

      {/* ② Map + Alert Panel — split at md */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-[1fr_288px]">
        <MapSection />
        <AlertPanel />
      </div>

      {/* ③ Company Table + Trend Chart — split at md */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-[1fr_320px]">
        <CompanyTable />
        <TrendSection />
      </div>
    </div>
  );
}
