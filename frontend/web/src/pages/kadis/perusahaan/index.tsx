import { useState, useMemo } from 'react';
import { Building2, Search, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { Card, SectionHeader } from '../../../components/ui';
import { MOCK_COMPANIES, MOCK_SENSORS, MOCK_ALERTS } from '../../../constants/mockData';
import { cn, getQuotaPercent, getSubsidenceColor } from '../../../lib/utils';
import type { Company } from '../../../types';

export default function KadisPerusahaanPage() {
  const [search, setSearch]         = useState('');
  const [sortKey, setSortKey]       = useState<keyof Company>('name');
  const [sortAsc, setSortAsc]       = useState(true);
  const [selected, setSelected]     = useState<Company | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return [...MOCK_COMPANIES]
      .filter(c => !q || c.name.toLowerCase().includes(q) || c.region.toLowerCase().includes(q))
      .sort((a, b) => {
        const va = a[sortKey] as string | number;
        const vb = b[sortKey] as string | number;
        return sortAsc
          ? va < vb ? -1 : va > vb ? 1 : 0
          : va > vb ? -1 : va < vb ? 1 : 0;
      });
  }, [search, sortKey, sortAsc]);

  const toggleSort = (key: keyof Company) => {
    if (sortKey === key) setSortAsc(p => !p);
    else { setSortKey(key); setSortAsc(true); }
  };

  const SortIcon = ({ col }: { col: keyof Company }) =>
    sortKey === col
      ? (sortAsc ? <ChevronUp size={11} className="text-emerald-600" /> : <ChevronDown size={11} className="text-emerald-600" />)
      : <ChevronDown size={11} className="text-slate-300" />;

  const overQuota = MOCK_COMPANIES.filter(c => getQuotaPercent(c.quotaUsed, c.quota) >= 100).length;

  return (
    <div className="p-3 sm:p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[18px] font-semibold text-slate-800">Data Perusahaan</h1>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
            Pemantauan kepatuhan {MOCK_COMPANIES.length} perusahaan terdaftar
          </p>
        </div>
        {overQuota > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 rounded-full">
            <AlertTriangle size={12} className="text-red-600" />
            <span className="text-[10px] font-mono text-red-700 font-semibold">{overQuota} perusahaan melebihi kuota</span>
          </div>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Perusahaan',  value: String(MOCK_COMPANIES.length),                                               color: '#059669' },
          { label: 'Status Online',     value: String(MOCK_COMPANIES.filter(c => c.status === 'online').length),            color: '#22C55E' },
          { label: 'Melebihi Kuota',    value: String(overQuota),                                                           color: '#EF4444' },
          { label: 'Sensor Terdaftar',  value: String(MOCK_COMPANIES.reduce((a, c) => a + c.sensorCount, 0)),               color: '#3B82F6' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-100 shadow-sm px-4 py-3 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl" style={{ background: color }} />
            <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-1">{label}</p>
            <p className="text-[22px] font-bold font-mono" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-[1fr_300px]">
        {/* Table */}
        <Card padding={false}>
          <SectionHeader
            title="Daftar Perusahaan"
            icon={<Building2 size={13} />}
            accent="#059669"
            subtitle={`${filtered.length} perusahaan`}
            action={
              <div className="relative">
                <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Cari nama / wilayah..."
                  className="pl-7 pr-3 py-1 text-[10px] font-mono border border-slate-200 rounded-lg bg-slate-50 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-emerald-400 w-44"
                />
              </div>
            }
          />
          <div className="overflow-x-auto">
            <table className="w-full" style={{ minWidth: 540 }}>
              <thead className="bg-slate-50/60 border-b border-slate-100">
                <tr>
                  {([
                    ['name',          'Perusahaan'],
                    ['region',        'Wilayah'],
                    ['avgSubsidence', 'Subsidence'],
                    ['quotaUsed',     'Kuota'],
                    ['sensorCount',   'Sensor'],
                    [null,            'Status'],
                  ] as const).map(([col, label]) => (
                    <th key={label}
                      className={cn('text-[9px] font-mono text-slate-400 uppercase tracking-wider px-4 py-2.5 text-left whitespace-nowrap', col && 'cursor-pointer hover:text-slate-600 select-none')}
                      onClick={() => col && toggleSort(col as keyof Company)}>
                      <span className="flex items-center gap-1">
                        {label}
                        {col && <SortIcon col={col as keyof Company} />}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(c => {
                  const pct = getQuotaPercent(c.quotaUsed, c.quota);
                  const pctColor = pct >= 100 ? '#EF4444' : pct >= 85 ? '#F59E0B' : '#22C55E';
                  const isSelected = selected?.id === c.id;
                  return (
                    <tr key={c.id} onClick={() => setSelected(c)}
                      className={cn('cursor-pointer transition-colors', isSelected ? 'bg-emerald-50' : 'hover:bg-slate-50/40', pct >= 100 && !isSelected && 'bg-red-50/20')}>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          {pct >= 100 && <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />}
                          <span className="text-[12px] font-semibold text-slate-800">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-[11px] text-slate-500">{c.region}</td>
                      <td className="px-4 py-2.5">
                        <span className={cn('text-[11px] font-semibold font-mono', getSubsidenceColor(c.avgSubsidence))}>
                          {c.avgSubsidence.toFixed(2)} cm/thn
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${Math.min(pct, 100)}%`, background: pctColor }} />
                          </div>
                          <span className="text-[10px] font-mono font-semibold" style={{ color: pctColor }}>{pct}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-[11px] font-mono text-slate-600">{c.sensorCount}</td>
                      <td className="px-4 py-2.5">
                        <span className={cn('text-[9px] font-mono px-2 py-0.5 rounded-full border',
                          c.status === 'online'    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : c.status === 'offline' ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200')}>
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Detail panel */}
        {selected ? (
          <div className="space-y-3">
            {/* Company KPI card */}
            <div className="bg-white rounded-xl border border-emerald-100 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 bg-emerald-50/40 flex items-center justify-between">
                <span className="text-[13px] font-semibold text-emerald-800">{selected.name}</span>
                <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
              </div>
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  {(() => {
                    const pct = getQuotaPercent(selected.quotaUsed, selected.quota);
                    const pctColor = pct >= 100 ? '#EF4444' : pct >= 85 ? '#F59E0B' : '#22C55E';
                    return [
                      { label: 'Wilayah',         value: selected.region },
                      { label: 'Total Sensor',     value: String(selected.sensorCount) },
                      { label: 'Kuota Izin',       value: `${(selected.quota / 1000).toFixed(0)}k m³` },
                      { label: 'Terpakai',         value: `${pct}%`, style: { color: pctColor } },
                    ].map(({ label, value, style }) => (
                      <div key={label}>
                        <p className="text-[9px] font-mono text-slate-400">{label}</p>
                        <p className="text-[13px] font-semibold text-slate-800 font-mono" style={style}>{value}</p>
                      </div>
                    ));
                  })()}
                </div>

                {/* Quota bar */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-[9px] font-mono text-slate-400">Penggunaan Kuota</span>
                    <span className="text-[9px] font-mono font-semibold" style={{ color: getQuotaPercent(selected.quotaUsed, selected.quota) >= 100 ? '#EF4444' : '#22C55E' }}>
                      {getQuotaPercent(selected.quotaUsed, selected.quota)}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    {(() => {
                      const pct = getQuotaPercent(selected.quotaUsed, selected.quota);
                      const color = pct >= 100 ? '#EF4444' : pct >= 85 ? '#F59E0B' : '#22C55E';
                      return <div className="h-full rounded-full" style={{ width: `${Math.min(pct, 100)}%`, background: color }} />;
                    })()}
                  </div>
                </div>

                {/* Subsidence */}
                <div className="bg-slate-50 rounded-lg px-3 py-2.5">
                  <p className="text-[9px] font-mono text-slate-400 mb-1">Rata-rata Subsidence</p>
                  <p className={cn('text-[18px] font-bold font-mono', getSubsidenceColor(selected.avgSubsidence))}>
                    {selected.avgSubsidence.toFixed(2)}
                    <span className="text-[10px] font-normal text-slate-400 ml-1">cm/tahun</span>
                  </p>
                </div>

                {/* Alert count */}
                {(() => {
                  const alerts = MOCK_ALERTS.filter(a => a.companyName === selected.name);
                  return alerts.length > 0 ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                      <p className="text-[9px] font-mono text-red-600 mb-1">{alerts.length} alert aktif</p>
                      {alerts.slice(0, 2).map(a => (
                        <p key={a.id} className="text-[10px] text-red-700 leading-relaxed">· {a.title}</p>
                      ))}
                    </div>
                  ) : null;
                })()}

                {/* Sensors */}
                {(() => {
                  const sensors = MOCK_SENSORS.filter(s => s.companyId === selected.id);
                  return sensors.length > 0 ? (
                    <div>
                      <p className="text-[9px] font-mono text-slate-400 mb-1.5">Sensor ({sensors.length})</p>
                      <div className="flex flex-wrap gap-1">
                        {sensors.map(s => (
                          <span key={s.id}
                            className={cn('text-[9px] font-mono px-1.5 py-0.5 rounded border',
                              s.status === 'alert' ? 'bg-red-50 text-red-700 border-red-200'
                              : s.status === 'maintenance' ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : s.status === 'online' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-slate-100 text-slate-500 border-slate-200')}>
                            {s.code}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm flex items-center justify-center" style={{ minHeight: 200 }}>
            <div className="text-center">
              <Building2 size={24} className="text-slate-200 mx-auto mb-2" />
              <p className="text-[11px] text-slate-400 font-mono">Pilih perusahaan<br/>untuk melihat detail</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
