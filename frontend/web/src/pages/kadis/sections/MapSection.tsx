import { useState } from "react";
import { Map, Layers } from "lucide-react";
import SensorMap from "../../../components/map/SensorMap";
import { SectionHeader } from "../../../components/ui";
import { useSensors } from "../../../hooks";
import { cn } from "../../../lib/utils";

const LAYER_OPTS = ["Peta Jalan", "Satelit", "Terrain"] as const;

export default function KadisMapSection() {
  const [layer, setLayer] = useState<(typeof LAYER_OPTS)[number]>("Peta Jalan");
  const { data: sensors = [] } = useSensors();

  const alertCount = sensors.filter((s) => s.status === "alert").length;
  const onlineCount = sensors.filter((s) => s.status === "online").length;
  const maintenanceCount = sensors.filter(
    (s) => s.status === "maintenance",
  ).length;
  const offlineCount = sensors.filter((s) => s.status === "offline").length;

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
      <SectionHeader
        title="Peta Sebaran Sensor Provinsi"
        icon={<Map size={13} />}
        accent="#059669"
        subtitle={`${sensors.length} SENSOR`}
        action={
          <div className="flex gap-1 bg-slate-100 rounded-lg p-0.5">
            {LAYER_OPTS.map((l) => (
              <button
                key={l}
                onClick={() => setLayer(l)}
                className={cn(
                  "text-[9px] font-mono px-2 py-0.5 rounded-md transition-all",
                  layer === l
                    ? "bg-white text-slate-700 shadow-sm"
                    : "text-slate-400 hover:text-slate-600",
                )}
              >
                {l}
              </button>
            ))}
          </div>
        }
      />

      <div className="px-4 py-2 border-b border-slate-100 flex items-center gap-4 bg-slate-50/40 flex-shrink-0">
        {[
          { label: "Online", count: onlineCount, color: "text-emerald-600" },
          { label: "Alert", count: alertCount, color: "text-red-600" },
          { label: "Maint", count: maintenanceCount, color: "text-amber-600" },
          { label: "Offline", count: offlineCount, color: "text-slate-400" },
        ].map(({ label, count, color }) => (
          <div key={label} className="flex items-center gap-1.5">
            <Layers size={10} className={color} />
            <span className={cn("text-[10px] font-mono font-semibold", color)}>
              {count}
            </span>
            <span className="text-[9px] font-mono text-slate-400">{label}</span>
          </div>
        ))}
      </div>

      <div
        className="flex-1 min-h-[220px]"
        style={{ height: "clamp(220px, 58vw, 360px)" }}
      >
        <SensorMap sensors={sensors} height="100%" />
      </div>
    </div>
  );
}
