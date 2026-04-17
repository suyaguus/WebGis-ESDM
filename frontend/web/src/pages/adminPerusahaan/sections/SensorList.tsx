import { useAppStore } from '../../../store';
import { Radio, ChevronRight } from 'lucide-react';
import { SectionHeader, StatusPill } from '../../../components/ui';
import { COMPANY_SENSORS } from '../../../constants/mockData';
import { cn, getSubsidenceColor } from '../../../lib/utils';

export default function AdminSensorList() {
  const { setActivePage } = useAppStore();

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col min-w-0">
      <SectionHeader
        title="Status Sensor"
        icon={<Radio size={13} />}
        accent="#F59E0B"
        action={
          <button onClick={() => setActivePage('ap-sumur')}
            className="text-[10px] text-amber-600 hover:text-amber-700 font-mono font-medium whitespace-nowrap">
            Lihat Semua →
          </button>
        }
      />
      <div className="overflow-y-auto divide-y divide-slate-50" style={{ maxHeight: '340px' }}>
        {COMPANY_SENSORS.map(s => (
          <div key={s.id}
            className={cn('flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50/60 transition-colors cursor-pointer',
              s.status === 'alert' && 'bg-red-50/30')}
            onClick={() => setActivePage('ap-sumur')}>
            {/* Type indicator */}
            <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-[9px] font-bold font-mono',
              s.type === 'water' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-amber-50 text-amber-700 border border-amber-100')}>
              {s.type === 'water' ? 'SW' : 'GN'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-bold font-mono text-slate-800">{s.code}</span>
                <span className="text-[10px] text-slate-400 truncate">{s.location}</span>
              </div>
              <span className={cn('text-[10px] font-mono font-semibold', getSubsidenceColor(s.subsidence))}>
                {s.subsidence.toFixed(2)} cm/thn
              </span>
            </div>
            <StatusPill status={s.status} />
            <ChevronRight size={12} className="text-slate-300 flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
