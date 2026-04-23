import { useState } from 'react';
import { Filter, ChevronDown, ChevronUp, X } from 'lucide-react';
import SensorMap from '../../../components/map/SensorMap';
import { StatusPill } from '../../../components/ui';
import { SURVEYOR_SENSORS } from '../../../constants/surveyorData';
import { cn, getSubsidenceColor } from '../../../lib/utils';
import type { Sensor } from '../../../types';

export default function SurveyorPetaPage() {
  const [selected,    setSelected]    = useState<Sensor | null>(null);
  const [filterOpen,  setFilterOpen]  = useState(false);
  const [sidebar,     setSidebar]     = useState(true);

  return (
    <div className="flex flex-col h-full min-w-0 overflow-hidden" style={{ minHeight: 0 }}>

      {/* ── MOBILE: collapsible sensor list ── */}
      <div className="md:hidden flex-shrink-0 bg-white border-b border-slate-100">
        <button
          onClick={() => setFilterOpen(o => !o)}
          className="w-full flex items-center justify-between px-4 py-2.5 text-[12px] font-semibold text-slate-700"
        >
          <span className="flex items-center gap-2">
            <Filter size={13} className="text-blue-500" />
            Sensor Saya
            <span className="text-[9px] font-mono text-slate-400">{SURVEYOR_SENSORS.length} sensor</span>
          </span>
          {filterOpen ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
        </button>
        {filterOpen && (
          <div className="px-4 pb-3 border-t border-slate-50 divide-y divide-slate-50">
            {SURVEYOR_SENSORS.map(s => (
              <button
                key={s.id}
                onClick={() => { setSelected(s); setFilterOpen(false); }}
                className={cn(
                  'w-full text-left py-2.5 flex items-center gap-3 transition-colors',
                  selected?.id === s.id && 'text-blue-600',
                )}
              >
                <span className="text-[12px] font-bold font-mono text-slate-800 w-16 flex-shrink-0">{s.code}</span>
                <span className="text-[10px] text-slate-500 flex-1 truncate">{s.location}</span>
                <span className={cn('text-[10px] font-mono font-semibold flex-shrink-0', getSubsidenceColor(s.subsidence))}>
                  {s.subsidence.toFixed(2)}
                </span>
                <StatusPill status={s.status} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── DESKTOP layout ── */}
      <div className="hidden md:flex flex-1 min-w-0 overflow-hidden" style={{ minHeight: 0 }}>
        {/* Sidebar */}
        {sidebar && (
          <div className="w-64 xl:w-[272px] flex-shrink-0 bg-white border-r border-slate-100 flex flex-col overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-slate-100 flex-shrink-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] font-semibold text-slate-800">Sensor Ditugaskan</span>
                <span className="text-[10px] font-mono text-slate-400">{SURVEYOR_SENSORS.length} sensor</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'Online', count: SURVEYOR_SENSORS.filter(s => s.status === 'online').length, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
                  { label: 'Alert',  count: SURVEYOR_SENSORS.filter(s => s.status === 'alert').length,  color: 'text-red-600 bg-red-50 border-red-200' },
                  { label: 'AT',     count: SURVEYOR_SENSORS.filter(s => s.type === 'water').length,    color: 'text-blue-600 bg-blue-50 border-blue-200' },
                  { label: 'GNSS',   count: SURVEYOR_SENSORS.filter(s => s.type === 'gnss').length,     color: 'text-amber-600 bg-amber-50 border-amber-200' },
                ].map(({ label, count, color }) => (
                  <span key={label} className={cn('text-[9px] font-mono font-medium px-2 py-0.5 rounded-full border', color)}>
                    {count} {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
              {SURVEYOR_SENSORS.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelected(s)}
                  className={cn(
                    'w-full text-left px-4 py-3 transition-colors',
                    selected?.id === s.id ? 'bg-blue-50 border-r-2 border-blue-500' : 'hover:bg-slate-50/60',
                    s.status === 'alert' && selected?.id !== s.id && 'border-l-2 border-l-red-400',
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] font-bold font-mono text-slate-800">{s.code}</span>
                    <StatusPill status={s.status} />
                  </div>
                  <p className="text-[10px] text-slate-500 mb-1 truncate">{s.location}</p>
                  <div className="flex items-center justify-between">
                    <span className={cn('text-[10px] font-mono font-semibold', getSubsidenceColor(s.subsidence))}>
                      {s.subsidence.toFixed(2)} cm/thn
                    </span>
                    <span className={cn(
                      'text-[9px] font-mono px-1.5 py-0.5 rounded',
                      s.type === 'gnss' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600',
                    )}>
                      {s.type === 'gnss' ? 'GNSS' : 'AT'}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/60 flex-shrink-0">
              <p className="text-[9px] font-mono text-slate-400 leading-relaxed">
                Hanya menampilkan sensor yang ditugaskan kepada Anda.
              </p>
            </div>
          </div>
        )}

        {/* Map */}
        <div className="flex-1 relative min-w-0 overflow-hidden">
          <button
            onClick={() => setSidebar(p => !p)}
            className="absolute top-3 left-3 z-[1000] bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-[10px] font-mono text-slate-600 hover:bg-slate-50 shadow-sm flex items-center gap-1.5"
          >
            <Filter size={10} /> {sidebar ? 'Sembunyikan' : 'Sensor'}
          </button>

          <div className="absolute bottom-3 left-3 bg-white/95 border border-slate-100 rounded-xl shadow-sm px-3 py-2.5 z-[1000]">
            {[['#3B82F6','Air Tanah'],['#F59E0B','GNSS'],['#EF4444','Alert']].map(([c,l]) => (
              <div key={l} className="flex items-center gap-2 mb-1.5 last:mb-0">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c }} />
                <span className="text-[9px] font-mono text-slate-500">{l}</span>
              </div>
            ))}
          </div>

          <div className="absolute top-3 right-3 z-[1000] flex gap-2">
            {[
              { label: 'Online', count: SURVEYOR_SENSORS.filter(s=>s.status==='online').length, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
              { label: 'Alert',  count: SURVEYOR_SENSORS.filter(s=>s.status==='alert').length,  color: 'text-red-600 bg-red-50 border-red-200' },
            ].map(({ label, count, color }) => (
              <div key={label} className={cn('flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[10px] font-mono font-medium shadow-sm', color)}>
                {count} {label}
              </div>
            ))}
          </div>

          {selected && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] bg-white border border-blue-200 rounded-xl shadow-lg px-5 py-4 w-[300px] max-w-[calc(100vw-2rem)]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-bold font-mono text-blue-700">{selected.code}</span>
                  <StatusPill status={selected.status} />
                </div>
                <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600">
                  <X size={14} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                {[
                  ['Lokasi', selected.location],
                  ['Tipe', selected.type === 'water' ? 'Air Tanah' : 'GNSS'],
                  ['Subsidence', `${selected.subsidence.toFixed(2)} cm/thn`],
                  ['Muka Air', selected.waterLevel ? `${selected.waterLevel} m` : '—'],
                  ['Update', selected.lastUpdate],
                ].map(([k, v]) => (
                  <div key={k}>
                    <p className="text-[9px] text-slate-400 font-mono">{k}</p>
                    <p className="text-[11px] font-medium text-slate-700">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <SensorMap sensors={SURVEYOR_SENSORS} height="100%" onMarkerClick={setSelected} />
        </div>
      </div>

      {/* ── MOBILE: Map ── */}
      <div className="md:hidden flex-1 overflow-hidden flex flex-col" style={{ minHeight: '200px' }}>
        <div className="relative min-h-[250px] flex-1 overflow-hidden">
          <div className="absolute bottom-3 left-3 bg-white/95 border border-slate-100 rounded-xl shadow-sm px-3 py-2.5 z-[1000]">
            {[['#3B82F6','Air Tanah'],['#F59E0B','GNSS'],['#EF4444','Alert']].map(([c,l]) => (
              <div key={l} className="flex items-center gap-2 mb-1.5 last:mb-0">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c }} />
                <span className="text-[9px] font-mono text-slate-500">{l}</span>
              </div>
            ))}
          </div>

          {selected && (
            <div className="absolute bottom-2 left-2 right-2 z-[1000] bg-white border border-blue-200 rounded-xl shadow-lg px-3 py-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-bold font-mono text-blue-700">{selected.code}</span>
                  <StatusPill status={selected.status} />
                </div>
                <button onClick={() => setSelected(null)} className="text-slate-400 w-6 h-6 flex items-center justify-center">
                  <X size={14} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                {[
                  ['Lokasi', selected.location],
                  ['Tipe', selected.type === 'water' ? 'Air Tanah' : 'GNSS'],
                  ['Subsidence', `${selected.subsidence.toFixed(2)} cm/thn`],
                  ['Muka Air', selected.waterLevel ? `${selected.waterLevel} m` : '—'],
                ].map(([k, v]) => (
                  <div key={k}>
                    <p className="text-[8px] text-slate-400 font-mono uppercase">{k}</p>
                    <p className="text-[10px] font-medium text-slate-700">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <SensorMap sensors={SURVEYOR_SENSORS} height="100%" onMarkerClick={setSelected} />
        </div>
      </div>
    </div>
  );
}
