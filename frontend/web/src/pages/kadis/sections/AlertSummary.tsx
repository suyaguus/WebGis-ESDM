import { AlertTriangle, Bell } from 'lucide-react';
import { SectionHeader } from '../../../components/ui';
import { MOCK_ALERTS } from '../../../constants/mockData';
import { cn, getSeverityColor } from '../../../lib/utils';

export default function KadisAlertSummary() {
  const criticalCount = MOCK_ALERTS.filter(a => a.severity === 'critical').length;
  const warningCount  = MOCK_ALERTS.filter(a => a.severity === 'warning').length;
  const unread        = MOCK_ALERTS.filter(a => !a.isRead).length;

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
      <SectionHeader
        title="Alert Provinsi"
        icon={<Bell size={13} />}
        accent="#059669"
        subtitle={unread > 0 ? `${unread} BARU` : 'SEMUA DIBACA'}
      />

      {/* Summary chips */}
      <div className="px-4 py-2.5 border-b border-slate-100 flex items-center gap-2 flex-shrink-0">
        <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-full px-2.5 py-1">
          <AlertTriangle size={10} className="text-red-600" />
          <span className="text-[10px] font-mono font-semibold text-red-700">{criticalCount} Kritis</span>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-1">
          <AlertTriangle size={10} className="text-amber-600" />
          <span className="text-[10px] font-mono font-semibold text-amber-700">{warningCount} Waspada</span>
        </div>
      </div>

      {/* Alert list */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
        {MOCK_ALERTS.map(a => (
          <div key={a.id}
            className={cn(
              'px-4 py-3 border-l-[3px] transition-colors hover:bg-slate-50/40',
              getSeverityColor(a.severity),
              !a.isRead ? 'bg-slate-50/60' : '',
            )}>
            <div className="flex items-center gap-2 mb-1">
              <span className={cn('text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded border',
                a.severity === 'critical' ? 'bg-red-50 text-red-700 border-red-200'
                : a.severity === 'warning' ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-blue-50 text-blue-700 border-blue-200')}>
                {a.severity === 'critical' ? 'KRITIS' : a.severity === 'warning' ? 'WASPADA' : 'INFO'}
              </span>
              {!a.isRead && <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />}
              <span className="ml-auto text-[9px] font-mono text-slate-400 flex-shrink-0">{a.timestamp}</span>
            </div>
            <p className="text-[11px] font-semibold text-slate-700 leading-snug">{a.title}</p>
            <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">{a.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
