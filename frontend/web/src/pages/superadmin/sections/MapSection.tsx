import { useState } from 'react';
import { Map } from 'lucide-react';
import { SectionHeader } from '../../../components/ui';
import SensorMap from '../../../components/map/SensorMap';
import { MOCK_SENSORS } from '../../../constants/mockData';
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
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);

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
      <div className="relative flex-1 min-w-0 min-h-[250px] sm:min-h-[240px]" style={{ height: 'clamp(250px, 72vw, 380px)' }}>
        <SensorMap
          sensors={MOCK_SENSORS}
          height="100%"
          className="rounded-none sm:rounded-b-xl"
          onMarkerClick={setSelectedSensor}
        />

        {/* Legend overlay */}
        <div className="absolute bottom-3 left-3 bg-white/95 border border-slate-100 rounded-xl shadow-sm px-3 py-2.5 z-[1000] hidden sm:block">
          {LEGEND.map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2 mb-1.5 last:mb-0">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
              <span className="text-[9px] font-mono text-slate-500 whitespace-nowrap">{label}</span>
            </div>
          ))}
        </div>

        {/* Selected sensor popup */}
        {selectedSensor && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-white border border-cyan-200 rounded-xl shadow-lg px-4 py-3 z-[1000] min-w-[200px] max-w-[240px] hidden sm:block">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-semibold font-mono text-cyan-700">{selectedSensor.code}</span>
              <button
                onClick={() => setSelectedSensor(null)}
                className="text-slate-400 hover:text-slate-600 text-xs ml-4 flex-shrink-0"
              >
                ✕
              </button>
            </div>
            <p className="text-[10px] text-slate-500 mb-1">{selectedSensor.location}</p>
            <p className="text-[10px] font-mono">
              Subsidence:{' '}
              <span className={selectedSensor.subsidence <= -4 ? 'text-red-600' : 'text-slate-700'}>
                {selectedSensor.subsidence.toFixed(2)} cm/thn
              </span>
            </p>
          </div>
        )}
      </div>

      <div className="sm:hidden border-t border-slate-100 bg-slate-50/60 px-3 py-3 space-y-3">
        <div>
          <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wide mb-2">Legenda Sensor</p>
          <div className="grid grid-cols-1 gap-2">
            {LEGEND.map(({ color, label }) => (
              <div key={label} className="flex items-center gap-2 bg-white border border-slate-100 rounded-lg px-2.5 py-1.5">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
                <span className="text-[9px] font-mono text-slate-600">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {selectedSensor && (
          <div className="bg-white border border-cyan-200 rounded-xl shadow-sm px-3 py-3">
            <div className="flex items-center justify-between mb-1.5 gap-2">
              <span className="text-[12px] font-semibold font-mono text-cyan-700">{selectedSensor.code}</span>
              <button
                onClick={() => setSelectedSensor(null)}
                className="text-slate-400 hover:text-slate-600 text-[11px]"
              >
                Tutup
              </button>
            </div>
            <p className="text-[10px] text-slate-500 mb-1">{selectedSensor.location}</p>
            <p className="text-[10px] font-mono">
              Subsidence:{' '}
              <span className={selectedSensor.subsidence <= -4 ? 'text-red-600' : 'text-slate-700'}>
                {selectedSensor.subsidence.toFixed(2)} cm/thn
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
