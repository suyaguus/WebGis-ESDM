import { useState, useMemo } from 'react'
import {
  ClipboardList, Search, Filter, Download,
  User, Shield, FileText, Cpu, Settings,
  LogIn, LogOut, Edit, Trash2, Plus,
  CheckCircle, XCircle, AlertTriangle, Eye,
} from 'lucide-react'
import Topbar from '@/components/layout/Topbar'
import { Panel, Badge } from '@/components/ui'
import { cn } from '@/lib/utils'

type ActionType = 'login' | 'logout' | 'create' | 'update' | 'delete' | 'approve' | 'reject' | 'view'
type Module = 'auth' | 'sensor' | 'laporan' | 'pengguna' | 'perusahaan' | 'konfigurasi' | 'sistem'

interface AuditLog {
  id: string
  timestamp: string
  user: string
  role: string
  action: ActionType
  module: Module
  description: string
  target?: string
  ip: string
  status: 'success' | 'failed' | 'warning'
}

const LOGS: AuditLog[] = [
  { id:'1',  timestamp:'10 Apr 2026, 10:02',  user:'Ahmad Fauzi',    role:'Super Admin',      action:'login',   module:'auth',        description:'Login berhasil',                   ip:'192.168.1.10', status:'success' },
  { id:'2',  timestamp:'10 Apr 2026, 09:45',  user:'Budi Raharjo',   role:'Admin Perusahaan', action:'update',  module:'sensor',      description:'Update status sensor',             target:'SW-019',   ip:'10.0.1.22',  status:'success' },
  { id:'3',  timestamp:'10 Apr 2026, 09:30',  user:'Ahmad Fauzi',    role:'Super Admin',      action:'approve', module:'laporan',     description:'Menyetujui laporan Q1 2026',       target:'RPT-001',  ip:'192.168.1.10',status:'success'},
  { id:'4',  timestamp:'10 Apr 2026, 09:15',  user:'Siti Aminah',    role:'Kepala Instansi',  action:'view',    module:'laporan',     description:'Melihat laporan perusahaan',       target:'PT Maju Jaya', ip:'10.0.2.15',status:'success'},
  { id:'5',  timestamp:'10 Apr 2026, 08:55',  user:'Dewi Kartika',   role:'Supervisor',       action:'login',   module:'auth',        description:'Percobaan login gagal',            ip:'10.0.3.88',  status:'failed'  },
  { id:'6',  timestamp:'10 Apr 2026, 08:40',  user:'Ahmad Fauzi',    role:'Super Admin',      action:'create',  module:'pengguna',    description:'Undang pengguna baru',             target:'hendra@indo.co.id', ip:'192.168.1.10', status:'success'},
  { id:'7',  timestamp:'10 Apr 2026, 08:22',  user:'Rina Kusuma',    role:'Admin Perusahaan', action:'create',  module:'laporan',     description:'Submit laporan baru',             target:'Laporan Mar 2026', ip:'10.0.4.55', status:'success'},
  { id:'8',  timestamp:'10 Apr 2026, 08:10',  user:'Rudi Santoso',   role:'Supervisor',       action:'update',  module:'sensor',      description:'Input data sensor lapangan',      target:'GN-011',   ip:'10.0.5.20',  status:'success'},
  { id:'9',  timestamp:'09 Apr 2026, 23:15',  user:'SYSTEM',         role:'Sistem',           action:'create',  module:'sistem',      description:'Auto backup database',            target:'DB-2026-04-09', ip:'localhost', status:'success'},
  { id:'10', timestamp:'09 Apr 2026, 17:30',  user:'Ahmad Fauzi',    role:'Super Admin',      action:'update',  module:'konfigurasi', description:'Update threshold subsidence',     target:'Config',   ip:'192.168.1.10', status:'success'},
  { id:'11', timestamp:'09 Apr 2026, 16:00',  user:'Ahmad Fauzi',    role:'Super Admin',      action:'reject',  module:'laporan',     description:'Menolak laporan Q4 2025',         target:'PT Bumi Raya', ip:'192.168.1.10', status:'warning'},
  { id:'12', timestamp:'09 Apr 2026, 14:45',  user:'Sari Wulandari', role:'Admin Perusahaan', action:'update',  module:'pengguna',    description:'Reset password pengguna',         target:'Fitri Handayani', ip:'10.0.1.33', status:'success'},
  { id:'13', timestamp:'09 Apr 2026, 12:00',  user:'Ahmad Fauzi',    role:'Super Admin',      action:'delete',  module:'pengguna',    description:'Nonaktifkan akun pengguna',       target:'Fitri Handayani', ip:'192.168.1.10', status:'warning'},
  { id:'14', timestamp:'09 Apr 2026, 10:30',  user:'Agus Wijaya',    role:'Kepala Instansi',  action:'view',    module:'laporan',     description:'Export laporan PDF',              target:'Laporan 2025', ip:'10.0.2.18', status:'success'},
  { id:'15', timestamp:'09 Apr 2026, 09:00',  user:'SYSTEM',         role:'Sistem',           action:'create',  module:'sistem',      description:'Alert kritis terdeteksi',         target:'GN-042',   ip:'localhost',  status:'failed'  },
]

