import { Map } from 'lucide-react'
import { Panel } from '@/components/ui'
import SensorMap from '@/components/map/SensorMap'

export default function MapSection() {
  return (
    <Panel
      title="Peta Pemantauan — Semua Wilayah"
      icon={<Map size={12} className="text-accent-cyan" />}
      sub="REALTIME · UPDATE 30s"
      className="flex flex-col"
    >
      <div className="flex-1 min-h-0">
        <SensorMap />
      </div>
    </Panel>
  )
}
