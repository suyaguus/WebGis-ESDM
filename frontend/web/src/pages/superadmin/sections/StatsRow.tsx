import { StatCard } from '../../../components/ui';
import { SUPERADMIN_STATS } from '../../../constants/mockData';

export default function StatsRow() {
  return (
    <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
      {SUPERADMIN_STATS.map((stat) => (
        <StatCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          sub={stat.sub}
          color={stat.color}
          trendUp={stat.trend === 'up'}
          trendDown={stat.trend === 'down'}
        />
      ))}
    </div>
  );
}