const ACTION_CFG: Record<ActionType, { label: string; Icon: React.ElementType; color: string; bg: string }> = {
  login:   { label: 'Login',    Icon: LogIn,        color: 'text-accent-blue',   bg: 'bg-fill-blue'   },
  logout:  { label: 'Logout',   Icon: LogOut,       color: 'text-text-muted',    bg: 'bg-bg-card3'    },
  create:  { label: 'Buat',     Icon: Plus,         color: 'text-accent-green',  bg: 'bg-fill-green'  },
  update:  { label: 'Update',   Icon: Edit,         color: 'text-accent-cyan',   bg: 'bg-fill-cyan'   },
  delete:  { label: 'Hapus',    Icon: Trash2,       color: 'text-accent-red',    bg: 'bg-fill-red'    },
  approve: { label: 'Setujui',  Icon: CheckCircle,  color: 'text-accent-green',  bg: 'bg-fill-green'  },
  reject:  { label: 'Tolak',    Icon: XCircle,      color: 'text-accent-red',    bg: 'bg-fill-red'    },
  view:    { label: 'Lihat',    Icon: Eye,          color: 'text-text-secondary',bg: 'bg-bg-card3'    },
}

const MODULE_CFG: Record<Module, { label: string; Icon: React.ElementType; color: string }> = {
  auth:        { label: 'Auth',        Icon: Shield,      color: 'text-accent-purple' },
  sensor:      { label: 'Sensor',      Icon: Cpu,         color: 'text-accent-cyan'   },
  laporan:     { label: 'Laporan',     Icon: FileText,    color: 'text-accent-blue'   },
  pengguna:    { label: 'Pengguna',    Icon: User,        color: 'text-accent-amber'  },
  perusahaan:  { label: 'Perusahaan',  Icon: Shield,      color: 'text-accent-blue'   },
  konfigurasi: { label: 'Konfigurasi', Icon: Settings,    color: 'text-accent-purple' },
  sistem:      { label: 'Sistem',      Icon: Shield,      color: 'text-text-muted'    },
}

const STATUS_CFG = {
  success: { dot: 'bg-accent-green',  label: 'Berhasil' },
  failed:  { dot: 'bg-accent-red',    label: 'Gagal'    },
  warning: { dot: 'bg-accent-amber',  label: 'Peringatan'},
}

