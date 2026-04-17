import { useState } from 'react';
import { Map } from 'lucide-react';
import { SectionHeader, StatusPill } from '../../../components/ui';
import SensorMap from '../../../components/map/SensorMap';
import { COMPANY_SENSORS } from '../../../constants/mockData';
import { cn, getSubsidenceColor } from '../../../lib/utils';
import type { Sensor } from '../../../types';

export default function AdminMapSection() {
  const [selected, setSelected] = useState<Sensor | null>(null);

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col min-w-0">
      <SectionHeader
        title="Peta Sensor PT Maju Jaya"
        subtitle={`${COMPANY_SENSORS.length} SENSOR`}
        icon={<Map size={13} />}
        accent="#F59E0B"
      />

      {/* Summary chips */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
        {[
          { label: 'Online',      count: COMPANY_SENSORS.filter(s => s.status === 'online').length,      color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
          { label: 'Alert',       count: COMPANY_SENSORS.filter(s => s.status === 'alert').length,       color: 'bg-red-50 text-red-700 border-red-200' },
          { label: 'Maintenance', count: COMPANY_SENSORS.filter(s => s.status === 'maintenance').length, color: 'bg-amber-50 text-amber-700 border-amber-200' },
        ].map(({ label, count, color }) => (
          <span key={label} className={cn('text-[9px] font-mono font-medium px-2.5 py-1 rounded-full border', color)}>
            {count} {label}
          </span>
        ))}
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
          <span className="text-[9px] font-mono text-slate-400">LIVE · 30s</span>
        </div>
      </div>

      {/* Map */}
      <div className="relative" style={{ minHeight: '280px' }}>
        <SensorMap sensors={COMPANY_SENSORS} height={280} onMarkerClick={setSelected} />

        {/* Legend */}
        <div className="absolute bottom-3 left-3 bg-white/95 border border-slate-100 rounded-xl shadow-sm px-3 py-2.5 z-[1000]">
          {[['#3B82F6','Air Tanah'],['#F59E0B','GNSS'],['#EF4444','Alert'],['#94A3B8','Maint']].map(([c, l]) => (
            <div key={l} className="flex items-center gap-2 mb-1.5 last:mb-0">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c }} />
              <span className="text-[9px] font-mono text-slate-500">{l}</span>
            </div>
          ))}
        </div>

        {/* Selected sensor card */}
        {selected && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-white border border-amber-200 rounded-xl shadow-lg px-4 py-3 z-[1000] min-w-[200px]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13px] font-bold font-mono text-amber-700">{selected.code}</span>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600 ml-3">✕</button>
            </div>
            <p className="text-[10px] text-slate-500 mb-2">{selected.location}</p>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-[9px] text-slate-400 font-mono">Subsidence</span>
                <span className={cn('text-[10px] font-mono font-semibold', getSubsidenceColor(selected.subsidence))}>{selected.subsidence.toFixed(2)} cm/thn</span>
              </div>
              {selected.waterLevel && (
                <div className="flex justify-between">
                  <span className="text-[9px] text-slate-400 font-mono">Muka Air</span>
                  <span className="text-[10px] font-mono text-slate-700">{selected.waterLevel} m</span>
                </div>
              )}
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100">
              <StatusPill status={selected.status} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
