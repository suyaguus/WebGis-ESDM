import { useMemo, useState } from "react";
import {
  ClipboardCheck,
  Search,
  Check,
  X,
  Clock3,
  ArrowUpDown,
  Eye,
  Image as ImageIcon,
  AlertCircle,
} from "lucide-react";
import { Card } from "../../../components/ui";
import { cn, getSubsidenceColor } from "../../../lib/utils";
import {
  useVerificationReports,
  useApproveReport,
  useRejectReport,
} from "../../../hooks/useReports";
import type { VerificationReport } from "../../../services/verification.service";

type FilterStatus = "ALL" | "PENDING" | "APPROVED" | "REJECTED";
type SortKey = "wellName" | "surveyorName" | "createdAt" | "status" | "waterDepth";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Menunggu",
  APPROVED: "Diverifikasi",
  REJECTED: "Ditolak",
};

const STATUS_ORDER: Record<string, number> = { PENDING: 0, REJECTED: 1, APPROVED: 2 };

const QUALITY_LABEL: Record<string, string> = { BAIK: "Baik", SEDANG: "Sedang", BURUK: "Buruk" };

const QUALITY_COLOR: Record<string, string> = {
  BAIK: "text-emerald-700 bg-emerald-50 border-emerald-200",
  SEDANG: "text-amber-700 bg-amber-50 border-amber-200",
  BURUK: "text-red-700 bg-red-50 border-red-200",
};

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));
  } catch { return iso; }
}