export default function AuditPage() {
  const [search,       setSearch]       = useState('')
  const [actionFilter, setActionFilter] = useState<ActionType | 'all'>('all')
  const [moduleFilter, setModuleFilter] = useState<Module | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'failed' | 'warning'>('all')
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 10

  const filtered = useMemo(() => LOGS.filter(l => {
    if (actionFilter !== 'all' && l.action !== actionFilter) return false
    if (moduleFilter !== 'all' && l.module !== moduleFilter) return false
    if (statusFilter !== 'all' && l.status !== statusFilter) return false
    if (search) {
      const q = search.toLowerCase()
      return l.user.toLowerCase().includes(q) || l.description.toLowerCase().includes(q) || (l.target ?? '').toLowerCase().includes(q)
    }
    return true
  }), [search, actionFilter, moduleFilter, statusFilter])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const counts = {
    success: LOGS.filter(l => l.status === 'success').length,
    failed:  LOGS.filter(l => l.status === 'failed').length,
    warning: LOGS.filter(l => l.status === 'warning').length,
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar
        breadcrumbs={[{ label: 'Super Admin' }, { label: 'Audit Log' }]}
        actions={
          <button className="flex items-center gap-1.5 text-[10px] font-medium text-text-secondary border border-border-base rounded-lg px-2.5 h-8 hover:bg-bg-card3 transition-colors">
            <Download size={12} /> Export Log
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto p-5 space-y-4">

        {/* Summary */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-bg-card border border-border-base rounded-xl p-4 shadow-card">
            <p className="text-[9px] text-text-muted uppercase tracking-wide font-mono mb-1">Total Aktivitas</p>
            <p className="text-[26px] font-bold font-mono text-text-primary leading-none">{LOGS.length}</p>
            <p className="text-[9px] text-text-muted mt-1">Hari ini</p>
          </div>
          {([
            ['success', 'Berhasil',   counts.success, 'text-accent-green'],
            ['failed',  'Gagal',      counts.failed,  'text-accent-red'  ],
            ['warning', 'Peringatan', counts.warning, 'text-accent-amber'],
          ] as const).map(([k, l, v, c]) => (
            <div key={k}
              onClick={() => setStatusFilter(statusFilter === k ? 'all' : k)}
              className={cn('bg-bg-card border border-border-base rounded-xl p-4 shadow-card cursor-pointer hover:shadow-card-hover transition-shadow',
                statusFilter === k && 'ring-2 ring-accent-cyan/30')}>
              <p className="text-[9px] text-text-muted uppercase tracking-wide font-mono mb-1">{l}</p>
              <p className={cn('text-[26px] font-bold font-mono leading-none', c)}>{v}</p>
            </div>
          ))}
        </div>

        <Panel
          title="Log Aktivitas"
          icon={<ClipboardList size={12} className="text-accent-purple" />}
          headerRight={<span className="text-[10px] font-mono text-text-muted">{filtered.length} entri</span>}
        >
          {/* Filters */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border-base bg-bg-card3 flex-wrap">
            <div className="flex items-center gap-2 bg-bg-card border border-border-base rounded-lg px-3 h-8 min-w-[200px]">
              <Search size={12} className="text-text-muted flex-shrink-0" />
              <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
                placeholder="Cari user, deskripsi, target..."
                className="bg-transparent outline-none text-[11px] text-text-primary placeholder:text-text-muted flex-1" />
            </div>

            {/* Module filter */}
            <select value={moduleFilter} onChange={e => { setModuleFilter(e.target.value as Module | 'all'); setPage(1) }}
              className="h-8 bg-bg-card border border-border-base rounded-lg px-2.5 text-[10px] text-text-secondary outline-none hover:border-border-strong cursor-pointer transition-colors">
              <option value="all">Semua Modul</option>
              {Object.entries(MODULE_CFG).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>

            {/* Action filter */}
            <select value={actionFilter} onChange={e => { setActionFilter(e.target.value as ActionType | 'all'); setPage(1) }}
              className="h-8 bg-bg-card border border-border-base rounded-lg px-2.5 text-[10px] text-text-secondary outline-none hover:border-border-strong cursor-pointer transition-colors">
              <option value="all">Semua Aksi</option>
              {Object.entries(ACTION_CFG).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>

            {/* Status tabs */}
            <div className="flex items-center gap-1 bg-bg-card border border-border-base rounded-lg p-1 ml-auto">
              {(['all', 'success', 'failed', 'warning'] as const).map((s) => (
                <button key={s} onClick={() => { setStatusFilter(s); setPage(1) }}
                  className={cn('px-2.5 py-1 rounded-md text-[10px] font-medium transition-all',
                    statusFilter === s ? 'bg-bg-card3 text-text-primary shadow-sm border border-border-base' : 'text-text-muted hover:text-text-secondary')}>
                  {s === 'all' ? 'Semua' : STATUS_CFG[s].label}
                </button>
              ))}
            </div>
          </div>

          {/* Log table */}
          <table className="data-table">
            <thead>
              <tr>
                <th>Waktu</th>
                <th>Pengguna</th>
                <th>Modul</th>
                <th>Aksi</th>
                <th>Deskripsi</th>
                <th>Target</th>
                <th>IP</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((log) => {
                const action = ACTION_CFG[log.action]
                const module = MODULE_CFG[log.module]
                const status = STATUS_CFG[log.status]
                const ActionIcon = action.Icon
                const ModuleIcon = module.Icon
                return (
                  <tr key={log.id} className="hover:bg-bg-card3 transition-colors group">
                    <td className="td-mono text-text-muted whitespace-nowrap">{log.timestamp}</td>
                    <td>
                      <div>
                        <p className="text-[11px] font-semibold text-text-primary">{log.user}</p>
                        <p className="text-[9px] text-text-muted">{log.role}</p>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <ModuleIcon size={11} className={module.color} />
                        <span className="text-[10px] text-text-secondary">{module.label}</span>
                      </div>
                    </td>
                    <td>
                      <div className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-mono font-semibold', action.bg, action.color)}>
                        <ActionIcon size={9} />
                        {action.label}
                      </div>
                    </td>
                    <td className="text-text-secondary text-[11px] max-w-[200px] truncate">{log.description}</td>
                    <td className="td-mono text-text-muted">{log.target ?? '—'}</td>
                    <td className="td-mono text-text-muted">{log.ip}</td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <span className={cn('w-[6px] h-[6px] rounded-full flex-shrink-0', status.dot,
                          log.status === 'success' ? 'animate-pulse-soft' : '')} />
                        <span className={cn('text-[9px] font-medium',
                          log.status === 'success' ? 'text-accent-green' :
                          log.status === 'failed'  ? 'text-accent-red'   : 'text-accent-amber')}>
                          {status.label}
                        </span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border-base bg-bg-card3">
              <p className="text-[10px] text-text-muted font-mono">
                {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} dari {filtered.length} entri
              </p>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="px-3 py-1 rounded-lg border border-border-base text-[10px] text-text-muted hover:bg-bg-card3 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                  ← Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)}
                    className={cn('w-7 h-7 rounded-lg border text-[10px] font-mono transition-colors',
                      page === p ? 'bg-accent-cyan text-white border-accent-cyan font-bold' : 'border-border-base text-text-muted hover:bg-bg-card3')}>
                    {p}
                  </button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="px-3 py-1 rounded-lg border border-border-base text-[10px] text-text-muted hover:bg-bg-card3 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                  Next →
                </button>
              </div>
            </div>
          )}
        </Panel>

        <div className="h-2" />
      </div>
    </div>
  )
}
