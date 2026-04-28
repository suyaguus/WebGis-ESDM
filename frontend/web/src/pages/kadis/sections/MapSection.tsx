import { useState } from "react";
import { Map, Layers } from "lucide-react";
import SensorMap from "../../../components/map/SensorMap";
import { SectionHeader } from "../../../components/ui";
import { useSensors } from "../../../hooks";
import { cn } from "../../../lib/utils";

const LAYER_OPTS = ["Peta Jalan", "Satelit", "Terrain"] as const;

export default function KadisMapSection() {
  const [layer, setLayer] = useState<(typeof LAYER_OPTS)[number]>("Peta Jalan");
  const { data = {} } = useSensors();
  const sensors = data.data ?? [];

  const activeSensors = sensors.filter((s) => s.status === "online").length;
  const inactiveSensors = sensors.filter((s) => s.status === "offline").length;
  const pendingApprovals = sensors.filter(
    (s) => s.wellStatus === "pending_approval",
  ).length;
  const rejectedSensors = sensors.filter(
    (s) => s.wellStatus === "rejected",
  ).length;

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
      <SectionHeader
        title="Peta Sebaran Sumur Provinsi"
        icon={<Map size={13} />}
        accent="#059669"
        subtitle={`${sensors.length} SUMUR`}
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
          { label: "Aktif", count: activeSensors, color: "text-emerald-600" },
          {
            label: "Non-aktif",
            count: inactiveSensors,
            color: "text-slate-400",
          },
          {
            label: "Pending",
            count: pendingApprovals,
            color: "text-amber-600",
          },
          { label: "Ditolak", count: rejectedSensors, color: "text-red-600" },
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
