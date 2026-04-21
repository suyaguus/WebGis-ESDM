import { COMPANY_SENSORS, ADMIN_COMPANY } from '../../../constants/mockData';
import { StatCard } from '../../../components/ui';
import { getQuotaPercent } from '../../../lib/utils';

export default function AdminStatsRow() {
  const total   = COMPANY_SENSORS.length;
  const alert   = COMPANY_SENSORS.filter(s => s.status === 'alert').length;
  const online  = COMPANY_SENSORS.filter(s => s.status === 'online').length;
  const maint   = COMPANY_SENSORS.filter(s => s.status === 'maintenance').length;
  const avgSub  = (COMPANY_SENSORS.reduce((a, s) => a + s.subsidence, 0) / total).toFixed(2);
  const pct     = getQuotaPercent(ADMIN_COMPANY.quotaUsed, ADMIN_COMPANY.quota);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      <StatCard label="Total Sensor"    value={total}            sub={`${online} online`}          color="amber"  />
      <StatCard label="Sensor Alert"    value={alert}            sub="↑ 1 dari kemarin"            color="red"    trendDown />
      <StatCard label="Maintenance"     value={maint}            sub="Perlu kalibrasi"             color="purple" />
      <StatCard label="Avg Subsidence"  value={avgSub}           sub="cm/thn seluruh sumur"        color="blue"   trendDown />
      <StatCard label="Kuota Terpakai"  value={`${pct}%`}        sub={`${(ADMIN_COMPANY.quotaUsed/1000).toFixed(0)}k / ${(ADMIN_COMPANY.quota/1000).toFixed(0)}k m³`} color="amber" trendDown />
    </div>
  );
}
