import { useMemo } from "react";
import { Map } from "lucide-react";
import SensorMap from "../../../components/map/SensorMap";
import { SectionHeader } from "../../../components/ui";
import { usePublicSensors } from "@/hooks/useSensors";
import { cn } from "../../../lib/utils";

export default function KadisMapSection() {
  const { data: allSensors = [] } = usePublicSensors();

  const approvedSensors = useMemo(
    () => allSensors.filter((s) => s.wellStatus === "approved"),
    [allSensors],
  );

  const pantauCount = useMemo(
    () => approvedSensors.filter((s) => s.wellType === "sumur_pantau").length,
    [approvedSensors],
  );
  const galiCount = useMemo(
    () => approvedSensors.filter((s) => s.wellType === "sumur_gali").length,
    [approvedSensors],
  );
  const borCount = useMemo(
    () => approvedSensors.filter((s) => s.wellType === "sumur_bor").length,
    [approvedSensors],
  );

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
      <SectionHeader
        title="Peta Sebaran Sumur Provinsi"
        icon={<Map size={13} />}
        accent="#059669"
        subtitle={`${approvedSensors.length} SUMUR`}
      />

      <div className="px-4 py-2 border-b border-slate-100 flex items-center gap-4 bg-slate-50/40 flex-shrink-0">
        {[
          { label: "Sumur Pantau", count: pantauCount, color: "#3B82F6" },
          { label: "Sumur Gali",   count: galiCount,   color: "#8B5CF6" },
          { label: "Sumur Bor",    count: borCount,    color: "#06B6D4" },
        ].map(({ label, count, color }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: color }}
            />
            <span className="text-[10px] font-mono font-semibold text-slate-700">
              {count}
            </span>
            <span className="text-[9px] font-mono text-slate-400">{label}</span>
          </div>
        ))}
      </div>

      <div style={{ height: "clamp(380px, 55vw, 520px)" }}>
        <SensorMap sensors={approvedSensors} height="100%" />
      </div>
    </div>
  );
}
