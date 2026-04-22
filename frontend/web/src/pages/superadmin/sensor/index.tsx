import { useState, useMemo } from "react";
import { Search, Radio, ArrowUpDown, AlertTriangle, Wifi, WifiOff, Settings2, X } from "lucide-react";
import { StatusPill, Card, Badge } from "../../../components/ui";
import { useSensors, useCompanies } from "../../../hooks";
import { cn, getSubsidenceColor } from "../../../lib/utils";
import type { Sensor, SensorStatus, SensorType } from "../../../types";

type SortKey = "code" | "location" | "subsidence" | "status" | "type" | "lastUpdate";

const STATUS_ICON: Record<string, JSX.Element> = {
  online: <Wifi size={12} className="text-emerald-500" />,
  offline: <WifiOff size={12} className="text-slate-400" />,
  alert: <AlertTriangle size={12} className="text-red-500" />,
  maintenance: <Settings2 size={12} className="text-amber-500" />,
};

function DetailModal({ sensor, companyName, onClose }: { sensor: Sensor; companyName: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center">
              <Radio size={18} className="text-cyan-600" />
            </div>
            <div>
              <p className="text-[15px] font-bold font-mono text-slate-800">{sensor.code}</p>
              <p className="text-[11px] text-slate-500">{sensor.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusPill status={sensor.status} />
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
            >
              <X size={14} className="text-slate-500" />
            </button>
          </div>
        </div>
        <div className="px-6 py-5 grid grid-cols-2 gap-4">
          {[
            ["Tipe Sensor", sensor.type === "water" ? "Air Tanah (Groundwater)" : "GNSS"],
            ["Perusahaan", companyName],
            ["Koordinat", `${sensor.lat.toFixed(4)}, ${sensor.lng.toFixed(4)}`],
            ["Subsidence", `${sensor.subsidence.toFixed(2)} cm/tahun`],
            ["Muka Air Tanah", sensor.waterLevel ? `${sensor.waterLevel} m` : "-"],
            ["Nilai Vertikal", sensor.verticalValue ? `${sensor.verticalValue} mm` : "-"],
            ["Terakhir Update", sensor.lastUpdate],
            ["Status", sensor.status.charAt(0).toUpperCase() + sensor.status.slice(1)],
          ].map(([k, v]) => (
            <div key={k} className="bg-slate-50 rounded-xl px-3 py-2.5">
              <p className="text-[9px] text-slate-400 font-mono uppercase tracking-wider mb-1">{k}</p>
              <p
                className={cn(
                  "text-[12px] font-semibold",
                  k === "Subsidence" ? getSubsidenceColor(sensor.subsidence) : "text-slate-800",
                )}
              >
                {v}
              </p>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex gap-2">
          <button className="px-4 py-2 bg-slate-100 text-slate-600 text-[12px] font-semibold rounded-xl hover:bg-slate-200 transition-colors">
            Edit Sensor
          </button>
          <button onClick={onClose} className="px-4 py-2 bg-slate-50 text-slate-500 text-[12px] rounded-xl hover:bg-slate-100 transition-colors">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SensorPage() {
  const { data: sensors = [], isLoading } = useSensors();
  const { data: companies = [] } = useCompanies();

  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState<SensorStatus | "all">("all");
  const [typeF, setTypeF] = useState<SensorType | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("code");
  const [sortAsc, setSortAsc] = useState(true);
  const [detail, setDetail] = useState<Sensor | null>(null);

  const data = useMemo(() => {
    let d = [...sensors];
    if (statusF !== "all") d = d.filter((s) => s.status === statusF);
    if (typeF !== "all") d = d.filter((s) => s.type === typeF);
    if (search)
      d = d.filter(
        (s) =>
          s.code.toLowerCase().includes(search.toLowerCase()) ||
          s.location.toLowerCase().includes(search.toLowerCase()),
      );
    d.sort((a, b) => {
      const av: string | number = a[sortKey] as string | number;
      const bv: string | number = b[sortKey] as string | number;
      if (typeof av === "string")
        return sortAsc ? av.localeCompare(bv as string) : (bv as string).localeCompare(av);
      return sortAsc ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
    return d;
  }, [sensors, search, statusF, typeF, sortKey, sortAsc]);

  const sort = (k: SortKey) => {
    setSortKey(k);
    if (sortKey === k) setSortAsc((p) => !p);
    else setSortAsc(true);
  };

  const Th = ({ label, k }: { label: string; k: SortKey }) => (
    <th
      onClick={() => sort(k)}
      className="text-[9px] font-mono text-slate-400 uppercase tracking-wider px-4 py-3 text-left cursor-pointer hover:text-slate-600 whitespace-nowrap select-none"
    >
      <span className="flex items-center gap-1">
        {label}
        <ArrowUpDown size={9} className={sortKey === k ? "text-cyan-500" : "text-slate-300"} />
      </span>
    </th>
  );

  const summary = {
    online: sensors.filter((s) => s.status === "online").length,
    alert: sensors.filter((s) => s.status === "alert").length,
    maintenance: sensors.filter((s) => s.status === "maintenance").length,
    offline: sensors.filter((s) => s.status === "offline").length,
  };

  const getCompanyName = (companyId: string) =>
    companies.find((c) => c.id === companyId)?.name ?? "-";

  return (
    <div className="p-3 sm:p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[18px] font-semibold text-slate-800">Semua Sensor</h1>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
            Kelola dan pantau seluruh sensor terdaftar
          </p>
        </div>
        <button className="px-4 py-2 bg-cyan-600 text-white text-[12px] font-semibold rounded-xl hover:bg-cyan-700 transition-colors flex items-center gap-2">
          <Radio size={13} /> Tambah Sensor
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Online", count: summary.online, color: "#22C55E", bg: "bg-emerald-50", border: "border-emerald-200" },
          { label: "Alert", count: summary.alert, color: "#EF4444", bg: "bg-red-50", border: "border-red-200" },
          { label: "Maintenance", count: summary.maintenance, color: "#F59E0B", bg: "bg-amber-50", border: "border-amber-200" },
          { label: "Offline", count: summary.offline, color: "#94A3B8", bg: "bg-slate-50", border: "border-slate-200" },
        ].map(({ label, count, color, bg, border }) => (
          <div key={label} className={cn("rounded-xl border px-4 py-3 flex items-center gap-3", bg, border)}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: color + "20" }}>
              <span className="text-[14px] font-bold font-mono" style={{ color }}>
                {count}
              </span>
            </div>
            <span className="text-[11px] font-medium text-slate-600">{label}</span>
          </div>
        ))}
      </div>

      {/* Table card */}
      <Card padding={false}>
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 flex-wrap">
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari kode / lokasi..."
              className="pl-8 pr-3 py-1.5 text-[11px] font-mono border border-slate-200 rounded-lg bg-slate-50 text-slate-700 w-48 focus:outline-none focus:border-cyan-400"
            />
          </div>
          <div className="flex gap-1">
            {(["all", "online", "alert", "maintenance", "offline"] as const).map((s) => (
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
                {s === "all" ? "Semua" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex gap-1 ml-1">
            {(["all", "water", "gnss"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTypeF(t)}
                className={cn(
                  "text-[9px] font-mono px-2.5 py-1 rounded-full border transition-all",
                  typeF === t
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : "text-slate-400 border-transparent hover:bg-slate-50",
                )}
              >
                {t === "all" ? "Semua Tipe" : t === "water" ? "Air Tanah" : "GNSS"}
              </button>
            ))}
          </div>
          <span className="ml-auto text-[10px] text-slate-400 font-mono">{data.length} sensor</span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-[11px] text-slate-400 font-mono">
            Memuat data sensor...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" style={{ minWidth: "640px" }}>
              <thead className="bg-slate-50/60 border-b border-slate-100">
                <tr>
                  <Th label="Kode" k="code" />
                  <Th label="Lokasi" k="location" />
                  <Th label="Tipe" k="type" />
                  <Th label="Subsidence" k="subsidence" />
                  <th className="text-[9px] font-mono text-slate-400 uppercase tracking-wider px-4 py-3 text-left">
                    Muka Air
                  </th>
                  <Th label="Status" k="status" />
                  <Th label="Update" k="lastUpdate" />
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {data.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3 font-mono text-[12px] font-bold text-slate-800">{s.code}</td>
                    <td className="px-4 py-3 text-[11px] text-slate-600">{s.location}</td>
                    <td className="px-4 py-3">
                      <Badge variant={s.type === "water" ? "info" : "neutral"}>
                        {s.type === "water" ? "Air Tanah" : "GNSS"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("text-[12px] font-semibold font-mono", getSubsidenceColor(s.subsidence))}>
                        {s.subsidence.toFixed(2)}
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono ml-0.5">cm/thn</span>
                    </td>
                    <td className="px-4 py-3 text-[11px] font-mono text-slate-600">
                      {s.waterLevel ?? "-"}
                      {s.waterLevel ? " m" : ""}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {STATUS_ICON[s.status] ?? STATUS_ICON.offline}
                        <StatusPill status={s.status} />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[10px] text-slate-400 font-mono">{s.lastUpdate}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setDetail(s)}
                        className="text-[10px] font-mono text-cyan-600 hover:text-cyan-800 font-medium whitespace-nowrap"
                      >
                        Detail →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {detail && (
        <DetailModal
          sensor={detail}
          companyName={getCompanyName(detail.companyId)}
          onClose={() => setDetail(null)}
        />
      )}
    </div>
  );
}