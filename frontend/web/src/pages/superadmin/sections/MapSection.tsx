import { useState } from 'react';
import * as React from 'react';
import { Map } from 'lucide-react';
import { SectionHeader } from '../../../components/ui';
import SensorMap from '../../../components/map/SensorMap';
import { MOCK_SENSORS } from '../../../constants/mockData';
import { useAppStore } from '../../../store';
import { cn } from '../../../lib/utils';
import type { Sensor } from '../../../types';

const LAYERS = ['Street', 'Satellite', 'Terrain', 'Heatmap'];

const LEGEND = [
  { color: '#3B82F6', label: 'Sensor Air Tanah' },
  { color: '#F59E0B', label: 'Sensor GNSS' },
  { color: '#EF4444', label: 'Alert / Kritis' },
  { color: '#94A3B8', label: 'Offline / Maint' },
];

export default function MapSection() {
  const [activeLayer, setActiveLayer] = useState('Street');
  const globalSelectedSensor = useAppStore((s) => s.selectedSensor);
  const setGlobalSelectedSensor = useAppStore((s) => s.setSelectedSensor);
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);

  // Sync global selected sensor to local state
  React.useEffect(() => {
    if (globalSelectedSensor) setSelectedSensor(globalSelectedSensor);
  }, [globalSelectedSensor]);

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col min-w-0">
      <SectionHeader
        title="Peta Pemantauan — Semua Wilayah"
        subtitle={`REALTIME · ${MOCK_SENSORS.length} SENSOR`}
        icon={<Map size={13} />}
      />

      {/* Layer tabs */}
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-slate-100 bg-slate-50/50 flex-shrink-0 overflow-x-auto">
        {LAYERS.map((layer) => (
          <button
            key={layer}
            onClick={() => setActiveLayer(layer)}
            className={`text-[10px] font-mono px-2.5 py-1 rounded whitespace-nowrap transition-all flex-shrink-0 ${
              activeLayer === layer
                ? 'bg-cyan-50 text-cyan-700 border border-cyan-200 font-medium'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
          >
            {layer}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-1.5 flex-shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
          <span className="text-[9px] font-mono text-slate-400 whitespace-nowrap">UPDATE 30s</span>
        </div>
      </div>

      {/* Map container — relative for legend overlay */}
      <div className="relative flex-1" style={{ minHeight: '300px' }}>
        <SensorMap
          sensors={MOCK_SENSORS}
          height={300}
          onMarkerClick={setSelectedSensor}
        />

        {/* Legend overlay */}
        <div className="absolute bottom-3 left-3 bg-white/95 border border-slate-100 rounded-xl shadow-sm px-3 py-2.5 z-[1000]">
          {LEGEND.map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2 mb-1.5 last:mb-0">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
              <span className="text-[9px] font-mono text-slate-500 whitespace-nowrap">{label}</span>
            </div>
          ))}
        </div>

        {/* Selected sensor popup */}
        {selectedSensor && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] bg-white border border-cyan-200 rounded-xl shadow-lg px-5 py-4 min-w-[320px]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-bold font-mono text-cyan-700">{selectedSensor.code}</span>
                <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border font-mono',
                  selectedSensor.status === 'alert' ? 'text-red-600 bg-red-50 border-red-200' : 'text-amber-600 bg-amber-50 border-amber-200'
                )}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0"></span>
                  {selectedSensor.status.charAt(0).toUpperCase() + selectedSensor.status.slice(1)}
                </span>
              </div>
              <button
                onClick={() => { setSelectedSensor(null); setGlobalSelectedSensor(null); }}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
              <div>
                <p className="text-[9px] text-slate-400 font-mono">Lokasi</p>
                <p className="text-[11px] font-medium text-slate-700">{selectedSensor.location}</p>
              </div>
              <div>
                <p className="text-[9px] text-slate-400 font-mono">Tipe</p>
                <p className="text-[11px] font-medium text-slate-700">{selectedSensor.type === 'water' ? 'Air Tanah' : 'GNSS'}</p>
              </div>
              <div>
                <p className="text-[9px] text-slate-400 font-mono">Subsidence</p>
                <p className="text-[11px] font-medium text-slate-700">{selectedSensor.subsidence.toFixed(2)} cm/thn</p>
              </div>
              {selectedSensor.waterLevel !== undefined && (
                <div>
                  <p className="text-[9px] text-slate-400 font-mono">Muka Air</p>
                  <p className="text-[11px] font-medium text-slate-700">{selectedSensor.waterLevel.toFixed(2)} m</p>
                </div>
              )}
              {selectedSensor.verticalValue !== undefined && (
                <div>
                  <p className="text-[9px] text-slate-400 font-mono">Nilai Vertikal</p>
                  <p className="text-[11px] font-medium text-slate-700">{selectedSensor.verticalValue.toFixed(3)} mm</p>
                </div>
              )}
              <div>
                <p className="text-[9px] text-slate-400 font-mono">Update</p>
                <p className="text-[11px] font-medium text-slate-700">{selectedSensor.lastUpdate}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
