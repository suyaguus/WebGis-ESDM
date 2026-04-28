import { useState, useMemo } from "react";
import {
  FileText,
  Calendar,
  Download,
  Droplets,
  BarChart3,
  SendHorizonal,
  X,
  CheckCircle2,
} from "lucide-react";
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
import { Card, SectionHeader } from "../../../components/ui";
import { useCompanies, useSensors, useSendToKadis } from "../../../hooks";
import { cn } from "../../../lib/utils";
import type { Sensor } from "../../../types";

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

const WELL_TYPE_CONFIG = {
  sumur_pantau: { label: "Sumur Pantau", color: "rgba(59,130,246,0.75)", border: "#3B82F6" },
  sumur_gali:   { label: "Sumur Gali",   color: "rgba(16,185,129,0.75)", border: "#10B981" },
  sumur_bor:    { label: "Sumur Bor",    color: "rgba(245,158,11,0.75)", border: "#F59E0B" },
} as const;

const CHART_COLORS = [
  "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6",
  "#EC4899", "#14B8A6", "#F97316", "#6366F1", "#84CC16",
];

/** Render the same line chart as the analytics MonthlyTrendChart to an offscreen canvas */
function buildChartImage(wells: Sensor[]): string {
  // Identical month-list logic as analytics buildMonthList(12)
  const n = 12;
  const now = new Date();
  const months = Array.from({ length: n }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (n - 1 - i), 1);
    return {
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      label: d.toLocaleDateString("id-ID", { month: "short", year: "numeric" }),
    };
  });
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  // Group by company — identical to analytics companyDatasets
  const companyMap = new Map<string, { name: string; levels: number[] }>();
  wells.forEach((w) => {
    if (w.staticWaterLevel === null) return;
    if (!companyMap.has(w.companyId)) {
      companyMap.set(w.companyId, { name: w.companyName, levels: [] });
    }
    companyMap.get(w.companyId)!.levels.push(w.staticWaterLevel);
  });

  const entries = Array.from(companyMap.values());
  if (entries.length === 0) return "";

  const datasets = entries.map((e, idx) => {
    const avg = e.levels.reduce((s, v) => s + v, 0) / e.levels.length;
    const color = CHART_COLORS[idx % CHART_COLORS.length];
    return {
      label: e.name,
      data: months.map(({ key }) => (key === currentMonthKey ? avg : null)),
      borderColor: color,
      backgroundColor: color + "15",
      fill: false,
      tension: 0.4,
      pointRadius: months.map(({ key }) => (key === currentMonthKey ? 6 : 0)),
      pointBackgroundColor: color,
      pointBorderColor: "white",
      pointBorderWidth: 2,
      borderWidth: 2,
      spanGaps: false,
    };
  });

  const canvas = document.createElement("canvas");
  canvas.width = 900;
  canvas.height = 320;

  const instance = new ChartJS(canvas, {
    type: "line",
    data: {
      labels: months.map((m) => m.label),
      datasets,
    },
    options: {
      animation: false,
      responsive: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          position: "top",
          labels: { boxWidth: 10, font: { size: 10 }, color: "#64748B" },
        },
      },
      scales: {
        x: {
          ticks: { color: "#94A3B8", font: { size: 9 } },
          grid: { color: "#F1F5F9" },
          border: { display: false },
        },
        y: {
          min: 0,
          ticks: {
            color: "#94A3B8",
            font: { size: 9 },
            callback: (v) => `${Number(v).toFixed(1)} m`,
            stepSize: 1,
          },
          grid: { color: "#F1F5F9" },
          border: { display: false },
        },
      },
    },
  });

  const dataUrl = canvas.toDataURL("image/png");
  instance.destroy();
  canvas.remove();
  return dataUrl;
}

