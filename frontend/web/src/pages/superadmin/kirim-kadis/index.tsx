import { useMemo, useState } from "react";
import {
  SendHorizonal,
  FileText,
  Search,
  Building2,
  CheckCircle2,
  Clock3,
  BarChart3,
} from "lucide-react";
import { Card, SectionHeader } from "../../../components/ui";
import { cn } from "../../../lib/utils";
import { useVerificationReports } from "../../../hooks/useReports";
import type { VerificationReport } from "../../../services/verification.service";

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));
  } catch { return iso; }
}

interface CompanyPackage {
  companyId: string;
  companyName: string;
  reports: VerificationReport[];
  latestAt: string;
}

export default function SuperAdminKirimKadisPage() {
  const { data: reports = [], isLoading } = useVerificationReports();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const approvedReports = useMemo(
    () => reports.filter((r) => r.status === "APPROVED"),
    [reports],
  );

  const packages = useMemo<CompanyPackage[]>(() => {
    const map = new Map<string, CompanyPackage>();
    for (const r of approvedReports) {
      const existing = map.get(r.companyId);
      if (existing) {
        existing.reports.push(r);
        if (new Date(r.createdAt) > new Date(existing.latestAt)) {
          existing.latestAt = r.createdAt;
        }
      } else {
        map.set(r.companyId, {
          companyId: r.companyId,
          companyName: r.companyName,
          reports: [r],
          latestAt: r.createdAt,
        });
      }
    }
    return Array.from(map.values()).sort(
      (a, b) => new Date(b.latestAt).getTime() - new Date(a.latestAt).getTime(),
    );
  }, [approvedReports]);

  const filtered = useMemo(() => {
    if (!search) return packages;
    const q = search.toLowerCase();
    return packages.filter((p) => p.companyName.toLowerCase().includes(q));
  }, [packages, search]);

  const selected = useMemo(
    () => packages.find((p) => p.companyId === selectedId) ?? packages[0] ?? null,
    [packages, selectedId],
  );

  const summary = {
    totalPerusahaan: packages.length,
    totalLaporan: approvedReports.length,
    pending: reports.filter((r) => r.status === "PENDING").length,
    rejected: reports.filter((r) => r.status === "REJECTED").length,
  };

  const qualityCount = (pkg: CompanyPackage, q: string) =>
    pkg.reports.filter((r) => r.waterQuality === q).length;

  return (
    <div className="p-3 sm:p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[18px] font-semibold text-slate-800">Kirim ke Kadis</h1>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
            Laporan terverifikasi yang siap ditinjau oleh Kepala Dinas
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Perusahaan", value: summary.totalPerusahaan, color: "#0891B2", bg: "bg-cyan-50 border-cyan-200" },
          { label: "Laporan Terverifikasi", value: summary.totalLaporan, color: "#22C55E", bg: "bg-emerald-50 border-emerald-200" },
          { label: "Masih Pending", value: summary.pending, color: "#F59E0B", bg: "bg-amber-50 border-amber-200" },
          { label: "Ditolak", value: summary.rejected, color: "#EF4444", bg: "bg-red-50 border-red-200" },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={cn("rounded-xl border px-4 py-3", bg)}>
            <p className="text-[9px] font-mono text-slate-400 uppercase mb-1">{label}</p>
            <p className="text-[22px] font-bold font-mono" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-[11px] text-slate-400 font-mono">
          Memuat data laporan...
        </div>
      ) : approvedReports.length === 0 ? (
        <div className="flex items-center justify-center py-16 text-[11px] text-slate-400 font-mono">
          Belum ada laporan yang terverifikasi
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-[340px_1fr] gap-4">
          {/* List */}
          <Card padding={false} className="flex flex-col min-h-[420px]">
            <SectionHeader title="Laporan per Perusahaan" icon={<FileText size={13} />} subtitle={filtered.length + " perusahaan"} />
            <div className="px-4 py-3 border-b border-slate-100">
              <div className="relative">
                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari nama perusahaan..."
                  className="w-full pl-8 pr-3 py-1.5 text-[11px] font-mono border border-slate-200 rounded-lg bg-slate-50 text-slate-700 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
              {filtered.map((pkg) => {
                const active = (selectedId ?? packages[0]?.companyId) === pkg.companyId;
                return (
                  <button
                    key={pkg.companyId}
                    onClick={() => setSelectedId(pkg.companyId)}
                    className={cn(
                      "w-full text-left px-4 py-3 transition-colors",
                      active ? "bg-cyan-50/60" : "hover:bg-slate-50/60",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-[12px] font-semibold text-slate-800 leading-tight">{pkg.companyName}</p>
                      <span className="text-[9px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full whitespace-nowrap">
                        {pkg.reports.length} laporan
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                      <Clock3 size={10} />
                      {formatDate(pkg.latestAt)}
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Detail */}
          {selected && (
            <Card padding={false} className="min-h-[420px]">
              <SectionHeader
                title={selected.companyName}
                icon={<Building2 size={13} />}
                subtitle={selected.reports.length + " laporan terverifikasi"}
              />
              <div className="p-4 space-y-4">
                {/* Summary stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "Total Laporan", value: selected.reports.length },
                    { label: "Kualitas Baik", value: qualityCount(selected, "BAIK") },
                    { label: "Kualitas Sedang", value: qualityCount(selected, "SEDANG") },
                    { label: "Kualitas Buruk", value: qualityCount(selected, "BURUK") },
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 text-center">
                      <p className="text-[9px] font-mono text-slate-400 uppercase mb-1">{label}</p>
                      <p className="text-[18px] font-bold font-mono text-slate-800">{value}</p>
                    </div>
                  ))}
                </div>

                {/* Avg water depth */}
                <div className="rounded-xl border border-cyan-100 bg-cyan-50/50 p-3 flex items-center gap-3">
                  <BarChart3 size={18} className="text-cyan-600 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] font-mono text-cyan-700 uppercase">Rata-rata Kedalaman Air</p>
                    <p className="text-[14px] font-bold text-slate-800">
                      {(selected.reports.reduce((s, r) => s + r.waterDepth, 0) / selected.reports.length).toFixed(1)} m
                    </p>
                  </div>
                </div>

                {/* Reports table */}
                <div className="rounded-xl border border-slate-100 overflow-hidden">
                  <div className="bg-slate-50 px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Daftar Laporan</p>
                    <span className="text-[10px] font-mono text-slate-400">{selected.reports.length} data</span>
                  </div>
                  <div className="divide-y divide-slate-50 max-h-72 overflow-y-auto">
                    {selected.reports.map((r) => (
                      <div key={r.id} className="flex items-center gap-3 px-3 py-2.5">
                        <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-semibold text-slate-800 truncate">{r.wellName}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{r.surveyorName} · {formatDate(r.createdAt)}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-[11px] font-mono text-slate-700">{r.waterDepth.toFixed(1)} m</p>
                          {r.waterQuality && (
                            <span className={cn(
                              "text-[8px] font-mono px-1.5 py-0.5 rounded-full border",
                              r.waterQuality === "BAIK" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                              r.waterQuality === "SEDANG" ? "bg-amber-50 text-amber-700 border-amber-200" :
                              "bg-red-50 text-red-700 border-red-200",
                            )}>
                              {r.waterQuality}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <p className="text-[10px] font-mono text-slate-400">
                    Laporan ini telah terverifikasi oleh Super Admin dan dapat dilihat oleh Kepala Dinas di dashboard mereka.
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}