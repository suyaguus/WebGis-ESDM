import { useState } from "react";
import { Building2, ArrowUpDown } from "lucide-react";
import { SectionHeader, StatusPill } from "@/components/ui";
import { useCompanies } from "@/hooks/useCompanies";
import { cn } from "@/lib/utils";
import { getWellTypeLabel } from "@/lib/groundwater";

type SortKey = "name" | "wellCount" | "avgWaterLevel" | "dominantWellType";

export default function CompanyTable() {
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);
  const { data: companiesResponse = { data: [] }, isLoading } = useCompanies({
    limit: 100,
  });
  const companies = companiesResponse.data ?? [];

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortAsc((p) => !p);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  const sorted = [...companies].sort((a, b) => {
    let av: string | number = "";
    let bv: string | number = "";

    if (sortKey === "name") {
      av = a.name;
      bv = b.name;
    } else if (sortKey === "wellCount") {
      av = a.wellCount ?? 0;
      bv = b.wellCount ?? 0;
    } else if (sortKey === "avgWaterLevel") {
      av = a.avgWaterLevel ?? 0;
      bv = b.avgWaterLevel ?? 0;
    } else if (sortKey === "dominantWellType") {
      av = a.dominantWellType ?? "";
      bv = b.dominantWellType ?? "";
    }

    if (typeof av === "string")
      return sortAsc
        ? av.localeCompare(bv as string)
        : (bv as string).localeCompare(av);
    return sortAsc
      ? (av as number) - (bv as number)
      : (bv as number) - (av as number);
  });

  const HeadCell = ({ label, sk }: { label: string; sk: SortKey }) => (
    <th
      onClick={() => handleSort(sk)}
      className="text-[9px] font-mono font-medium text-slate-400 uppercase tracking-wider px-3 py-2.5 text-left cursor-pointer hover:text-slate-600 select-none whitespace-nowrap"
    >
      <span className="flex items-center gap-1">
        {label}
        <ArrowUpDown
          size={9}
          className={sortKey === sk ? "text-cyan-500" : "text-slate-300"}
        />
      </span>
    </th>
  );

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden min-w-0 flex flex-col">
      <SectionHeader
        title="Daftar Perusahaan"
        icon={<Building2 size={13} />}
        action={
          <button className="text-[10px] text-cyan-600 hover:text-cyan-700 font-mono font-medium whitespace-nowrap">
            Lihat Semua →
          </button>
        }
      />

      {isLoading && (
        <div className="flex items-center justify-center py-10 text-[11px] text-slate-400 font-mono">
          Memuat data perusahaan…
        </div>
      )}

      {!isLoading && sorted.length === 0 && (
        <div className="flex items-center justify-center py-10 text-[11px] text-slate-400 font-mono">
          Belum ada data perusahaan.
        </div>
      )}

      {/* ── Mobile: card list (hidden on md+) ── */}
      <div className="md:hidden divide-y divide-slate-50">
        {sorted.map((company) => {
          return (
            <div
              key={company.id}
              className="px-4 py-3 hover:bg-slate-50/60 transition-colors"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[12px] font-semibold text-slate-800 truncate flex-1 min-w-0 mr-2">
                  {company.name}
                </span>
                <StatusPill status={company.status} />
              </div>
              <p className="text-[10px] text-slate-400 font-mono mb-2">
                {company.region}
              </p>
              <div className="grid grid-cols-3 gap-2 text-center mb-2">
                <div>
                  <p className="text-[11px] font-mono font-semibold text-slate-700">
                    {company.wellCount}
                  </p>
                  <p className="text-[9px] text-slate-400 font-mono">Sumur</p>
                </div>
                <div>
                  <p className="text-[11px] font-mono font-semibold text-blue-700">
                    {company.avgWaterLevel !== null
                      ? company.avgWaterLevel.toFixed(2)
                      : "-"}
                  </p>
                  <p className="text-[9px] text-slate-400 font-mono">m</p>
                </div>
                <div>
                  <p className="text-[11px] font-mono font-semibold text-slate-700">
                    {getWellTypeLabel(company.dominantWellType)}
                  </p>
                  <p className="text-[9px] text-slate-400 font-mono">Tipe</p>
                </div>
              </div>
              <div className="flex gap-1">
                {company.wellTypes.sumur_pantau > 0 && (
                  <div className="flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    <span>{company.wellTypes.sumur_pantau}</span>
                  </div>
                )}
                {company.wellTypes.sumur_gali > 0 && (
                  <div className="flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 bg-purple-50 text-purple-700 rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    <span>{company.wellTypes.sumur_gali}</span>
                  </div>
                )}
                {company.wellTypes.sumur_bor > 0 && (
                  <div className="flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 bg-cyan-50 text-cyan-700 rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>{company.wellTypes.sumur_bor}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Desktop: table (hidden on mobile) ── */}
      <div className="hidden md:block overflow-x-auto flex-1">
        <table
          className="w-full"
          style={{ tableLayout: "fixed", minWidth: "480px" }}
        >
          <colgroup>
            <col style={{ width: "30%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "12%" }} />
          </colgroup>
          <thead className="bg-slate-50/70 border-b border-slate-100">
            <tr>
              <HeadCell label="Perusahaan" sk="name" />
              <th className="text-[9px] font-mono font-medium text-slate-400 uppercase tracking-wider px-3 py-2.5 text-left whitespace-nowrap">
                Wilayah
              </th>
              <HeadCell label="Sumur" sk="wellCount" />
              <HeadCell label="Rata-rata Muka Air" sk="avgWaterLevel" />
              <HeadCell label="Tipe Sumur" sk="dominantWellType" />
              <th className="text-[9px] font-mono font-medium text-slate-400 uppercase tracking-wider px-3 py-2.5 text-left">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {sorted.map((company) => {
              return (
                <tr
                  key={company.id}
                  className="hover:bg-slate-50/60 transition-colors cursor-pointer"
                >
                  <td className="px-3 py-2.5">
                    <span className="text-[12px] font-semibold text-slate-800 truncate block">
                      {company.name}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="text-[11px] text-slate-500 truncate block">
                      {company.region}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="text-[11px] font-mono font-medium text-slate-700">
                      {company.wellCount}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="text-[11px] font-mono font-semibold text-blue-700">
                      {company.avgWaterLevel !== null
                        ? company.avgWaterLevel.toFixed(2)
                        : "-"}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono ml-0.5">
                      m
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] font-mono font-medium text-slate-700">
                        {getWellTypeLabel(company.dominantWellType)}
                      </span>
                      <div className="flex gap-0.5">
                        {company.wellTypes.sumur_pantau > 0 && (
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: "#3B82F6" }}
                            title={`Pantau: ${company.wellTypes.sumur_pantau}`}
                          />
                        )}
                        {company.wellTypes.sumur_gali > 0 && (
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: "#8B5CF6" }}
                            title={`Gali: ${company.wellTypes.sumur_gali}`}
                          />
                        )}
                        {company.wellTypes.sumur_bor > 0 && (
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: "#06B6D4" }}
                            title={`Bor: ${company.wellTypes.sumur_bor}`}
                          />
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <StatusPill status={company.status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
