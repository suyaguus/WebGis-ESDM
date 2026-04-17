import { Activity } from 'lucide-react';
import { SectionHeader } from '../../../components/ui';
import { COMPANY_ACTIVITY } from '../../../constants/mockData';
import { cn } from '../../../lib/utils';
import type { ActivityItem } from '../../../constants/mockData';

const TYPE_ICON: Record<ActivityItem['type'], string> = {
  measurement: '📊',
  alert:       '🚨',
  sensor:      '📡',
  report:      '📄',
  user:        '👤',
};

const TYPE_COLOR: Record<ActivityItem['type'], string> = {
  measurement: 'bg-blue-50 border-blue-100',
  alert:       'bg-red-50 border-red-100',
  sensor:      'bg-purple-50 border-purple-100',
  report:      'bg-amber-50 border-amber-100',
  user:        'bg-emerald-50 border-emerald-100',
};

export default function AdminActivityLog() {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col min-w-0">
      <SectionHeader title="Aktivitas Terkini" icon={<Activity size={13} />} accent="#F59E0B" subtitle="HARI INI" />
      <div className="overflow-y-auto divide-y divide-slate-50" style={{ maxHeight: '280px' }}>
        {COMPANY_ACTIVITY.map(item => (
          <div key={item.id} className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50/40 transition-colors">
            <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center text-[13px] flex-shrink-0 border', TYPE_COLOR[item.type])}>
              {TYPE_ICON[item.type]}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold text-slate-700 leading-snug">{item.title}</p>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">{item.desc}</p>
            </div>
            <span className="text-[9px] font-mono text-slate-400 flex-shrink-0 mt-0.5">{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
