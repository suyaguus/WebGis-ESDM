import { useState } from "react";
import {
  FileText,
  Clock3,
  CheckCircle2,
  Droplets,
  User2,
  Search,
  Download,
} from "lucide-react";
import { Card, SectionHeader } from "../../../components/ui";
import { useKadisReports } from "../../../hooks";
import { cn } from "../../../lib/utils";
import type { KadisReport } from "../../../services/kadis-report.service";

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "long",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function downloadPdf(report: KadisReport) {
  const win = window.open("", "_blank", "width=1200,height=900");
  if (!win) return;
  win.document.write(report.pdfContent!);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 500);
}

export default function KadisLaporanPage() {
  const { data: reports = [], isLoading } = useKadisReports();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<KadisReport | null>(null);

  const filtered = reports.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      r.title.toLowerCase().includes(q) ||
      r.companyName.toLowerCase().includes(q)
    );
  });

  const activeReport = selected ?? filtered[0] ?? null;

  return (
    <div className="p-3 sm:p-5 space-y-4">
      <div>
        <h1 className="text-[18px] font-semibold text-slate-800">
          Laporan dari Super Admin
        </h1>
        <p className="text-[11px] text-slate-400 font-mono mt-0.5">
          Laporan muka air tanah yang dikirim oleh Super Admin
        </p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          {
            label: "Total Laporan",
            value: reports.length,
            color: "#6366F1",
            bg: "bg-indigo-50 border-indigo-200",
          },
          {
            label: "Bulan Ini",
            value: reports.filter((r) => {
              const d = new Date(r.sentAt);
              const now = new Date();
              return (
                d.getMonth() === now.getMonth() &&
                d.getFullYear() === now.getFullYear()
              );
            }).length,
            color: "#0891B2",
            bg: "bg-cyan-50 border-cyan-200",
          },
          {
            label: "Perusahaan",
            value: new Set(reports.map((r) => r.companyId ?? "all")).size,
            color: "#22C55E",
            bg: "bg-emerald-50 border-emerald-200",
          },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={cn("rounded-xl border px-4 py-3", bg)}>
            <p className="text-[9px] font-mono text-slate-400 uppercase mb-1">
              {label}
            </p>
            <p className="text-[22px] font-bold font-mono" style={{ color }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-[11px] text-slate-400 font-mono">
          Memuat laporan...
        </div>
      ) : reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <FileText size={32} className="text-slate-200" />
          <p className="text-[12px] text-slate-400 font-mono">
            Belum ada laporan yang diterima
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-4">
          {/* List */}
          <Card padding={false} className="flex flex-col min-h-[440px]">
            <SectionHeader
              title="Daftar Laporan"
              icon={<FileText size={13} />}
              subtitle={`${filtered.length} laporan`}
            />
            <div className="px-4 py-3 border-b border-slate-100">
              <div className="relative">
                <Search
                  size={12}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari laporan..."
                  className="w-full pl-8 pr-3 py-1.5 text-[11px] font-mono border border-slate-200 rounded-lg bg-slate-50 text-slate-700 focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
              {filtered.map((r) => {
                const isActive = (selected?.id ?? filtered[0]?.id) === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => setSelected(r)}
                    className={cn(
                      "w-full text-left px-4 py-3 transition-colors",
                      isActive ? "bg-emerald-50/60" : "hover:bg-slate-50/60",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-[11px] font-semibold text-slate-800 leading-tight">
                        {r.companyName}
                      </p>
                      <CheckCircle2
                        size={12}
                        className="text-emerald-500 flex-shrink-0 mt-0.5"
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 truncate mb-1">
                      {r.title}
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                      <Clock3 size={10} />
                      {formatDate(r.sentAt)}
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Detail */}
          {activeReport && (
            <Card padding={false} className="min-h-[440px]">
              <SectionHeader
                title={activeReport.companyName}
                icon={<FileText size={13} />}
                subtitle="Detail laporan"
                action={
                  <button
                    onClick={() => downloadPdf(activeReport)}
                    disabled={!activeReport.pdfContent}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Download size={11} /> Export PDF
                  </button>
                }
              />
              <div className="p-5 space-y-4">
                {/* Title */}
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 px-4 py-3">
                  <p className="text-[12px] font-bold text-slate-800 mb-1">
                    {activeReport.title}
                  </p>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                    <Clock3 size={10} />
                    Dikirim pada {formatDate(activeReport.sentAt)}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      label: "Total Sumur",
                      value: String(activeReport.totalWells),
                      icon: <Droplets size={13} className="text-cyan-600" />,
                    },
                    {
                      label: "Avg Muka Air",
                      value:
                        activeReport.avgWaterLevel !== null
                          ? `${activeReport.avgWaterLevel.toFixed(2)} m`
                          : "-",
                      icon: <Droplets size={13} className="text-blue-600" />,
                    },
                    {
                      label: "Dikirim oleh",
                      value: activeReport.sender.name,
                      icon: <User2 size={13} className="text-slate-500" />,
                    },
                  ].map(({ label, value, icon }) => (
                    <div
                      key={label}
                      className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5"
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        {icon}
                        <span className="text-[9px] font-mono text-slate-400 uppercase">
                          {label}
                        </span>
                      </div>
                      <p className="text-[12px] font-bold text-slate-800 truncate">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Notes */}
                {activeReport.notes && (
                  <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <p className="text-[9px] font-mono text-slate-400 uppercase mb-1.5">
                      Catatan dari Super Admin
                    </p>
                    <p className="text-[11px] text-slate-700 leading-relaxed">
                      {activeReport.notes}
                    </p>
                  </div>
                )}

                {/* All reports list */}
                <div>
                  <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-2">
                    Semua Laporan Tersedia
                  </p>
                  <div className="rounded-xl border border-slate-100 divide-y divide-slate-50 overflow-hidden">
                    {filtered
                      .filter((r) => r.companyId === activeReport.companyId)
                      .map((r) => (
                        <button
                          key={r.id}
                          onClick={() => setSelected(r)}
                          className={cn(
                            "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-slate-50/60",
                            r.id === activeReport.id && "bg-emerald-50/40",
                          )}
                        >
                          <CheckCircle2
                            size={12}
                            className="text-emerald-500 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-semibold text-slate-800 truncate">
                              {r.title}
                            </p>
                            <p className="text-[9px] font-mono text-slate-400">
                              {formatDate(r.sentAt)}
                            </p>
                          </div>
                          <span className="text-[10px] font-mono text-slate-500 flex-shrink-0">
                            {r.totalWells} sumur
                          </span>
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
