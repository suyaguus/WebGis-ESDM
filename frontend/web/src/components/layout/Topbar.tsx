import { useState, useEffect } from 'react'
import { ChevronRight, Bell, Search } from 'lucide-react'
import { useAuthStore } from '@/store'
import { getLiveDate, getLiveTime } from '@/lib/utils'

interface Crumb { label: string }

export default function Topbar({
  breadcrumbs,
  actions,
}: {
  breadcrumbs: Crumb[]
  actions?: React.ReactNode
}) {
  const { user } = useAuthStore()
  const [time, setTime] = useState(getLiveTime())

  useEffect(() => {
    const t = setInterval(() => setTime(getLiveTime()), 30_000)
    return () => clearInterval(t)
  }, [])

  return (
    <header className="h-12 flex-shrink-0 bg-bg-sidebar border-b border-border-base flex items-center px-5 gap-4 shadow-topbar">

      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-[11px] text-text-muted">
        {breadcrumbs.map((b, i) => (
          <span key={b.label} className="flex items-center gap-1">
            {i > 0 && <ChevronRight size={11} className="text-border-strong" />}
            <span className={i === breadcrumbs.length - 1
              ? 'text-text-primary font-semibold'
              : 'hover:text-text-secondary transition-colors cursor-pointer'
            }>
              {b.label}
            </span>
          </span>
        ))}
      </div>

      <div className="ml-auto flex items-center gap-2.5">
        {actions}

        {/* Search */}
        <button className="flex items-center gap-2 bg-bg-card3 border border-border-base rounded-lg px-3 h-8 text-[11px] text-text-muted hover:border-border-strong hover:text-text-secondary transition-colors w-48">
          <Search size={12} />
          <span>Cari...</span>
          <span className="ml-auto text-[9px] font-mono bg-border-light px-1.5 py-0.5 rounded text-text-muted">⌘K</span>
        </button>

        {/* Date-time */}
        <div className="text-[10px] text-text-muted font-mono bg-bg-card3 border border-border-base px-2.5 py-1.5 rounded-lg whitespace-nowrap">
          {getLiveDate()} · {time}
        </div>

        {/* Notifications */}
        <button className="relative w-8 h-8 rounded-lg bg-bg-card border border-border-base flex items-center justify-center hover:bg-bg-card3 hover:border-border-strong transition-colors group shadow-sm">
          <Bell size={14} className="text-text-muted group-hover:text-text-secondary transition-colors" />
          <span className="absolute top-[6px] right-[6px] w-[5px] h-[5px] rounded-full bg-accent-red border border-white" />
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm"
          style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)' }}>
          {user.initials}
        </div>
      </div>
    </header>
  )
}
