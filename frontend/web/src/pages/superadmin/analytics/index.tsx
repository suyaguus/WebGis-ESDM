import { useState, useRef, useEffect, useMemo } from "react";
import {
  BarChart3,
  Download,
  TrendingDown,
  Building2,
  X,
  ChevronRight,
} from "lucide-react";
import {
  Chart as ChartJS,
  LineController,
  LineElement,
  BarController,
  BarElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Card, SectionHeader } from "../../../components/ui";
import {
  useSensors,
  useCompanies,
  useVerificationReports,
} from "../../../hooks";
import { cn } from "../../../lib/utils";
import type { Sensor, Company } from "../../../types";
import type { VerificationReport } from "../../../services/verification.service";

ChartJS.register(
  LineController,
  LineElement,
  BarController,
  BarElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  Legend,
);

const PERIODS = ["6 Bulan", "12 Bulan"] as const;

/** Generate last N months in ascending order (oldest → current) */
function buildMonthList(n: number) {
  const now = new Date();
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (n - 1 - i), 1);
    return {
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      label: d.toLocaleDateString("id-ID", { month: "short", year: "numeric" }),
    };
  });
}

function monthKey(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

const CHART_COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
  "#F97316",
  "#6366F1",
  "#84CC16",
];

/* ─────────────────────────────────────────────
   Monthly Trend Chart
   ──────────────────────────────────────────── */
