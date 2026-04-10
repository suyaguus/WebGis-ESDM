import { Cpu, Building2, AlertTriangle, Users, TrendingDown } from 'lucide-react'
import { StatCard } from '@/components/ui'
import { MOCK_STATS } from '@/constants/mockData'

export default function StatsRow() {
  const { totalSensors, sensorDelta, totalCompanies, newCompanies, problemSensors, problemDelta, totalUsers, avgSubsidence } = MOCK_STATS

  return (
    <div className="grid grid-cols-5 gap-3">
      <StatCard
        accent="cyan"
        label="Total Sensor Aktif"
        value={totalSensors}
        sub={`↑ ${sensorDelta} bulan ini`}
        subColor="text-accent-green font-medium"
        icon={<Cpu size={14} className="text-accent-cyan" />}
      />
      <StatCard
        accent="purple"
        label="Perusahaan Terdaftar"
        value={totalCompanies}
        sub={`↑ ${newCompanies} baru`}
        subColor="text-accent-green font-medium"
        icon={<Building2 size={14} className="text-accent-purple" />}
      />
      <StatCard
        accent="red"
        label="Sensor Bermasalah"
        value={problemSensors}
        sub={`↑ ${problemDelta} dari kemarin`}
        subColor="text-accent-red font-medium"
        icon={<AlertTriangle size={14} className="text-accent-red" />}
      />
      <StatCard
        accent="blue"
        label="Total Pengguna"
        value={totalUsers}
        sub="4 role aktif"
        subColor="text-text-secondary"
        icon={<Users size={14} className="text-accent-blue" />}
      />
      <StatCard
        accent="amber"
        label="Rata-rata Subsidence"
        value={avgSubsidence.toFixed(2)}
        sub="cm/tahun regional"
        subColor="text-text-muted font-mono text-[9px]"
        icon={<TrendingDown size={14} className="text-accent-amber" />}
      />
    </div>
  )
}
