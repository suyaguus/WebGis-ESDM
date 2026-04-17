import { KADIS_STATS } from '../../../constants/mockData';
import { StatCard } from '../../../components/ui';

export default function KadisStatsRow() {
  return (
    <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(5, minmax(0,1fr))' }}>
      {KADIS_STATS.map(s => (
        <StatCard key={s.label} label={s.label} value={s.value} sub={s.sub} color={s.color} />
      ))}
    </div>
  );
}
