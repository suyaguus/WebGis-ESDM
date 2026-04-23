import { useRef, useEffect } from 'react';
import { TrendingDown } from 'lucide-react';
import {
  Chart as ChartJS, LineController, LineElement, PointElement, LinearScale,
  CategoryScale, Filler, Tooltip, Legend,
} from 'chart.js';
import { SectionHeader } from '../../../components/ui';
import { COMPANY_TREND_DATA } from '../../../constants/mockData';

ChartJS.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip, Legend);

export default function AdminTrendSection() {
  const ref   = useRef<HTMLCanvasElement>(null);
  const chart = useRef<ChartJS | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    chart.current?.destroy();
    chart.current = new ChartJS(ref.current, {
      type: 'line',
      data: {
        labels: COMPANY_TREND_DATA.map(d => d.label),
        datasets: [
          {
            label: 'Subsidence (cm/thn)',
            data: COMPANY_TREND_DATA.map(d => d.subsidence),
            borderColor: '#F59E0B', backgroundColor: 'rgba(245,158,11,0.08)',
            fill: true, tension: 0.4, pointRadius: 3, borderWidth: 2,
            pointBackgroundColor: '#F59E0B', pointBorderColor: '#fff', pointBorderWidth: 1.5,
            yAxisID: 'y',
          },
          {
            label: 'Muka Air (m)',
            data: COMPANY_TREND_DATA.map(d => d.waterLevel),
            borderColor: '#3B82F6', backgroundColor: 'rgba(59,130,246,0.06)',
            fill: true, tension: 0.4, pointRadius: 3, borderWidth: 2,
            pointBackgroundColor: '#3B82F6', pointBorderColor: '#fff', pointBorderWidth: 1.5,
            yAxisID: 'y1',
          },
          {
            label: 'Threshold (-4.0)',
            data: COMPANY_TREND_DATA.map(d => d.threshold),
            borderColor: 'rgba(239,68,68,0.4)', borderDash: [5, 4],
            pointRadius: 0, borderWidth: 1.5, fill: false, yAxisID: 'y',
          },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            position: 'top',
            labels: { boxWidth: 10, font: { size: 10, family: "'IBM Plex Mono'" }, color: '#64748B' },
          },
          tooltip: {
            backgroundColor: '#fff', borderColor: '#E2E8F0', borderWidth: 1,
            bodyColor: '#0F172A', titleColor: '#475569',
            bodyFont: { size: 10, family: "'IBM Plex Mono'" },
            titleFont: { size: 10, family: "'IBM Plex Mono'" },
          },
        },
        scales: {
          x: { ticks: { color: '#94A3B8', font: { size: 9, family: "'IBM Plex Mono'" } }, grid: { color: '#F1F5F9' }, border: { display: false } },
          y: {
            position: 'left', min: -5, max: -1,
            ticks: { color: '#F59E0B', font: { size: 9, family: "'IBM Plex Mono'" }, callback: (v) => `${Number(v).toFixed(1)}` },
            grid: { color: '#F1F5F9' }, border: { display: false },
          },
          y1: {
            position: 'right', min: -42, max: -18,
            ticks: { color: '#3B82F6', font: { size: 9, family: "'IBM Plex Mono'" }, callback: (v) => `${Number(v).toFixed(0)} m` },
            grid: { drawOnChartArea: false }, border: { display: false },
          },
        },
      },
    });
    return () => chart.current?.destroy();
  }, []);

  const latest = COMPANY_TREND_DATA[COMPANY_TREND_DATA.length - 1];

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col min-w-0">
      <SectionHeader title="Tren 12 Bulan — Subsidence & Muka Air" icon={<TrendingDown size={13} />} accent="#F59E0B" />
      <div className="px-4 pt-3 pb-2">
        <div style={{ position: 'relative', height: 180 }}>
          <canvas ref={ref} />
        </div>
      </div>
      {/* Summary row */}
      <div className="grid grid-cols-3 divide-x divide-slate-100 border-t border-slate-100 flex-shrink-0">
        {[
          { label: 'Subsidence Mar', value: `${latest.subsidence.toFixed(2)}`, unit: 'cm/thn', color: '#F59E0B' },
          { label: 'Muka Air Mar',   value: `${latest.waterLevel.toFixed(1)}`, unit: 'm',      color: '#3B82F6' },
          { label: 'Threshold',      value: '-4.00',                           unit: 'kritis',  color: '#EF4444' },
        ].map(({ label, value, unit, color }) => (
          <div key={label} className="px-3 py-3 text-center">
            <p className="text-[17px] font-semibold font-mono truncate" style={{ color }}>{value}</p>
            <p className="text-[8px] font-mono text-slate-400 mt-0.5">{unit}</p>
            <p className="text-[9px] font-mono text-slate-400 mt-0.5 truncate">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
