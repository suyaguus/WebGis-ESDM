import { KADIS_STATS } from '../../../constants/mockData';
import { StatCard } from '../../../components/ui';

export default function KadisStatsRow() {
  return (
    <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
      {KADIS_STATS.map(s => (
        <StatCard key={s.label} label={s.label} value={s.value} sub={s.sub} color={s.color} />
      ))}
    </div>
  );
}