function RejectModal({ reportName, onClose, onConfirm, isPending }: {
  reportName: string; onClose: () => void; onConfirm: (reason: string) => void; isPending: boolean;
}) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) { setError("Alasan penolakan wajib diisi"); return; }
    onConfirm(reason.trim());
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[70] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-red-50 border border-red-200 flex items-center justify-center">
              <AlertCircle size={15} className="text-red-500" />
            </div>
            <div>
              <p className="text-[14px] font-bold text-slate-800">Tolak Laporan</p>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate max-w-[240px]">{reportName}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
            <X size={14} className="text-slate-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1.5">
              Alasan Penolakan <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => { setReason(e.target.value); if (e.target.value.trim()) setError(""); }}
              placeholder="Jelaskan alasan penolakan laporan ini..."
              rows={4}
              className={cn(
                "w-full px-3 py-2 text-[12px] font-mono border rounded-lg bg-slate-50 text-slate-800 resize-none focus:outline-none focus:ring-1",
                error ? "border-red-300 focus:ring-red-300" : "border-slate-200 focus:ring-red-400 focus:border-red-400",
              )}
            />
            {error && <p className="text-[10px] text-red-500 mt-1">{error}</p>}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 bg-slate-100 text-slate-600 text-[12px] font-semibold rounded-xl hover:bg-slate-200 transition-colors">
              Batal
            </button>
            <button type="submit" disabled={isPending} className="flex-1 px-4 py-2 bg-red-600 text-white text-[12px] font-semibold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-1.5">
              {isPending ? "Menolak..." : <><X size={12} /> Tolak Laporan</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function SuperAdminVerifikasiPage() {
  const { data: reports = [], isLoading } = useVerificationReports();
  const approveReport = useApproveReport();
  const rejectReport = useRejectReport();

  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState<FilterStatus>("ALL");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortAsc, setSortAsc] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [rejectTarget, setRejectTarget] = useState<VerificationReport | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<{ url: string; title: string } | null>(null);

  const detailRow = useMemo(() => reports.find((r) => r.id === detailId) ?? null, [reports, detailId]);

  const summary = useMemo(() => ({
    total: reports.length,
    pending: reports.filter((r) => r.status === "PENDING").length,
    approved: reports.filter((r) => r.status === "APPROVED").length,
    rejected: reports.filter((r) => r.status === "REJECTED").length,
  }), [reports]);

  const filtered = useMemo(() => {
    let data = [...reports];
    if (statusF !== "ALL") data = data.filter((r) => r.status === statusF);
    if (search) {
      const q = search.toLowerCase();
      data = data.filter((r) =>
        r.wellName.toLowerCase().includes(q) ||
        r.companyName.toLowerCase().includes(q) ||
        r.surveyorName.toLowerCase().includes(q),
      );
    }
    data.sort((a, b) => {
      if (sortKey === "status") {
        return sortAsc ? (STATUS_ORDER[a.status] ?? 99) - (STATUS_ORDER[b.status] ?? 99) : (STATUS_ORDER[b.status] ?? 99) - (STATUS_ORDER[a.status] ?? 99);
      }
      if (sortKey === "waterDepth") return sortAsc ? a.waterDepth - b.waterDepth : b.waterDepth - a.waterDepth;
      if (sortKey === "createdAt") {
        const av = new Date(a.createdAt).getTime(), bv = new Date(b.createdAt).getTime();
        return sortAsc ? av - bv : bv - av;
      }
      const av = String((a as Record<string, unknown>)[sortKey] ?? "");
      const bv = String((b as Record<string, unknown>)[sortKey] ?? "");
      return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
    });
    return data;
  }, [reports, search, statusF, sortKey, sortAsc]);

  const sort = (key: SortKey) => { if (sortKey === key) { setSortAsc((p) => !p); return; } setSortKey(key); setSortAsc(true); };

  const handleApprove = (id: string) => {
    approveReport.mutate(id, { onSuccess: () => { if (detailId === id) setDetailId(null); } });
  };

  const handleReject = (reason: string) => {
    if (!rejectTarget) return;
    const tid = rejectTarget.id;
    rejectReport.mutate({ id: tid, reason }, {
      onSuccess: () => { setRejectTarget(null); if (detailId === tid) setDetailId(null); },
    });
  };

  const closeDetail = () => { setDetailId(null); setPreviewPhoto(null); };

  const Th = ({ label, k }: { label: string; k: SortKey }) => (
    <th onClick={() => sort(k)} className="text-[9px] font-mono text-slate-400 uppercase tracking-wider px-4 py-3 text-left cursor-pointer hover:text-slate-600 whitespace-nowrap select-none">
      <span className="flex items-center gap-1">{label}<ArrowUpDown size={9} className={sortKey === k ? "text-cyan-500" : "text-slate-300"} /></span>
    </th>
  );

  const StatusBadge = ({ status }: { status: string }) => (
    <span className={cn("text-[9px] font-mono px-2 py-0.5 rounded-full border",
      status === "PENDING" ? "bg-amber-50 text-amber-700 border-amber-200" :
      status === "APPROVED" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
      "bg-red-50 text-red-700 border-red-200"
    )}>
      {STATUS_LABEL[status] ?? status}
    </span>
  );

  return (
    <div className="p-3 sm:p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[18px] font-semibold text-slate-800">Verifikasi Data</h1>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">Tinjau laporan surveyor sebelum masuk ke laporan resmi</p>
        </div>
        <div className="flex items-center gap-2">
          <ClipboardCheck size={15} className="text-cyan-600" />
          <span className="text-[11px] font-mono text-slate-500">{summary.pending} menunggu</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Laporan", value: summary.total, color: "#0891B2", bg: "bg-cyan-50 border-cyan-200" },
          { label: "Menunggu", value: summary.pending, color: "#F59E0B", bg: "bg-amber-50 border-amber-200" },
          { label: "Diverifikasi", value: summary.approved, color: "#22C55E", bg: "bg-emerald-50 border-emerald-200" },
          { label: "Ditolak", value: summary.rejected, color: "#EF4444", bg: "bg-red-50 border-red-200" },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={cn("rounded-xl border px-4 py-3", bg)}>
            <p className="text-[9px] font-mono text-slate-400 uppercase mb-1">{label}</p>
            <p className="text-[22px] font-bold font-mono" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      <Card padding={false}>
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 flex-wrap">
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari sumur / perusahaan / surveyor..." className="pl-8 pr-3 py-1.5 text-[11px] font-mono border border-slate-200 rounded-lg bg-slate-50 text-slate-700 w-64 focus:outline-none focus:border-cyan-400" />
          </div>
          <div className="flex gap-1">
            {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map((s) => (
              <button key={s} onClick={() => setStatusF(s)} className={cn("text-[9px] font-mono px-2.5 py-1 rounded-full border transition-all", statusF === s ? "bg-cyan-50 text-cyan-700 border-cyan-200" : "text-slate-400 border-transparent hover:bg-slate-50")}>
                {s === "ALL" ? "Semua" : STATUS_LABEL[s]}
              </button>
            ))}
          </div>
          <span className="ml-auto text-[10px] text-slate-400 font-mono">{filtered.length} data</span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-[11px] text-slate-400 font-mono">Memuat data laporan...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" style={{ minWidth: "860px" }}>
              <thead className="bg-slate-50/60 border-b border-slate-100">
                <tr>
                  <Th label="Sumur" k="wellName" />
                  <Th label="Surveyor" k="surveyorName" />
                  <Th label="Waktu" k="createdAt" />
                  <th className="text-[9px] font-mono text-slate-400 uppercase tracking-wider px-4 py-3 text-left whitespace-nowrap">Perusahaan</th>
                  <Th label="Status" k="status" />
                  <Th label="Kedalaman Air" k="waterDepth" />
                  <th className="text-[9px] font-mono text-slate-400 uppercase tracking-wider px-4 py-3 text-left whitespace-nowrap">Foto</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-[12px] font-mono font-bold text-slate-800">{row.wellName}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{row.id.slice(0, 8)}...</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                          {row.surveyorName.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-[11px] font-semibold text-slate-700">{row.surveyorName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[10px] font-mono text-slate-500 whitespace-nowrap">{formatDate(row.createdAt)}</td>
                    <td className="px-4 py-3 text-[11px] text-slate-600 max-w-[160px] truncate">{row.companyName}</td>
                    <td className="px-4 py-3"><StatusBadge status={row.status} /></td>
                    <td className="px-4 py-3">
                      <span className={cn("text-[12px] font-semibold font-mono", getSubsidenceColor(row.waterDepth))}>
                        {row.waterDepth.toFixed(1)}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400 ml-1">m</span>
                    </td>
                    <td className="px-4 py-3 text-[10px] font-mono text-slate-500">{row.photos.length} foto</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => setDetailId(row.id)} className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center">
                          <Eye size={12} className="text-slate-500" />
                        </button>
                        {row.status === "PENDING" && (
                          <>
                            <button onClick={() => handleApprove(row.id)} disabled={approveReport.isPending} className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 flex items-center justify-center disabled:opacity-50">
                              <Check size={12} className="text-emerald-600" />
                            </button>
                            <button onClick={() => setRejectTarget(row)} className="w-7 h-7 rounded-lg bg-red-50 border border-red-200 hover:bg-red-100 flex items-center justify-center">
                              <X size={12} className="text-red-600" />
                            </button>
                          </>
                        )}
                        {row.status !== "PENDING" && (
                          <div className="text-[9px] font-mono text-slate-400 px-2 whitespace-nowrap inline-flex items-center gap-1">
                            <Clock3 size={10} />
                            {row.approvedAt ? formatDate(row.approvedAt) : "-"}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="py-12 text-center text-[11px] text-slate-400 font-mono">Tidak ada data laporan</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Detail Modal */}
      {detailRow && (
        <div className="fixed inset-0 bg-black/25 backdrop-blur-[1px] z-50 flex items-center justify-center p-4" onClick={closeDetail}>
          <div className="w-full max-w-3xl bg-white rounded-2xl border border-slate-100 shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-slate-100 flex items-start justify-between gap-3">
              <div>
                <p className="text-[15px] font-semibold text-slate-800">Detail Laporan</p>
                <p className="text-[10px] font-mono text-slate-400 mt-0.5">{detailRow.wellName} · {detailRow.companyName} · {formatDate(detailRow.createdAt)}</p>
              </div>
              <button onClick={closeDetail} className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 hover:bg-slate-200 flex items-center justify-center">
                <X size={14} className="text-slate-500" />
              </button>
            </div>
            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              {detailRow.description && (
                <div className="rounded-xl border border-cyan-100 bg-cyan-50/50 p-4">
                  <p className="text-[9px] font-mono text-cyan-700 uppercase tracking-wider mb-1">Deskripsi Laporan</p>
                  <p className="text-[12px] leading-relaxed text-slate-700">{detailRow.description}</p>
                </div>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Surveyor", value: detailRow.surveyorName, extra: null },
                  { label: "Perusahaan", value: detailRow.companyName, extra: null },
                  { label: "Foto", value: detailRow.photos.length + " lampiran", extra: null },
                  { label: "Kualitas Air", value: detailRow.waterQuality ? QUALITY_LABEL[detailRow.waterQuality] ?? detailRow.waterQuality : "-", extra: detailRow.waterQuality },
                ].map(({ label, value, extra }) => (
                  <div key={label} className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
                    <p className="text-[9px] font-mono text-slate-400 uppercase">{label}</p>
                    {extra ? (
                      <span className={cn("mt-1 inline-flex text-[10px] font-mono px-2 py-0.5 rounded-full border", QUALITY_COLOR[extra])}>{value}</span>
                    ) : (
                      <p className="text-[12px] font-semibold text-slate-800 mt-1">{value}</p>
                    )}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-xl border border-slate-100 px-3 py-3 bg-white">
                  <p className="text-[9px] font-mono text-slate-400 uppercase mb-1">Kedalaman Air</p>
                  <p className="text-[14px] font-semibold font-mono text-slate-800">{detailRow.waterDepth.toFixed(1)} m</p>
                </div>
                <div className="rounded-xl border border-slate-100 px-3 py-3 bg-white">
                  <p className="text-[9px] font-mono text-slate-400 uppercase mb-1">Penggunaan Air</p>
                  <p className="text-[14px] font-semibold font-mono text-slate-800">{detailRow.waterUsage != null ? detailRow.waterUsage.toFixed(1) + " m3" : "-"}</p>
                </div>
                <div className="rounded-xl border border-slate-100 px-3 py-3 bg-white">
                  <p className="text-[9px] font-mono text-slate-400 uppercase mb-1">Status</p>
                  <div className="mt-1"><StatusBadge status={detailRow.status} /></div>
                </div>
              </div>
              {detailRow.photos.length > 0 && (
                <div className="rounded-xl border border-slate-100 bg-white p-3.5">
                  <div className="flex items-center justify-between mb-2.5">
                    <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Lampiran Foto</p>
                    <span className="text-[10px] text-slate-500 font-mono">{detailRow.photos.length} foto</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {detailRow.photos.map((url, idx) => (
                      <button key={idx} onClick={() => setPreviewPhoto({ url, title: "Lampiran " + (idx + 1) + " - " + detailRow.wellName })} className="group relative rounded-lg overflow-hidden border border-slate-200 bg-slate-50 hover:border-cyan-300 transition-colors">
                        <img src={url} alt={"Lampiran " + (idx + 1)} className="w-full h-24 object-cover" />
                        <div className="absolute inset-x-0 bottom-0 px-2 py-1.5 bg-gradient-to-t from-black/65 to-transparent">
                          <p className="text-[9px] font-mono text-white">Lampiran {idx + 1}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <button onClick={closeDetail} className="px-3 py-2 bg-slate-100 text-slate-600 text-[12px] font-semibold rounded-xl hover:bg-slate-200">Tutup</button>
              {detailRow.status === "PENDING" ? (
                <div className="flex items-center gap-2">
                  <button onClick={() => { setRejectTarget(detailRow); closeDetail(); }} className="px-3 py-2 bg-red-50 border border-red-200 text-red-600 text-[12px] font-semibold rounded-xl hover:bg-red-100 inline-flex items-center gap-1.5">
                    <X size={12} /> Tolak
                  </button>
                  <button onClick={() => { handleApprove(detailRow.id); closeDetail(); }} disabled={approveReport.isPending} className="px-3 py-2 bg-emerald-600 text-white text-[12px] font-semibold rounded-xl hover:bg-emerald-700 inline-flex items-center gap-1.5 disabled:opacity-50">
                    <Check size={12} /> Verifikasi
                  </button>
                </div>
              ) : (
                <div className="text-[10px] font-mono text-slate-400 inline-flex items-center gap-1.5">
                  <Clock3 size={11} />
                  {STATUS_LABEL[detailRow.status]} · {detailRow.approvedAt ? formatDate(detailRow.approvedAt) : "-"}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Preview Foto */}
      {previewPhoto && (
        <div className="fixed inset-0 bg-black/70 z-[60] p-4 flex items-center justify-center" onClick={() => setPreviewPhoto(null)}>
          <div className="w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <div className="bg-slate-900/90 rounded-t-xl px-4 py-2.5 border border-slate-700 border-b-0 flex items-center justify-between">
              <p className="text-[11px] font-mono text-slate-200 inline-flex items-center gap-1.5"><ImageIcon size={12} /> {previewPhoto.title}</p>
              <button onClick={() => setPreviewPhoto(null)} className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 flex items-center justify-center">
                <X size={12} className="text-slate-200" />
              </button>
            </div>
            <div className="bg-black border border-slate-700 rounded-b-xl overflow-hidden">
              <img src={previewPhoto.url} alt={previewPhoto.title} className="w-full max-h-[75vh] object-contain" />
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectTarget && (
        <RejectModal
          reportName={rejectTarget.wellName + " - " + rejectTarget.companyName}
          onClose={() => setRejectTarget(null)}
          onConfirm={handleReject}
          isPending={rejectReport.isPending}
        />
      )}
    </div>
  );
}