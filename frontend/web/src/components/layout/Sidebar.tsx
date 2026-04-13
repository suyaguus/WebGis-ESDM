import { Link, useLocation } from 'react-router-dom'
import {
  Activity, LayoutGrid, Map, Cpu, BarChart2,
  Users, Building2, ShieldCheck, FileText,
  Settings, Server, ClipboardList, ChevronLeft, ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUIStore, useAuthStore } from '@/store'
import { NavBadge, LiveDot } from '@/components/ui'

const NAV = [
  {
    section: 'Overview',
    items: [
      { label: 'Dashboard',       Icon: LayoutGrid,    path: '/superadmin'              },
      { label: 'Peta Interaktif', Icon: Map,           path: '/superadmin/peta'         },
      { label: 'Semua Sensor',    Icon: Cpu,           path: '/superadmin/sensor', badge: 3,  bv: 'red'   as const },
      { label: 'Analytics',       Icon: BarChart2,     path: '/superadmin/analytics'    },
    ],
  },
  {
    section: 'Manajemen',
    items: [
      { label: 'Pengguna',        Icon: Users,         path: '/superadmin/users',  badge: 12, bv: 'amber' as const },
      { label: 'Perusahaan',      Icon: Building2,     path: '/superadmin/companies'    },
      { label: 'Role & Akses',    Icon: ShieldCheck,   path: '/superadmin/roles'        },
      { label: 'Laporan',         Icon: FileText,      path: '/superadmin/reports'      },
    ],
  },
  {
    section: 'Sistem',
    items: [
      { label: 'Konfigurasi',     Icon: Settings,      path: '/superadmin/config'       },
      { label: 'Server & API',    Icon: Server,        path: '/superadmin/server'       },
      { label: 'Audit Log',       Icon: ClipboardList, path: '/superadmin/audit'        },
    ],
  },
]

export default function Sidebar() {
  const { pathname } = useLocation()
  const { sidebarCollapsed, toggleSidebar } = useUIStore()
  const { user } = useAuthStore()

  return (
    <aside className={cn(
      'relative flex flex-col bg-bg-sidebar border-r border-border-base transition-[width] duration-200 flex-shrink-0 overflow-hidden shadow-sidebar',
      sidebarCollapsed ? 'w-[54px]' : 'w-[210px]',
    )}>

      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-[14px] border-b border-border-base min-h-[56px]">
        <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center shadow-sm"
          style={{ background: 'linear-gradient(135deg, #0891b2, #2563eb)' }}>
          <Activity size={16} className="text-white" strokeWidth={2.5} />
        </div>
        {!sidebarCollapsed && (
          <div>
            <p className="text-[13px] font-bold text-text-primary tracking-[0.3px] leading-none">WebGIS</p>
            <p className="text-[9px] text-accent-cyan font-mono tracking-[1.5px] mt-0.5">SIPASTI v2.0</p>
          </div>
        )}
      </div>

      {/* User card */}
      <div className={cn(
        'flex items-center gap-2.5 border-b border-border-base bg-bg-card2 min-h-[46px]',
        sidebarCollapsed ? 'px-[13px]' : 'px-4',
      )}>
        <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white"
          style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)' }}>
          {user.initials}
        </div>
        {!sidebarCollapsed && (
          <div className="overflow-hidden">
            <p className="text-[11px] font-semibold text-text-primary truncate leading-tight">{user.name}</p>
            <p className="text-[8px] text-text-muted font-mono">{user.role.toUpperCase()}</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2">
        {NAV.map(({ section, items }) => (
          <div key={section}>
            {!sidebarCollapsed && (
              <p className="text-[8px] text-text-muted font-mono uppercase tracking-[1.5px] px-4 pt-3 pb-1.5 font-semibold">
                {section}
              </p>
            )}
            {items.map(({ label, Icon, path, badge, bv }) => {
              const active = pathname === path ||
                (path !== '/superadmin' && pathname.startsWith(path))
              return (
                <Link key={path} to={path}
                  title={sidebarCollapsed ? label : undefined}
                  className={cn('nav-item', active && 'active', sidebarCollapsed && 'justify-center px-0 py-2.5')}>
                  <Icon size={13} className="flex-shrink-0" />
                  {!sidebarCollapsed && (
                    <>
                      <span>{label}</span>
                      {badge != null && <NavBadge count={badge} variant={bv} />}
                    </>
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      {!sidebarCollapsed && (
        <div className="px-4 py-3 border-t border-border-base bg-bg-card2">
          <div className="flex items-center gap-2 text-[9px] text-text-muted font-mono">
            <LiveDot />
            SISTEM ONLINE · 99.8% UPTIME
          </div>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-[72px] w-6 h-6 rounded-full bg-bg-card border border-border-base shadow-card flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-card3 transition-colors z-10">
        {sidebarCollapsed ? <ChevronRight size={11} /> : <ChevronLeft size={11} />}
      </button>
    </aside>
  )
}
