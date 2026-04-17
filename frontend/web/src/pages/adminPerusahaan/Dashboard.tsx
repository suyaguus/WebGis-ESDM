import { Download, FileText, Users, CheckSquare } from 'lucide-react';
import { useAppStore } from '../../store';
import AdminStatsRow  from './sections/StatsRow';
import AdminMapSection from './sections/MapSection';
import AdminAlertPanel from './sections/AlertPanel';
import AdminSensorList from './sections/SensorList';
import AdminTrendSection from './sections/TrendSection';
import AdminActivityLog from './sections/ActivityLog';
import { ADMIN_COMPANY } from '../../constants/mockData';
import { getQuotaPercent, cn } from '../../lib/utils';

const QUICK_ACTIONS = [
  { key: 'ap-laporan',   label: 'Ekspor Laporan',    icon: Download,     color: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' },
  { key: 'ap-sumur',     label: 'Data Realtime',     icon: FileText,     color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' },
  { key: 'ap-tim',       label: 'Tim Lapangan',      icon: Users,        color: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' },
  { key: 'ap-verifikasi',label: 'Verifikasi Data',   icon: CheckSquare,  color: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100' },
];

export default function AdminDashboard() {
  const { setActivePage } = useAppStore();
  const pct = getQuotaPercent(ADMIN_COMPANY.quotaUsed, ADMIN_COMPANY.quota);
  const pctColor = pct >= 100 ? '#EF4444' : pct >= 85 ? '#F59E0B' : '#22C55E';

  return (
    <div className="p-5 space-y-4 w-full">
      {/* Page heading */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[18px] font-semibold text-slate-800 leading-tight">Dashboard Perusahaan</h1>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">PT Maju Jaya Tbk · Bandar Lampung, Lampung</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot flex-shrink-0" />
          <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap">Realtime · 30s</span>
        </div>
      </div>

      {/* ── Quick actions ── */}
      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
        {QUICK_ACTIONS.map(({ key, label, icon: Icon, color }) => (
          <button key={key} onClick={() => setActivePage(key)}
            className={cn('flex items-center gap-2.5 px-4 py-3 rounded-xl border font-medium text-[12px] transition-all shadow-sm hover:shadow', color)}>
            <Icon size={14} className="flex-shrink-0" />
            <span className="truncate">{label}</span>
          </button>
        ))}
      </div>

      {/* ── Stats row ── */}
      <AdminStatsRow />

      {/* ── Map + Alert panel ── */}
      <div className="grid gap-4" style={{ gridTemplateColumns: 'minmax(0,1fr) 280px' }}>
        <AdminMapSection />
        <AdminAlertPanel />
      </div>

      {/* ── Sensor list + Trend + Activity ── */}
      <div className="grid gap-4" style={{ gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr) 280px' }}>
        <AdminSensorList />
        <AdminTrendSection />
        <AdminActivityLog />
      </div>

      {/* ── Quota bar full-width ── */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm px-5 py-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[13px] font-semibold text-slate-800">Kuota Pengambilan Air Tanah 2026</p>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
              {(ADMIN_COMPANY.quotaUsed / 1000).toFixed(0)}k m³ terpakai dari {(ADMIN_COMPANY.quota / 1000).toFixed(0)}k m³ total izin
            </p>
          </div>
          <div className="text-right">
            <span className="text-[22px] font-bold font-mono" style={{ color: pctColor }}>{pct}%</span>
            <p className="text-[9px] font-mono text-slate-400 mt-0.5">
              {pct >= 85 ? '⚠ Mendekati batas kuota' : 'Aman'}
            </p>
          </div>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700 relative overflow-hidden"
            style={{ width: `${Math.min(pct, 100)}%`, background: pctColor }}>
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </div>
        </div>
        <div className="flex justify-between mt-2">
          {[0, 25, 50, 75, 100].map(tick => (
            <div key={tick} className="text-center">
              <div className="h-1.5 w-px bg-slate-200 mx-auto" />
              <span className="text-[8px] font-mono text-slate-400">{tick}%</span>
            </div>
          ))}
        </div>
        {pct >= 85 && (
          <div className="mt-3 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            <span className="text-amber-600 text-[13px]">⚠</span>
            <p className="text-[11px] text-amber-700">
              Kuota tersisa <strong>{100 - pct}%</strong> ({((ADMIN_COMPANY.quota - ADMIN_COMPANY.quotaUsed) / 1000).toFixed(0)}k m³).
              Hubungi Kepala Instansi jika memerlukan penambahan kuota.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
