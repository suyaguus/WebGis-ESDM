import { useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend,
} from 'recharts'
import { TrendingDown, TrendingUp, BarChart2, MapPin, Calendar, Download } from 'lucide-react'
import Topbar from '@/components/layout/Topbar'
import { Panel, StatCard } from '@/components/ui'
import { cn } from '@/lib/utils'

/* ── Mock data ─────────────────────────────────────────────────────── */
const TREND_12M = [
  { month: 'Apr', avg: -1.82, max: -3.10, min: -0.41 },
  { month: 'Mei', avg: -1.95, max: -3.22, min: -0.45 },
  { month: 'Jun', avg: -2.10, max: -3.50, min: -0.48 },
  { month: 'Jul', avg: -2.18, max: -3.60, min: -0.52 },
  { month: 'Agu', avg: -2.25, max: -3.90, min: -0.50 },
  { month: 'Sep', avg: -2.31, max: -4.00, min: -0.55 },
  { month: 'Okt', avg: -2.28, max: -4.10, min: -0.53 },
  { month: 'Nov', avg: -2.40, max: -4.30, min: -0.58 },
  { month: 'Des', avg: -2.35, max: -4.50, min: -0.56 },
  { month: 'Jan', avg: -2.50, max: -4.62, min: -0.60 },
  { month: 'Feb', avg: -2.44, max: -4.70, min: -0.59 },
  { month: 'Mar', avg: -2.55, max: -4.82, min: -0.63 },
]

const COMPANY_COMPARE = [
  { name: 'PT Maju Jaya',   subsidence: -2.41, sensors: 34, status: 'warning' },
  { name: 'PT Bumi Raya',   subsidence: -4.82, sensors: 18, status: 'critical' },
  { name: 'PT Tirta',       subsidence: -1.10, sensors: 27, status: 'ok' },
  { name: 'PT Sumber Air',  subsidence: -3.30, sensors: 21, status: 'warning' },
  { name: 'PT Karya',       subsidence: -0.82, sensors: 15, status: 'ok' },
  { name: 'PT Indo Nusa',   subsidence: -2.90, sensors: 11, status: 'warning' },
]

const QUARTERLY = [
  { q: 'Q2 2024', jakarta: -1.65, bekasi: -2.10, tangerang: -0.90, depok: -1.20 },
  { q: 'Q3 2024', jakarta: -1.80, bekasi: -2.40, tangerang: -0.95, depok: -1.35 },
  { q: 'Q4 2024', jakarta: -1.95, bekasi: -2.80, tangerang: -1.00, depok: -1.50 },
  { q: 'Q1 2025', jakarta: -2.10, bekasi: -3.20, tangerang: -1.05, depok: -1.65 },
  { q: 'Q2 2025', jakarta: -2.20, bekasi: -3.60, tangerang: -1.08, depok: -1.75 },
  { q: 'Q3 2025', jakarta: -2.35, bekasi: -4.00, tangerang: -1.10, depok: -1.90 },
  { q: 'Q4 2025', jakarta: -2.45, bekasi: -4.40, tangerang: -1.09, depok: -2.00 },
  { q: 'Q1 2026', jakarta: -2.55, bekasi: -4.82, tangerang: -1.10, depok: -2.10 },
]

const PERIODS = ['6 Bulan', '12 Bulan', '2 Tahun', '5 Tahun']

