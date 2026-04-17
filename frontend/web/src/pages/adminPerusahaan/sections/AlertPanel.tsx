import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { SectionHeader, SeverityBadge } from '../../../components/ui';
import { MOCK_ALERTS } from '../../../constants/mockData';
import { cn } from '../../../lib/utils';
import type { Alert } from '../../../types';

// Alerts scoped to PT Maju Jaya
const COMPANY_ALERTS = MOCK_ALERTS.filter(a =>
  !a.companyName || a.companyName === 'PT Maju Jaya',
);

export default function AdminAlertPanel() {
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const unread = COMPANY_ALERTS.filter(a => !a.isRead).length;

  const filtered = COMPANY_ALERTS.filter(a => filter === 'all' || a.severity === filter);

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col overflow-hidden">
      <SectionHeader title="Alert Perusahaan" icon={<AlertTriangle size={13} />} accent="#EF4444" subtitle={`${unread} BARU`} />

      {/* Filter chips */}
      <div className="flex gap-1 px-3 py-2 border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
        {(['all','critical','warning','info'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={cn('text-[9px] font-mono px-2 py-0.5 rounded-full transition-all',
              filter === f ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'text-slate-400 hover:text-slate-600')}>
            {f === 'all' ? 'Semua' : f === 'critical' ? 'Kritis' : f === 'warning' ? 'Waspada' : 'Info'}
          </button>
        ))}
      </div>

      {/* Alert list */}
      <div className="overflow-y-auto divide-y divide-slate-50" style={{ maxHeight: '320px' }}>
        {filtered.map(a => (
          <div key={a.id} className={cn('px-3 py-3 hover:bg-slate-50/60 transition-colors',
            a.severity === 'critical' ? 'border-l-[3px] border-l-red-400'
            : a.severity === 'warning' ? 'border-l-[3px] border-l-amber-400'
            : 'border-l-[3px] border-l-blue-300',
            !a.isRead && 'bg-slate-50/40')}>
            <div className="flex items-center gap-2 mb-1">
              <SeverityBadge severity={a.severity} />
              {!a.isRead && <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />}
            </div>
            <p className="text-[11px] font-medium text-slate-700 leading-snug">{a.title}</p>
            {a.sensorCode && <p className="text-[10px] font-mono text-amber-600 mt-0.5">{a.sensorCode}</p>}
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">{a.timestamp}</p>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="py-8 text-center text-[11px] text-slate-400 font-mono">Tidak ada alert</div>
        )}
      </div>

      <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50 flex-shrink-0">
        <button className="text-[10px] text-amber-600 hover:text-amber-700 font-medium w-full text-center">
          Lihat semua alert →
        </button>
      </div>
    </div>
  );
}
