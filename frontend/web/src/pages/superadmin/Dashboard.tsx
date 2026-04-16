import StatsRow from '../../../../web/src/pages/superadmin/sections/StatsRow';
import MapSection from '../../../../web/src/pages/superadmin/sections/MapSection';
import AlertPanel from '../../../../web/src/pages/superadmin/sections/AlertPanel';
import CompanyTable from '../../../../web/src/pages/superadmin/sections/CompanyTable';
import TrendSection from '../../../../web/src/pages/superadmin/sections/TrendSection';

export default function SuperAdminDashboard() {
  return (
    <div className="p-5 pb-8 space-y-4 w-full">
      {/* Page heading */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[18px] font-semibold text-slate-800 leading-tight">
            Dashboard Sistem
          </h1>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
            Pemantauan penuh seluruh sensor, perusahaan, dan pengguna
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot flex-shrink-0" />
          <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap">Realtime · 30s</span>
        </div>
      </div>

      {/* ① Stats Row — 5 cols, min-width protected */}
      <StatsRow />

      {/* ② Map + Alert Panel */}
      <div className="grid gap-4" style={{ gridTemplateColumns: 'minmax(0,1fr) 288px' }}>
        <MapSection />
        <AlertPanel />
      </div>

      {/* ③ Company Table + Trend Chart */}
      <div className="grid gap-4" style={{ gridTemplateColumns: 'minmax(0,1fr) 340px' }}>
        <CompanyTable />
        <TrendSection />
      </div>
    </div>
  );
}
