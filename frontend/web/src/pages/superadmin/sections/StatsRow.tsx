import { StatCard } from '../../../components/ui';
import { SUPERADMIN_STATS } from '../../../constants/mockData';

export default function StatsRow() {
  return (
    <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(5, minmax(0, 1fr))' }}>
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
