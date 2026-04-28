import { useState, useMemo } from "react";
import { Droplets, Search, ChevronDown, ChevronUp } from "lucide-react";
import { Card, SectionHeader } from "../../../components/ui";
import { useSensors } from "../../../hooks";
import { cn } from "../../../lib/utils";
import type { Sensor } from "../../../types";

type SortKey = "code" | "location";

export default function KadisSumurPage() {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("code");
  const [sortAsc, setSortAsc] = useState(true);
  const [wellTypeFilter, setWellTypeFilter] = useState<string | null>(null);

  // Fetch real data from API
  const { data: sensorsResponse = { data: [] } } = useSensors({
    wellStatus: "approved",
    limit: 500,
  });
  const wells = sensorsResponse.data ?? [];

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return [...wells]
      .filter(
        (w) =>
          (!q ||
            w.code.toLowerCase().includes(q) ||
            w.location.toLowerCase().includes(q)) &&
          (!wellTypeFilter || w.wellType === wellTypeFilter),
      )
      .sort((a, b) => {
        const va = a[sortKey];
        const vb = b[sortKey];
        return sortAsc
          ? va < vb
            ? -1
            : va > vb
              ? 1
              : 0
          : va > vb
            ? -1
            : va < vb
              ? 1
              : 0;
      });
  }, [search, sortKey, sortAsc, wells, wellTypeFilter]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc((p) => !p);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const SortIcon = ({ col }: { col: SortKey }) =>
    sortKey === col ? (
      sortAsc ? (
        <ChevronUp size={11} className="text-emerald-600" />
      ) : (
        <ChevronDown size={11} className="text-emerald-600" />
      )
    ) : (
      <ChevronDown size={11} className="text-slate-300" />
    );

  const wellTypes = [
    { value: "sumur_pantau", label: "Pantau", color: "#3B82F6" },
    { value: "sumur_gali", label: "Gali", color: "#F59E0B" },
    { value: "sumur_bor", label: "Bor", color: "#EF4444" },
  ];

  const typeStats = wellTypes.map(({ value, label, color }) => ({
    label,
    color,
    count: wells.filter((w) => w.wellType === value).length,
    value,
  }));

  return (
    <div className="p-3 sm:p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[18px] font-semibold text-slate-800">
            Data Sumur
          </h1>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
            Pemantauan {wells.length} sumur air tanah terdaftar
          </p>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {(() => {
          const totalWells = wells.length;
          const activeWells = wells.filter((w) => w.isActive).length;
          const wellsWithLevel = wells.filter(
            (w) => w.staticWaterLevel !== null,
          );
          const avgWaterLevel =
            wellsWithLevel.length > 0
              ? wellsWithLevel.reduce(
                  (s, w) => s + (w.staticWaterLevel ?? 0),
                  0,
                ) / wellsWithLevel.length
              : null;

          const activePct =
            totalWells > 0
              ? ((activeWells / totalWells) * 100).toFixed(0)
              : "0";

          return [
            {
              label: "Total Sumur",
              value: String(totalWells),
              color: "#059669",
            },
            {
              label: "Sumur Aktif",
              value: `${activePct}%`,
              sub: `${activeWells} dari ${totalWells}`,
              color: "#0891B2",
            },
            {
              label: "Rata-rata Muka Air",
              value:
                avgWaterLevel !== null ? `${avgWaterLevel.toFixed(2)} m` : "-",
              color: "#3B82F6",
            },
          ].map(({ label, value, color, sub }) => (
            <div
              key={label}
              className="bg-white rounded-xl border border-slate-100 shadow-sm px-4 py-3 relative overflow-hidden"
            >
              <div
                className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl"
                style={{ background: color }}
              />
              <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                {label}
              </p>
              <p className="text-[20px] font-bold font-mono" style={{ color }}>
                {value}
              </p>
              {sub && (
                <p className="text-[9px] font-mono text-slate-500 mt-1">
                  {sub}
                </p>
              )}
            </div>
          ));
        })()}
      </div>

      {/* Type Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        {typeStats.map(({ label, color, count, value }) => (
          <button
            key={value}
            onClick={() =>
              setWellTypeFilter(wellTypeFilter === value ? null : value)
            }
            className={cn(
              "p-4 rounded-xl border-2 transition-all",
              wellTypeFilter === value
                ? "border-slate-800 bg-slate-50"
                : "border-slate-200 bg-white hover:border-slate-300",
            )}
          >
            <p className="text-[9px] font-mono text-slate-500 mb-1">{label}</p>
            <p className="text-[20px] font-bold font-mono" style={{ color }}>
              {count}
            </p>
          </button>
        ))}
      </div>

      <div className="grid gap-4 grid-cols-1">
        {/* Table */}
        <Card padding={false}>
          <SectionHeader
            title="Daftar Sumur"
            icon={<Droplets size={13} />}
            accent="#0891B2"
            subtitle={`${filtered.length} sumur`}
            action={
              <div className="relative">
                <Search
                  size={11}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari kode / lokasi..."
                  className="pl-7 pr-3 py-1 text-[10px] font-mono border border-slate-200 rounded-lg bg-slate-50 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-emerald-400 w-56"
                />
              </div>
            }
          />
          <div className="overflow-x-auto">
            <table className="w-full" style={{ minWidth: 700 }}>
              <thead className="bg-slate-50/60 border-b border-slate-100">
                <tr>
                  {(
                    [
                      ["code", "Kode Sumur"],
                      ["location", "Lokasi"],
                      [null, "Tipe"],
                      [null, "Perusahaan"],
                      [null, "Muka Air (m)"],
                      [null, "Status"],
                    ] as const
                  ).map(([col, label]) => (
                    <th
                      key={label}
                      className={cn(
                        "text-[9px] font-mono text-slate-400 uppercase tracking-wider px-4 py-2.5 text-left whitespace-nowrap",
                        col &&
                          "cursor-pointer hover:text-slate-600 select-none",
                      )}
                      onClick={() => col && toggleSort(col as SortKey)}
                    >
                      <span className="flex items-center gap-1">
                        {label}
                        {col && <SortIcon col={col as SortKey} />}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((w) => (
                  <tr
                    key={w.id}
                    className="hover:bg-slate-50/40 transition-colors"
                  >
                    <td className="px-4 py-2.5">
                      <span className="text-[12px] font-semibold font-mono text-slate-800">
                        {w.code}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-[11px] text-slate-600">
                      {w.location}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-[10px] font-mono px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                        {w.wellType === "sumur_pantau"
                          ? "Pantau"
                          : w.wellType === "sumur_gali"
                            ? "Gali"
                            : "Bor"}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-[11px] font-mono text-slate-600">
                      {w.companyId ? w.companyId.substring(0, 8) : "-"}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-[11px] font-semibold font-mono text-blue-600">
                        {w.staticWaterLevel !== null
                          ? `${w.staticWaterLevel.toFixed(2)}`
                          : "-"}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={cn(
                          "text-[9px] font-mono px-2 py-0.5 rounded-full border",
                          w.isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-100 text-slate-600 border-slate-200",
                        )}
                      >
                        {w.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
