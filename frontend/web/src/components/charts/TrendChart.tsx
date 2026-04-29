import { useRef, useEffect } from "react";
import {
  Chart as ChartJS,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import type { TrendDataPoint } from "../../types";

ChartJS.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  Legend,
);

interface TrendChartProps {
  data: TrendDataPoint[];
  height?: number;
}

export default function TrendChart({ data, height = 160 }: TrendChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<ChartJS | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    chartRef.current?.destroy();
    chartRef.current = null;

    const existing = ChartJS.getChart(canvas);
    existing?.destroy();

    const chart = new ChartJS(canvas, {
      type: "line",
      data: {
        labels: data.map((d) => d.label),
        datasets: [
          {
            label: "Muka Air Tanah (cm)",
            data: data.map((d) => d.waterLevel * 100),
            borderColor: "#0891B2",
            borderWidth: 2,
            backgroundColor: "rgba(8,145,178,0.08)",
            fill: true,
            tension: 0.4,
            pointRadius: 3,
            pointBackgroundColor: "#0891B2",
            pointBorderColor: "#ffffff",
            pointBorderWidth: 1.5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#fff",
            borderColor: "#E2E8F0",
            borderWidth: 1,
            titleColor: "#475569",
            bodyColor: "#0F172A",
            titleFont: { size: 10, family: "'IBM Plex Mono'" },
            bodyFont: { size: 11, family: "'IBM Plex Mono'", weight: 500 },
            padding: 10,
            callbacks: {
              label: (ctx) => {
                const y = ctx.parsed.y ?? 0;
                return `${ctx.dataset.label}: ${y.toFixed(0)} cm`;
              },
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: "#94A3B8",
              font: { size: 9, family: "'IBM Plex Mono'" },
            },
            grid: { color: "#F1F5F9" },
            border: { display: false },
          },
          y: {
            ticks: {
              color: "#94A3B8",
              font: { size: 9, family: "'IBM Plex Mono'" },
              callback: (v) => `${Number(v).toFixed(1)}`,
            },
            grid: { color: "#F1F5F9" },
            border: { display: false },
            max: 0,
          },
        },
      },
    });

    chartRef.current = chart;

    return () => {
      chart.destroy();
      if (chartRef.current === chart) {
        chartRef.current = null;
      }
    };
  }, [data]);

  return (
    <div style={{ position: "relative", width: "100%", height }}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Grafik tren muka air tanah"
      />
    </div>
  );
}
