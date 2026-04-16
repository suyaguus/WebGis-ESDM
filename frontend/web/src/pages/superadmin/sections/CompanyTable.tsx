import { useState } from 'react';
import { Building2, ArrowUpDown } from 'lucide-react';
import { SectionHeader, StatusPill } from '../../../components/ui';
import { MOCK_COMPANIES } from '../../../constants/mockData';
import { cn, getSubsidenceColor, getQuotaPercent } from '../../../lib/utils';

type SortKey = 'name' | 'sensorCount' | 'avgSubsidence' | 'quotaUsed';

export default function CompanyTable() {
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortAsc, setSortAsc] = useState(true);

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortAsc((p) => !p);
    else { setSortKey(key); setSortAsc(true); }
  }

  const sorted = [...MOCK_COMPANIES].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    if (typeof av === 'string') return sortAsc ? av.localeCompare(bv as string) : (bv as string).localeCompare(av);
    return sortAsc ? (av as number) - (bv as number) : (bv as number) - (av as number);
  });

  const HeadCell = ({ label, sk }: { label: string; sk: SortKey }) => (
    <th
      onClick={() => handleSort(sk)}
      className="text-[9px] font-mono font-medium text-slate-400 uppercase tracking-wider px-3 py-2.5 text-left cursor-pointer hover:text-slate-600 select-none whitespace-nowrap"
    >
      <span className="flex items-center gap-1">
        {label}
        <ArrowUpDown size={9} className={sortKey === sk ? 'text-cyan-500' : 'text-slate-300'} />
      </span>
    </th>
  );

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden min-w-0 flex flex-col">
      <SectionHeader
        title="Daftar Perusahaan"
        icon={<Building2 size={13} />}
        action={
          <button className="text-[10px] text-cyan-600 hover:text-cyan-700 font-mono font-medium whitespace-nowrap">
            Lihat Semua →
          </button>
        }
      />

      <div className="overflow-x-auto flex-1">
        <table className="w-full" style={{ tableLayout: 'fixed', minWidth: '480px' }}>
          <colgroup>
            <col style={{ width: '30%' }} />
            <col style={{ width: '18%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '14%' }} />
            <col style={{ width: '16%' }} />
            <col style={{ width: '12%' }} />
          </colgroup>
          <thead className="bg-slate-50/70 border-b border-slate-100">
            <tr>
              <HeadCell label="Perusahaan" sk="name" />
              <th className="text-[9px] font-mono font-medium text-slate-400 uppercase tracking-wider px-3 py-2.5 text-left whitespace-nowrap">Wilayah</th>
              <HeadCell label="Sensor" sk="sensorCount" />
              <HeadCell label="Subsidence" sk="avgSubsidence" />
              <HeadCell label="Kuota" sk="quotaUsed" />
              <th className="text-[9px] font-mono font-medium text-slate-400 uppercase tracking-wider px-3 py-2.5 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {sorted.map((company) => {
              const pct = getQuotaPercent(company.quotaUsed, company.quota);
              const pctColor = pct >= 100 ? '#EF4444' : pct >= 85 ? '#F59E0B' : '#22C55E';
              return (
                <tr key={company.id} className="hover:bg-slate-50/60 transition-colors cursor-pointer">
                  <td className="px-3 py-2.5">
                    <span className="text-[12px] font-semibold text-slate-800 truncate block">{company.name}</span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="text-[11px] text-slate-500 truncate block">{company.region}</span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="text-[11px] font-mono font-medium text-slate-700">{company.sensorCount}</span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={cn('text-[11px] font-mono font-semibold', getSubsidenceColor(company.avgSubsidence))}>
                      {company.avgSubsidence.toFixed(2)}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono ml-0.5">cm/thn</span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden" style={{ minWidth: '36px' }}>
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${Math.min(pct, 100)}%`, background: pctColor }}
                        />
                      </div>
                      <span className="text-[10px] font-mono flex-shrink-0" style={{ color: pctColor }}>{pct}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <StatusPill status={company.status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
