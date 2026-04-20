import { useState, useMemo } from 'react';
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import SensorMap from '../../../components/map/SensorMap';
import { StatusPill } from '../../../components/ui';
import { COMPANY_SENSORS } from '../../../constants/mockData';
import { cn, getSubsidenceColor } from '../../../lib/utils';
import type { Sensor, SensorStatus, SensorType } from '../../../types';

export default function AdminPetaPage() {
  const [search, setSearch]         = useState('');
  const [statusF, setStatusF]       = useState<SensorStatus | 'all'>('all');
  const [typeF, setTypeF]           = useState<SensorType | 'all'>('all');
  const [selected, setSelected]     = useState<Sensor | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);  // mobile: filter panel toggle
  const [sidebar, setSidebar]       = useState(true);   // desktop: sidebar toggle

  const filtered = useMemo(() =>
    COMPANY_SENSORS.filter(s => {
      if (statusF !== 'all' && s.status !== statusF) return false;
      if (typeF   !== 'all' && s.type   !== typeF)   return false;
      if (search && !s.code.toLowerCase().includes(search.toLowerCase()) &&
          !s.location.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    }), [search, statusF, typeF]);

  const FilterControls = () => (
    <>
      {/* Search */}
      <div className="relative mb-2">
        <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari kode / lokasi..."
          className="w-full pl-8 pr-3 py-1.5 text-[11px] font-mono border border-slate-200 rounded-lg bg-slate-50 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-amber-400" />
      </div>
      {/* Status filter */}
      <div className="flex flex-wrap gap-1 mb-1.5">
        {(['all','online','alert','maintenance','offline'] as const).map(s => (
          <button key={s} onClick={() => setStatusF(s)}
            className={cn('text-[9px] font-mono px-2 py-0.5 rounded-full border transition-all',
              statusF === s ? 'bg-amber-50 text-amber-700 border-amber-200' : 'text-slate-400 border-transparent hover:bg-slate-50')}>
            {s === 'all' ? 'Semua' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>
      {/* Type filter */}
      <div className="flex gap-1">
        {(['all','water','gnss'] as const).map(t => (
          <button key={t} onClick={() => setTypeF(t)}
            className={cn('text-[9px] font-mono px-2 py-0.5 rounded-full border transition-all',
              typeF === t ? 'bg-blue-50 text-blue-700 border-blue-200' : 'text-slate-400 border-transparent hover:bg-slate-50')}>
            {t === 'all' ? 'Semua Tipe' : t === 'water' ? 'Air Tanah' : 'GNSS'}
          </button>
        ))}
      </div>
    </>
  );

  return (
    <div className="flex flex-col h-full min-w-0 overflow-hidden" style={{ minHeight: 0 }}>

      {/* ── MOBILE: Filter panel (collapsible top bar) ── */}
      <div className="md:hidden flex-shrink-0 bg-white border-b border-slate-100">
        <button
          onClick={() => setFilterOpen(o => !o)}
          className="w-full flex items-center justify-between px-4 py-2.5 text-[12px] font-semibold text-slate-700"
        >
          <span className="flex items-center gap-2">
            <Filter size={13} className="text-amber-500" />
            Filter Sensor
            <span className="text-[9px] font-mono text-slate-400">{filtered.length} sensor</span>
          </span>
          {filterOpen ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
        </button>
        {filterOpen && (
          <div className="px-4 pb-3 border-t border-slate-50">
            <div className="mt-2">
              <FilterControls />
            </div>
          </div>
        )}
      </div>

      {/* ── DESKTOP: Side-by-side layout ── */}
      <div className="hidden md:flex flex-1 min-w-0 overflow-hidden" style={{ minHeight: 0 }}>
        {/* Desktop sidebar */}
        {sidebar && (
          <div className="w-64 xl:w-[272px] flex-shrink-0 bg-white border-r border-slate-100 flex flex-col overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-slate-100 flex-shrink-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] font-semibold text-slate-800">Filter Sensor</span>
                <span className="text-[10px] font-mono text-slate-400">{filtered.length} sensor</span>
              </div>
              <FilterControls />
            </div>
            <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/60 flex-shrink-0">
              <p className="text-[9px] font-mono text-slate-500">Atur filter untuk menampilkan titik sensor sesuai status dan tipe.</p>
            </div>
          </div>
        )}

        {/* Desktop map */}
        <div className="flex-1 relative min-w-0 overflow-hidden">
          <button onClick={() => setSidebar(p => !p)}
            className="absolute top-2 left-2 sm:top-3 sm:left-3 z-[1000] max-w-[calc(100vw-1rem)] overflow-hidden text-ellipsis whitespace-nowrap bg-white border border-slate-200 rounded-lg px-2 py-1 sm:px-2.5 sm:py-1.5 text-[9px] sm:text-[10px] font-mono text-slate-600 hover:bg-slate-50 shadow-sm flex items-center gap-1 sm:gap-1.5">
            <Filter size={10} /> {sidebar ? 'Sembunyikan' : 'Filter'}
          </button>
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-[1000] flex flex-col sm:flex-row gap-1 sm:gap-2 max-w-[calc(100vw-1rem)] items-end sm:items-start">
            {[
              { label: 'Online', count: COMPANY_SENSORS.filter(s=>s.status==='online').length, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
              { label: 'Alert',  count: COMPANY_SENSORS.filter(s=>s.status==='alert').length,  color: 'text-red-600 bg-red-50 border-red-200' },
            ].map(({ label, count, color }) => (
              <div key={label} className={cn('flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[10px] font-mono font-medium shadow-sm', color)}>
                {count} {label}
              </div>
            ))}
          </div>
          <div className="absolute bottom-3 left-3 bg-white/95 border border-slate-100 rounded-xl shadow-sm px-3 py-2.5 z-[1000] hidden sm:block">
            {[['#3B82F6','Air Tanah'],['#F59E0B','GNSS'],['#EF4444','Alert'],['#94A3B8','Maintenance']].map(([c,l]) => (
              <div key={l} className="flex items-center gap-2 mb-1.5 last:mb-0">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c }} />
                <span className="text-[9px] font-mono text-slate-500">{l}</span>
              </div>
            ))}
          </div>
          {selected && (
            <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-[1000] bg-white border border-amber-200 rounded-xl shadow-lg px-3 py-3 sm:px-5 sm:py-4 w-auto sm:w-[300px] max-w-[calc(100vw-1rem)]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-bold font-mono text-amber-700">{selected.code}</span>
                  <StatusPill status={selected.status} />
                </div>
                <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600 text-lg leading-none">✕</button>
              </div>
              <div className="grid grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-1.5">
                {[
                  ['Lokasi', selected.location],
                  ['Tipe', selected.type === 'water' ? 'Air Tanah' : 'GNSS'],
                  ['Subsidence', `${selected.subsidence.toFixed(2)} cm/thn`],
                  ['Muka Air', selected.waterLevel ? `${selected.waterLevel} m` : '-'],
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

        <div className="border-t border-slate-100 bg-white max-h-[30vh] md:max-h-[36vh] overflow-y-auto divide-y divide-slate-100">
          {filtered.length === 0 && (
            <div className="flex items-center justify-center py-10 text-[11px] text-slate-400 font-mono">
              Tidak ada sensor ditemukan
            </div>
          )}
          {filtered.map(s => (
            <button
              key={s.id}
              onClick={() => setSelected(s)}
              className={cn(
                'w-full text-left px-4 py-3 transition-colors',
                selected?.id === s.id ? 'bg-amber-50' : 'hover:bg-slate-50/60',
                s.status === 'alert' && 'border-l-2 border-l-red-400',
              )}
            >
              <div className="flex items-center justify-between mb-1 gap-2">
                <span className="text-[12px] font-bold font-mono text-slate-800">{s.code}</span>
                <StatusPill status={s.status} />
              </div>
              <p className="text-[10px] text-slate-500 mb-1 truncate">{s.location}</p>
              <span className={cn('text-[10px] font-mono font-semibold', getSubsidenceColor(s.subsidence))}>
                {s.subsidence.toFixed(2)} cm/thn
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── MOBILE: Map (takes remaining space) ── */}
      <div className="md:hidden flex-1 overflow-hidden flex flex-col" style={{ minHeight: '200px' }}>
        <div className="relative min-h-[250px] flex-1 overflow-hidden">
          <div className="absolute bottom-3 left-3 bg-white/95 border border-slate-100 rounded-xl shadow-sm px-3 py-2.5 z-[1000]">
            {[['#3B82F6','Air Tanah'],['#F59E0B','GNSS'],['#EF4444','Alert'],['#94A3B8','Maintenance']].map(([c,l]) => (
              <div key={l} className="flex items-center gap-2 mb-1.5 last:mb-0">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c }} />
                <span className="text-[9px] font-mono text-slate-500">{l}</span>
              </div>
            ))}
          </div>

          {selected && (
            <div className="absolute bottom-2 left-2 right-2 z-[1000] bg-white border border-amber-200 rounded-xl shadow-lg px-3 py-3 max-w-[calc(100vw-1rem)]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-bold font-mono text-amber-700">{selected.code}</span>
                  <StatusPill status={selected.status} />
                </div>
                <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600 w-6 h-6 flex items-center justify-center">
                  <X size={14} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                {[
                  ['Lokasi', selected.location],
                  ['Tipe', selected.type === 'water' ? 'Air Tanah' : 'GNSS'],
                  ['Subsidence', `${selected.subsidence.toFixed(2)} cm/thn`],
                  ['Muka Air', selected.waterLevel ? `${selected.waterLevel} m` : '-'],
                ].map(([k, v]) => (
                  <div key={k}>
                    <p className="text-[8px] text-slate-400 font-mono uppercase">{k}</p>
                    <p className="text-[10px] font-medium text-slate-700">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <SensorMap sensors={filtered} height="100%" onMarkerClick={setSelected} />
        </div>

        <div className="border-t border-slate-100 bg-white max-h-[30vh] overflow-y-auto divide-y divide-slate-100">
          {filtered.length === 0 && (
            <div className="flex items-center justify-center py-10 text-[11px] text-slate-400 font-mono">
              Tidak ada sensor ditemukan
            </div>
          )}
          {filtered.map(s => (
            <button
              key={s.id}
              onClick={() => setSelected(s)}
              className={cn(
                'w-full text-left px-4 py-2 flex items-center gap-3 transition-colors',
                selected?.id === s.id ? 'bg-amber-50' : 'hover:bg-slate-50/60',
                s.status === 'alert' && 'border-l-2 border-l-red-400',
              )}
            >
              <span className="text-[11px] font-bold font-mono text-slate-800 w-16 flex-shrink-0">{s.code}</span>
              <span className="text-[10px] text-slate-500 flex-1 truncate">{s.location}</span>
              <span className={cn('text-[10px] font-mono font-semibold flex-shrink-0', getSubsidenceColor(s.subsidence))}>
                {s.subsidence.toFixed(2)}
              </span>
              <StatusPill status={s.status} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
