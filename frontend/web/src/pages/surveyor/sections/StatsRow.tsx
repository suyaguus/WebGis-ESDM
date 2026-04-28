import { StatCard } from "../../../components/ui";
import { useSensors } from "../../../hooks";
import { useMeasurements } from "../../../hooks/useMeasurements";

export default function SurveyorStatsRow() {
  const { data = {} } = useSensors();
  const sensors = data.data ?? [];
  const { data: measurements = [] } = useMeasurements();

  // Count inactive wells (status = offline means isActive = false)
  const inactiveSensors = sensors.filter((s) => !s.isActive).length;

  // Count pending wells awaiting approval
  const pendingApprovals = sensors.filter(
    (s) => s.wellStatus === "pending_approval",
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
        label="Total Sumur"
        value={sensors.length}
        sub={
          inactiveSensors > 0 ? `${inactiveSensors} non-aktif` : "Semua aktif"
        }
        color={inactiveSensors > 0 ? "amber" : "green"}
        trendDown={inactiveSensors > 0}
      />
      <StatCard
        label="Menunggu Persetujuan"
        value={pendingApprovals}
        sub="Pengajuan ke super admin"
        color={pendingApprovals > 0 ? "orange" : "blue"}
      />
      <StatCard
        label="Total Pengukuran"
        value={measurements.length}
        sub="Semua riwayat"
        color="blue"
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
