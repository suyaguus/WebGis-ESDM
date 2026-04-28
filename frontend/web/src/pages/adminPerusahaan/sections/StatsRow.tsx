import { StatCard } from "../../../components/ui";
import { useSensors, useBusinesses } from "@/hooks";
import { useCompany } from "@/hooks/useCompanies";
import { useAuthStore } from "@/store";

export default function AdminStatsRow() {
  const { user } = useAuthStore();
  const companyId = user?.companyId ?? "";
  const { data: sensorsResponse = { data: [] }, isLoading: loadingSensors } =
    useSensors({
      companyId: companyId || undefined,
    });
  const sensors = sensorsResponse.data ?? [];
  const {
    data: businessesResponse = { data: [] },
    isLoading: loadingBusinesses,
  } = useBusinesses();
  const allBusinesses = businessesResponse.data ?? [];
  const { data: company, isLoading: loadingCompany } = useCompany(companyId);

  // Count businesses for this company
  const userBusinesses = allBusinesses.filter((b) => b.companyId === companyId);
  const totalBusiness = userBusinesses.length;

  // Calculate average water level from wells
  const wellsWithLevel = sensors.filter((s) => s.staticWaterLevel !== null);
  const avgWaterLevel =
    wellsWithLevel.length > 0
      ? wellsWithLevel.reduce((sum, s) => sum + (s.staticWaterLevel ?? 0), 0) /
        wellsWithLevel.length
      : null;

  const total = sensors.length;
  const online = sensors.filter((s) => s.status === "online").length;

  const loading = loadingSensors || loadingBusinesses || loadingCompany;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <StatCard
        label="Total Sumur"
        value={loading ? "…" : String(total)}
        sub={`${online} online`}
        color="amber"
      />
      <StatCard
        label="Unit Usaha"
        value={loading ? "…" : String(totalBusiness)}
        sub="jenis usaha perusahaan"
        color="cyan"
      />
      <StatCard
        label="Rata-rata Muka Air"
        value={
          loading || avgWaterLevel === null
            ? "…"
            : `${avgWaterLevel.toFixed(2)}`
        }
        sub="meter dari permukaan"
        color="blue"
      />
    </div>
  );
}
