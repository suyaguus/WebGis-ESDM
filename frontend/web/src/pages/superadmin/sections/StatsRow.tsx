import { StatCard } from "../../../components/ui";
import { useSensors } from "@/hooks/useSensors";
import { useCompanies } from "@/hooks/useCompanies";

export default function StatsRow() {
  const { data: sensors = [], isLoading: loadingSensors } = useSensors();
  const { data: companies = [], isLoading: loadingCompanies } = useCompanies();

  const totalOnline = sensors.filter((s) => s.status === "online").length;
  const totalOffline = sensors.filter((s) => s.status === "offline").length;
  const totalSensors = sensors.length;
  const totalCompanies = companies.length;

  const loading = loadingSensors || loadingCompanies;

  const stats = [
    {
      label: "Total Sensor Aktif",
      value: loading ? "…" : String(totalOnline),
      sub: `dari ${totalSensors} terdaftar`,
      trend: "up",
      trendValue: "",
      color: "cyan",
    },
    {
      label: "Perusahaan Terdaftar",
      value: loading ? "…" : String(totalCompanies),
      sub: "terdaftar di sistem",
      trend: "up",
      trendValue: "",
      color: "amber",
    },
    {
      label: "Sensor Bermasalah",
      value: loading ? "…" : String(totalOffline),
      sub: "offline / tidak aktif",
      trend: "down",
      trendValue: "",
      color: "red",
    },
    {
      label: "Total Pengguna",
      value: "—",
      sub: "4 role aktif",
      trend: "neutral",
      trendValue: "",
      color: "green",
    },
    {
      label: "Rata-rata Subsidence",
      value: "—",
      sub: "cm/tahun avg regional",
      trend: "down",
      trendValue: "",
      color: "purple",
    },
  ] as const;

  return (
    <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
      {stats.map((stat) => (
        <StatCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          sub={stat.sub}
          color={stat.color}
          trendUp={stat.trend === "up"}
          trendDown={stat.trend === "down"}
        />
      ))}
    </div>
  );
}
