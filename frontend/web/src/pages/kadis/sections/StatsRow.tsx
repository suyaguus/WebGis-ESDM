import { useMemo } from "react";
import { StatCard } from "../../../components/ui";
import { useCompanies } from "../../../hooks";
import { useBusinesses } from "../../../hooks";
import { usePublicSensors } from "@/hooks/useSensors";

export default function KadisStatsRow() {
  const { data: companiesResponse } = useCompanies({ limit: 500 });
  const companies = companiesResponse?.data ?? [];

  const { data: businessesResponse } = useBusinesses({ limit: 500 });
  const businesses = businessesResponse?.data ?? [];

  const { data: allSensors = [] } = usePublicSensors();
  const approvedSensors = useMemo(
    () => allSensors.filter((s) => s.wellStatus === "approved"),
    [allSensors],
  );

  const avgWaterLevel = useMemo(() => {
    const withLevel = approvedSensors.filter((s) => s.staticWaterLevel !== null);
    if (withLevel.length === 0) return "0.00";
    return (
      withLevel.reduce((sum, s) => sum + (s.staticWaterLevel ?? 0), 0) /
      withLevel.length
    ).toFixed(2);
  }, [approvedSensors]);

  const stats = [
    {
      label: "Total Perusahaan",
      value: String(companies.length),
      sub: `${companies.length} terdaftar`,
      color: "green",
    },
    {
      label: "Total Business",
      value: String(businesses.length),
      sub: `${businesses.length} unit usaha`,
      color: "cyan",
    },
    {
      label: "Total Sumur",
      value: String(approvedSensors.length),
      sub: `${approvedSensors.length} sumur disetujui`,
      color: "blue",
    },
    {
      label: "Rata-rata Muka Air Tanah",
      value: `${avgWaterLevel} m`,
      sub: "dari sumur aktif",
      color: "purple",
    },
  ] as const;

  return (
    <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
      {stats.map((s) => (
        <StatCard
          key={s.label}
          label={s.label}
          value={s.value}
          sub={s.sub}
          color={s.color}
        />
      ))}
    </div>
  );
}
