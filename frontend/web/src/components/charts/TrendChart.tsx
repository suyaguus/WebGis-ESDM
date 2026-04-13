import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { MOCK_TREND } from '@/constants/mockData'

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-border-base rounded-lg px-3 py-2 shadow-card-hover">
      <p className="text-[9px] text-text-muted font-mono mb-0.5">{label}</p>
      <p className="text-[13px] font-bold font-mono text-accent-cyan">{payload[0].value.toFixed(2)} cm/thn</p>
    </div>
  )
}

export function TrendChart() {
  return (
    <div className="w-full h-[160px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={MOCK_TREND} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#0891b2" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#0891b2" stopOpacity={0}    />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: '#94a3b8', fontSize: 9 }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            domain={[-3, -1.5]}
            tick={{ fill: '#94a3b8', fontSize: 9 }}
            axisLine={false} tickLine={false}
            tickFormatter={(v: number) => v.toFixed(1)}
          />
          <Tooltip content={<ChartTooltip />} />
          <ReferenceLine
            y={-4} stroke="#dc2626" strokeDasharray="4 4" strokeOpacity={0.4}
            label={{ value: 'threshold', position: 'right', fontSize: 8, fill: '#dc2626' }}
          />
          <Area
            type="monotone" dataKey="value"
            stroke="#0891b2" strokeWidth={2}
            fill="url(#cyanGrad)"
            dot={{ fill: '#0891b2', r: 3, strokeWidth: 0 }}
            activeDot={{ fill: '#0891b2', stroke: '#fff', strokeWidth: 2, r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
