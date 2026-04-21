import { useState, useEffect } from 'react';
import { Bell, ChevronRight, RefreshCw, Menu, ClipboardEdit } from 'lucide-react';
import { useAppStore } from '../../../store';
import { getCurrentDate, getCurrentTime, cn } from '../../../lib/utils';
import { MOCK_ALERTS } from '../../../constants/mockData';
import { SURVEYOR_PROFILE } from '../../../constants/surveyorData';

const PAGE_META: Record<string, { label: string; section: string }> = {
  'sv-dashboard': { label: 'Dashboard',          section: 'Overview'  },
  'sv-sensor':    { label: 'Sensor Ditugaskan',   section: 'Lapangan'  },
  'sv-input':     { label: 'Input Pengukuran',    section: 'Lapangan'  },
  'sv-peta':      { label: 'Peta Sensor',         section: 'Lapangan'  },
  'sv-laporan':   { label: 'Riwayat Laporan',     section: 'Laporan'   },
};

const MY_ALERTS = MOCK_ALERTS.filter(a =>
  a.sensorCode === 'SW-007' || a.sensorCode === 'GN-055',
);

export default function SurveyorTopbar() {
  const { activePage, setActivePage, setMobileSidebarOpen } = useAppStore();
  const [time, setTime]         = useState(getCurrentTime());
  const [showAlerts, setAlerts] = useState(false);
  const [refreshing, setRefresh] = useState(false);

  const unread = MY_ALERTS.filter(a => !a.isRead).length;
  const meta   = PAGE_META[activePage] ?? { label: activePage, section: 'Surveyor' };

  useEffect(() => {
    const t = setInterval(() => setTime(getCurrentTime()), 30_000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="h-[60px] bg-white border-b border-slate-100 flex items-center px-4 gap-3 flex-shrink-0 shadow-sm relative z-20 min-w-0">
      {/* Hamburger — mobile only */}
      <button
        onClick={() => setMobileSidebarOpen(true)}
        className="md:hidden w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center hover:bg-slate-100 transition-colors flex-shrink-0"
      >
        <Menu size={16} className="text-slate-500" />
      </button>

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 min-w-0 flex-1">
        <span className="hidden sm:inline text-[11px] text-slate-400 flex-shrink-0">{SURVEYOR_PROFILE.company}</span>
        <ChevronRight size={11} className="hidden sm:inline text-slate-300 flex-shrink-0" />
        <span className="hidden sm:inline text-[11px] text-slate-400 flex-shrink-0">{meta.section}</span>
        <ChevronRight size={11} className="hidden sm:inline text-slate-300 flex-shrink-0" />
        <span className="text-[12px] font-semibold text-slate-700 truncate">{meta.label}</span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Quick input shortcut */}
        <button
          onClick={() => setActivePage('sv-input')}
          className="hidden md:flex items-center gap-1.5 text-[10px] font-mono text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <ClipboardEdit size={11} /> Input Data
        </button>

        {/* Refresh */}
        <button
          onClick={() => { setRefresh(true); setTimeout(() => setRefresh(false), 800); }}
          className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center hover:bg-slate-100 transition-colors"
        >
          <RefreshCw size={13} className={cn('text-slate-500', refreshing && 'animate-spin')} />
        </button>

        {/* Date + time */}
        <div className="hidden md:flex text-[10px] font-mono text-slate-400 bg-slate-50 border border-slate-100 px-2.5 py-1.5 rounded-lg whitespace-nowrap items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
          {getCurrentDate()} · {time}
        </div>

        {/* Alert bell */}
        <div className="relative">
          <button
            onClick={() => setAlerts(p => !p)}
            className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center hover:bg-slate-100 transition-colors relative"
          >
            <Bell size={14} className="text-slate-500" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                {unread}
              </span>
            )}
          </button>

          {showAlerts && (
            <div className="absolute right-0 top-10 w-72 max-w-[calc(100vw-1rem)] bg-white border border-slate-100 rounded-xl shadow-xl z-50 overflow-hidden animate-slide-up">
              <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                <span className="text-[12px] font-semibold text-slate-700">Notifikasi Sensor</span>
                <span className="text-[9px] font-mono text-red-500 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                  {unread} BARU
                </span>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-50">
                {MY_ALERTS.slice(0, 4).map(a => (
                  <div key={a.id} className={cn('px-4 py-3', !a.isRead && 'bg-slate-50/60')}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn('text-[9px] font-mono font-medium px-1.5 py-0.5 rounded border',
                        a.severity === 'critical' ? 'bg-red-50 text-red-700 border-red-200'
                        : a.severity === 'warning' ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-blue-50 text-blue-700 border-blue-200')}>
                        {a.severity === 'critical' ? 'KRITIS' : a.severity === 'warning' ? 'WASPADA' : 'INFO'}
                      </span>
                      {!a.isRead && <span className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                    </div>
                    <p className="text-[11px] font-medium text-slate-700 leading-snug">{a.title}</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{a.timestamp}</p>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50">
                <button onClick={() => setAlerts(false)} className="text-[11px] text-blue-600 hover:text-blue-700 font-medium w-full text-center">
                  Tutup ✕
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-700 cursor-pointer hover:ring-2 hover:ring-blue-200 transition-all flex-shrink-0 border border-blue-200">
          {SURVEYOR_PROFILE.initials}
        </div>
      </div>
    </header>
  );
}