function MonthlyTrendChart({
  wells,
  companies,
  months,
}: {
  wells: Sensor[];
  companies: Company[];
  months: { key: string; label: string }[];
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const chart = useRef<ChartJS | null>(null);

  const currentMonthKey = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  }, []);

  // Per-company avg staticWaterLevel — same logic as Ringkasan per Perusahaan table
  const companyDatasets = useMemo(() => {
    return companies
      .map((c, idx) => {
        const cWells = wells.filter(
          (w) => w.companyId === c.id && w.staticWaterLevel !== null,
        );
        const avg =
          cWells.length > 0
            ? cWells.reduce((s, w) => s + (w.staticWaterLevel ?? 0), 0) /
              cWells.length
            : null;
        const color = CHART_COLORS[idx % CHART_COLORS.length];
        return {
          company: c,
          avg,
          count: cWells.length,
          color,
          data: months.map(({ key }) => (key === currentMonthKey ? avg : null)),
        };
      })
      .filter((d) => d.avg !== null);
  }, [companies, wells, months, currentMonthKey]);

  useEffect(() => {
    if (!ref.current) return;
    chart.current?.destroy();

    chart.current = new ChartJS(ref.current, {
      type: "line",
      data: {
        labels: months.map((m) => m.label),
        datasets: companyDatasets.map((d) => ({
          label: d.company.name,
          data: d.data,
          borderColor: d.color,
          backgroundColor: `${d.color}15`,
          fill: false,
          tension: 0.4,
          pointRadius: months.map(({ key }) =>
            key === currentMonthKey ? 6 : 0,
          ),
          pointBackgroundColor: d.color,
          pointBorderColor: "white",
          pointBorderWidth: 2,
          borderWidth: 2,
          spanGaps: false,
          borderDash: [],
        })),
      },
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
              label: (ctx) => {
                const d = companyDatasets[ctx.datasetIndex];
                if (ctx.parsed.y === null || !d) return " Tidak ada data";
                return ` ${d.company.name}: ${Number(ctx.parsed.y).toFixed(2)} m (${d.count} sumur)`;
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
            min: 0,
            max: 10,
            ticks: {
              color: "#94A3B8",
              font: { size: 9, family: "'IBM Plex Mono'" },
              callback: (v) => `${Number(v).toFixed(1)} m`,
              stepSize: 1,
            },
            grid: { color: "#F1F5F9" },
            border: { display: false },
          },
        },
      },
    });

    return () => chart.current?.destroy();
  }, [companyDatasets, months, currentMonthKey]);

  return (
    <div style={{ position: "relative", height: 220 }}>
      <canvas ref={ref} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Company Detail Modal
   ──────────────────────────────────────────── */
function CompanyDetailModal({
  company,
  wells,
  onClose,
}: {
  company: Company;
  wells: Sensor[];
  onClose: () => void;
}) {
  const companyWells = wells.filter((w) => w.companyId === company.id);
  const businesses = company.businesses ?? [];

  return (
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-2xl overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <div>
            <p className="text-[15px] font-bold font-mono text-slate-800">
              {company.name}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {businesses.length} unit bisnis · {companyWells.length} sumur
              terverifikasi
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
          >
            <X size={14} className="text-slate-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {businesses.length === 0 ? (
            <p className="text-[11px] text-slate-400 font-mono text-center py-8">
              Belum ada unit bisnis terdaftar
            </p>
          ) : (
            businesses.map((biz) => {
              const bizWells = companyWells.filter(
                (w) => w.businessId === biz.id,
              );
              return (
                <div
                  key={biz.id}
                  className="rounded-xl border border-slate-100 overflow-hidden"
                >
                  <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Building2 size={12} className="text-slate-400" />
                      <span className="text-[12px] font-semibold text-slate-700">
                        {biz.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      {bizWells.length} sumur
                    </span>
                  </div>
                  {bizWells.length === 0 ? (
                    <p className="px-4 py-3 text-[10px] text-slate-400 font-mono">
                      Belum ada sumur terverifikasi
                    </p>
                  ) : (
                    <div className="divide-y divide-slate-50">
                      {bizWells.map((well) => (
                        <div
                          key={well.id}
                          className="px-4 py-2.5 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={cn(
                                "w-1.5 h-1.5 rounded-full flex-shrink-0",
                                well.isActive
                                  ? "bg-emerald-400"
                                  : "bg-slate-300",
                              )}
                            />
                            <div>
                              <p className="text-[12px] font-semibold font-mono text-slate-800">
                                {well.code}
                              </p>
                              <p className="text-[10px] text-slate-400">
                                {well.wellType === "sumur_pantau"
                                  ? "Sumur Pantau"
                                  : well.wellType === "sumur_gali"
                                    ? "Sumur Gali"
                                    : "Sumur Bor"}
                                {!well.isActive && (
                                  <span className="ml-1.5 text-slate-300">
                                    · Non-aktif
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[11px] font-mono font-semibold text-blue-700">
                              {well.staticWaterLevel !== null
                                ? `${well.staticWaterLevel.toFixed(2)} m`
                                : "-"}
                            </p>
                            <p className="text-[9px] text-slate-400">
                              muka air tanah
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}

          {(() => {
            const orphans = companyWells.filter((w) => !w.businessId);
            if (orphans.length === 0) return null;
            return (
              <div className="rounded-xl border border-slate-100 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-100">
                  <span className="text-[12px] font-semibold text-slate-500">
                    Tanpa Unit Bisnis
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {orphans.length} sumur
                  </span>
                </div>
                <div className="divide-y divide-slate-50">
                  {orphans.map((well) => (
                    <div
                      key={well.id}
                      className="px-4 py-2.5 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            "w-1.5 h-1.5 rounded-full flex-shrink-0",
                            well.isActive ? "bg-emerald-400" : "bg-slate-300",
                          )}
                        />
                        <div>
                          <p className="text-[12px] font-semibold font-mono text-slate-800">
                            {well.code}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {well.wellType === "sumur_pantau"
                              ? "Sumur Pantau"
                              : well.wellType === "sumur_gali"
                                ? "Sumur Gali"
                                : "Sumur Bor"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] font-mono font-semibold text-blue-700">
                          {well.staticWaterLevel !== null
                            ? `${well.staticWaterLevel.toFixed(2)} m`
                            : "-"}
                        </p>
                        <p className="text-[9px] text-slate-400">
                          muka air tanah
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Page
   ──────────────────────────────────────────── */
export default function AnalyticsPage() {
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>("12 Bulan");
  const [detailCompany, setDetailCompany] = useState<Company | null>(null);

  const { data: wellsResponse } = useSensors(
    { wellStatus: "approved" },
    { page: 1, limit: 200 },
  );
  const wells: Sensor[] = wellsResponse?.data ?? [];

  const { data: companiesResponse } = useCompanies({ limit: 100 });
  const companies: Company[] = companiesResponse?.data ?? [];

  const { data: allReports = [] } = useVerificationReports();

  const monthCount = period === "6 Bulan" ? 6 : 12;
  const months = useMemo(() => buildMonthList(monthCount), [monthCount]);

  const approvedReports = useMemo(
    () => allReports.filter((r) => r.status === "APPROVED"),
    [allReports],
  );

  /* KPI calculations */
  const totalWells = wells.length;
  const activeWells = wells.filter((w) => w.isActive).length;

  const periodStart = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - monthCount + 1);
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [monthCount]);

  const reportsInPeriod = useMemo(
    () => approvedReports.filter((r) => new Date(r.createdAt) >= periodStart),
    [approvedReports, periodStart],
  );

  const wellsWithLevel = useMemo(
    () => wells.filter((w) => w.staticWaterLevel !== null),
    [wells],
  );

  const avgDepthInPeriod = useMemo(() => {
    if (reportsInPeriod.length > 0)
      return (
        reportsInPeriod.reduce((s, r) => s + r.waterDepth, 0) /
        reportsInPeriod.length
      );
    if (wellsWithLevel.length > 0)
      return (
        wellsWithLevel.reduce((s, w) => s + (w.staticWaterLevel ?? 0), 0) /
        wellsWithLevel.length
      );
    return null;
  }, [reportsInPeriod, wellsWithLevel]);

  // Detect trend direction — prefer well data, fallback to approved reports
  const trendDirection = useMemo(() => {
    // Try wells first: monthly buckets by lastWaterLevelMeasurement
    const wellMonthlyAvgs = [...months]
      .reverse()
      .map(({ key }) => {
        const bucket = wells.filter(
          (w) =>
            w.staticWaterLevel !== null &&
            w.lastWaterLevelMeasurement != null &&
            monthKey(w.lastWaterLevelMeasurement) === key,
        );
        if (bucket.length === 0) return null;
        return (
          bucket.reduce((s, w) => s + (w.staticWaterLevel ?? 0), 0) /
          bucket.length
        );
      })
      .filter((v): v is number => v !== null);

    if (wellMonthlyAvgs.length >= 2) {
      return wellMonthlyAvgs[0] > wellMonthlyAvgs[1]
        ? "declining"
        : wellMonthlyAvgs[0] < wellMonthlyAvgs[1]
          ? "improving"
          : "stable";
    }

    // Fallback: approved reports
    const reportMonthlyAvgs = [...months]
      .reverse()
      .map(({ key }) => {
        const bucket = approvedReports.filter(
          (r) => monthKey(r.createdAt) === key,
        );
        if (bucket.length === 0) return null;
        return bucket.reduce((s, r) => s + r.waterDepth, 0) / bucket.length;
      })
      .filter((v): v is number => v !== null);

    if (reportMonthlyAvgs.length >= 2) {
      return reportMonthlyAvgs[0] > reportMonthlyAvgs[1]
        ? "declining"
        : reportMonthlyAvgs[0] < reportMonthlyAvgs[1]
          ? "improving"
          : "stable";
    }

    // Fallback: dominant waterLevelTrend field from wells
    const trends = wells.map((w) => w.waterLevelTrend).filter(Boolean);
    const falling = trends.filter((t) => t === "falling").length;
    const rising = trends.filter((t) => t === "rising").length;
    if (falling > rising) return "declining";
    if (rising > falling) return "improving";
    return "stable";
  }, [approvedReports, wells, months]);

  const printDate = new Date().toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const handlePrint = () => {
    const page1El = document.getElementById("print-page-1");
    const page2El = document.getElementById("print-page-2");
    if (!page1El || !page2El) return;

    const clone1 = page1El.cloneNode(true) as HTMLElement;
    const clone2 = page2El.cloneNode(true) as HTMLElement;

    const replaceCanvases = (source: HTMLElement, clone: HTMLElement) => {
      const srcCanvases = source.querySelectorAll("canvas");
      const cloneCanvases = clone.querySelectorAll("canvas");
      srcCanvases.forEach((srcCanvas, i) => {
        const img = document.createElement("img");
        img.src = (srcCanvas as HTMLCanvasElement).toDataURL("image/png");
        img.style.width = "100%";
        img.style.height = "auto";
        img.style.display = "block";
        cloneCanvases[i]?.parentNode?.replaceChild(img, cloneCanvases[i]);
      });
    };
    replaceCanvases(page1El, clone1);
    replaceCanvases(page2El, clone2);

    const styles = Array.from(document.styleSheets)
      .map((sheet) => {
        try {
          return Array.from(sheet.cssRules)
            .map((r) => r.cssText)
            .join("\n");
        } catch {
          return "";
        }
      })
      .join("\n");

    const win = window.open("", "_blank", "width=1200,height=800");
    if (!win) return;

    win.document.write(`<!DOCTYPE html>
<html><head>
  <meta charset="UTF-8"/>
  <title>Analytics Report — ${printDate}</title>
  <style>
    ${styles}
    @page { size: A4 landscape; margin: 12mm 14mm; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-sizing: border-box; }
    body { background: white; margin: 0; padding: 0; }
    .print-sheet-1 { width:100%; height:186mm; overflow:hidden; page-break-after:always; break-after:page; }
    .print-sheet-2 { width:100%; page-break-after:auto; break-after:auto; }
    .overflow-x-auto { overflow:visible !important; }
    img { max-width:100% !important; display:block; }
  </style>
</head>
<body>
  <div class="print-sheet-1">${clone1.innerHTML}</div>
  <div class="print-sheet-2">${clone2.innerHTML}</div>
</body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => {
      win.print();
      win.close();
    }, 500);
  };

  return (
    <>
      <style>{`
        @media print {
          @page { size: A4 landscape; margin: 0; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div id="analytics-print-root" className="p-3 sm:p-5 space-y-4">
        {/* ── Halaman 1 ── */}
        <div id="print-page-1" className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[18px] font-semibold text-slate-800">
                Analytics
              </h1>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                Tren penurunan muka air tanah · rata-rata bulanan dari seluruh
                laporan pengukuran
              </p>
              <p className="hidden print:block text-[8pt] text-slate-400 font-mono mt-0.5">
                Dicetak pada: {printDate} · Periode: {period}
              </p>
            </div>
            <div className="flex items-center gap-2 no-print">
              <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
                {PERIODS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={cn(
                      "text-[10px] font-mono px-2.5 py-1 rounded-md transition-all",
                      period === p
                        ? "bg-white text-slate-800 shadow-sm"
                        : "text-slate-500 hover:text-slate-700",
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button
                onClick={handlePrint}
                className="px-3 py-2 bg-white border border-slate-200 text-slate-600 text-[11px] rounded-xl hover:bg-slate-50 flex items-center gap-1.5"
              >
                <Download size={12} /> Ekspor PDF
              </button>
            </div>
          </div>

          {/* KPI Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                label: "Sumur Terverifikasi",
                value: `${activeWells} / ${totalWells}`,
                sub: "Aktif / Total",
                color: "#0891B2",
              },
              {
                label: `Laporan (${period})`,
                value: String(reportsInPeriod.length),
                sub: "Laporan pengukuran disetujui",
                color: "#6366F1",
              },
              {
                label: "Avg Kedalaman Air",
                value:
                  avgDepthInPeriod !== null
                    ? `${avgDepthInPeriod.toFixed(2)} m`
                    : "-",
                sub: `Rata-rata ${period} terakhir`,
                color: "#3B82F6",
              },
              {
                label: "Tren Terkini",
                value:
                  trendDirection === "declining"
                    ? "Turun ↓"
                    : trendDirection === "improving"
                      ? "Naik ↑"
                      : "Stabil →",
                sub: "Perubahan 2 bulan terakhir",
                color:
                  trendDirection === "declining"
                    ? "#EF4444"
                    : trendDirection === "improving"
                      ? "#22C55E"
                      : "#F59E0B",
              },
            ].map(({ label, value, sub, color }) => (
              <div
                key={label}
                className="bg-white rounded-xl border border-slate-100 shadow-sm px-4 py-3 relative overflow-hidden"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl"
                  style={{ background: color }}
                />
                <p className="text-[9px] font-mono text-slate-400 tracking-wider uppercase mb-1">
                  {label}
                </p>
                <p className="text-[20px] font-bold font-mono text-slate-800">
                  {value}
                </p>
                <p className="text-[9px] font-mono mt-0.5" style={{ color }}>
                  {sub}
                </p>
              </div>
            ))}
          </div>

          {/* Monthly Trend Chart */}
          <Card padding={false} className="print-keep">
            <SectionHeader
              title="Tren Penurunan Muka Air Tanah"
              icon={<TrendingDown size={13} />}
              subtitle={`PROYEKSI ${period.toUpperCase()} KE DEPAN · ${wellsWithLevel.length} SUMUR`}
            />
            <div className="p-4">
              <MonthlyTrendChart
                wells={wells}
                companies={companies}
                months={months}
              />
              <p className="text-[9px] font-mono text-slate-400 text-center mt-2">
                Nilai lebih tinggi → muka air tanah lebih dalam (lebih kritis) ·
                Titik = rata-rata {wellsWithLevel.length} sumur bulan ini
              </p>
            </div>
          </Card>
        </div>
        {/* end print-page-1 */}

        {/* ── Halaman 2 (tabel) ── */}
        <div id="print-page-2">
          <Card padding={false} className="print-keep">
            <SectionHeader
              title="Ringkasan per Perusahaan"
              icon={<BarChart3 size={13} />}
              subtitle={`${companies.length} PERUSAHAAN`}
            />
            <div className="overflow-x-auto">
              <table className="w-full" style={{ minWidth: "600px" }}>
                <thead className="bg-slate-50/60 border-b border-slate-100">
                  <tr>
                    {[
                      "Perusahaan",
                      "Muka Air Tanah (avg)",
                      "Total Sumur",
                      "Sumur Aktif",
                      "",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-[9px] font-mono text-slate-400 uppercase tracking-wider px-4 py-2.5 text-left whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {companies.map((c) => {
                    const cWells = wells.filter((w) => w.companyId === c.id);
                    const totalCWells = cWells.length;
                    const activeCWells = cWells.filter(
                      (w) => w.isActive,
                    ).length;
                    const activePct =
                      totalCWells > 0
                        ? Math.round((activeCWells / totalCWells) * 100)
                        : 0;
                    const withLevel = cWells.filter(
                      (w) => w.staticWaterLevel !== null,
                    );
                    const avgLevel =
                      withLevel.length > 0
                        ? withLevel.reduce(
                            (s, w) => s + (w.staticWaterLevel ?? 0),
                            0,
                          ) / withLevel.length
                        : null;
                    const pctColor =
                      activePct >= 75
                        ? "#22C55E"
                        : activePct >= 50
                          ? "#F59E0B"
                          : "#EF4444";

                    return (
                      <tr
                        key={c.id}
                        className="hover:bg-slate-50/40 transition-colors"
                      >
                        <td className="px-4 py-2.5">
                          <p className="text-[12px] font-semibold text-slate-800">
                            {c.name}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono">
                            {(c.businesses ?? []).length} unit bisnis
                          </p>
                        </td>
                        <td className="px-4 py-2.5 text-[12px] font-mono font-semibold text-blue-700">
                          {avgLevel !== null ? `${avgLevel.toFixed(2)} m` : "-"}
                        </td>
                        <td className="px-4 py-2.5 text-[12px] font-mono text-slate-700">
                          {totalCWells}
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${activePct}%`,
                                  background: pctColor,
                                }}
                              />
                            </div>
                            <span
                              className="text-[11px] font-mono font-semibold"
                              style={{ color: pctColor }}
                            >
                              {activePct}%
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-2.5">
                          <button
                            onClick={() => setDetailCompany(c)}
                            className="no-print flex items-center gap-1 text-[10px] font-mono text-cyan-600 hover:text-cyan-800 font-medium transition-colors"
                          >
                            Detail <ChevronRight size={11} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {companies.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-8 text-center text-[10px] text-slate-400 font-mono"
                      >
                        Belum ada data perusahaan
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      {detailCompany && (
        <CompanyDetailModal
          company={detailCompany}
          wells={wells}
          onClose={() => setDetailCompany(null)}
        />
      )}
    </>
  );
}
