import { useState, useRef, useEffect } from 'react';
import { BarChart3, TrendingDown, Download } from 'lucide-react';
import {
  Chart as ChartJS,
  LineController, BarController,
  LineElement, BarElement, PointElement,
  LinearScale, CategoryScale, Filler, Tooltip, Legend,
} from 'chart.js';
import { Card, SectionHeader } from '../../../components/ui';
import { MOCK_COMPANIES, ANALYTICS_MONTHLY } from '../../../constants/mockData';
import { cn, getSubsidenceColor } from '../../../lib/utils';

ChartJS.register(
  LineController, BarController,
  LineElement, BarElement, PointElement,
  LinearScale, CategoryScale, Filler, Tooltip, Legend,
);

const PERIODS = ['6 Bulan', '12 Bulan', '2 Tahun'] as const;

function TrendLineChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  const chart = useRef<ChartJS | null>(null);
  useEffect(() => {
    if (!ref.current) return;
    chart.current?.destroy();
    chart.current = new ChartJS(ref.current, {
      type: 'line',
      data: {
        labels: ANALYTICS_MONTHLY.map(d => d.month),
        datasets: [
          { label: 'Air Tanah', data: ANALYTICS_MONTHLY.map(d => d.sw), borderColor: '#3B82F6', backgroundColor: 'rgba(59,130,246,0.07)', fill: true, tension: 0.4, pointRadius: 3, borderWidth: 2 },
          { label: 'GNSS', data: ANALYTICS_MONTHLY.map(d => d.gnss), borderColor: '#F59E0B', backgroundColor: 'rgba(245,158,11,0.07)', fill: true, tension: 0.4, pointRadius: 3, borderWidth: 2 },
          { label: 'Threshold', data: ANALYTICS_MONTHLY.map(d => d.threshold), borderColor: 'rgba(239,68,68,0.4)', borderDash: [5,4], pointRadius: 0, borderWidth: 1.5, fill: false },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: { legend: { position: 'top', labels: { boxWidth: 10, font: { size: 10, family: "'IBM Plex Mono'" }, color: '#64748B' } }, tooltip: { backgroundColor: '#fff', borderColor: '#E2E8F0', borderWidth: 1, bodyColor: '#0F172A', titleColor: '#475569', bodyFont: { size: 10, family: "'IBM Plex Mono'" }, titleFont: { size: 10, family: "'IBM Plex Mono'" } } },
        scales: {
          x: { ticks: { color: '#94A3B8', font: { size: 9, family: "'IBM Plex Mono'" } }, grid: { color: '#F1F5F9' }, border: { display: false } },
          y: { min: -5, max: -1, ticks: { color: '#94A3B8', font: { size: 9, family: "'IBM Plex Mono'" }, callback: (v) => `${Number(v).toFixed(1)}` }, grid: { color: '#F1F5F9' }, border: { display: false } },
        },
      },
    });
    return () => chart.current?.destroy();
  }, []);
  return <div style={{ position: 'relative', height: 220 }}><canvas ref={ref} /></div>;
}

function BarCompanyChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  const chart = useRef<ChartJS | null>(null);
  useEffect(() => {
    if (!ref.current) return;
    chart.current?.destroy();
    chart.current = new ChartJS(ref.current, {
      type: 'bar',
      data: {
        labels: MOCK_COMPANIES.map(c => c.name.replace('PT ', '').substring(0, 12)),
        datasets: [
          { label: 'Avg Subsidence', data: MOCK_COMPANIES.map(c => Math.abs(c.avgSubsidence)), backgroundColor: MOCK_COMPANIES.map(c => c.avgSubsidence <= -3 ? 'rgba(239,68,68,0.7)' : c.avgSubsidence <= -2 ? 'rgba(245,158,11,0.7)' : 'rgba(34,197,94,0.7)'), borderRadius: 6, borderSkipped: false },
          { label: 'Threshold (4.0)', data: MOCK_COMPANIES.map(() => 4.0), type: 'line', borderColor: 'rgba(239,68,68,0.4)', borderDash: [5,4], pointRadius: 0, borderWidth: 1.5, backgroundColor: 'transparent' },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { backgroundColor: '#fff', borderColor: '#E2E8F0', borderWidth: 1, bodyColor: '#0F172A', titleColor: '#475569', bodyFont: { size: 10, family: "'IBM Plex Mono'" }, titleFont: { size: 10, family: "'IBM Plex Mono'" } } },
        scales: {
          x: { ticks: { color: '#94A3B8', font: { size: 9, family: "'IBM Plex Mono'" } }, grid: { display: false }, border: { display: false } },
          y: { min: 0, max: 5, ticks: { color: '#94A3B8', font: { size: 9, family: "'IBM Plex Mono'" }, callback: (v) => `-${Number(v).toFixed(1)}` }, grid: { color: '#F1F5F9' }, border: { display: false } },
        },
      },
    });
    return () => chart.current?.destroy();
  }, []);
  return <div style={{ position: 'relative', height: 200 }}><canvas ref={ref} /></div>;
}

function QuotaBarChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  const chart = useRef<ChartJS | null>(null);
  useEffect(() => {
    if (!ref.current) return;
    chart.current?.destroy();
    chart.current = new ChartJS(ref.current, {
      type: 'bar',
      data: {
        labels: MOCK_COMPANIES.map(c => c.name.replace('PT ', '').substring(0, 12)),
        datasets: [
          { label: 'Terpakai (m³)', data: MOCK_COMPANIES.map(c => c.quotaUsed / 1000), backgroundColor: MOCK_COMPANIES.map(c => c.quotaUsed / c.quota >= 1 ? 'rgba(239,68,68,0.7)' : c.quotaUsed / c.quota >= 0.85 ? 'rgba(245,158,11,0.7)' : 'rgba(34,197,94,0.7)'), borderRadius: 6 },
          { label: 'Kuota Total (m³)', data: MOCK_COMPANIES.map(c => c.quota / 1000), backgroundColor: 'rgba(148,163,184,0.15)', borderRadius: 6 },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false, indexAxis: 'y' as const,
        plugins: { legend: { position: 'top', labels: { boxWidth: 10, font: { size: 10, family: "'IBM Plex Mono'" }, color: '#64748B' } }, tooltip: { backgroundColor: '#fff', borderColor: '#E2E8F0', borderWidth: 1, bodyColor: '#0F172A', titleColor: '#475569', bodyFont: { size: 10, family: "'IBM Plex Mono'" }, titleFont: { size: 10, family: "'IBM Plex Mono'" }, callbacks: { label: (ctx) => `${ctx.dataset.label}: ${(ctx.parsed.x).toFixed(0)}k m³` } } },
        scales: {
          x: { ticks: { color: '#94A3B8', font: { size: 9, family: "'IBM Plex Mono'" }, callback: (v) => `${v}k` }, grid: { color: '#F1F5F9' }, border: { display: false } },
          y: { ticks: { color: '#94A3B8', font: { size: 9, family: "'IBM Plex Mono'" } }, grid: { display: false }, border: { display: false } },
        },
      },
    });
    return () => chart.current?.destroy();
  }, []);
  return <div style={{ position: 'relative', height: 200 }}><canvas ref={ref} /></div>;
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<typeof PERIODS[number]>('12 Bulan');
  const alertCount = MOCK_COMPANIES.filter(c => c.quotaUsed / c.quota > 1).length;
  const warnCount  = MOCK_COMPANIES.filter(c => { const p = c.quotaUsed / c.quota; return p >= 0.85 && p <= 1; }).length;

  return (
    <div className="p-3 sm:p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-[18px] font-semibold text-slate-800">Analytics</h1>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">Analisis tren subsidence dan penggunaan air tanah</p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
          <div className="flex gap-1 bg-slate-100 rounded-lg p-1 w-full sm:w-auto overflow-x-auto">
            {PERIODS.map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={cn('text-[10px] font-mono px-2.5 py-1 rounded-md transition-all whitespace-nowrap',
                  period === p ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700')}>
                {p}
              </button>
            ))}
          </div>
          <button className="px-3 py-2 bg-white border border-slate-200 text-slate-600 text-[11px] rounded-xl hover:bg-slate-50 flex items-center justify-center gap-1.5 w-full sm:w-auto">
            <Download size={12} /> Ekspor PDF
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Avg Subsidence', value: '-2.34 cm/thn', sub: 'Seluruh sensor', color: '#0891B2' },
          { label: 'Sensor Kritis', value: '3', sub: '> -4.0 threshold', color: '#EF4444' },
          { label: 'Kuota Melebihi', value: String(alertCount), sub: 'Perusahaan', color: '#EF4444' },
          { label: 'Kuota Waspada', value: String(warnCount), sub: '≥ 85% terpakai', color: '#F59E0B' },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-100 shadow-sm px-4 py-3 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl" style={{ background: color }} />
            <p className="text-[9px] font-mono text-slate-400 tracking-wider uppercase mb-1">{label}</p>
            <p className="text-[20px] font-bold font-mono text-slate-800">{value}</p>
            <p className="text-[9px] font-mono mt-0.5" style={{ color }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Trend Chart */}
      <Card padding={false}>
        <SectionHeader title="Tren Subsidence per Tipe Sensor" icon={<TrendingDown size={13} />} subtitle="RATA-RATA cm/TAHUN" />
        <div className="p-4"><TrendLineChart /></div>
      </Card>

      {/* Bar Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card padding={false}>
          <SectionHeader title="Subsidence per Perusahaan" icon={<BarChart3 size={13} />} subtitle="|SUBSIDENCE| cm/thn" />
          <div className="p-4"><BarCompanyChart /></div>
          <div className="px-4 pb-3 flex gap-3">
            {[['#EF4444','Kritis (>3.0)'],['#F59E0B','Waspada (2-3)'],['#22C55E','Normal (<2)']].map(([c,l]) => (
              <div key={l} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: c }} />
                <span className="text-[9px] font-mono text-slate-400">{l}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card padding={false}>
          <SectionHeader title="Penggunaan Kuota Air Tanah" icon={<BarChart3 size={13} />} subtitle="RIBU m³" />
          <div className="p-4"><QuotaBarChart /></div>
        </Card>
      </div>

      {/* Company table */}
      <Card padding={false}>
        <SectionHeader title="Ringkasan per Perusahaan" />
        <div className="overflow-x-auto">
          <table className="w-full" style={{ minWidth: '500px' }}>
            <thead className="bg-slate-50/60 border-b border-slate-100">
              <tr>
                {['Perusahaan','Wilayah','Avg Subsidence','Kuota Terpakai','Sensor','Status'].map(h => (
                  <th key={h} className="text-[9px] font-mono text-slate-400 uppercase tracking-wider px-4 py-2.5 text-left whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {MOCK_COMPANIES.map(c => {
                const pct = Math.round((c.quotaUsed / c.quota) * 100);
                const pctColor = pct >= 100 ? '#EF4444' : pct >= 85 ? '#F59E0B' : '#22C55E';
                return (
                  <tr key={c.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-4 py-2.5 text-[12px] font-semibold text-slate-800">{c.name}</td>
                    <td className="px-4 py-2.5 text-[11px] text-slate-500">{c.region}</td>
                    <td className="px-4 py-2.5">
                      <span className={cn('text-[12px] font-semibold font-mono', getSubsidenceColor(c.avgSubsidence))}>{c.avgSubsidence.toFixed(2)} cm/thn</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${Math.min(pct,100)}%`, background: pctColor }} />
                        </div>
                        <span className="text-[10px] font-mono font-semibold" style={{ color: pctColor }}>{pct}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-[11px] font-mono text-slate-700">{c.sensorCount}</td>
                    <td className="px-4 py-2.5">
                      <span className={cn('text-[10px] font-mono px-2 py-0.5 rounded-full border',
                        c.status === 'online' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
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
    </div>
  );
}
