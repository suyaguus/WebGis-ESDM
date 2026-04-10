import { cn } from '@/lib/utils'

/* ── Badge ─────────────────────────────────────────────────────────── */
type BadgeVariant = 'critical' | 'warning' | 'info' | 'success'
const BADGE_CLS: Record<BadgeVariant, string> = {
  critical: 'badge-critical',
  warning:  'badge-warning',
  info:     'badge-info',
  success:  'badge-success',
}
export function Badge({ label, variant, className }: { label: string; variant: BadgeVariant; className?: string }) {
  return <span className={cn('badge', BADGE_CLS[variant], className)}>{label}</span>
}

/* ── Status Pill ───────────────────────────────────────────────────── */
type PillVariant = 'online' | 'offline' | 'warning' | 'evaluation'
const PILL_CLS: Record<PillVariant, string> = {
  online:     'pill-online',
  offline:    'pill-offline',
  warning:    'pill-warning',
  evaluation: 'pill-evaluation',
}
const PILL_TXT: Record<PillVariant, string> = {
  online: '● Online', offline: '● Offline', warning: '● Warning', evaluation: '● Evaluasi',
}
export function StatusPill({ variant, className }: { variant: PillVariant; className?: string }) {
  return <span className={cn('status-pill', PILL_CLS[variant], className)}>{PILL_TXT[variant]}</span>
}

/* ── Nav Badge ─────────────────────────────────────────────────────── */
const NAV_BADGE_CLS = {
  red:   'bg-accent-red   text-white',
  amber: 'bg-accent-amber text-white',
  green: 'bg-accent-green text-white',
}
export function NavBadge({ count, variant = 'red' }: { count: number | string; variant?: 'red' | 'amber' | 'green' }) {
  return (
    <span className={cn('ml-auto text-[8px] font-mono font-semibold px-[5px] py-[1px] rounded-full', NAV_BADGE_CLS[variant])}>
      {count}
    </span>
  )
}

/* ── Stat Card ─────────────────────────────────────────────────────── */
type AccentKey = 'cyan' | 'amber' | 'red' | 'green' | 'purple' | 'blue'

const ACCENT_BAR: Record<AccentKey, string> = {
  cyan:   'bg-accent-cyan',
  amber:  'bg-accent-amber',
  red:    'bg-accent-red',
  green:  'bg-accent-green',
  purple: 'bg-accent-purple',
  blue:   'bg-accent-blue',
}
const ACCENT_ICON_BG: Record<AccentKey, string> = {
  cyan:   'bg-fill-cyan',
  amber:  'bg-fill-amber',
  red:    'bg-fill-red',
  green:  'bg-fill-green',
  purple: 'bg-fill-purple',
  blue:   'bg-fill-blue',
}
const ACCENT_VALUE: Record<AccentKey, string> = {
  cyan:   'text-accent-cyan',
  amber:  'text-accent-amber',
  red:    'text-accent-red',
  green:  'text-accent-green',
  purple: 'text-accent-purple',
  blue:   'text-accent-blue',
}

interface StatCardProps {
  label:     string
  value:     string | number
  sub?:      string
  subColor?: string
  accent:    AccentKey
  icon?:     React.ReactNode
}
export function StatCard({ label, value, sub, subColor, accent, icon }: StatCardProps) {
  return (
    <div className="stat-card flex flex-col gap-1.5">
      <div className={cn('stat-card-bar', ACCENT_BAR[accent])} />
      {icon && (
        <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center mb-0.5', ACCENT_ICON_BG[accent])}>
          {icon}
        </div>
      )}
      <p className="text-[9px] text-text-muted font-mono uppercase tracking-[0.8px]">{label}</p>
      <p className={cn('text-[22px] font-bold font-mono leading-none', ACCENT_VALUE[accent])}>{value}</p>
      {sub && (
        <p className={cn('text-[10px]', subColor ?? 'text-text-secondary')}>{sub}</p>
      )}
    </div>
  )
}

/* ── Panel ─────────────────────────────────────────────────────────── */
interface PanelProps {
  title:        string
  sub?:         string
  icon?:        React.ReactNode
  children:     React.ReactNode
  className?:   string
  headerRight?: React.ReactNode
}
export function Panel({ title, sub, icon, children, className, headerRight }: PanelProps) {
  return (
    <div className={cn('panel', className)}>
      <div className="panel-header">
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span className="panel-title">{title}</span>
        <div className="ml-auto flex items-center gap-2">
          {headerRight ?? (sub && <span className="panel-sub">{sub}</span>)}
        </div>
      </div>
      {children}
    </div>
  )
}

/* ── Live Dot ──────────────────────────────────────────────────────── */
export function LiveDot({ className }: { className?: string }) {
  return (
    <span className={cn('inline-block w-[6px] h-[6px] rounded-full bg-accent-green animate-pulse-soft', className)} />
  )
}
