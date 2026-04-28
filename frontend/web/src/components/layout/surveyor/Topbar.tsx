import { useState, useEffect } from 'react';
import { Bell, ChevronRight, RefreshCw, Menu } from 'lucide-react';
import { useAppStore } from '../../../store';
import { getCurrentDate, getCurrentTime, cn } from '../../../lib/utils';
import { useAlerts, useUnreadAlertCount, useMarkAllAlertsRead, useSensors } from '../../../hooks';

const PAGE_META: Record<string, { label: string; section: string }> = {
  'sv-dashboard': { label: 'Dashboard',          section: 'Overview'  },
  'sv-sensor':    { label: 'Sensor Ditugaskan',   section: 'Lapangan'  },
  'sv-input':     { label: 'Input Pengukuran',    section: 'Lapangan'  },
  'sv-peta':      { label: 'Peta Sensor',         section: 'Lapangan'  },
  'sv-laporan':   { label: 'Riwayat Laporan',     section: 'Laporan'   },
};

export default function SurveyorTopbar() {
  const { activePage, setMobileSidebarOpen } = useAppStore();
  const [time, setTime]         = useState(getCurrentTime());
  // const [showAlerts, setAlerts] = useState(false);
  const [refreshing, setRefresh] = useState(false);

  const { data: sensorsPage } = useSensors(undefined, { limit: 1 });
  const companyName = sensorsPage?.data?.[0]?.companyName ?? '—';

  // const { data: alerts = [] } = useAlerts(undefined);
  // const { data: unread = 0 } = useUnreadAlertCount();
  // const markAll = useMarkAllAlertsRead();

  const meta = PAGE_META[activePage] ?? { label: activePage, section: 'Surveyor' };

  useEffect(() => {
    const t = setInterval(() => setTime(getCurrentTime()), 30_000);
    return () => clearInterval(t);
  }, []);

  // const handleOpenAlerts = () => {
  //   setAlerts((p) => !p);
  // };

  // const handleMarkAll = () => {
  //   markAll.mutate();
  //   setAlerts(false);
  // };

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
        <span className="hidden sm:inline text-[11px] text-slate-400 flex-shrink-0">{companyName}</span>
        <ChevronRight size={11} className="hidden sm:inline text-slate-300 flex-shrink-0" />
        <span className="hidden sm:inline text-[11px] text-slate-400 flex-shrink-0">{meta.section}</span>
        <ChevronRight size={11} className="hidden sm:inline text-slate-300 flex-shrink-0" />
        <span className="text-[12px] font-semibold text-slate-700 truncate">{meta.label}</span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 flex-shrink-0">
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
        {/* <div className="relative">
          <button
            onClick={handleOpenAlerts}
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
                <span className="text-[12px] font-semibold text-slate-700">Notifikasi</span>
                {unread > 0 && (
                  <span className="text-[9px] font-mono text-red-500 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                    {unread} BARU
                  </span>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-50">
                {alerts.length === 0 ? (
                  <div className="px-4 py-6 text-center text-[11px] text-slate-400 font-mono">
                    Tidak ada notifikasi
                  </div>
                ) : (
                  alerts.slice(0, 6).map((a) => (
                    <div key={a.id} className={cn('px-4 py-3', !a.isRead && 'bg-slate-50/60')}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn(
                          'text-[9px] font-mono font-medium px-1.5 py-0.5 rounded border',
                          a.severity === 'critical'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : a.severity === 'warning'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-blue-50 text-blue-700 border-blue-200',
                        )}>
                          {a.severity === 'critical' ? 'KRITIS' : a.severity === 'warning' ? 'WASPADA' : 'INFO'}
                        </span>
                        {!a.isRead && <span className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                      </div>
                      <p className="text-[11px] font-medium text-slate-700 leading-snug">{a.title}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{a.timestamp}</p>
                    </div>
                  ))
                )}
              </div>
              <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50 flex gap-2">
                {unread > 0 && (
                  <button
                    onClick={handleMarkAll}
                    className="text-[11px] text-blue-600 hover:text-blue-700 font-medium flex-1 text-center"
                  >
                    Tandai semua dibaca
                  </button>
                )}
                <button
                  onClick={() => setAlerts(false)}
                  className="text-[11px] text-slate-500 hover:text-slate-700 font-medium flex-1 text-center"
                >
                  Tutup
                </button>
              </div>
            </div>
          )}
        </div> */}
      </div>
    </header>
  );
}
