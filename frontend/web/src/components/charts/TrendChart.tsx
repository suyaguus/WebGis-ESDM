import { useRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  LineController,
  LineElement, PointElement, LinearScale, CategoryScale,
  Filler, Tooltip, Legend,
} from 'chart.js';
import type { TrendDataPoint } from '../../../../web/src/types';

ChartJS.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip, Legend);

interface TrendChartProps {
  data: TrendDataPoint[];
  height?: number;
}

export default function TrendChart({ data, height = 160 }: TrendChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef  = useRef<ChartJS | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Destroy existing chart properly
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    chartRef.current = new ChartJS(canvasRef.current, {
      type: 'line',
      data: {
        labels: data.map((d) => d.label),
        datasets: [
          {
            label: 'Rata-rata Subsidence (cm/thn)',
            data: data.map((d) => d.subsidence),
            borderColor: '#0891B2',
            borderWidth: 2,
            backgroundColor: 'rgba(8,145,178,0.08)',
            fill: true,
            tension: 0.4,
            pointRadius: 3,
            pointBackgroundColor: '#0891B2',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 1.5,
          },
          {
            label: 'Threshold Kritis (-4.0)',
            data: data.map((d) => d.threshold),
            borderColor: 'rgba(239,68,68,0.4)',
            borderWidth: 1.5,
            borderDash: [5, 4],
            pointRadius: 0,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#fff',
            borderColor: '#E2E8F0',
            borderWidth: 1,
            titleColor: '#475569',
            bodyColor: '#0F172A',
            titleFont: { size: 10, family: "'IBM Plex Mono'" },
            bodyFont:  { size: 11, family: "'IBM Plex Mono'", weight: 500 },
            padding: 10,
            callbacks: {
              label: (ctx) => {
                const y = ctx.parsed.y ?? 0;
                return `${ctx.dataset.label}: ${y.toFixed(2)} cm/thn`;
              },
            },
          },
        },
        scales: {
          x: {
            ticks: { color: '#94A3B8', font: { size: 9, family: "'IBM Plex Mono'" } },
            grid:  { color: '#F1F5F9' },
            border: { display: false },
          },
          y: {
            ticks: {
              color: '#94A3B8',
              font: { size: 9, family: "'IBM Plex Mono'" },
              callback: (v) => `${Number(v).toFixed(1)}`,
            },
            grid:  { color: '#F1F5F9' },
            border: { display: false },
            min: -5,
            max: -1,
          },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [data]);

  return (
    <div style={{ position: 'relative', width: '100%', height }}>
      <canvas ref={canvasRef} role="img" aria-label="Grafik tren subsidence tanah" />
    </div>
  );
}
