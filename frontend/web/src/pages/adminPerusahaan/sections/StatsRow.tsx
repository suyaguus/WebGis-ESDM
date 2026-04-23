import { StatCard } from "../../../components/ui";
import { useSensors } from "@/hooks/useSensors";
import { useCompany } from "@/hooks/useCompanies";
import { useAuthStore } from "@/store";
import { getQuotaPercent } from "../../../lib/utils";

export default function AdminStatsRow() {
  const { user } = useAuthStore();
  const companyId = user?.companyId ?? "";
  const { data: sensors = [], isLoading: loadingSensors } = useSensors({
    companyId: companyId || undefined,
  });
  const { data: company, isLoading: loadingCompany } = useCompany(companyId);

  const total = sensors.length;
  const online = sensors.filter((s) => s.status === "online").length;
  const offline = sensors.filter((s) => s.status === "offline").length;
  const pct = company ? getQuotaPercent(company.quotaUsed, company.quota) : 0;

  const loading = loadingSensors || loadingCompany;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      <StatCard
        label="Total Sensor"
        value={loading ? "…" : String(total)}
        sub={`${online} online`}
        color="amber"
      />
      <StatCard
        label="Sensor Offline"
        value={loading ? "…" : String(offline)}
        sub="tidak aktif"
        color="red"
        trendDown
      />
      <StatCard
        label="Maintenance"
        value="—"
        sub="Perlu kalibrasi"
        color="purple"
      />
      <StatCard
        label="Avg Subsidence"
        value="—"
        sub="cm/thn seluruh sumur"
        color="blue"
        trendDown
      />
      <StatCard
        label="Kuota Terpakai"
        value={loading ? "…" : `${pct}%`}
        sub={
          company
            ? `${(company.quotaUsed / 1000).toFixed(0)}k / ${(company.quota / 1000).toFixed(0)}k m³`
            : "—"
        }
        color="amber"
        trendDown
      />
    </div>
  );
}
