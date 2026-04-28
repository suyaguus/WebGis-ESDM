import { Building2, ChevronRight } from "lucide-react";
import { SectionHeader } from "../../../components/ui";
import { useCompanies } from "../../../hooks";
import { cn, getQuotaPercent, getSubsidenceColor } from "../../../lib/utils";
import { useAppStore } from "../../../store";

export default function KadisComplianceTable() {
  const { setActivePage } = useAppStore();
  const { data: companiesResponse, isLoading } = useCompanies({ limit: 100 });
  const companies = companiesResponse?.data ?? [];

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
      <SectionHeader
        title="Kepatuhan Perusahaan"
        icon={<Building2 size={13} />}
        accent="#059669"
        subtitle={`${companies.length} TERDAFTAR`}
        action={
          <button
            onClick={() => setActivePage("kadis-perusahaan")}
            className="flex items-center gap-1 text-[10px] text-emerald-600 hover:text-emerald-700 font-mono"
          >
            Lihat semua <ChevronRight size={10} />
          </button>
        }
      />

      <div className="overflow-x-auto flex-1">
        {isLoading ? (
          <div className="flex items-center justify-center py-12 text-[11px] text-slate-400 font-mono">
            Memuat data…
          </div>
        ) : (
          <table className="w-full" style={{ minWidth: 480 }}>
            <thead className="bg-slate-50/60 border-b border-slate-100">
              <tr>
                {[
                  "Perusahaan",
                  "Wilayah",
                  "Subsidence",
                  "Kuota",
                  "Sensor",
                  "Status",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-[9px] font-mono text-slate-400 uppercase tracking-wider px-4 py-2.5 text-left whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {companies.map((c) => {
                const pct = getQuotaPercent(c.quotaUsed, c.quota);
                const pctColor =
                  pct >= 100 ? "#EF4444" : pct >= 85 ? "#F59E0B" : "#22C55E";
                const isOver = pct >= 100;
                return (
                  <tr
                    key={c.id}
                    className={cn(
                      "hover:bg-slate-50/40 transition-colors",
                      isOver && "bg-red-50/30",
                    )}
                  >
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        {isOver && (
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                        )}
                        <span className="text-[12px] font-semibold text-slate-800">
                          {c.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-[11px] text-slate-500 font-mono">
                      {c.region}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={cn(
                          "text-[11px] font-semibold font-mono",
                          getSubsidenceColor(c.avgSubsidence),
                        )}
                      >
                        {c.avgSubsidence.toFixed(2)}
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono ml-1">
                        cm/thn
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2 min-w-[80px]">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${Math.min(pct, 100)}%`,
                              background: pctColor,
                            }}
                          />
                        </div>
                        <span
                          className="text-[10px] font-mono font-semibold"
                          style={{ color: pctColor }}
                        >
                          {pct}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-[11px] font-mono text-slate-600">
                      {c.sensorCount}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={cn(
                          "text-[9px] font-mono px-2 py-0.5 rounded-full border",
                          c.status === "online"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : c.status === "offline"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : "bg-amber-50 text-amber-700 border-amber-200",
                        )}
                      >
                        {c.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
