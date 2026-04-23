import { useState } from "react";
import type { ReactNode } from "react";
import { ScrollText, Search, Download, Shield } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightToBracket,
  faTriangleExclamation,
  faArrowRightFromBracket,
  faUserPlus,
  faSatellite,
  faChartBar,
  faBuilding,
  faTrashAlt,
  faWrench,
  faFilePdf,
  faCog,
  faEdit,
  faCheckCircle,
  faBan,
} from "@fortawesome/free-solid-svg-icons";
import { Card, SeverityBadge } from "../../../components/ui";
import { useAuditLogs } from "../../../hooks/useAudit";
import { cn } from "../../../lib/utils";
import type { AuditLogEntry } from "../../../services/audit.service";

const ACTION_ICONS: Record<string, ReactNode> = {
  LOGIN: <FontAwesomeIcon icon={faArrowRightToBracket} />,
  LOGIN_FAILED: <FontAwesomeIcon icon={faTriangleExclamation} />,
  LOGOUT: <FontAwesomeIcon icon={faArrowRightFromBracket} />,
  CREATE_USER: <FontAwesomeIcon icon={faUserPlus} />,
  DELETE_USER: <FontAwesomeIcon icon={faTrashAlt} />,
  UPDATE_USER: <FontAwesomeIcon icon={faEdit} />,
  ACTIVATE_USER: <FontAwesomeIcon icon={faCheckCircle} />,
  DEACTIVATE_USER: <FontAwesomeIcon icon={faBan} />,
  CREATE_SENSOR: <FontAwesomeIcon icon={faSatellite} />,
  UPDATE_SENSOR: <FontAwesomeIcon icon={faWrench} />,
  DELETE_SENSOR: <FontAwesomeIcon icon={faTrashAlt} />,
  SUBMIT_MEASUREMENT: <FontAwesomeIcon icon={faChartBar} />,
  EXPORT_REPORT: <FontAwesomeIcon icon={faFilePdf} />,
  APPROVE_REPORT: <FontAwesomeIcon icon={faCheckCircle} />,
  REJECT_REPORT: <FontAwesomeIcon icon={faTriangleExclamation} />,
  CREATE_REPORT: <FontAwesomeIcon icon={faChartBar} />,
  UPDATE_COMPANY: <FontAwesomeIcon icon={faBuilding} />,
  CREATE_COMPANY: <FontAwesomeIcon icon={faBuilding} />,
  CONFIG_CHANGE: <FontAwesomeIcon icon={faCog} />,
};

const ACTION_LABELS: Record<string, string> = {
  LOGIN: "Login berhasil",
  LOGIN_FAILED: "Login gagal",
  LOGOUT: "Logout",
  CREATE_USER: "Buat pengguna",
  DELETE_USER: "Hapus pengguna",
  UPDATE_USER: "Edit pengguna",
  ACTIVATE_USER: "Aktifkan pengguna",
  DEACTIVATE_USER: "Nonaktifkan pengguna",
  CREATE_SENSOR: "Tambah sensor",
  UPDATE_SENSOR: "Edit sensor",
  DELETE_SENSOR: "Hapus sensor",
  SUBMIT_MEASUREMENT: "Submit pengukuran",
  EXPORT_REPORT: "Ekspor laporan",
  APPROVE_REPORT: "Setujui laporan",
  REJECT_REPORT: "Tolak laporan",
  CREATE_REPORT: "Buat laporan",
  UPDATE_COMPANY: "Edit perusahaan",
  CREATE_COMPANY: "Tambah perusahaan",
  CONFIG_CHANGE: "Ubah konfigurasi",
};

const DAY_MAP: Record<string, number> = {
  "Hari Ini": 1,
  "7 Hari": 7,
  "30 Hari": 30,
};

