import { useRef, useEffect, useMemo } from "react";
import { TrendingDown } from "lucide-react";
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
import { SectionHeader } from "../../../components/ui";
import { useSensors } from "@/hooks/useSensors";
import { useAuthStore } from "@/store";

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

export default function AdminTrendSection() {
  const ref = useRef<HTMLCanvasElement>(null);
  const chart = useRef<ChartJS | null>(null);
  const { user } = useAuthStore();
  const companyId = user?.companyId ?? "";

  // Fetch wells for this company
  const { data: sensorsResponse = { data: [] }, isLoading } = useSensors({
    companyId: companyId || undefined,
  });
  const sensors = sensorsResponse.data ?? [];

  // Calculate water level statistics
  const waterLevelStats = useMemo(() => {
    const wellsWithLevel = sensors.filter((s) => s.staticWaterLevel !== null);
    if (wellsWithLevel.length === 0) {
      return {
        avg: null,
        min: null,
        max: null,
        count: 0,
      };
    }

    const levels = wellsWithLevel.map((s) => s.staticWaterLevel as number);
    return {
      avg: levels.reduce((a, b) => a + b, 0) / levels.length,
      min: Math.min(...levels),
      max: Math.max(...levels),
      count: wellsWithLevel.length,
    };
  }, [sensors]);

  // Create simple data: show distribution of water levels by well
  const chartData = useMemo(() => {
    const wellsWithLevel = sensors
      .filter((s) => s.staticWaterLevel !== null)
      .sort((a, b) => (a.staticWaterLevel ?? 0) - (b.staticWaterLevel ?? 0));

    return {
      labels: wellsWithLevel.map((s) => s.code),
      datasets: [
        {
          label: "Muka Air Tanah (m)",
          data: wellsWithLevel.map((s) => s.staticWaterLevel),
          borderColor: "#3B82F6",
          backgroundColor: "rgba(59,130,246,0.08)",
          fill: true,
          tension: 0.3,
          pointRadius: 4,
          borderWidth: 2,
          pointBackgroundColor: "#3B82F6",
          pointBorderColor: "#fff",
          pointBorderWidth: 1.5,
        },
      ],
    };
  }, [sensors]);

  useEffect(() => {
    if (!ref.current) return;
    chart.current?.destroy();
    chart.current = new ChartJS(ref.current, {
      type: "line",
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: {
            position: "top",
            labels: {
              boxWidth: 10,
              font: { size: 10, family: "'IBM Plex Mono'" },
              color: "#64748B",
            },
          },
          tooltip: {
            backgroundColor: "#fff",
            borderColor: "#E2E8F0",
            borderWidth: 1,
            bodyColor: "#0F172A",
            titleColor: "#475569",
            bodyFont: { size: 10, family: "'IBM Plex Mono'" },
            titleFont: { size: 10, family: "'IBM Plex Mono'" },
            callbacks: {
              label: (context) =>
                `Muka Air: ${(context.parsed.y as number).toFixed(2)} m`,
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: "#94A3B8",
              font: { size: 8, family: "'IBM Plex Mono'" },
            },
            grid: { color: "#F1F5F9" },
            border: { display: false },
          },
          y: {
            ticks: {
              color: "#3B82F6",
              font: { size: 9, family: "'IBM Plex Mono'" },
              callback: (v) => `${Number(v).toFixed(1)} m`,
            },
            grid: { color: "#F1F5F9" },
            border: { display: false },
          },
        },
      },
    });
    return () => chart.current?.destroy();
  }, [chartData]);

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col min-w-0">
      <SectionHeader
        title="Distribusi Muka Air Tanah"
        icon={<TrendingDown size={13} />}
        subtitle={`${waterLevelStats.count} sumur terukur`}
        accent="#3B82F6"
      />
      <div className="px-4 pt-3 pb-2">
        <div style={{ position: "relative", height: 200 }}>
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-[11px] text-slate-400 font-mono">
              Memuat data...
            </div>
          ) : waterLevelStats.count === 0 ? (
            <div className="flex items-center justify-center h-full text-[11px] text-slate-400 font-mono">
              Belum ada data muka air tanah
            </div>
          ) : (
            <canvas ref={ref} />
          )}
        </div>
      </div>
      {/* Summary row */}
      {waterLevelStats.count > 0 && (
        <div className="grid grid-cols-3 divide-x divide-slate-100 border-t border-slate-100 flex-shrink-0">
          {[
            {
              label: "Rata-rata",
              value: `${(waterLevelStats.avg ?? 0).toFixed(2)}`,
              unit: "m",
              color: "#3B82F6",
            },
            {
              label: "Terdalim",
              value: `${(waterLevelStats.min ?? 0).toFixed(2)}`,
              unit: "m",
              color: "#0EA5E9",
            },
            {
              label: "Tersekitar",
              value: `${(waterLevelStats.max ?? 0).toFixed(2)}`,
              unit: "m",
              color: "#06B6D4",
            },
          ].map(({ label, value, unit, color }) => (
            <div key={label} className="px-3 py-3 text-center">
              <p
                className="text-[17px] font-semibold font-mono truncate"
                style={{ color }}
              >
                {value}
              </p>
              <p className="text-[8px] font-mono text-slate-400 mt-0.5">
                {unit}
              </p>
              <p className="text-[9px] font-mono text-slate-400 mt-0.5 truncate">
                {label}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