export default function ReportsPage() {
  const { data: companiesResponse } = useCompanies({ limit: 100 });
  const companies = companiesResponse?.data ?? [];

  const { data: wellsResponse } = useSensors(
    { wellStatus: "approved" },
    { page: 1, limit: 200 },
  );
  const allWells: Sensor[] = wellsResponse?.data ?? [];

  const sendToKadis = useSendToKadis();

  const [company, setCompany] = useState("all");
  const [inclGrafik, setInclGrafik] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [sendNotes, setSendNotes] = useState("");
  const [sent, setSent] = useState(false);

  const filteredWells = useMemo(
    () =>
      company === "all"
        ? allWells
        : allWells.filter((w) => w.companyId === company),
    [company, allWells],
  );

  const selectedCompanyName =
    company === "all"
      ? "Semua Perusahaan"
      : (companies.find((c) => c.id === company)?.name ?? "-");

  const avgWaterLevel = useMemo(() => {
    const withLevel = filteredWells.filter((w) => w.staticWaterLevel !== null);
    if (withLevel.length === 0) return null;
    return withLevel.reduce((s, w) => s + (w.staticWaterLevel ?? 0), 0) / withLevel.length;
  }, [filteredWells]);

  const printDate = new Date().toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  function buildPrintHtml(chartImg: string): string {
    const wellRows = filteredWells
      .map(
        (w) => `
      <tr>
        <td>${w.code}</td>
        <td>${w.companyName}</td>
        <td>${w.businessName ?? "-"}</td>
        <td>${
          w.wellType === "sumur_pantau"
            ? "Sumur Pantau"
            : w.wellType === "sumur_gali"
              ? "Sumur Gali"
              : "Sumur Bor"
        }</td>
        <td>${w.staticWaterLevel !== null ? w.staticWaterLevel.toFixed(2) + " m" : "-"}</td>
        <td>${
          w.waterLevelTrend === "rising"
            ? "Naik"
            : w.waterLevelTrend === "falling"
              ? "Turun"
              : w.waterLevelTrend === "stable"
                ? "Stabil"
                : "-"
        }</td>
        <td>${w.isActive ? "Aktif" : "Non-aktif"}</td>
      </tr>`,
      )
      .join("");

    const withLevel = filteredWells.filter((w) => w.staticWaterLevel !== null);
    const avgStr =
      withLevel.length > 0
        ? (withLevel.reduce((s, w) => s + (w.staticWaterLevel ?? 0), 0) / withLevel.length).toFixed(2) + " m"
        : "-";

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>Laporan Muka Air Tanah — ${printDate}</title>
  <style>
    @page { size: A4; margin: 15mm 18mm; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #1E293B; margin: 0; background: white; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0891B2; padding-bottom: 10px; margin-bottom: 18px; }
    .header-title { font-size: 18pt; font-weight: 700; color: #0891B2; margin: 0 0 4px; }
    .header-sub  { font-size: 9pt; color: #64748B; margin: 0; }
    .header-meta { text-align: right; font-size: 9pt; color: #475569; line-height: 1.6; }
    .meta-row { display: flex; gap: 24px; margin-bottom: 14px; }
    .meta-box { background: #F0F9FF; border: 1px solid #BAE6FD; border-radius: 8px; padding: 8px 14px; flex: 1; }
    .meta-box label { font-size: 7.5pt; color: #0369A1; font-weight: 600; text-transform: uppercase; letter-spacing: .04em; display: block; margin-bottom: 2px; }
    .meta-box span { font-size: 11pt; font-weight: 700; color: #1E293B; }
    .section-title { font-size: 11pt; font-weight: 700; color: #1E293B; margin: 18px 0 10px; border-left: 3px solid #0891B2; padding-left: 8px; }
    table { width: 100%; border-collapse: collapse; font-size: 8.5pt; margin-bottom: 16px; }
    th { background: #F0F9FF; color: #0369A1; font-weight: 600; text-transform: uppercase; letter-spacing: .04em; padding: 6px 10px; text-align: left; border-bottom: 1.5px solid #BAE6FD; }
    td { padding: 5px 10px; border-bottom: 1px solid #F1F5F9; color: #334155; }
    tr:nth-child(even) td { background: #F8FAFC; }
    .section-img { text-align: center; margin-bottom: 18px; }
    .section-img img { max-width: 100%; border: 1px solid #E2E8F0; border-radius: 8px; }
    .footer { margin-top: 24px; border-top: 1px solid #E2E8F0; padding-top: 8px; font-size: 8pt; color: #94A3B8; display: flex; justify-content: space-between; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <p class="header-title">SIGAT</p>
      <p class="header-sub">Laporan Muka Air Tanah — Sumur Terverifikasi</p>
    </div>
    <div class="header-meta">
      <div>Tanggal: ${printDate}</div>
      <div>Perusahaan: ${selectedCompanyName}</div>
      <div>Total Sumur: ${filteredWells.length}</div>
    </div>
  </div>
  <div class="meta-row">
    <div class="meta-box"><label>Rata-rata Muka Air</label><span>${avgStr}</span></div>
    <div class="meta-box"><label>Sumur Aktif</label><span>${filteredWells.filter((w) => w.isActive).length} / ${filteredWells.length}</span></div>
    <div class="meta-box"><label>Tren Turun</label><span>${filteredWells.filter((w) => w.waterLevelTrend === "falling").length} sumur</span></div>
    <div class="meta-box"><label>Tren Naik</label><span>${filteredWells.filter((w) => w.waterLevelTrend === "rising").length} sumur</span></div>
  </div>
  ${chartImg ? `<p class="section-title">Grafik Rata-rata Muka Air Tanah per Perusahaan</p><div class="section-img"><img src="${chartImg}" /></div>` : ""}
  <p class="section-title">Data Muka Air Tanah</p>
  <table>
    <thead>
      <tr>
        <th>Nama Sumur</th><th>Perusahaan</th><th>Unit Bisnis</th>
        <th>Tipe</th><th>Muka Air Tanah</th><th>Tren</th><th>Status</th>
      </tr>
    </thead>
    <tbody>${wellRows}</tbody>
  </table>
  <div class="footer">
    <span>Sistem Informasi Geologi dan Air Tanah (SIGAT)</span>
    <span>Dicetak: ${printDate}</span>
  </div>
</body>
</html>`;
  }

  function openPrintWindow(chartImg: string) {
    const html = buildPrintHtml(chartImg);
    const win = window.open("", "_blank", "width=1200,height=900");
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 600);
  }

  const handleGenerate = () => {
    setGenerating(true);
    setDone(false);
    setTimeout(() => {
      try {
        const chartImg = inclGrafik ? buildChartImage(filteredWells) : "";
        openPrintWindow(chartImg);
        setDone(true);
      } finally {
        setGenerating(false);
      }
    }, 100);
  };

  const handleSendToKadis = () => {
    const chartImg = inclGrafik ? buildChartImage(filteredWells) : "";
    const pdfContent = buildPrintHtml(chartImg);

    sendToKadis.mutate(
      {
        title: `Laporan Muka Air Tanah — ${selectedCompanyName}`,
        companyId: company === "all" ? null : company,
        companyName: selectedCompanyName,
        totalWells: filteredWells.length,
        avgWaterLevel,
        notes: sendNotes.trim() || null,
        pdfContent,
      },
      {
        onSuccess: () => {
          setShowSendDialog(false);
          setSendNotes("");
          setSent(true);
        },
      },
    );
  };

  return (
    <>
    <div className="p-3 sm:p-5 space-y-4">
      <div>
        <h1 className="text-[18px] font-semibold text-slate-800">Laporan</h1>
        <p className="text-[11px] text-slate-400 font-mono mt-0.5">
          Generate laporan muka air tanah sumur terverifikasi
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
        <div className="space-y-4">
          {/* Report type — only Laporan Muka Air */}
          <Card padding={false}>
            <SectionHeader
              title="Jenis Laporan"
              icon={<FileText size={13} />}
            />
            <div className="p-4">
              <div className="flex items-start gap-3 p-4 rounded-xl border border-cyan-300 ring-1 ring-cyan-200 bg-cyan-50/30">
                <Droplets size={22} className="text-cyan-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[12px] font-semibold text-slate-800">
                    Laporan Muka Air Tanah
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5 leading-relaxed">
                    Data kedalaman muka air tanah seluruh sumur yang telah
                    terverifikasi, dilengkapi tren perubahan dan status
                    operasional.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Parameters */}
          <Card>
            <h3 className="text-[13px] font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Calendar size={13} className="text-cyan-600" /> Parameter Laporan
            </h3>

            <div className="space-y-4">
              {/* Company selector */}
              <div>
                <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                  Perusahaan
                </label>
                <select
                  value={company}
                  onChange={(e) => { setCompany(e.target.value); setDone(false); }}
                  className="w-full text-[11px] font-mono border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-slate-700 focus:outline-none focus:border-cyan-400"
                >
                  <option value="all">Semua Perusahaan</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Format — PDF only */}
              <div>
                <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                  Format Output
                </label>
                <div className="inline-flex">
                  <div className="px-6 py-2 text-[11px] font-mono font-semibold rounded-lg border bg-cyan-600 text-white border-cyan-600">
                    PDF
                  </div>
                </div>
              </div>

              {/* Opsi tambahan */}
              <div>
                <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
                  Opsi Tambahan
                </label>
                <div className="space-y-2.5">
                  <label className="flex items-start gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={inclGrafik}
                      onChange={(e) => { setInclGrafik(e.target.checked); setDone(false); }}
                      className="w-3.5 h-3.5 mt-0.5 accent-cyan-600 flex-shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <BarChart3 size={11} className="text-slate-400" />
                        <span className="text-[11px] text-slate-700 font-medium">
                          Sertakan Grafik
                        </span>
                      </div>
                      <p className="text-[9px] text-slate-400 font-mono mt-0.5">
                        Grafik rata-rata muka air tanah per perusahaan
                      </p>
                    </div>
                  </label>

                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 space-y-2.5">
              <button
                onClick={handleGenerate}
                disabled={generating || filteredWells.length === 0}
                className={cn(
                  "w-full py-2.5 text-[12px] font-semibold rounded-xl transition-all flex items-center justify-center gap-2",
                  !generating && filteredWells.length > 0
                    ? "bg-cyan-600 text-white hover:bg-cyan-700"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed",
                )}
              >
                {generating ? (
                  "⏳ Membuat laporan..."
                ) : done ? (
                  <>
                    <Download size={13} /> ✅ Laporan siap — Klik untuk generate ulang
                  </>
                ) : (
                  <>
                    <Download size={13} /> Generate Laporan PDF
                  </>
                )}
              </button>

              {done && !sent && (
                <button
                  onClick={() => setShowSendDialog(true)}
                  className="w-full py-2.5 text-[12px] font-semibold rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-all flex items-center justify-center gap-2"
                >
                  <SendHorizonal size={13} /> Kirim ke Kadis
                </button>
              )}

              {sent && (
                <div className="flex items-center gap-2 justify-center py-2 rounded-xl bg-emerald-50 border border-emerald-200">
                  <CheckCircle2 size={13} className="text-emerald-600" />
                  <span className="text-[11px] font-semibold text-emerald-700">
                    Laporan telah dikirim ke Kepala Dinas
                  </span>
                </div>
              )}

              {filteredWells.length === 0 && !generating && (
                <p className="text-[10px] text-slate-400 font-mono text-center">
                  Tidak ada data sumur terverifikasi untuk perusahaan ini
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* Preview panel */}
        <Card padding={false} className="flex flex-col">
          <SectionHeader
            title="Pratinjau Data"
            icon={<Droplets size={13} />}
            subtitle={`${filteredWells.length} sumur`}
          />
          <div className="flex-1 divide-y divide-slate-50 overflow-y-auto max-h-[500px]">
            {filteredWells.length === 0 ? (
              <div className="px-4 py-8 text-center text-[10px] text-slate-400 font-mono">
                Belum ada sumur terverifikasi
              </div>
            ) : (
              filteredWells.map((w) => (
                <div
                  key={w.id}
                  className="px-4 py-3 hover:bg-slate-50/60 transition-colors"
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-[11px] font-semibold font-mono text-slate-800">
                      {w.code}
                    </p>
                    <span
                      className="text-[9px] font-mono font-semibold"
                      style={{
                        color:
                          WELL_TYPE_CONFIG[w.wellType]?.border ?? "#94A3B8",
                      }}
                    >
                      {WELL_TYPE_CONFIG[w.wellType]?.label ?? w.wellType}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 truncate">
                    {w.companyName}
                    {w.businessName ? ` · ${w.businessName}` : ""}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] font-mono text-blue-700 font-semibold">
                      {w.staticWaterLevel !== null
                        ? `${w.staticWaterLevel.toFixed(2)} m`
                        : "-"}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400">
                      {w.isActive ? "🟢 Aktif" : "⚫ Non-aktif"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>

    {/* ── Dialog Kirim ke Kadis ── */}

    {showSendDialog && (
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={() => setShowSendDialog(false)}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <SendHorizonal size={15} className="text-indigo-600" />
              <p className="text-[14px] font-bold text-slate-800">
                Kirim ke Kepala Dinas
              </p>
            </div>
            <button
              onClick={() => setShowSendDialog(false)}
              className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
            >
              <X size={13} className="text-slate-500" />
            </button>
          </div>

          <div className="px-5 py-4 space-y-4">
            {/* Summary */}
            <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Judul</span>
                <span className="text-[11px] font-semibold text-slate-700 text-right max-w-[60%] leading-tight">
                  Laporan Muka Air Tanah — {selectedCompanyName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Total Sumur</span>
                <span className="text-[11px] font-semibold text-slate-700">{filteredWells.length} sumur</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Avg Muka Air</span>
                <span className="text-[11px] font-semibold text-blue-700">
                  {avgWaterLevel !== null ? `${avgWaterLevel.toFixed(2)} m` : "-"}
                </span>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                Catatan (opsional)
              </label>
              <textarea
                value={sendNotes}
                onChange={(e) => setSendNotes(e.target.value)}
                rows={3}
                placeholder="Tambahkan catatan untuk Kepala Dinas..."
                className="w-full text-[11px] font-mono border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-slate-700 focus:outline-none focus:border-indigo-400 resize-none"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setShowSendDialog(false)}
                className="flex-1 py-2.5 text-[12px] font-semibold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleSendToKadis}
                disabled={sendToKadis.isPending}
                className={cn(
                  "flex-1 py-2.5 text-[12px] font-semibold rounded-xl transition-all flex items-center justify-center gap-2",
                  sendToKadis.isPending
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700",
                )}
              >
                {sendToKadis.isPending ? (
                  "Mengirim..."
                ) : (
                  <>
                    <SendHorizonal size={13} /> Kirim Sekarang
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
