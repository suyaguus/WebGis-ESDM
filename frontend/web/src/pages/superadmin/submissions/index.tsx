import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sensorService } from "../../../services/sensor.service";
import { Sensor } from "../../../types";
import {
  X,
  AlertCircle,
  Clock,
  Building2,
  FileEdit,
  CheckCircle2,
  XCircle,
  Send,
  Eye,
  AlertTriangle,
} from "lucide-react";
import { cn } from "../../../lib/utils";

type WellStatus = Sensor["wellStatus"];

const STATUS_CONFIG: Record<WellStatus, { label: string; cls: string; border: string; icon: React.ReactNode }> = {
  draft:            { label: "Pengajuan Baru",    cls: "bg-amber-50 text-amber-700",   border: "border-l-amber-400",   icon: <FileEdit className="w-3 h-3" /> },
  pending_approval: { label: "Di Supervisor",     cls: "bg-blue-50 text-blue-700",     border: "border-l-blue-400",    icon: <Clock className="w-3 h-3" /> },
  reviewed:         { label: "Sudah Ditinjau",    cls: "bg-teal-50 text-teal-700",     border: "border-l-teal-400",    icon: <Eye className="w-3 h-3" /> },
  approved:         { label: "Disetujui",         cls: "bg-emerald-50 text-emerald-700", border: "border-l-emerald-400", icon: <CheckCircle2 className="w-3 h-3" /> },
  rejected:         { label: "Ditolak",           cls: "bg-red-50 text-red-700",       border: "border-l-red-400",     icon: <XCircle className="w-3 h-3" /> },
};

