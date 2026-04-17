import { useRef, useEffect } from 'react';
import { TrendingDown } from 'lucide-react';
import {
  Chart as ChartJS, LineElement, PointElement,
  LinearScale, CategoryScale, Filler, Tooltip, Legend,
} from 'chart.js';
import { SectionHeader } from '../../../components/ui';
import { TREND_DATA } from '../../../constants/mockData';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip, Legend);

export default function KadisTrendSection() {
  const ref   = useRef<HTMLCanvasElement>(null);
  const chart = useRef<ChartJS | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    chart.current?.destroy();
    chart.current = new ChartJS(ref.current, {
      type: 'line',
      data: {
        labels: TREND_DATA.map(d => d.label),
        datasets: [
          {
            label: 'Subsidence Avg',
            data: TREND_DATA.map(d => d.subsidence),
            borderColor: '#059669',
            backgroundColor: 'rgba(5,150,105,0.08)',
            fill: true,
            tension: 0.4,
            pointRadius: 3,
            borderWidth: 2,
          },
          {
            label: 'Threshold',
            data: TREND_DATA.map(d => d.threshold),
            borderColor: 'rgba(239,68,68,0.45)',
            borderDash: [5, 4],
            pointRadius: 0,
            borderWidth: 1.5,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { position: 'top', labels: { boxWidth: 10, font: { size: 10, family: "'IBM Plex Mono'" }, color: '#64748B' } },
          tooltip: { backgroundColor: '#fff', borderColor: '#E2E8F0', borderWidth: 1, bodyColor: '#0F172A', titleColor: '#475569', bodyFont: { size: 10, family: "'IBM Plex Mono'" }, titleFont: { size: 10, family: "'IBM Plex Mono'" } },
        },
        scales: {
          x: { ticks: { color: '#94A3B8', font: { size: 9, family: "'IBM Plex Mono'" } }, grid: { color: '#F1F5F9' }, border: { display: false } },
          y: { min: -5, max: -1, ticks: { color: '#94A3B8', font: { size: 9, family: "'IBM Plex Mono'" }, callback: (v) => `${Number(v).toFixed(1)}` }, grid: { color: '#F1F5F9' }, border: { display: false } },
        },
      },
    });
    return () => chart.current?.destroy();
  }, []);

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
      <SectionHeader
        title="Tren Subsidence Provinsi"
        icon={<TrendingDown size={13} />}
        accent="#059669"
        subtitle="12 BULAN TERAKHIR"
      />
      <div className="p-4 flex-1">
        <div style={{ position: 'relative', height: 180 }}>
          <canvas ref={ref} />
        </div>
      </div>
    </div>
  );
}
