import { useState } from 'react';
import { Building2, Plus, Search, MoreHorizontal, ArrowUpDown } from 'lucide-react';
import { Card, StatusPill } from '../../../components/ui';
import { MOCK_COMPANIES, MOCK_SENSORS } from '../../../constants/mockData';
import { cn, getSubsidenceColor, getQuotaPercent } from '../../../lib/utils';
import type { Company } from '../../../types';

type SortKey = 'name' | 'region' | 'sensorCount' | 'avgSubsidence' | 'quotaUsed' | 'status';

export default function CompaniesPage() {
  const [search, setSearch]   = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [menuId, setMenuId]   = useState<string | null>(null);
  const [selected, setSelected] = useState<Company | null>(null);

  const data = [...MOCK_COMPANIES]
    .filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.region.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const av = a[sortKey] as string | number, bv = b[sortKey] as string | number;
      if (typeof av === 'string') return sortAsc ? av.localeCompare(bv as string) : (bv as string).localeCompare(av);
      return sortAsc ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });

  const sort = (k: SortKey) => { setSortKey(k); if (sortKey === k) setSortAsc(p => !p); else setSortAsc(true); };
  const Th = ({ label, k }: { label: string; k: SortKey }) => (
    <th onClick={() => sort(k)} className="text-[9px] font-mono text-slate-400 uppercase tracking-wider px-4 py-3 text-left cursor-pointer hover:text-slate-600 whitespace-nowrap select-none">
      <span className="flex items-center gap-1">{label}<ArrowUpDown size={9} className={sortKey === k ? 'text-cyan-500' : 'text-slate-300'} /></span>
    </th>
  );

  const companySensors = (id: string) => MOCK_SENSORS.filter(s => s.companyId === id);
  const alertSensors   = (id: string) => companySensors(id).filter(s => s.status === 'alert').length;

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[18px] font-semibold text-slate-800">Perusahaan</h1>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">Kelola data perusahaan pengguna air tanah</p>
        </div>
        <button className="px-4 py-2 bg-cyan-600 text-white text-[12px] font-semibold rounded-xl hover:bg-cyan-700 transition-colors flex items-center gap-2">
          <Plus size={13} /> Tambah Perusahaan
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Perusahaan', value: MOCK_COMPANIES.length, color: '#0891B2' },
          { label: 'Online', value: MOCK_COMPANIES.filter(c=>c.status==='online').length, color: '#22C55E' },
          { label: 'Kuota Melebihi', value: MOCK_COMPANIES.filter(c=>c.quotaUsed>c.quota).length, color: '#EF4444' },
          { label: 'Total Sensor', value: MOCK_COMPANIES.reduce((a,c)=>a+c.sensorCount,0), color: '#8B5CF6' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-100 shadow-sm px-4 py-3 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl" style={{ background: color }} />
            <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-1">{label}</p>
            <p className="text-[22px] font-bold font-mono" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Company cards grid */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Cari perusahaan / wilayah..."
              className="pl-8 pr-3 py-1.5 text-[11px] font-mono border border-slate-200 rounded-lg bg-white text-slate-700 w-52 focus:outline-none focus:border-cyan-400" />
          </div>
          <span className="text-[10px] text-slate-400 font-mono">{data.length} perusahaan</span>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {data.map(c => {
            const pct = getQuotaPercent(c.quotaUsed, c.quota);
            const pctColor = pct >= 100 ? '#EF4444' : pct >= 85 ? '#F59E0B' : '#22C55E';
            const alerts = alertSensors(c.id);
            return (
              <div key={c.id} onClick={() => setSelected(c)}
                className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 cursor-pointer hover:border-cyan-200 hover:shadow-md transition-all">
                {/* Company header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center flex-shrink-0">
                    <Building2 size={18} className="text-cyan-600" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    {alerts > 0 && <span className="text-[9px] font-mono bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-full">{alerts} alert</span>}
                    <StatusPill status={c.status} />
                  </div>
                </div>
                <h3 className="text-[13px] font-bold text-slate-800 leading-tight mb-0.5">{c.name}</h3>
                <p className="text-[10px] text-slate-400 font-mono mb-3">{c.region}</p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[
                    { label: 'Sensor', value: c.sensorCount },
                    { label: 'Subsidence', value: `${c.avgSubsidence.toFixed(1)}`, unit: 'cm/thn', valueClass: getSubsidenceColor(c.avgSubsidence) },
                    { label: 'Kuota', value: `${pct}%`, valueClass: pct >= 100 ? 'text-red-600' : pct >= 85 ? 'text-amber-600' : 'text-emerald-600' },
                  ].map(({ label, value, unit, valueClass }) => (
                    <div key={label} className="bg-slate-50 rounded-lg px-2 py-2 text-center">
                      <p className={cn('text-[13px] font-bold font-mono', valueClass ?? 'text-slate-800')}>{value}<span className="text-[8px] text-slate-400 font-mono ml-0.5">{unit}</span></p>
                      <p className="text-[8px] text-slate-400 font-mono">{label}</p>
                    </div>
                  ))}
                </div>

                {/* Quota bar */}
                <div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(pct,100)}%`, background: pctColor }} />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[8px] font-mono text-slate-400">{(c.quotaUsed/1000).toFixed(0)}k m³</span>
                    <span className="text-[8px] font-mono text-slate-400">{(c.quota/1000).toFixed(0)}k m³</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail slide-in */}
      {selected && (
        <div className="fixed inset-0 bg-black/20 z-50 flex justify-end" onClick={() => setSelected(null)}>
          <div className="w-96 bg-white h-full overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[14px] font-bold text-slate-800">{selected.name}</p>
                <p className="text-[10px] text-slate-400 font-mono">{selected.region}</p>
              </div>
              <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200">
                <span className="text-slate-500 text-sm">✕</span>
              </button>
            </div>
            <div className="p-5 space-y-4">
              <StatusPill status={selected.status} />
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['Total Sensor', selected.sensorCount],
                  ['Avg Subsidence', `${selected.avgSubsidence.toFixed(2)} cm/thn`],
                  ['Kuota Total', `${(selected.quota/1000).toFixed(0)}k m³`],
                  ['Kuota Terpakai', `${getQuotaPercent(selected.quotaUsed, selected.quota)}%`],
                ].map(([k, v]) => (
                  <div key={String(k)} className="bg-slate-50 rounded-xl p-3">
                    <p className="text-[9px] font-mono text-slate-400 mb-1">{k}</p>
                    <p className="text-[13px] font-bold text-slate-800">{v}</p>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-700 mb-2">Sensor Perusahaan</p>
                <div className="space-y-2">
                  {companySensors(selected.id).map(s => (
                    <div key={s.id} className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg">
                      <span className="text-[11px] font-mono font-semibold text-slate-700">{s.code}</span>
                      <span className="text-[10px] text-slate-400">{s.location}</span>
                      <StatusPill status={s.status} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 bg-cyan-600 text-white text-[12px] font-semibold rounded-xl hover:bg-cyan-700 transition-colors">Edit Perusahaan</button>
                <button className="px-4 py-2 bg-slate-100 text-slate-600 text-[12px] font-semibold rounded-xl hover:bg-slate-200 transition-colors">Laporan</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
