import { StatCard } from "../../../components/ui";
import { useSensors } from "../../../hooks";
import { useMeasurements } from "../../../hooks/useMeasurements";
import { useAuthStore } from "../../../store";

export default function SurveyorStatsRow() {
  const user = useAuthStore((s) => s.user);
  const companyId = user?.companyId ?? "";
  const { data: sensors = [] } = useSensors(
    companyId ? { companyId } : undefined,
  );
  const { data: measurements = [] } = useMeasurements();

  const alertSensor = sensors.filter(
    (s) => s.status === "alert" || s.status === "offline",
  ).length;
  const pendingVerif = measurements.filter(
    (m) => m.status === "pending",
  ).length;
  const now = new Date();
  const thisMonth = measurements.filter((m) => {
    const d = new Date(m.submittedAt);
    return (
      d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    );
  }).length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <StatCard
        label="Sensor Ditugaskan"
        value={sensors.length}
        sub={
          alertSensor > 0 ? `${alertSensor} perlu perhatian` : "Semua normal"
        }
        color={alertSensor > 0 ? "red" : "blue"}
        trendDown={alertSensor > 0}
      />
      <StatCard
        label="Total Pengukuran"
        value={measurements.length}
        sub="Semua riwayat"
        color="blue"
      />
      <StatCard
        label="Pending Verifikasi"
        value={pendingVerif}
        sub="Menunggu persetujuan admin"
        color={pendingVerif > 0 ? "amber" : "green"}
      />
      <StatCard
        label="Pengukuran Bulan Ini"
        value={thisMonth}
        sub={now.toLocaleString("id-ID", { month: "long", year: "numeric" })}
        color="blue"
        trendUp
      />
    </div>
  );
}