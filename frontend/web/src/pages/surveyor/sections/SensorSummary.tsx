import { Radio, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Card, SectionHeader, StatusPill } from "../../../components/ui";
import { cn, getSubsidenceColor } from "../../../lib/utils";
import { useSensors } from "../../../hooks";
import { useAuthStore } from "../../../store";
import { useAppStore } from "../../../store";

export default function SensorSummary() {
  const { setActivePage } = useAppStore();
  const user = useAuthStore((s) => s.user);
  const companyId = user?.companyId ?? "";
  const { data: sensors = [] } = useSensors(
    companyId ? { companyId } : undefined,
  );

  return (
    <Card padding={false} className="flex flex-col">
      <SectionHeader
        title="Sensor Saya"
        subtitle={`${sensors.length} SENSOR`}
        icon={<Radio size={13} />}
        accent="#3B82F6"
      />
      <div className="divide-y divide-slate-50">
        {sensors.map((sensor) => (
          <div
            key={sensor.id}
            className={cn(
              "px-4 py-3 flex items-center gap-3 hover:bg-slate-50/60 transition-colors",
              sensor.status === "alert" && "border-l-2 border-l-red-400",
            )}
          >
            {/* Icon */}
            <div
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                sensor.status === "alert" ? "bg-red-100" : "bg-blue-100",
              )}
            >
              {sensor.status === "alert" ? (
                <AlertTriangle size={14} className="text-red-600" />
              ) : (
                <CheckCircle2 size={14} className="text-blue-600" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[12px] font-bold font-mono text-slate-800">
                  {sensor.code}
                </span>
                <span
                  className={cn(
                    "text-[9px] font-mono px-1 py-0.5 rounded",
                    sensor.type === "gnss"
                      ? "text-amber-600 bg-amber-50"
                      : "text-blue-600 bg-blue-50",
                  )}
                >
                  {sensor.type === "gnss" ? "GNSS" : "AT"}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 truncate">
                {sensor.location}
              </p>
            </div>

            {/* Values */}
            <div className="text-right flex-shrink-0">
              <p
                className={cn(
                  "text-[11px] font-mono font-semibold",
                  getSubsidenceColor(sensor.subsidence),
                )}
              >
                {sensor.subsidence.toFixed(2)} cm/thn
              </p>
              {sensor.waterLevel && (
                <p className="text-[9px] font-mono text-slate-400">
                  MAT: {sensor.waterLevel} m
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
          onClick={() => setActivePage("sv-sensor")}
          className="text-[11px] text-blue-600 hover:text-blue-700 font-medium w-full text-center"
        >
          Detail sensor →
        </button>
      </div>
    </Card>
  );
}
