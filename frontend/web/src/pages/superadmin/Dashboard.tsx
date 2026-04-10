import Topbar from '@/components/layout/Topbar'
import StatsRow     from './sections/StatsRow'
import MapSection   from './sections/MapSection'
import AlertPanel   from './sections/AlertPanel'
import CompanyTable from './sections/CompanyTable'
import TrendSection from './sections/TrendSection'

export default function SuperAdminDashboard() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar
        breadcrumbs={[{ label: 'Dashboard' }, { label: 'Super Admin' }]}
      />

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* Row 1 — Stats */}
        <StatsRow />

        {/* Row 2 — Map + Alerts (fixed height) */}
        <div className="grid grid-cols-[1fr_300px] gap-3 h-[390px]">
          <MapSection />
          <AlertPanel />
        </div>

        {/* Row 3 — Company table + Trend chart */}
        <div className="grid grid-cols-[1fr_1fr] gap-3">
          <CompanyTable />
          <TrendSection />
        </div>

        {/* Bottom padding for breathing room */}
        <div className="h-2" />
      </div>
    </div>
  )
}
