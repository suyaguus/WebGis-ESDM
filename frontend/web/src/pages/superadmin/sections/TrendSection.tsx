import { TrendingDown } from 'lucide-react';
import { SectionHeader } from '../../../components/ui';
import TrendChart from '../../../components/charts/TrendChart';
import { TREND_DATA } from '../../../constants/mockData';

const METRICS = [
  { label: 'Avg cm/thn', value: '-2.34', color: '#0891B2', pct: '47%' },
  { label: 'Maks cm/thn', value: '-4.82', color: '#EF4444', pct: '96%' },
  { label: 'Min cm/thn', value: '-0.41', color: '#22C55E', pct: '8%' },
];

export default function TrendSection() {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col min-w-0">
      <SectionHeader
        title="Trend Subsidence — 12 Bulan"
        icon={<TrendingDown size={13} />}
      />

      {/* Legend */}
      <div className="flex items-center gap-4 px-4 pt-3 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 rounded bg-cyan-500" />
          <span className="text-[9px] font-mono text-slate-400">Rata-rata (cm/thn)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 border-t border-dashed border-red-400" />
          <span className="text-[9px] font-mono text-slate-400">Kritis (-4.0)</span>
        </div>
      </div>

      {/* Chart */}
      <div className="px-4 pt-2 pb-2 flex-1" style={{ minHeight: '140px' }}>
        <TrendChart data={TREND_DATA} height={145} />
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 divide-x divide-slate-100 border-t border-slate-100 flex-shrink-0">
        {METRICS.map(({ label, value, color, pct }) => (
          <div key={label} className="px-3 py-3 text-center min-w-0">
            <p className="text-[17px] font-semibold font-mono truncate" style={{ color }}>
              {value}
            </p>
            <p className="text-[9px] font-mono text-slate-400 mt-0.5 truncate">{label}</p>
            <div className="mt-1.5 h-1 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: pct, background: color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
