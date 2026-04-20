import { useState } from 'react';
import { Map, Layers } from 'lucide-react';
import SensorMap from '../../../components/map/SensorMap';
import { SectionHeader } from '../../../components/ui';
import { MOCK_SENSORS } from '../../../constants/mockData';
import { cn } from '../../../lib/utils';

const LAYER_OPTS = ['Peta Jalan', 'Satelit', 'Terrain'] as const;
const LAYER_LABELS: Record<typeof LAYER_OPTS[number], string> = {
  'Peta Jalan': 'Jalan',
  Satelit: 'Satelit',
  Terrain: 'Terrain',
};

export default function KadisMapSection() {
  const [layer, setLayer] = useState<typeof LAYER_OPTS[number]>('Peta Jalan');

  const alertCount  = MOCK_SENSORS.filter(s => s.status === 'alert').length;
  const onlineCount = MOCK_SENSORS.filter(s => s.status === 'online').length;

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
      <SectionHeader
        title="Peta Sebaran Sensor Provinsi"
        icon={<Map size={13} />}
        accent="#059669"
        subtitle={`${MOCK_SENSORS.length} SENSOR`}
        action={
          <div className="hidden sm:flex gap-1 bg-slate-100 rounded-lg p-0.5">
            {LAYER_OPTS.map(l => (
              <button key={l} onClick={() => setLayer(l)}
                className={cn('text-[9px] font-mono px-2 py-0.5 rounded-md transition-all',
                  layer === l ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-400 hover:text-slate-600')}>
                {l}
              </button>
            ))}
          </div>
        }
      />

      {/* Mini stats bar */}
      <div className="px-4 py-2 border-b border-slate-100 flex items-center gap-3 sm:gap-4 bg-slate-50/40 flex-shrink-0 overflow-x-auto">
        {[
          { label: 'Online', count: onlineCount, color: 'text-emerald-600' },
          { label: 'Alert',  count: alertCount,  color: 'text-red-600'     },
          { label: 'Maint',  count: MOCK_SENSORS.filter(s => s.status === 'maintenance').length, color: 'text-amber-600' },
          { label: 'Offline',count: MOCK_SENSORS.filter(s => s.status === 'offline').length, color: 'text-slate-400' },
        ].map(({ label, count, color }) => (
          <div key={label} className="flex items-center gap-1.5 flex-shrink-0">
            <Layers size={10} className={color} />
            <span className={cn('text-[10px] font-mono font-semibold', color)}>{count}</span>
            <span className="text-[9px] font-mono text-slate-400">{label}</span>
          </div>
        ))}
      </div>

      <div className="sm:hidden px-3 py-2 border-b border-slate-100 bg-white">
        <div className="flex gap-1 bg-slate-100 rounded-lg p-0.5 w-full">
          {LAYER_OPTS.map(l => (
            <button
              key={l}
              onClick={() => setLayer(l)}
              className={cn(
                'text-[10px] font-mono px-2 py-1 rounded-md transition-all flex-1',
                layer === l ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-400 hover:text-slate-600',
              )}
            >
              {LAYER_LABELS[l]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-[250px] sm:min-h-[220px]" style={{ height: 'clamp(250px, 72vw, 360px)' }}>
        <SensorMap sensors={MOCK_SENSORS} height="100%" className="rounded-none sm:rounded-b-xl" />
      </div>
    </div>
  );
}
