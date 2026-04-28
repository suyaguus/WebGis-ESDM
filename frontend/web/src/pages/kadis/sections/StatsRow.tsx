import { StatCard } from "../../../components/ui";
import { useSensors, useCompanies } from "../../../hooks";

export default function KadisStatsRow() {
  const { data: sensorsResponse } = useSensors();
  const sensors = sensorsResponse?.data ?? [];
  const { data: companiesResponse } = useCompanies({ limit: 100 });
  const companies = companiesResponse?.data ?? [];

  const totalSensor = sensors.length;
  const activeSensor = sensors.filter((s) => s.isActive).length;
  const inactiveSensor = sensors.filter((s) => !s.isActive).length;
  const totalCompany = companies.length;
  const overQuota = companies.filter(
    (c) => c.quota > 0 && c.quotaUsed >= c.quota,
  ).length;

  const activeSensorsWithLevel = sensors.filter(
    (s) => s.staticWaterLevel !== null,
  );
  const avgWaterLevel =
    activeSensorsWithLevel.length > 0
      ? (
          activeSensorsWithLevel.reduce(
            (sum, s) => sum + (s.staticWaterLevel ?? 0),
            0,
          ) / activeSensorsWithLevel.length
        ).toFixed(2)
      : "0.00";

  const companiesWithSubsidence = companies.filter((c) => c.avgSubsidence > 0);
  const avgSubsidenceVal =
    companiesWithSubsidence.length > 0
      ? (
          companiesWithSubsidence.reduce((s, c) => s + c.avgSubsidence, 0) /
          companiesWithSubsidence.length
        ).toFixed(2)
      : "0.00";

  const stats = [
    {
      label: "Perusahaan Dipantau",
      value: String(totalCompany),
      sub: `${totalCompany} terdaftar`,
      color: "green",
    },
    {
      label: "Total Sumur Aktif",
      value: String(totalSensor),
      sub: `${activeSensor} aktif · ${inactiveSensor} non-aktif`,
      color: "cyan",
    },
    {
      label: "Rata-rata Kedalaman MAT",
      value: `${avgWaterLevel} m`,
      sub: "dari sumur aktif",
      color: "blue",
    },
    {
      label: "Melebihi Kuota",
      value: String(overQuota),
      sub: overQuota > 0 ? `${overQuota} perusahaan` : "Semua normal",
      color: "amber",
    },
    {
      label: "Subsidence Regional",
      value: `${avgSubsidenceVal} cm`,
      sub: "rata-rata per tahun",
      color: "purple",
    },
  ] as const;

  return (
    <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
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