function TT({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-border-base rounded-lg px-3 py-2 shadow-card-hover text-[11px]">
      <p className="text-text-muted font-mono text-[9px] mb-1">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-text-secondary">{p.name}:</span>
          <span className="font-bold font-mono" style={{ color: p.color }}>{p.value.toFixed(2)}</span>
        </div>
      ))}
    </div>
  )
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('12 Bulan')

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar
        breadcrumbs={[{ label: 'Super Admin' }, { label: 'Analytics' }]}
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-bg-card3 border border-border-base rounded-lg p-1">
              {PERIODS.map((p) => (
                <button key={p} onClick={() => setPeriod(p)}
                  className={cn('px-2.5 py-1 rounded-md text-[10px] font-medium transition-all',
                    period === p ? 'bg-bg-card text-text-primary shadow-sm border border-border-base' : 'text-text-muted hover:text-text-secondary')}>
                  {p}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-1.5 text-[10px] text-text-secondary border border-border-base rounded-lg px-2.5 h-8 hover:bg-bg-card3 transition-colors">
              <Download size={12} /> Ekspor
            </button>
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto p-5 space-y-4">

        {/* KPI row */}
        <div className="grid grid-cols-4 gap-3">
          <StatCard accent="cyan"   label="Avg Subsidence Regional" value="-2.34" sub="cm/tahun" icon={<TrendingDown size={14} className="text-accent-cyan" />} />
          <StatCard accent="red"    label="Zona Kritis Aktif"       value="4"     sub="↑ 1 dari bulan lalu" subColor="text-accent-red" icon={<MapPin size={14} className="text-accent-red" />} />
          <StatCard accent="amber"  label="Perusahaan Perlu Tindak" value="3"     sub="dari 18 total" icon={<BarChart2 size={14} className="text-accent-amber" />} />
          <StatCard accent="green"  label="Sensor Compliance Rate"  value="89%"   sub="Target 85% — tercapai" subColor="text-accent-green" icon={<TrendingUp size={14} className="text-accent-green" />} />
        </div>

        {/* Row 1: trend + quarterly */}
        <div className="grid grid-cols-[1.4fr_1fr] gap-4">
          {/* 12 month trend */}
          <Panel title="Trend Subsidence Regional — 12 Bulan" icon={<TrendingDown size={12} className="text-accent-cyan" />} sub="Apr 2025 – Mar 2026">
            <div className="flex gap-4 px-4 pt-3 pb-1">
              {[
                { color: '#0891b2', label: 'Rata-rata' },
                { color: '#dc2626', label: 'Nilai Maks' },
                { color: '#16a34a', label: 'Nilai Min'  },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <span className="w-[10px] h-[3px] rounded-full" style={{ background: l.color }} />
                  <span className="text-[9px] text-text-muted">{l.label}</span>
                </div>
              ))}
            </div>
            <div className="px-3 pb-4 pt-1">
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={TREND_12M} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#0891b2" stopOpacity={0.12} />
                      <stop offset="95%" stopColor="#0891b2" stopOpacity={0}    />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 9 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[-5.5, 0]} tick={{ fill: '#94a3b8', fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => v.toFixed(1)} />
                  <Tooltip content={<TT />} />
                  <Area type="monotone" dataKey="max" name="Maks" stroke="#dc2626" strokeWidth={1.5} fill="none"
                    strokeDasharray="4 3" dot={false} />
                  <Area type="monotone" dataKey="avg" name="Avg"  stroke="#0891b2" strokeWidth={2}   fill="url(#g1)"
                    dot={{ fill: '#0891b2', r: 3, strokeWidth: 0 }} activeDot={{ r: 5, fill: '#0891b2', stroke: '#fff', strokeWidth: 2 }} />
                  <Area type="monotone" dataKey="min" name="Min"  stroke="#16a34a" strokeWidth={1.5} fill="none"
                    strokeDasharray="4 3" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          {/* Company comparison bar */}
          <Panel title="Perbandingan Antar Perusahaan" icon={<BarChart2 size={12} className="text-accent-purple" />} sub="Avg cm/thn">
            <div className="px-3 py-4 space-y-2">
              {COMPANY_COMPARE.map((c) => {
                const pct = Math.abs(c.subsidence) / 5 * 100
                const color = c.status === 'critical' ? '#dc2626' : c.status === 'warning' ? '#d97706' : '#16a34a'
                return (
                  <div key={c.name}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] text-text-secondary truncate max-w-[130px]">{c.name}</span>
                      <span className="text-[10px] font-bold font-mono" style={{ color }}>{c.subsidence.toFixed(2)}</span>
                    </div>
                    <div className="h-2 bg-bg-card3 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
                    </div>
                  </div>
                )
              })}
              <div className="flex items-center gap-3 pt-2 text-[9px] text-text-muted font-mono border-t border-border-light">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent-red inline-block" />Kritis (&lt;-3.5)</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent-amber inline-block" />Waspada</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent-green inline-block" />Normal</span>
              </div>
            </div>
          </Panel>
        </div>

        {/* Row 2: quarterly by region */}
        <Panel title="Tren Per Wilayah — Kuartalan" icon={<Calendar size={12} className="text-accent-blue" />} sub="Q2 2024 – Q1 2026">
          <div className="flex gap-4 px-4 pt-3 pb-1">
            {[
              { color: '#2563eb', label: 'Jakarta' },
              { color: '#dc2626', label: 'Bekasi'  },
              { color: '#d97706', label: 'Tangerang'},
              { color: '#0891b2', label: 'Depok'   },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <span className="w-[10px] h-[3px] rounded-full" style={{ background: l.color }} />
                <span className="text-[9px] text-text-muted">{l.label}</span>
              </div>
            ))}
          </div>
          <div className="px-3 pb-4 pt-1">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={QUARTERLY} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="q" tick={{ fill: '#94a3b8', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis domain={[-5.5, 0]} tick={{ fill: '#94a3b8', fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => v.toFixed(1)} />
                <Tooltip content={<TT />} />
                <Line type="monotone" dataKey="jakarta"   name="Jakarta"    stroke="#2563eb" strokeWidth={2} dot={{ r: 3, fill: '#2563eb', strokeWidth: 0 }} />
                <Line type="monotone" dataKey="bekasi"    name="Bekasi"     stroke="#dc2626" strokeWidth={2} dot={{ r: 3, fill: '#dc2626', strokeWidth: 0 }} />
                <Line type="monotone" dataKey="tangerang" name="Tangerang"  stroke="#d97706" strokeWidth={2} dot={{ r: 3, fill: '#d97706', strokeWidth: 0 }} />
                <Line type="monotone" dataKey="depok"     name="Depok"      stroke="#0891b2" strokeWidth={2} dot={{ r: 3, fill: '#0891b2', strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        {/* Row 3: sensor health + summary table */}
        <div className="grid grid-cols-[1fr_1.4fr] gap-4">
          {/* Sensor health donut-like */}
          <Panel title="Status Sensor Keseluruhan" icon={<BarChart2 size={12} className="text-accent-cyan" />}>
            <div className="px-4 pb-4 pt-2">
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={[
                  { name: 'Online',   value: 232, fill: '#16a34a' },
                  { name: 'Waspada',  value: 8,   fill: '#d97706' },
                  { name: 'Kritis',   value: 3,   fill: '#dc2626' },
                  { name: 'Offline',  value: 4,   fill: '#94a3b8' },
                ]} layout="vertical" margin={{ top: 0, right: 40, left: 10, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} width={55} />
                  <Tooltip formatter={(v: number) => [v, 'Sensor']} contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e2e8f0' }} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {[
                      { fill: '#16a34a' },
                      { fill: '#d97706' },
                      { fill: '#dc2626' },
                      { fill: '#94a3b8' },
                    ].map((entry, i) => (
                      <rect key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {[
                  { label: 'Online',  value: '232', pct: '94%', color: 'text-accent-green' },
                  { label: 'Waspada', value: '8',   pct: '3%',  color: 'text-accent-amber' },
                  { label: 'Kritis',  value: '3',   pct: '1%',  color: 'text-accent-red'   },
                  { label: 'Offline', value: '4',   pct: '2%',  color: 'text-text-muted'   },
                ].map((s) => (
                  <div key={s.label} className="bg-bg-card3 rounded-lg p-2.5">
                    <p className="text-[8px] text-text-muted mb-0.5">{s.label}</p>
                    <div className="flex items-baseline gap-1.5">
                      <span className={cn('text-[15px] font-bold font-mono', s.color)}>{s.value}</span>
                      <span className="text-[9px] text-text-muted">({s.pct})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Panel>

          {/* Summary stats table */}
          <Panel title="Ringkasan Statistik Regional" icon={<TrendingDown size={12} className="text-accent-amber" />}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Wilayah</th>
                  <th>Sensor</th>
                  <th>Avg cm/thn</th>
                  <th>Maks cm/thn</th>
                  <th>Trend</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { region: 'Jakarta Utara', sensors: 52, avg: -2.41, max: -4.82, trend: 'up' },
                  { region: 'Jakarta Barat', sensors: 38, avg: -1.95, max: -2.90, trend: 'up' },
                  { region: 'Bekasi',        sensors: 18, avg: -4.20, max: -4.82, trend: 'up' },
                  { region: 'Tangerang',     sensors: 27, avg: -1.10, max: -1.80, trend: 'stable' },
                  { region: 'Depok',         sensors: 21, avg: -3.30, max: -3.90, trend: 'up' },
                  { region: 'Bogor',         sensors: 15, avg: -0.82, max: -1.20, trend: 'stable' },
                ].map((r) => (
                  <tr key={r.region}>
                    <td className="td-primary">{r.region}</td>
                    <td className="td-mono text-text-primary">{r.sensors}</td>
                    <td className={cn('td-mono font-semibold',
                      r.avg < -3.5 ? 'text-accent-red' : r.avg < -2.5 ? 'text-accent-amber' : 'text-accent-green')}>
                      {r.avg.toFixed(2)}
                    </td>
                    <td className="td-mono text-accent-red font-semibold">{r.max.toFixed(2)}</td>
                    <td>
                      {r.trend === 'up'
                        ? <span className="flex items-center gap-1 text-[10px] text-accent-red"><TrendingDown size={11} /> Memburuk</span>
                        : <span className="flex items-center gap-1 text-[10px] text-accent-green"><TrendingUp size={11} /> Stabil</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>
        </div>

        <div className="h-2" />
      </div>
    </div>
  )
}
