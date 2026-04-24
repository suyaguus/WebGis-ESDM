import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import SensorMap from "../../../components/map/SensorMap";
import { StatusPill } from "../../../components/ui";
import { useSensors } from "@/hooks/useSensors";
import { useAuthStore } from "@/store";
import { cn } from "../../../lib/utils";
import {
  getWaterLevelTrendLabel,
  getWaterLevelTrendColor,
} from "../../../lib/groundwater";
import type { Sensor, SensorStatus, SensorType } from "../../../types";

export default function AdminPetaPage() {
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState<SensorStatus | "all">("all");
  const [typeF, setTypeF] = useState<SensorType | "all">("all");
  const [selected, setSelected] = useState<Sensor | null>(null);
  const [filterOpen, setFilterOpen] = useState(false); // mobile: filter panel toggle
  const [sidebar, setSidebar] = useState(true); // desktop: sidebar toggle

  const { user } = useAuthStore();
  const companyId = user?.companyId ?? "";
  const { data: sensorsResponse = { data: [] }, isLoading } = useSensors({
    companyId: companyId || undefined,
  });
  const sensors = sensorsResponse.data ?? [];

  const filtered = useMemo(
    () =>
      sensors.filter((s) => {
        if (statusF !== "all" && s.status !== statusF) return false;
        if (typeF !== "all" && s.type !== typeF) return false;
        if (
          search &&
          !s.code.toLowerCase().includes(search.toLowerCase()) &&
          !s.location.toLowerCase().includes(search.toLowerCase())
        )
          return false;
        return true;
      }),
    [sensors, search, statusF, typeF],
  );

  const FilterControls = () => (
    <>
      {/* Search */}
      <div className="relative mb-2">
        <Search
          size={12}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari kode / lokasi..."
          className="w-full pl-8 pr-3 py-1.5 text-[11px] font-mono border border-slate-200 rounded-lg bg-slate-50 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-amber-400"
        />
      </div>
      {/* Status filter */}
      <div className="flex flex-wrap gap-1 mb-1.5">
        {(["all", "online", "alert", "maintenance", "offline"] as const).map(
          (s) => (
            <button
              key={s}
              onClick={() => setStatusF(s)}
              className={cn(
                "text-[9px] font-mono px-2 py-0.5 rounded-full border transition-all",
                statusF === s
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : "text-slate-400 border-transparent hover:bg-slate-50",
              )}
            >
              {s === "all" ? "Semua" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ),
        )}
      </div>
      {/* Type filter */}
      <div className="flex gap-1">
        {(["all", "water", "gnss"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTypeF(t)}
            className={cn(
              "text-[9px] font-mono px-2 py-0.5 rounded-full border transition-all",
              typeF === t
                ? "bg-blue-50 text-blue-700 border-blue-200"
                : "text-slate-400 border-transparent hover:bg-slate-50",
            )}
          >
            {t === "all" ? "Semua Tipe" : t === "water" ? "Air Tanah" : "GNSS"}
          </button>
        ))}
      </div>
    </>
  );

  return (
    <div
      className="flex flex-col h-full min-w-0 overflow-hidden"
      style={{ minHeight: 0 }}
    >
      {/* ── MOBILE: Filter panel (collapsible top bar) ── */}
      <div className="md:hidden flex-shrink-0 bg-white border-b border-slate-100">
        <button
          onClick={() => setFilterOpen((o) => !o)}
          className="w-full flex items-center justify-between px-4 py-2.5 text-[12px] font-semibold text-slate-700"
        >
          <span className="flex items-center gap-2">
            <Filter size={13} className="text-amber-500" />
            Filter Sensor
            <span className="text-[9px] font-mono text-slate-400">
              {filtered.length} sensor
            </span>
          </span>
          {filterOpen ? (
            <ChevronUp size={14} className="text-slate-400" />
          ) : (
            <ChevronDown size={14} className="text-slate-400" />
          )}
        </button>
        {filterOpen && (
          <div className="px-4 pb-3 border-t border-slate-50">
            <div className="mt-2">
              <FilterControls />
            </div>
          </div>
        )}
      </div>

      {/* ── MOBILE: Sensor list (compact) ── */}
      <div className="md:hidden flex-shrink-0 max-h-[28vh] overflow-y-auto bg-white border-b border-slate-100 divide-y divide-slate-50">
        {filtered.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelected(s)}
            className={cn(
              "w-full text-left px-4 py-2 flex items-center gap-3 transition-colors",
              selected?.id === s.id ? "bg-amber-50" : "hover:bg-slate-50/60",
              s.status === "alert" && "border-l-2 border-l-red-400",
            )}
          >
            <span className="text-[11px] font-bold font-mono text-slate-800 w-16 flex-shrink-0">
              {s.code}
            </span>
            <span className="text-[10px] text-slate-500 flex-1 truncate">
              {s.location}
            </span>
            <div className="flex items-center gap-1 flex-shrink-0">
              {s.waterLevelTrend === "rising" && (
                <TrendingUp size={11} className="text-emerald-600" />
              )}
              {s.waterLevelTrend === "falling" && (
                <TrendingDown size={11} className="text-amber-600" />
              )}
              {s.waterLevelTrend === "stable" && (
                <Minus size={11} className="text-blue-600" />
              )}
              <span
                className={cn(
                  "text-[10px] font-mono font-semibold",
                  getWaterLevelTrendColor(s.waterLevelTrend),
                )}
              >
                {getWaterLevelTrendLabel(s.waterLevelTrend)}
              </span>
            </div>
            <StatusPill status={s.status} />
          </button>
        ))}
      </div>

      {/* ── DESKTOP: Side-by-side layout ── */}
      <div
        className="hidden md:flex flex-1 min-w-0 overflow-hidden"
        style={{ minHeight: 0 }}
      >
        {/* Desktop sidebar */}
        {sidebar && (
          <div className="w-64 xl:w-[272px] flex-shrink-0 bg-white border-r border-slate-100 flex flex-col overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-slate-100 flex-shrink-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] font-semibold text-slate-800">
                  Filter Sensor
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {filtered.length} sensor
                </span>
              </div>
              <FilterControls />
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
              {filtered.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelected(s)}
                  className={cn(
                    "w-full text-left px-4 py-3 transition-colors",
                    selected?.id === s.id
                      ? "bg-amber-50"
                      : "hover:bg-slate-50/60",
                    s.status === "alert" && "border-l-2 border-l-red-400",
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] font-bold font-mono text-slate-800">
                      {s.code}
                    </span>
                    <StatusPill status={s.status} />
                  </div>
                  <p className="text-[10px] text-slate-500 mb-1">
                    {s.location}
                  </p>
                  <div className="flex items-center gap-1">
                    {s.waterLevelTrend === "rising" && (
                      <TrendingUp size={11} className="text-emerald-600" />
                    )}
                    {s.waterLevelTrend === "falling" && (
                      <TrendingDown size={11} className="text-amber-600" />
                    )}
                    {s.waterLevelTrend === "stable" && (
                      <Minus size={11} className="text-blue-600" />
                    )}
                    <span
                      className={cn(
                        "text-[10px] font-mono font-semibold",
                        getWaterLevelTrendColor(s.waterLevelTrend),
                      )}
                    >
                      {getWaterLevelTrendLabel(s.waterLevelTrend)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/60 flex-shrink-0 space-y-1">
              {[
                ["#3B82F6", "Air Tanah"],
                ["#F59E0B", "GNSS"],
                ["#EF4444", "Alert"],
                ["#94A3B8", "Maintenance"],
              ].map(([c, l]) => (
                <div key={l} className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: c }}
                  />
                  <span className="text-[9px] font-mono text-slate-500">
                    {l}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Desktop map */}
        <div className="flex-1 relative min-w-0 overflow-hidden">
          <button
            onClick={() => setSidebar((p) => !p)}
            className="absolute top-2 left-2 sm:top-3 sm:left-3 z-[1000] max-w-[calc(100vw-1rem)] overflow-hidden text-ellipsis whitespace-nowrap bg-white border border-slate-200 rounded-lg px-2 py-1 sm:px-2.5 sm:py-1.5 text-[9px] sm:text-[10px] font-mono text-slate-600 hover:bg-slate-50 shadow-sm flex items-center gap-1 sm:gap-1.5"
          >
            <Filter size={10} /> {sidebar ? "Sembunyikan" : "Filter"}
          </button>
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-[1000] flex flex-col sm:flex-row gap-1 sm:gap-2 max-w-[calc(100vw-1rem)] items-end sm:items-start">
            {[
              {
                label: "Online",
                count: sensors.filter((s) => s.status === "online").length,
                color: "text-emerald-600 bg-emerald-50 border-emerald-200",
              },
              {
                label: "Alert",
                count: sensors.filter((s) => s.status === "alert").length,
                color: "text-red-600 bg-red-50 border-red-200",
              },
            ].map(({ label, count, color }) => (
              <div
                key={label}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[10px] font-mono font-medium shadow-sm",
                  color,
                )}
              >
                {count} {label}
              </div>
            ))}
          </div>
          {selected && (
            <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-[1000] bg-white border border-amber-200 rounded-xl shadow-lg px-3 py-3 sm:px-5 sm:py-4 w-auto sm:w-[300px] max-w-[calc(100vw-1rem)]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-bold font-mono text-amber-700">
                    {selected.code}
                  </span>
                  <StatusPill status={selected.status} />
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="text-slate-400 hover:text-slate-600 text-lg leading-none"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-1.5">
                {[
                  ["Lokasi", selected.location],
                  ["Tipe", selected.type === "water" ? "Air Tanah" : "GNSS"],
                  [
                    "Tren Muka Air",
                    getWaterLevelTrendLabel(selected.waterLevelTrend),
                  ],
                  [
                    "Muka Air Tanah",
                    selected.staticWaterLevel !== null &&
                    selected.staticWaterLevel !== undefined
                      ? `${(selected.staticWaterLevel * 100).toFixed(2)} cm`
                      : "-",
                  ],
                  ["Update", selected.lastUpdate],
                ].map(([k, v]) => (
                  <div key={k}>
                    <p className="text-[9px] text-slate-400 font-mono">{k}</p>
                    <p className="text-[11px] font-medium text-slate-700">
                      {v}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <SensorMap
            sensors={filtered}
            height="100%"
            onMarkerClick={setSelected}
          />
        </div>
      </div>

      {/* ── MOBILE: Map (takes remaining space) ── */}
      <div
        className="md:hidden flex-1 relative overflow-hidden"
        style={{ minHeight: "200px" }}
      >
        {selected && (
          <div className="absolute bottom-2 left-2 right-2 z-[1000] bg-white border border-amber-200 rounded-xl shadow-lg px-3 py-3 max-w-[calc(100vw-1rem)]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-bold font-mono text-amber-700">
                  {selected.code}
                </span>
                <StatusPill status={selected.status} />
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-slate-400 hover:text-slate-600 w-6 h-6 flex items-center justify-center"
              >
                <X size={14} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              {[
                ["Lokasi", selected.location],
                ["Tipe", selected.type === "water" ? "Air Tanah" : "GNSS"],
                [
                  "Tren Muka Air",
                  getWaterLevelTrendLabel(selected.waterLevelTrend),
                ],
                [
                  "Muka Air Tanah",
                  selected.staticWaterLevel !== null &&
                  selected.staticWaterLevel !== undefined
                    ? `${(selected.staticWaterLevel * 100).toFixed(2)} cm`
                    : "-",
                ],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-[8px] text-slate-400 font-mono uppercase">
                    {k}
                  </p>
                  <p className="text-[10px] font-medium text-slate-700">{v}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        <SensorMap
          sensors={filtered}
          height="100%"
          onMarkerClick={setSelected}
        />
      </div>
    </div>
  );
}
