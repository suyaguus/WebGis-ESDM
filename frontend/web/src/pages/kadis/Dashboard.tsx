import { FileText, Map, BarChart3, AlertTriangle } from 'lucide-react';
import { useAppStore } from '../../store';
import KadisStatsRow      from './sections/StatsRow';
import KadisMapSection    from './sections/MapSection';
import KadisAlertSummary  from './sections/AlertSummary';
import KadisComplianceTable from './sections/ComplianceTable';
import KadisTrendSection  from './sections/TrendSection';
import { MOCK_ALERTS } from '../../constants/mockData';
import { cn } from '../../lib/utils';

const QUICK_ACTIONS = [
  { key: 'kadis-laporan',    label: 'Laporan Kepatuhan', icon: FileText,      color: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' },
  { key: 'kadis-peta',       label: 'Peta Wilayah',      icon: Map,           color: 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100' },
  { key: 'kadis-analitik',   label: 'Analitik Tren',     icon: BarChart3,     color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' },
  { key: 'kadis-perusahaan', label: 'Data Perusahaan',   icon: AlertTriangle, color: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' },
];

export default function KadisDashboard() {
  const { setActivePage } = useAppStore();
  const criticalCount = MOCK_ALERTS.filter(a => a.severity === 'critical' && !a.isRead).length;

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
          {criticalCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 blink-alert flex-shrink-0" />
              <span className="text-[10px] font-mono text-red-700 font-semibold">{criticalCount} kritis</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot flex-shrink-0" />
            <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap hidden sm:inline">Realtime · 30s</span>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
        {QUICK_ACTIONS.map(({ key, label, icon: Icon, color }) => (
          <button key={key} onClick={() => setActivePage(key)}
            className={cn('flex items-center gap-2.5 px-4 py-3 rounded-xl border font-medium text-[12px] transition-all shadow-sm hover:shadow', color)}>
            <Icon size={14} className="flex-shrink-0" />
            <span className="truncate">{label}</span>
          </button>
        ))}
      </div>

      {/* Stats row */}
      <KadisStatsRow />

      {/* Map + Alert summary */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-[1fr_296px]">
        <KadisMapSection />
        <KadisAlertSummary />
      </div>

      {/* Compliance table + Trend */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-[1fr_320px]">
        <KadisComplianceTable />
        <KadisTrendSection />
      </div>
    </div>
  );
}