export default function SubmissionsPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [statusF, setStatusF] = useState<WellStatus | "all">("all");
  const [selectedWell, setSelectedWell] = useState<Sensor | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const qc = useQueryClient();

  const invalidate = () => qc.invalidateQueries({ queryKey: ["pendingWells"] });

  // All non-approved wells
  const { data: pendingData, isLoading, isError, error } = useQuery({
    queryKey: ["pendingWells", page, limit],
    queryFn: () => sensorService.getPending(page, limit),
  });

  const processMutation = useMutation({
    mutationFn: (wellId: string) => sensorService.process(wellId),
    onSuccess: () => { setSelectedWell(null); invalidate(); },
  });

  const approveMutation = useMutation({
    mutationFn: (wellId: string) => sensorService.approve(wellId),
    onSuccess: () => { setSelectedWell(null); invalidate(); },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ wellId, reason }: { wellId: string; reason: string }) =>
      sensorService.reject(wellId, reason),
    onSuccess: () => {
      setSelectedWell(null);
      setRejectionReason("");
      setShowRejectForm(false);
      invalidate();
    },
  });

  const isPending =
    processMutation.isPending || approveMutation.isPending || rejectMutation.isPending;

  const allWells = pendingData?.data ?? [];
  const pagination = pendingData?.pagination;

  const wells = statusF === "all"
    ? allWells
    : allWells.filter((w) => w.wellStatus === statusF);

  const closeModal = () => {
    setSelectedWell(null);
    setRejectionReason("");
    setShowRejectForm(false);
  };

  const summaryCount = (s: WellStatus) => allWells.filter((w) => w.wellStatus === s).length;

  return (
    <div className="p-3 sm:p-5 space-y-4">
      <div>
        <h1 className="text-[18px] font-semibold text-slate-800">Pengajuan Sumur</h1>
        <p className="text-[11px] text-slate-400 font-mono mt-0.5">
          Kelola seluruh pengajuan sumur yang belum disetujui
        </p>
      </div>

      {/* Summary */}
      {pagination && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Pengajuan Baru",  value: summaryCount("draft"),            color: "#D97706", bg: "bg-amber-50  border-amber-200" },
            { label: "Di Supervisor",   value: summaryCount("pending_approval"), color: "#3B82F6", bg: "bg-blue-50   border-blue-200" },
            { label: "Sudah Ditinjau",  value: summaryCount("reviewed"),         color: "#0D9488", bg: "bg-teal-50   border-teal-200" },
            { label: "Ditolak",         value: summaryCount("rejected"),         color: "#EF4444", bg: "bg-red-50    border-red-200" },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className={cn("rounded-xl border px-4 py-3 flex items-center gap-3", bg)}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: color + "20" }}>
                <span className="text-[14px] font-bold font-mono" style={{ color }}>{value}</span>
              </div>
              <span className="text-[11px] font-medium text-slate-600">{label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Status filter */}
      <div className="flex gap-1 flex-wrap">
        {(["all", "draft", "pending_approval", "reviewed", "rejected"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusF(s)}
            className={cn(
              "text-[9px] font-mono px-2.5 py-1 rounded-full border transition-all",
              statusF === s
                ? "bg-cyan-50 text-cyan-700 border-cyan-200"
                : "text-slate-400 border-transparent hover:bg-slate-50",
            )}
          >
            {s === "all" ? "Semua" : STATUS_CONFIG[s as WellStatus]?.label ?? s}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-16 text-[11px] text-slate-400 font-mono">
          <Clock className="w-4 h-4 mr-2 animate-spin" /> Memuat data...
        </div>
      )}

      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-[12px] text-slate-600">
            {error instanceof Error ? error.message : "Gagal memuat data"}
          </p>
        </div>
      )}

      {!isLoading && wells.length === 0 && (
        <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center shadow-sm">
          <CheckCircle2 className="w-10 h-10 text-slate-200 mx-auto mb-3" />
          <p className="text-[14px] font-semibold text-slate-700">Tidak Ada Pengajuan</p>
          <p className="text-[11px] text-slate-400 mt-1">
            Semua pengajuan telah diproses
          </p>
        </div>
      )}

      {!isLoading && wells.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wells.map((well) => {
            const cfg = STATUS_CONFIG[well.wellStatus];
            const hasSupervisorNote = !!well.supervisorNote;
            return (
              <div
                key={well.id}
                onClick={() => setSelectedWell(well)}
                className={cn(
                  "bg-white border rounded-xl p-5 cursor-pointer hover:shadow-md transition-shadow border-l-4",
                  cfg.border,
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <p className="text-[13px] font-bold font-mono text-slate-800 truncate flex-1">
                    {well.code}
                  </p>
                  <span className={cn("inline-flex items-center gap-1 text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full ml-2", cfg.cls)}>
                    {cfg.icon} {cfg.label}
                  </span>
                </div>

                {/* Supervisor alert */}
                {hasSupervisorNote && (
                  <div className="mb-3 flex items-start gap-1.5 bg-orange-50 border border-orange-200 rounded-lg px-2.5 py-2">
                    <AlertTriangle className="w-3 h-3 text-orange-500 flex-shrink-0 mt-0.5" />
                    <p className="text-[10px] text-orange-700 font-mono leading-tight">
                      {well.supervisorNote}
                    </p>
                  </div>
                )}

                <div className="space-y-1.5 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3 h-3 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{well.companyName}</span>
                  </div>
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedWell(well); }}
                  className="mt-4 w-full px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-600 text-[11px] font-mono rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Lihat Detail →
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination && !isLoading && pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={!pagination.hasPrevPage}
            className="px-3 py-1.5 text-[11px] border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50"
          >
            Sebelumnya
          </button>
          <span className="px-3 py-1.5 text-[11px] text-slate-500 font-mono">
            Hal {pagination.currentPage} / {pagination.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!pagination.hasNextPage}
            className="px-3 py-1.5 text-[11px] border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50"
          >
            Selanjutnya
          </button>
        </div>
      )}

      {/* Detail Modal */}
      {selectedWell && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <p className="text-[15px] font-bold font-mono text-slate-800">{selectedWell.code}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Detail Pengajuan</p>
              </div>
              <div className="flex items-center gap-2">
                {(() => {
                  const cfg = STATUS_CONFIG[selectedWell.wellStatus];
                  return (
                    <span className={cn("inline-flex items-center gap-1 text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full", cfg.cls)}>
                      {cfg.icon} {cfg.label}
                    </span>
                  );
                })()}
                <button onClick={closeModal} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            </div>

            {/* Supervisor alert banner */}
            {selectedWell.supervisorNote && (
              <div className="mx-6 mt-4 flex items-start gap-2 bg-orange-50 border border-orange-300 rounded-xl px-4 py-3">
                <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] font-semibold text-orange-800">Laporan Ketidaksesuaian dari Supervisor</p>
                  <p className="text-[11px] text-orange-700 mt-0.5 font-mono">{selectedWell.supervisorNote}</p>
                </div>
              </div>
            )}

            <div className="px-6 py-5 grid grid-cols-2 gap-3">
              {[
                ["Nama Sumur", selectedWell.code],
                ["Tipe Sumur",
                  selectedWell.wellType === "sumur_pantau" ? "Sumur Pantau"
                  : selectedWell.wellType === "sumur_gali" ? "Sumur Gali"
                  : "Sumur Bor"],
                ["Perusahaan", selectedWell.companyName],
                ["Unit Bisnis", selectedWell.businessName ?? "-"],
                ["Lokasi", selectedWell.location],
                ["Koordinat",
                  selectedWell.lat != null && selectedWell.lng != null
                    ? `${selectedWell.lat.toFixed(4)}, ${selectedWell.lng.toFixed(4)}`
                    : "Belum diatur"],
                ["Muka Air Tanah",
                  selectedWell.staticWaterLevel != null
                    ? `${(selectedWell.staticWaterLevel * 100).toFixed(2)} cm`
                    : "-"],
                ["Dibuat Oleh", selectedWell.createdBy ?? "-"],
              ].map(([k, v]) => (
                <div key={k} className="bg-slate-50 rounded-xl px-3 py-2.5">
                  <p className="text-[9px] text-slate-400 font-mono uppercase tracking-wider mb-1">{k}</p>
                  <p className="text-[12px] font-semibold text-slate-800">{v}</p>
                </div>
              ))}
            </div>

            {/* Rejection textarea */}
            {showRejectForm && (
              <div className="px-6 pb-4">
                <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">
                  Alasan Penolakan
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Jelaskan alasan penolakan..."
                  className="w-full px-3 py-2 text-[12px] font-mono border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-red-300 focus:border-red-300"
                  rows={3}
                />
              </div>
            )}

            <div className="px-6 py-4 border-t border-slate-100 flex gap-2 flex-wrap">
              {!showRejectForm && selectedWell.wellStatus === "draft" && (
                <button
                  onClick={() => processMutation.mutate(selectedWell.id)}
                  disabled={isPending}
                  className="px-4 py-2 bg-blue-50 text-blue-600 text-[12px] font-semibold rounded-xl hover:bg-blue-100 disabled:opacity-50 transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3 h-3" /> Kirim ke Supervisor
                </button>
              )}
              {!showRejectForm && selectedWell.wellStatus === "reviewed" && (
                <button
                  onClick={() => approveMutation.mutate(selectedWell.id)}
                  disabled={isPending}
                  className="px-4 py-2 bg-emerald-50 text-emerald-600 text-[12px] font-semibold rounded-xl hover:bg-emerald-100 disabled:opacity-50 transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3 h-3" /> Setujui
                </button>
              )}
              {!showRejectForm && selectedWell.wellStatus === "pending_approval" && !selectedWell.supervisorNote && (
                <span className="px-4 py-2 bg-slate-50 text-slate-400 text-[12px] font-mono rounded-xl border border-slate-200 flex items-center gap-1.5">
                  <Clock className="w-3 h-3" /> Sedang ditinjau supervisor
                </span>
              )}
              {!showRejectForm &&
                (selectedWell.wellStatus === "draft" ||
                  selectedWell.wellStatus === "reviewed" ||
                  (selectedWell.wellStatus === "pending_approval" && !!selectedWell.supervisorNote)) && (
                <button
                  onClick={() => setShowRejectForm(true)}
                  disabled={isPending}
                  className="px-4 py-2 bg-red-50 text-red-600 text-[12px] font-semibold rounded-xl hover:bg-red-100 disabled:opacity-50 transition-colors flex items-center gap-1.5"
                >
                  <XCircle className="w-3 h-3" /> Tolak
                </button>
              )}
              {showRejectForm && (
                <>
                  <button
                    onClick={() => rejectMutation.mutate({ wellId: selectedWell.id, reason: rejectionReason })}
                    disabled={!rejectionReason.trim() || isPending}
                    className="px-4 py-2 bg-red-600 text-white text-[12px] font-semibold rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center gap-1.5"
                  >
                    <X className="w-3 h-3" /> Konfirmasi Tolak
                  </button>
                  <button
                    onClick={() => { setShowRejectForm(false); setRejectionReason(""); }}
                    className="px-4 py-2 bg-slate-100 text-slate-600 text-[12px] rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    Batal
                  </button>
                </>
              )}
              {!showRejectForm && (
                <button onClick={closeModal} className="px-4 py-2 bg-slate-50 text-slate-500 text-[12px] rounded-xl hover:bg-slate-100 transition-colors ml-auto">
                  Tutup
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
