import { useState, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import SensorMap from '../../../components/map/SensorMap';
import { StatusPill } from '../../../components/ui';
import { COMPANY_SENSORS } from '../../../constants/mockData';
import { cn, getSubsidenceColor } from '../../../lib/utils';
import type { Sensor, SensorStatus, SensorType } from '../../../types';

export default function AdminPetaPage() {
  const [search, setSearch]     = useState('');
  const [statusF, setStatusF]   = useState<SensorStatus | 'all'>('all');
  const [typeF, setTypeF]       = useState<SensorType | 'all'>('all');
  const [selected, setSelected] = useState<Sensor | null>(null);
  const [sidebar, setSidebar]   = useState(true);

  const filtered = useMemo(() =>
    COMPANY_SENSORS.filter(s => {
      if (statusF !== 'all' && s.status !== statusF) return false;
      if (typeF   !== 'all' && s.type   !== typeF)   return false;
      if (search && !s.code.toLowerCase().includes(search.toLowerCase()) &&
          !s.location.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    }), [search, statusF, typeF]);

  return (
    <div className="flex h-full overflow-hidden" style={{ minHeight: 0 }}>
      {/* Sidebar */}
      {sidebar && (
        <div className="w-68 flex-shrink-0 bg-white border-r border-slate-100 flex flex-col overflow-hidden shadow-sm" style={{ width: '272px' }}>
          <div className="px-4 py-3 border-b border-slate-100 flex-shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13px] font-semibold text-slate-800">Filter Sensor</span>
              <span className="text-[10px] font-mono text-slate-400">{filtered.length} sensor</span>
            </div>
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
          </div>

          {/* Sensor list */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
            {filtered.map(s => (
              <button key={s.id} onClick={() => setSelected(s)}
                className={cn('w-full text-left px-4 py-3 transition-colors',
                  selected?.id === s.id ? 'bg-amber-50' : 'hover:bg-slate-50/60',
                  s.status === 'alert' && 'border-l-2 border-l-red-400')}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] font-bold font-mono text-slate-800">{s.code}</span>
                  <StatusPill status={s.status} />
                </div>
                <p className="text-[10px] text-slate-500 mb-1">{s.location}</p>
                <span className={cn('text-[10px] font-mono font-semibold', getSubsidenceColor(s.subsidence))}>
                  {s.subsidence.toFixed(2)} cm/thn
                </span>
              </button>
            ))}
          </div>

          {/* Legend */}
          <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/60 flex-shrink-0 space-y-1">
            {[['#3B82F6','Air Tanah'],['#F59E0B','GNSS'],['#EF4444','Alert'],['#94A3B8','Maintenance']].map(([c,l]) => (
              <div key={l} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c }} />
                <span className="text-[9px] font-mono text-slate-500">{l}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Map */}
      <div className="flex-1 relative overflow-hidden">
        <button onClick={() => setSidebar(p => !p)}
          className="absolute top-3 left-3 z-[1000] bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-[10px] font-mono text-slate-600 hover:bg-slate-50 shadow-sm flex items-center gap-1.5">
          <Filter size={10} /> {sidebar ? 'Sembunyikan' : 'Filter'}
        </button>

        {/* Stats chips */}
        <div className="absolute top-3 right-3 z-[1000] flex gap-2">
          {[
            { label: 'Online', count: COMPANY_SENSORS.filter(s=>s.status==='online').length, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
            { label: 'Alert',  count: COMPANY_SENSORS.filter(s=>s.status==='alert').length,  color: 'text-red-600 bg-red-50 border-red-200' },
          ].map(({ label, count, color }) => (
            <div key={label} className={cn('flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[10px] font-mono font-medium shadow-sm', color)}>
              {count} {label}
            </div>
          ))}
        </div>

        {/* Selected sensor detail */}
        {selected && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] bg-white border border-amber-200 rounded-xl shadow-lg px-5 py-4 min-w-[300px]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-bold font-mono text-amber-700">{selected.code}</span>
                <StatusPill status={selected.status} />
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
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

        <SensorMap sensors={filtered} height={window.innerHeight - 60} onMarkerClick={setSelected} />
      </div>
    </div>
  );
}
