import { useState } from "react";
import { Map } from "lucide-react";
import { SectionHeader, StatusPill } from "../../../components/ui";
import SensorMap from "../../../components/map/SensorMap";
import { useSensors } from "@/hooks/useSensors";
import { useAuthStore } from "@/store";
import { cn, getSubsidenceColor } from "../../../lib/utils";
import type { Sensor } from "../../../types";

export default function AdminMapSection() {
  const [selected, setSelected] = useState<Sensor | null>(null);
  const { user } = useAuthStore();
  const companyId = user?.companyId ?? "";
  const { data: sensorsResponse = { data: [] }, isLoading } = useSensors({
    companyId: companyId || undefined,
  });
  const sensors = sensorsResponse.data ?? [];

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col min-w-0">
      <SectionHeader
        title="Peta Sensor Perusahaan"
        subtitle={isLoading ? "MEMUATâ€¦" : `${sensors.length} SENSOR`}
        icon={<Map size={13} />}
        accent="#F59E0B"
      />

      {/* Summary chips */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
        {[
          {
            label: "Online",
            count: sensors.filter((s) => s.status === "online").length,
            color: "bg-emerald-50 text-emerald-700 border-emerald-200",
          },
          {
            label: "Offline",
            count: sensors.filter((s) => s.status === "offline").length,
            color: "bg-red-50 text-red-700 border-red-200",
          },
        ].map(({ label, count, color }) => (
          <span
            key={label}
            className={cn(
              "text-[9px] font-mono font-medium px-2.5 py-1 rounded-full border",
              color,
            )}
          >
            {count} {label}
          </span>
        ))}
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
          <span className="text-[9px] font-mono text-slate-400">
            LIVE Â· 30s
          </span>
        </div>
      </div>

      {/* Map */}
      <div
        className="relative min-h-[220px]"
        style={{ height: "clamp(220px, 60vw, 360px)" }}
      >
        <SensorMap
          sensors={sensors}
          height="100%"
          onMarkerClick={setSelected}
        />

        {/* Legend */}
        <div className="absolute bottom-3 left-3 bg-white/95 border border-slate-100 rounded-xl shadow-sm px-3 py-2.5 z-[1000]">
          {[
            ["#3B82F6", "Air Tanah"],
            ["#94A3B8", "Offline"],
          ].map(([c, l]) => (
            <div key={l} className="flex items-center gap-2 mb-1.5 last:mb-0">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: c }}
              />
              <span className="text-[9px] font-mono text-slate-500">{l}</span>
            </div>
          ))}
        </div>

        {/* Selected sensor card */}
        {selected && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-white border border-amber-200 rounded-xl shadow-lg px-4 py-3 z-[1000] min-w-[200px]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13px] font-bold font-mono text-amber-700">
                {selected.code}
              </span>
              <button
                onClick={() => setSelected(null)}
                className="text-slate-400 hover:text-slate-600 ml-3"
              >
                âœ•
              </button>
            </div>
            <p className="text-[10px] text-slate-500 mb-2">
              {selected.location}
            </p>
            <div className="space-y-1">
              {selected.waterLevel != null && (
                <div className="flex justify-between">
                  <span className="text-[9px] text-slate-400 font-mono">
                    Muka Air
                  </span>
                  <span className="text-[10px] font-mono text-slate-700">
                    {selected.waterLevel} m
                  </span>
                </div>
              )}
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100">
              <StatusPill status={selected.status} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