export default function AuditPage() {
  const [search, setSearch] = useState("");
  const [sevF, setSevF] = useState<AuditLogEntry["severity"] | "all">("all");
  const [dateF, setDateF] = useState("30 Hari");
  const [page, setPage] = useState(1);

  const { data: result, isLoading } = useAuditLogs({
    days: DAY_MAP[dateF],
    severity: sevF,
    search: search || undefined,
    page,
  });

  const data = result?.data ?? [];
  const meta = result?.metadata;
  const totalPages = meta?.totalPages ?? 1;

  const handleFilter = (fn: () => void) => {
    fn();
    setPage(1);
  };

  const summary = {
    total: meta?.total ?? 0,
    critical: data.filter((l) => l.severity === "critical").length,
    warning: data.filter((l) => l.severity === "warning").length,
    info: data.filter((l) => l.severity === "info").length,
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="p-3 sm:p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[18px] font-semibold text-slate-800">
            Audit Log
          </h1>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
            Rekam jejak aktivitas seluruh pengguna sistem
          </p>
        </div>
        <button className="px-3 py-2 bg-white border border-slate-200 text-slate-600 text-[11px] font-semibold rounded-xl hover:bg-slate-50 flex items-center gap-1.5">
          <Download size={12} /> Ekspor Log
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Total Aktivitas",
            value: summary.total,
            color: "#0891B2",
            bg: "bg-cyan-50 border-cyan-200",
          },
          {
            label: "Kritis",
            value: summary.critical,
            color: "#EF4444",
            bg: "bg-red-50 border-red-200",
          },
          {
            label: "Peringatan",
            value: summary.warning,
            color: "#F59E0B",
            bg: "bg-amber-50 border-amber-200",
          },
          {
            label: "Informasi",
            value: summary.info,
            color: "#3B82F6",
            bg: "bg-blue-50 border-blue-200",
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

      {/* Log table */}
      <Card padding={false}>
        {/* Controls */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 flex-wrap">
          <div className="relative">
            <Search
              size={12}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => handleFilter(() => setSearch(e.target.value))}
              placeholder="Cari pengguna / aksi / target..."
              className="pl-8 pr-3 py-1.5 text-[11px] font-mono border border-slate-200 rounded-lg bg-slate-50 text-slate-700 w-56 focus:outline-none focus:border-cyan-400"
            />
          </div>
          <div className="flex gap-1">
            {(["all", "critical", "warning", "info"] as const).map((s) => (
              <button
                key={s}
                onClick={() => handleFilter(() => setSevF(s))}
                className={cn(
                  "text-[9px] font-mono px-2.5 py-1 rounded-full border transition-all",
                  sevF === s
                    ? "bg-cyan-50 text-cyan-700 border-cyan-200"
                    : "text-slate-400 border-transparent hover:bg-slate-50",
                )}
              >
                {s === "all" ? "Semua" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex gap-1 ml-1">
            {["Hari Ini", "7 Hari", "30 Hari"].map((d) => (
              <button
                key={d}
                onClick={() => handleFilter(() => setDateF(d))}
                className={cn(
                  "text-[9px] font-mono px-2.5 py-1 rounded-full border transition-all",
                  dateF === d
                    ? "bg-slate-800 text-white border-slate-800"
                    : "text-slate-400 border-transparent hover:bg-slate-50",
                )}
              >
                {d}
              </button>
            ))}
          </div>
          <span className="ml-auto text-[10px] text-slate-400 font-mono">
            {meta ? `${meta.total} entri` : "..."}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full" style={{ minWidth: "640px" }}>
            <thead className="bg-slate-50/60 border-b border-slate-100">
              <tr>
                {["Waktu", "Pengguna", "Aksi", "Target", "IP", "Severity"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-[9px] font-mono text-slate-400 uppercase tracking-wider px-4 py-2.5 text-left whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-[11px] text-slate-400 font-mono"
                  >
                    Memuat log...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-[11px] text-slate-400 font-mono"
                  >
                    Tidak ada log ditemukan
                  </td>
                </tr>
              ) : (
                data.map((log) => {
                  const borderLeft =
                    log.severity === "critical"
                      ? "border-l-2 border-l-red-400"
                      : log.severity === "warning"
                        ? "border-l-2 border-l-amber-400"
                        : "";
                  return (
                    <tr
                      key={log.id}
                      className={cn(
                        "hover:bg-slate-50/40 transition-colors",
                        borderLeft,
                      )}
                    >
                      <td className="px-4 py-2.5 text-[10px] font-mono text-slate-400 whitespace-nowrap">
                        {formatTime(log.createdAt)}
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-[8px] font-bold text-white flex-shrink-0">
                            {log.userName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </div>
                          <span className="text-[11px] font-medium text-slate-700 whitespace-nowrap">
                            {log.userName}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <span>{ACTION_ICONS[log.action] ?? "📋"}</span>
                          <span className="text-[10px] font-mono text-slate-600 whitespace-nowrap">
                            {ACTION_LABELS[log.action] ?? log.action}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-[10px] font-mono text-slate-500">
                        {log.target}
                      </td>
                      <td className="px-4 py-2.5 text-[10px] font-mono text-slate-400">
                        {log.ip}
                      </td>
                      <td className="px-4 py-2.5">
                        <SeverityBadge severity={log.severity} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between flex-wrap gap-2">
          <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5">
            <Shield size={10} /> Log tersimpan selama 365 hari sesuai kebijakan
            retensi
          </p>
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-2 py-1 text-[10px] font-mono border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-100 transition-colors"
              >
                ←
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={cn(
                    "px-2.5 py-1 text-[10px] font-mono border rounded-lg transition-colors",
                    page === p
                      ? "bg-slate-800 text-white border-slate-800"
                      : "border-slate-200 hover:bg-slate-100",
                  )}
                >
                  {p}
                </button>
              ))}
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-2 py-1 text-[10px] font-mono border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-100 transition-colors"
              >
                →
              </button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
