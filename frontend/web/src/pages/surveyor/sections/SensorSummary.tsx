import { Radio, AlertTriangle, CheckCircle2, Droplets } from "lucide-react";
import { Card, SectionHeader } from "../../../components/ui";
import { cn } from "../../../lib/utils";
import { useSensors } from "../../../hooks";
import { useAuthStore } from "../../../store";
import { useAppStore } from "../../../store";

export default function SensorSummary() {
  const { setActivePage } = useAppStore();
  const user = useAuthStore((s) => s.user);
  const { data = {} } = useSensors();
  const sensors = data.data ?? [];

  return (
    <Card padding={false} className="flex flex-col">
      <SectionHeader
        title="Data Sumur"
        subtitle={`${sensors.length} SUMUR`}
        icon={<Radio size={13} />}
        accent="#3B82F6"
      />
      <div className="divide-y divide-slate-50">
        {sensors.map((sensor) => (
          <div
            key={sensor.id}
            className={cn(
              "px-4 py-3 flex items-center gap-3 hover:bg-slate-50/60 transition-colors",
              sensor.wellStatus === "pending_approval" &&
                "border-l-2 border-l-orange-400",
            )}
          >
            {/* Icon */}
            <div
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-lg",
                sensor.wellStatus === "pending_approval"
                  ? "bg-orange-100"
                  : "bg-blue-100",
              )}
            >
              {sensor.wellType === "sumur_pantau"
                ? "🔍"
                : sensor.wellType === "sumur_gali"
                  ? "⛏️"
                  : "🪛"}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[12px] font-bold font-mono text-slate-800 truncate">
                  {sensor.code}
                </span>
                {sensor.wellStatus === "pending_approval" && (
                  <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-orange-100 text-orange-600 flex-shrink-0">
                    Pending
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-500 truncate">
                {sensor.companyName}
              </p>
            </div>

            {/* Values */}
            <div className="text-right flex-shrink-0">
              {sensor.isActive && (
                <p className="text-[11px] font-mono font-semibold text-green-600">
                  🟢 Aktif
                </p>
              )}
              {sensor.staticWaterLevel !== null && (
                <p className="text-[9px] font-mono text-blue-600">
                  {sensor.staticWaterLevel.toFixed(2)} m
                </p>
              )}
              <p className="text-[8px] font-mono text-slate-400">
                {sensor.lastUpdate}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/50 flex-shrink-0">
        <button
          onClick={() => setActivePage("sv-sumur")}
          className="text-[11px] text-blue-600 hover:text-blue-700 font-medium w-full text-center"
        >
          Lihat semua sumur →
        </button>
      </div>
    </Card>
  );
}
