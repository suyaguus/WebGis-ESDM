import { AlertTriangle } from 'lucide-react'
import { Panel, Badge } from '@/components/ui'
import { MOCK_ALERTS } from '@/constants/mockData'
import { cn } from '@/lib/utils'
import type { AlertType } from '@/types'

const ALERT_CLS: Record<AlertType, string> = {
  critical: 'alert-critical',
  warning:  'alert-warning',
  info:     'alert-info',
}
const BADGE_VARIANT: Record<AlertType, 'critical' | 'warning' | 'info'> = {
  critical: 'critical', warning: 'warning', info: 'info',
}
const BADGE_LABEL: Record<AlertType, string> = {
  critical: 'KRITIS', warning: 'WASPADA', info: 'INFO',
}
/* icon color per type */
const ICON_COLOR: Record<AlertType, string> = {
  critical: 'text-accent-red',
  warning:  'text-accent-amber',
  info:     'text-accent-blue',
}

export default function AlertPanel() {
  const criticalCount = MOCK_ALERTS.filter((a) => a.type === 'critical').length

  return (
    <Panel
      title="Alert & Notifikasi"
      icon={<AlertTriangle size={12} className="text-accent-red" />}
      headerRight={
        <span className="badge badge-critical">{criticalCount} KRITIS</span>
      }
      className="flex flex-col"
    >
      <div className="flex-1 overflow-y-auto p-2">
        {MOCK_ALERTS.map((alert) => (
          <div key={alert.id} className={cn('alert-item', ALERT_CLS[alert.type])}>
            <div className="flex items-center gap-1.5 mb-1.5">
              <AlertTriangle size={10} className={ICON_COLOR[alert.type]} />
              <Badge label={BADGE_LABEL[alert.type]} variant={BADGE_VARIANT[alert.type]} />
              <span className="text-[8px] text-text-muted font-mono ml-auto">{alert.time}</span>
            </div>
            <p className="text-[11px] font-semibold text-text-primary leading-tight mb-0.5">
              {alert.title}
            </p>
            <p className="text-[9px] text-text-secondary">{alert.subtitle}</p>
            {alert.detail && (
              <p className="text-[9px] text-text-muted mt-0.5 font-mono">{alert.detail}</p>
            )}
          </div>
        ))}
      </div>
    </Panel>
  )
}
