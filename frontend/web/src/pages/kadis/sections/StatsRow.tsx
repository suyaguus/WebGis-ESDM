import { StatCard } from "../../../components/ui";
import { useSensors, useCompanies } from "../../../hooks";

export default function KadisStatsRow() {
  const { data: sensors = [] } = useSensors();
  const { data: companies = [] } = useCompanies();

  const totalSensor = sensors.length;
  const onlineSensor = sensors.filter((s) => s.status === "online").length;
  const alertSensor = sensors.filter(
    (s) => s.status === "alert" || s.status === "offline",
  ).length;
  const totalCompany = companies.length;
  const overQuota = companies.filter(
    (c) => c.quota > 0 && c.quotaUsed >= c.quota,
  ).length;
  const avgSubsidence =
    sensors.length > 0
      ? (
          sensors.reduce((sum, s) => sum + (s.subsidence ?? 0), 0) /
          sensors.length
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
      label: "Total Sensor Aktif",
      value: String(totalSensor),
      sub: `${onlineSensor} online · ${alertSensor} masalah`,
      color: "cyan",
    },
    {
      label: "Perusahaan Kritis",
      value: String(alertSensor > 0 ? Math.min(alertSensor, totalCompany) : 0),
      sub: "sensor bermasalah",
      color: "red",
    },
    {
      label: "Melebihi Kuota",
      value: String(overQuota),
      sub: overQuota > 0 ? `${overQuota} perusahaan` : "Semua normal",
      color: "amber",
    },
    {
      label: "Subsidence Regional",
      value: avgSubsidence,
      sub: "cm/tahun rata-rata",
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
