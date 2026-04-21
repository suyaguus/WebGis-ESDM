import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Card, SectionHeader, SeverityBadge } from '../../../components/ui';
import { MOCK_ALERTS } from '../../../constants/mockData';
import { cn, getSeverityColor } from '../../../lib/utils';
import type { Alert } from '../../../types';

function AlertItem({ alert }: { alert: Alert }) {
  const borderColor =
    alert.severity === 'critical' ? 'border-l-red-400'
    : alert.severity === 'warning' ? 'border-l-amber-400'
    : 'border-l-blue-300';

  return (
    <div className={cn(
      'px-3 py-2.5 border-l-[3px] hover:bg-slate-50/60 transition-colors cursor-pointer',
      borderColor,
      !alert.isRead && 'bg-slate-50/40',
    )}>
      <div className="flex items-center gap-2 mb-1">
        <SeverityBadge severity={alert.severity} />
        {!alert.isRead && (
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
        )}
      </div>
      <p className="text-[11px] font-medium text-slate-700 leading-snug">
        {alert.title}
      </p>
      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{alert.timestamp}</p>
      {(alert.companyName || alert.sensorCode) && (
        <p className="text-[10px] text-slate-400 mt-0.5 truncate">
          {alert.sensorCode ? `${alert.sensorCode} · ` : ''}{alert.companyName ?? ''}
        </p>
      )}
    </div>
  );
}

const FILTERS = ['Semua', 'Kritis', 'Waspada', 'Info'] as const;
type Filter = (typeof FILTERS)[number];

export default function AlertPanel() {
  const [filter, setFilter] = useState<Filter>('Semua');
  const unread = MOCK_ALERTS.filter((a) => !a.isRead).length;

  const filtered = MOCK_ALERTS.filter((a) => {
    if (filter === 'Semua')   return true;
    if (filter === 'Kritis')  return a.severity === 'critical';
    if (filter === 'Waspada') return a.severity === 'warning';
    if (filter === 'Info')    return a.severity === 'info';
    return true;
  });

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col overflow-hidden">
      <SectionHeader
        title="Alert & Notifikasi"
        icon={<AlertTriangle size={13} />}
        accent="#EF4444"
        subtitle={`${unread} BARU`}
      />

      {/* Filter chips */}
      <div className="flex items-center gap-1 px-3 py-2 border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'text-[9px] font-mono px-2 py-0.5 rounded-full transition-all',
              filter === f
                ? 'bg-red-50 text-red-600 border border-red-200'
                : 'text-slate-400 hover:text-slate-600',
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Alert list — scrollable */}
      <div className="overflow-y-auto divide-y divide-slate-50 max-h-[240px] md:max-h-[360px]">
        {filtered.map((alert) => (
          <AlertItem key={alert.id} alert={alert} />
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50 flex-shrink-0">
        <button className="text-[10px] text-cyan-600 hover:text-cyan-700 font-medium w-full text-center">
          Lihat semua notifikasi →
        </button>
      </div>
    </div>
  );
}
