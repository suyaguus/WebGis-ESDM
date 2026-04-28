import KadisStatsRow from "./sections/StatsRow";
import KadisMapSection from "./sections/MapSection";

export default function KadisDashboard() {

  return (
    <div className="p-3 sm:p-5 pb-8 space-y-4 w-full">
      {/* Page heading */}
      <div className="flex items-center justify-between gap-2 min-w-0">
        <div className="min-w-0">
          <h1 className="text-[16px] sm:text-[18px] font-semibold text-slate-800 leading-tight">
            Dashboard Kepala Dinas
          </h1>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5 hidden sm:block">
            Pengawasan penggunaan air tanah · Provinsi Lampung
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot flex-shrink-0" />
            <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap hidden sm:inline">
              Realtime · 30s
            </span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <KadisStatsRow />

      {/* Map */}
      <div>
        <KadisMapSection />
      </div>

    </div>
  );
}
