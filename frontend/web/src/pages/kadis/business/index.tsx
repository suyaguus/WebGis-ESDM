import { useState, useMemo } from "react";
import { Briefcase, Search, ChevronDown, ChevronUp } from "lucide-react";
import { Card, SectionHeader } from "../../../components/ui";
import { useBusinesses, useSensors } from "../../../hooks";
import { cn } from "../../../lib/utils";
import type { Business } from "../../../services/business.service";

export default function KadisBusinessPage() {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<"name">("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [selected, setSelected] = useState<Business | null>(null);

  // Fetch real data from API
  const { data: businessesResponse = { data: [] } } = useBusinesses({
    limit: 500,
  });
  const businesses = businessesResponse.data ?? [];

  const { data: sensorsResponse = { data: [] } } = useSensors({
    wellStatus: "approved",
  });
  const wells = sensorsResponse.data ?? [];

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return [...businesses]
      .filter((b) => !q || b.name.toLowerCase().includes(q))
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
  }, [search, sortKey, sortAsc, businesses]);

  const toggleSort = (key: "name") => {
    if (sortKey === key) setSortAsc((p) => !p);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const SortIcon = ({ col }: { col: "name" }) =>
    sortKey === col ? (
      sortAsc ? (
        <ChevronUp size={11} className="text-emerald-600" />
      ) : (
        <ChevronDown size={11} className="text-emerald-600" />
      )
    ) : (
      <ChevronDown size={11} className="text-slate-300" />
    );

  return (
    <div className="p-3 sm:p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[18px] font-semibold text-slate-800">
            Data Unit Usaha
          </h1>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
            Pemantauan {businesses.length} unit usaha pengguna air tanah
          </p>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {(() => {
          const totalWells = wells.length;
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

          return [
            {
              label: "Total Unit Usaha",
              value: String(businesses.length),
              color: "#059669",
            },
            {
              label: "Total Sumur",
              value: String(totalWells),
              color: "#0891B2",
            },
            {
              label: "Rata-rata Muka Air",
              value:
                avgWaterLevel !== null ? `${avgWaterLevel.toFixed(2)} m` : "-",
              color: "#3B82F6",
            },
          ].map(({ label, value, color }) => (
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
            </div>
          ));
        })()}
      </div>

      <div className="grid gap-4 grid-cols-1">
        {/* Table */}
        <Card padding={false}>
          <SectionHeader
            title="Daftar Unit Usaha"
            icon={<Briefcase size={13} />}
            accent="#059669"
            subtitle={`${filtered.length} unit usaha`}
            action={
              <div className="relative">
                <Search
                  size={11}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari nama unit usaha..."
                  className="pl-7 pr-3 py-1 text-[10px] font-mono border border-slate-200 rounded-lg bg-slate-50 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-emerald-400 w-56"
                />
              </div>
            }
          />
          <div className="overflow-x-auto">
            <table className="w-full" style={{ minWidth: 600 }}>
              <thead className="bg-slate-50/60 border-b border-slate-100">
                <tr>
                  {(
                    [
                      ["name", "Nama Unit Usaha"],
                      [null, "Perusahaan"],
                      [null, "Sumur"],
                      [null, "Muka Air Rata-rata"],
                    ] as const
                  ).map(([col, label]) => (
                    <th
                      key={label}
                      className={cn(
                        "text-[9px] font-mono text-slate-400 uppercase tracking-wider px-4 py-2.5 text-left whitespace-nowrap",
                        col &&
                          "cursor-pointer hover:text-slate-600 select-none",
                      )}
                      onClick={() => col && toggleSort(col as "name")}
                    >
                      <span className="flex items-center gap-1">
                        {label}
                        {col && <SortIcon col={col as "name"} />}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((b) => {
                  const businessWells = wells.filter(
                    (w) => w.businessId === b.id,
                  );
                  const wellsWithLevel = businessWells.filter(
                    (w) => w.staticWaterLevel !== null,
                  );
                  const avgWaterLevel =
                    wellsWithLevel.length > 0
                      ? wellsWithLevel.reduce(
                          (s, w) => s + (w.staticWaterLevel ?? 0),
                          0,
                        ) / wellsWithLevel.length
                      : null;
                  const isSelected = selected?.id === b.id;
                  return (
                    <tr
                      key={b.id}
                      onClick={() => setSelected(b)}
                      className={cn(
                        "cursor-pointer transition-colors",
                        isSelected ? "bg-emerald-50" : "hover:bg-slate-50/40",
                      )}
                    >
                      <td className="px-4 py-2.5">
                        <span className="text-[12px] font-semibold text-slate-800">
                          {b.name}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-[11px] text-slate-500">
                        {b.companyId}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="text-[11px] font-semibold font-mono text-slate-700">
                          {businessWells.length}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="text-[11px] font-semibold font-mono text-blue-600">
                          {avgWaterLevel !== null
                            ? `${avgWaterLevel.toFixed(2)} m`
                            : "-"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
