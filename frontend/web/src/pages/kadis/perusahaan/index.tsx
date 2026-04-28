import { useState, useMemo } from "react";
import { Building2, Search, ChevronDown, ChevronUp } from "lucide-react";
import { Card, SectionHeader } from "../../../components/ui";
import { useCompanies, useSensors, useBusinesses } from "../../../hooks";
import { cn } from "../../../lib/utils";
import type { Company } from "../../../types";

export default function KadisPerusahaanPage() {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<"name" | "region">("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [selected, setSelected] = useState<Company | null>(null);

  // Fetch real data from API
  const { data: companiesResponse = { data: [] } } = useCompanies({
    limit: 100,
  });
  const companies = companiesResponse.data ?? [];

  const { data: sensorsResponse = { data: [] } } = useSensors({
    wellStatus: "approved",
  });
  const wells = sensorsResponse.data ?? [];

  const { data: businessesResponse = { data: [] } } = useBusinesses({
    limit: 100,
  });
  const allBusinesses = businessesResponse.data ?? [];

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return [...companies]
      .filter(
        (c) =>
          !q ||
          c.name.toLowerCase().includes(q) ||
          c.region.toLowerCase().includes(q),
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
  }, [search, sortKey, sortAsc, companies]);

  const toggleSort = (key: "name" | "region") => {
    if (sortKey === key) setSortAsc((p) => !p);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const SortIcon = ({ col }: { col: "name" | "region" }) =>
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
            Data Perusahaan
          </h1>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
            Pemantauan {companies.length} perusahaan pengguna air tanah
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
              label: "Total Perusahaan",
              value: String(companies.length),
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

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-[1fr_300px]">
        {/* Table */}
        <Card padding={false}>
          <SectionHeader
            title="Daftar Perusahaan"
            icon={<Building2 size={13} />}
            accent="#059669"
            subtitle={`${filtered.length} perusahaan`}
            action={
              <div className="relative">
                <Search
                  size={11}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari nama / wilayah..."
                  className="pl-7 pr-3 py-1 text-[10px] font-mono border border-slate-200 rounded-lg bg-slate-50 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-emerald-400 w-44"
                />
              </div>
            }
          />
          <div className="overflow-x-auto">
            <table className="w-full" style={{ minWidth: 540 }}>
              <thead className="bg-slate-50/60 border-b border-slate-100">
                <tr>
                  {(
                    [
                      ["name", "Perusahaan"],
                      ["region", "Wilayah"],
                      [null, "Sumur"],
                      [null, "Unit Usaha"],
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
                      onClick={() =>
                        col && toggleSort(col as "name" | "region")
                      }
                    >
                      <span className="flex items-center gap-1">
                        {label}
                        {col && <SortIcon col={col as "name" | "region"} />}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((c) => {
                  const companyWells = wells.filter(
                    (w) => w.companyId === c.id,
                  );
                  const companyBusinesses = allBusinesses.filter(
                    (b) => b.companyId === c.id,
                  );
                  const wellsWithLevel = companyWells.filter(
                    (w) => w.staticWaterLevel !== null,
                  );
                  const avgWaterLevel =
                    wellsWithLevel.length > 0
                      ? wellsWithLevel.reduce(
                          (s, w) => s + (w.staticWaterLevel ?? 0),
                          0,
                        ) / wellsWithLevel.length
                      : null;
                  const isSelected = selected?.id === c.id;
                  return (
                    <tr
                      key={c.id}
                      onClick={() => setSelected(c)}
                      className={cn(
                        "cursor-pointer transition-colors",
                        isSelected ? "bg-emerald-50" : "hover:bg-slate-50/40",
                      )}
                    >
                      <td className="px-4 py-2.5">
                        <span className="text-[12px] font-semibold text-slate-800">
                          {c.name}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-[11px] text-slate-500">
                        {c.region}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="text-[11px] font-semibold font-mono text-slate-700">
                          {companyWells.length}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="text-[11px] font-semibold font-mono text-slate-700">
                          {companyBusinesses.length}
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

        {/* Detail panel */}
        {selected ? (
          <div className="space-y-3">
            {/* Company KPI card */}
            <div className="bg-white rounded-xl border border-emerald-100 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 bg-emerald-50/40 flex items-center justify-between">
                <span className="text-[13px] font-semibold text-emerald-800">
                  {selected.name}
                </span>
                <button
                  onClick={() => setSelected(null)}
                  className="text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              </div>
              <div className="p-4 space-y-3">
                {(() => {
                  const companyWells = wells.filter(
                    (w) => w.companyId === selected.id,
                  );
                  const companyBusinesses = allBusinesses.filter(
                    (b) => b.companyId === selected.id,
                  );
                  const wellsWithLevel = companyWells.filter(
                    (w) => w.staticWaterLevel !== null,
                  );
                  const avgWaterLevel =
                    wellsWithLevel.length > 0
                      ? wellsWithLevel.reduce(
                          (s, w) => s + (w.staticWaterLevel ?? 0),
                          0,
                        ) / wellsWithLevel.length
                      : null;

                  return (
                    <>
                      {/* KPI Cards */}
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          {
                            label: "Sumur",
                            value: String(companyWells.length),
                            color: "#0891B2",
                          },
                          {
                            label: "Unit Usaha",
                            value: String(companyBusinesses.length),
                            color: "#059669",
                          },
                        ].map(({ label, value, color }) => (
                          <div key={label}>
                            <p className="text-[9px] font-mono text-slate-400">
                              {label}
                            </p>
                            <p
                              className="text-[18px] font-bold font-mono"
                              style={{ color }}
                            >
                              {value}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Water Level */}
                      <div className="bg-blue-50 rounded-lg px-3 py-2.5 border border-blue-100">
                        <p className="text-[9px] font-mono text-blue-600 mb-1">
                          Muka Air Rata-rata
                        </p>
                        <p className="text-[18px] font-bold font-mono text-blue-700">
                          {avgWaterLevel !== null
                            ? `${avgWaterLevel.toFixed(2)} m`
                            : "-"}
                        </p>
                      </div>

                      {/* Well Types Summary */}
                      {companyWells.length > 0 && (
                        <div className="bg-slate-50 rounded-lg px-3 py-2.5 border border-slate-200">
                          <p className="text-[9px] font-mono text-slate-600 mb-2 font-semibold">
                            Tipe Sumur
                          </p>
                          <div className="space-y-1">
                            {[
                              {
                                type: "sumur_pantau",
                                label: "Pantau",
                                color: "#3B82F6",
                              },
                              {
                                type: "sumur_gali",
                                label: "Gali",
                                color: "#F59E0B",
                              },
                              {
                                type: "sumur_bor",
                                label: "Bor",
                                color: "#EF4444",
                              },
                            ].map(({ type, label, color }) => {
                              const count = companyWells.filter(
                                (w) => w.wellType === type,
                              ).length;
                              return (
                                <div
                                  key={type}
                                  className="flex items-center justify-between text-[10px]"
                                >
                                  <span className="text-slate-600">
                                    {label}
                                  </span>
                                  <span
                                    className="font-semibold font-mono"
                                    style={{ color }}
                                  >
                                    {count}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        ) : (
          <div
            className="bg-white rounded-xl border border-slate-100 shadow-sm flex items-center justify-center"
            style={{ minHeight: 200 }}
          >
            <div className="text-center">
              <Building2 size={24} className="text-slate-200 mx-auto mb-2" />
              <p className="text-[11px] text-slate-400 font-mono">
                Pilih perusahaan
                <br />
                untuk melihat detail
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
