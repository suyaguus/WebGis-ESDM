import { useState, useEffect } from 'react';
import { Bell, ChevronRight, RefreshCw } from 'lucide-react';
import { useAppStore } from '../../../store';
import { getCurrentDate, getCurrentTime } from '../../../lib/utils';
import { MOCK_ALERTS } from '../../../constants/mockData';
import { cn } from '../../../lib/utils';

const PAGE_META: Record<string, { label: string; section: string }> = {
  dashboard:  { label: 'Dashboard',        section: 'Overview' },
  peta:       { label: 'Peta Interaktif',  section: 'Overview' },
  sensor:     { label: 'Semua Sensor',     section: 'Overview' },
  analytics:  { label: 'Analytics',        section: 'Overview' },
  users:      { label: 'Pengguna',         section: 'Manajemen' },
  companies:  { label: 'Perusahaan',       section: 'Manajemen' },
  roles:      { label: 'Role & Akses',     section: 'Manajemen' },
  reports:    { label: 'Laporan',          section: 'Manajemen' },
  config:     { label: 'Konfigurasi',      section: 'Sistem' },
  server:     { label: 'Server & API',     section: 'Sistem' },
  audit:      { label: 'Audit Log',        section: 'Sistem' },
};

export default function Topbar() {
  const { activePage } = useAppStore();
  const [time, setTime]         = useState(getCurrentTime());
  const [showAlerts, setAlerts] = useState(false);
  const [refreshing, setRefresh] = useState(false);
  const unread = MOCK_ALERTS.filter(a => !a.isRead).length;
  const meta   = PAGE_META[activePage] ?? { label: activePage, section: 'SIPASTI' };

  useEffect(() => {
    const t = setInterval(() => setTime(getCurrentTime()), 30_000);
    return () => clearInterval(t);
  }, []);

  const handleRefresh = () => {
    setRefresh(true);
    setTimeout(() => setRefresh(false), 800);
  };

  return (
    <header className="h-[60px] bg-white border-b border-slate-100 flex items-center px-5 gap-4 flex-shrink-0 shadow-sm relative z-20 min-w-0">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[12px] min-w-0">
        <span className="text-slate-400 flex-shrink-0 text-[11px]">SIPASTI</span>
        <ChevronRight size={11} className="text-slate-300 flex-shrink-0" />
        <span className="text-slate-400 flex-shrink-0 text-[11px]">{meta.section}</span>
        <ChevronRight size={11} className="text-slate-300 flex-shrink-0" />
        <span className="font-semibold text-slate-700 truncate text-[12px]">{meta.label}</span>
      </div>

      {/* Right controls */}
      <div className="ml-auto flex items-center gap-2.5 flex-shrink-0">
        {/* Refresh */}
        <button onClick={handleRefresh}
          className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center hover:bg-slate-100 transition-colors">
          <RefreshCw size={13} className={cn('text-slate-500 transition-transform', refreshing && 'animate-spin')} />
        </button>

        {/* Date + time */}
        <div className="hidden md:flex text-[10px] font-mono text-slate-400 bg-slate-50 border border-slate-100 px-2.5 py-1.5 rounded-lg whitespace-nowrap items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot flex-shrink-0" />
          {getCurrentDate()} · {time}
        </div>

        {/* Alert bell */}
        <div className="relative">
          <button onClick={() => setAlerts(p => !p)}
            className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center hover:bg-slate-100 transition-colors relative">
            <Bell size={14} className="text-slate-500" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                {unread}
              </span>
            )}
          </button>

          {showAlerts && (
            <div className="absolute right-0 top-10 w-72 bg-white border border-slate-100 rounded-xl shadow-xl z-50 overflow-hidden animate-slide-up">
              <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                <span className="text-[12px] font-semibold text-slate-700">Notifikasi</span>
                <span className="text-[9px] font-mono text-red-500 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">{unread} BARU</span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                {MOCK_ALERTS.slice(0, 5).map(a => (
                  <div key={a.id} className={cn('px-4 py-3', !a.isRead && 'bg-slate-50/60')}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn('text-[9px] font-mono font-medium px-1.5 py-0.5 rounded border',
                        a.severity === 'critical' ? 'bg-red-50 text-red-700 border-red-200'
                        : a.severity === 'warning' ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-blue-50 text-blue-700 border-blue-200')}>
                        {a.severity.toUpperCase()}
                      </span>
                      {!a.isRead && <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />}
                    </div>
                    <p className="text-[11px] font-medium text-slate-700 leading-snug">{a.title}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-mono">{a.timestamp}</p>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50">
                <button onClick={() => setAlerts(false)} className="text-[11px] text-cyan-600 hover:text-cyan-700 font-medium w-full text-center">
                  Lihat semua notifikasi →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-[10px] font-bold text-purple-700 cursor-pointer hover:ring-2 hover:ring-purple-200 transition-all flex-shrink-0 border border-purple-200">
          AF
        </div>
      </div>
    </header>
  );
}
