import { TrendingDown } from 'lucide-react'
import { Panel } from '@/components/ui'
import { TrendChart } from '@/components/charts/TrendChart'
import { MOCK_STATS } from '@/constants/mockData'
import { cn } from '@/lib/utils'

const METRICS = [
  { label: 'Avg Regional', value: MOCK_STATS.avgSubsidence.toFixed(2), accent: 'cyan'  as const },
  { label: 'Nilai Maks',   value: '-4.82',                             accent: 'red'   as const },
  { label: 'Nilai Terbaik',value: '-0.41',                             accent: 'green' as const },
]
const METRIC_BAR: Record<string, { color: string; width: string }> = {
  cyan:  { color: 'bg-accent-cyan',  width: '47%' },
  red:   { color: 'bg-accent-red',   width: '96%' },
  green: { color: 'bg-accent-green', width: '8%'  },
}
const METRIC_TEXT: Record<string, string> = {
  cyan: 'text-accent-cyan', red: 'text-accent-red', green: 'text-accent-green',
}

export default function TrendSection() {
  return (
    <Panel
      title="Trend Subsidence — 12 Bulan"
      icon={<TrendingDown size={12} className="text-accent-cyan" />}
      sub="Apr 2025 – Mar 2026"
    >
      {/* Legend */}
      <div className="flex gap-4 px-4 pt-3 pb-1">
        {[
          { color: 'bg-accent-cyan',   label: 'Rata-rata (cm/thn)'    },
          { color: 'bg-accent-red/50', label: 'Threshold kritis (–4)' },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <span className={cn('w-[10px] h-[3px] rounded-full flex-shrink-0', l.color)} />
            <span className="text-[9px] text-text-muted">{l.label}</span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="px-3 pb-2">
        <TrendChart />
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 divide-x divide-border-base border-t border-border-base">
        {METRICS.map((m) => (
          <div key={m.label} className="px-4 py-3 text-center">
            <p className={cn('text-[18px] font-bold font-mono', METRIC_TEXT[m.accent])}>{m.value}</p>
            <p className="text-[8px] text-text-muted uppercase tracking-[0.5px] mt-0.5">{m.label}</p>
            <div className="h-[3px] rounded-full mt-2 bg-border-base overflow-hidden">
              <div className={cn('h-full rounded-full transition-all', METRIC_BAR[m.accent].color)}
                style={{ width: METRIC_BAR[m.accent].width }} />
            </div>
          </div>
        ))}
      </div>
    </Panel>
  )
}
