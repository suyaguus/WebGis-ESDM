import { useState, useMemo } from 'react';
import { Search, Layers, Radio, AlertTriangle, Filter } from 'lucide-react';
import SensorMap from '../../../components/map/SensorMap';
import { StatusPill, Badge } from '../../../components/ui';
import { MOCK_SENSORS, MOCK_COMPANIES } from '../../../constants/mockData';
import { cn, getSubsidenceColor } from '../../../lib/utils';
import type { Sensor, SensorStatus, SensorType } from '../../../types';

type FilterStatus = 'all' | SensorStatus;
type FilterType   = 'all' | SensorType;

const STATUS_OPTS: { key: FilterStatus; label: string }[] = [
  { key: 'all', label: 'Semua' },
  { key: 'online', label: 'Online' },
  { key: 'alert', label: 'Alert' },
  { key: 'maintenance', label: 'Maint' },
  { key: 'offline', label: 'Offline' },
];

const TYPE_OPTS: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'Semua Tipe' },
  { key: 'water', label: 'Air Tanah' },
  { key: 'gnss', label: 'GNSS' },
];

export default function PetaPage() {
  const [search, setSearch]       = useState('');
  const [statusF, setStatusF]     = useState<FilterStatus>('all');
  const [typeF, setTypeF]         = useState<FilterType>('all');
  const [selected, setSelected]   = useState<Sensor | null>(null);
  const [sidebarOpen, setSidebar] = useState(true);

  const filtered = useMemo(() => {
    return MOCK_SENSORS.filter(s => {
      if (statusF !== 'all' && s.status !== statusF) return false;
      if (typeF   !== 'all' && s.type   !== typeF)   return false;
      if (search && !s.code.toLowerCase().includes(search.toLowerCase()) &&
          !s.location.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [search, statusF, typeF]);

  const company = (id: string) => MOCK_COMPANIES.find(c => c.id === id);

  return (
    <div className="flex flex-col md:flex-row h-full min-w-0 overflow-hidden" style={{ minHeight: 0 }}>
      {/* ── Sidebar ── */}
      {sidebarOpen && (
        <div className="w-full md:w-72 max-h-[44vh] md:max-h-none flex-shrink-0 bg-white border-b md:border-b-0 md:border-r border-slate-100 flex flex-col overflow-hidden shadow-sm">
          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-100 flex-shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13px] font-semibold text-slate-800 flex items-center gap-1.5">
                <Layers size={13} className="text-cyan-600" /> Filter Sensor
              </span>
              <span className="text-[10px] font-mono text-slate-400">{filtered.length} sensor</span>
            </div>
            {/* Search */}
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari kode / lokasi..."
                className="w-full pl-8 pr-3 py-1.5 text-[11px] font-mono border border-slate-200 rounded-lg bg-slate-50 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>
          {/* Filters */}
          <div className="px-4 py-2 border-b border-slate-100 flex-shrink-0 space-y-2">
            <div className="flex flex-wrap gap-1">
              {STATUS_OPTS.map(o => (
                <button key={o.key} onClick={() => setStatusF(o.key)}
                  className={cn('text-[9px] font-mono px-2 py-0.5 rounded-full border transition-all',
                    statusF === o.key ? 'bg-cyan-50 text-cyan-700 border-cyan-200' : 'text-slate-400 border-transparent hover:bg-slate-50')}>
                  {o.label}
                </button>
              ))}
            </div>
            <div className="flex gap-1">
              {TYPE_OPTS.map(o => (
                <button key={o.key} onClick={() => setTypeF(o.key)}
                  className={cn('text-[9px] font-mono px-2 py-0.5 rounded-full border transition-all',
                    typeF === o.key ? 'bg-blue-50 text-blue-700 border-blue-200' : 'text-slate-400 border-transparent hover:bg-slate-50')}>
                  {o.label}
                </button>
              ))}
            </div>
          </div>
          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
            {filtered.length === 0 && (
              <div className="flex items-center justify-center py-10 text-[11px] text-slate-400 font-mono">
                Tidak ada sensor ditemukan
              </div>
            )}
            {filtered.map(s => {
              const co = company(s.companyId);
              const isSelected = selected?.id === s.id;
              return (
                <button key={s.id} onClick={() => setSelected(s)}
                  className={cn('w-full text-left px-4 py-3 transition-colors',
                    isSelected ? 'bg-cyan-50' : 'hover:bg-slate-50/60')}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] font-semibold font-mono text-slate-800">{s.code}</span>
                    <StatusPill status={s.status} />
                  </div>
                  <p className="text-[10px] text-slate-500 mb-1">{s.location}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-slate-400 font-mono">{co?.name ?? '-'}</span>
                    <span className={cn('text-[10px] font-mono font-semibold', getSubsidenceColor(s.subsidence))}>
                      {s.subsidence.toFixed(2)} cm/thn
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
          {/* Legend */}
          <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex-shrink-0 space-y-1">
            {[['#3B82F6','Air Tanah'],['#F59E0B','GNSS'],['#EF4444','Alert'],['#94A3B8','Offline']].map(([c,l]) => (
              <div key={l} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c }} />
                <span className="text-[9px] font-mono text-slate-500">{l}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Map ── */}
      <div className="flex-1 relative min-w-0 min-h-[240px] md:min-h-0 overflow-hidden">
        {/* Toggle sidebar button */}
        <button onClick={() => setSidebar(p => !p)}
          className="absolute top-2 left-2 sm:top-3 sm:left-3 z-[1000] max-w-[calc(100vw-1rem)] overflow-hidden text-ellipsis whitespace-nowrap bg-white border border-slate-200 rounded-lg px-2 py-1 sm:px-2.5 sm:py-1.5 text-[9px] sm:text-[10px] font-mono text-slate-600 hover:bg-slate-50 shadow-sm flex items-center gap-1 sm:gap-1.5">
          <Filter size={10} /> {sidebarOpen ? 'Sembunyikan' : 'Filter'}
        </button>

        {/* Stats overlay */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-[1000] flex flex-col sm:flex-row gap-1 sm:gap-2 max-w-[calc(100vw-1rem)] items-end sm:items-start">
          {[
            { label: 'Online', count: MOCK_SENSORS.filter(s=>s.status==='online').length, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
            { label: 'Alert',  count: MOCK_SENSORS.filter(s=>s.status==='alert').length,  color: 'text-red-600 bg-red-50 border-red-200' },
            { label: 'Maint',  count: MOCK_SENSORS.filter(s=>s.status==='maintenance').length, color: 'text-amber-600 bg-amber-50 border-amber-200' },
          ].map(({ label, count, color }) => (
            <div key={label} className={cn('flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[10px] font-mono font-medium shadow-sm', color)}>
              <Radio size={10} /> {count} {label}
            </div>
          ))}
        </div>

        {/* Selected sensor panel */}
        {selected && (
          <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-[1000] bg-white border border-cyan-200 rounded-xl shadow-lg px-3 py-3 sm:px-5 sm:py-4 w-auto sm:min-w-[320px] max-w-[calc(100vw-1rem)]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-bold font-mono text-cyan-700">{selected.code}</span>
                <StatusPill status={selected.status} />
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-1.5">
              {[
                ['Lokasi', selected.location],
                ['Tipe', selected.type === 'water' ? 'Air Tanah' : 'GNSS'],
                ['Subsidence', `${selected.subsidence.toFixed(2)} cm/thn`],
                ['Muka Air', selected.waterLevel ? `${selected.waterLevel} m` : '-'],
                ['Nilai Vertikal', selected.verticalValue ? `${selected.verticalValue} mm` : '-'],
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

        <SensorMap sensors={filtered} height="100%" onMarkerClick={setSelected} />
      </div>
    </div>
  );
}
