import { useState, useMemo } from 'react'
import {
  Search, UserPlus, MoreVertical, Shield,
  ChevronDown, X, Check, Mail, Building2,
  Users, ShieldCheck, Cpu, Eye,
} from 'lucide-react'
import Topbar from '@/components/layout/Topbar'
import { Panel, Badge, StatusPill } from '@/components/ui'
import { cn } from '@/lib/utils'

type UserRole = 'super_admin' | 'admin_company' | 'kepala_instansi' | 'supervisor'

interface User {
  id: string
  name: string
  email: string
  role: UserRole
  company: string
  status: 'active' | 'inactive' | 'pending'
  lastLogin: string
  createdAt: string
}

const MOCK_USERS: User[] = [
  { id: '1', name: 'Ahmad Fauzi', email: 'a.fauzi@webgis.id', role: 'super_admin', company: 'PT Makmur Abadi', status: 'active', lastLogin: '10 Apr 2026', createdAt: '01 Jan 2024' },
  { id: '2', name: 'Budi Raharjo', email: 'admin@majujaya.co.id', role: 'admin_company', company: 'PT Maju Jaya', status: 'active', lastLogin: '10 Apr 2026', createdAt: '15 Mar 2024' },
  { id: '3', name: 'Siti Aminah', email: 's.aminah@desdm.go.id', role: 'kepala_instansi', company: 'Dinas ESDM DKI', status: 'active', lastLogin: '09 Apr 2026', createdAt: '01 Feb 2024' },
  { id: '4', name: 'Rudi Santoso', email: 'rudi.s@majujaya.co.id', role: 'supervisor', company: 'PT Maju Jaya', status: 'active', lastLogin: '10 Apr 2026', createdAt: '20 Mar 2024' },
  { id: '5', name: 'Dewi Kartika', email: 'dewi.k@bumiraya.co.id', role: 'supervisor', company: 'PT Bumi Raya', status: 'pending', lastLogin: '—', createdAt: '08 Apr 2026' },
  { id: '6', name: 'Agus Wijaya', email: 'a.wijaya@desdm.go.id', role: 'kepala_instansi', company: 'Dinas ESDM DKI', status: 'active', lastLogin: '07 Apr 2026', createdAt: '01 Feb 2024' },
  { id: '7', name: 'Sari Wulandari', email: 'admin@tirta.co.id', role: 'admin_company', company: 'PT Tirta Mandiri', status: 'active', lastLogin: '08 Apr 2026', createdAt: '10 Mar 2024' },
  { id: '8', name: 'Dedi Haryanto', email: 'admin@karya.co.id', role: 'admin_company', company: 'PT Karya Makmur', status: 'active', lastLogin: '05 Apr 2026', createdAt: '20 Feb 2024' },
  { id: '9', name: 'Fitri Handayani', email: 'fitri@sumberair.co.id', role: 'supervisor', company: 'PT Sumber Air', status: 'inactive', lastLogin: '01 Mar 2026', createdAt: '15 Jan 2024' },
  { id: '10', name: 'Hendra Saputra', email: 'hendra@indo.co.id', role: 'supervisor', company: 'PT Indo Nusantara', status: 'pending', lastLogin: '—', createdAt: '09 Apr 2026' },
  { id: '11', name: 'Rina Kusuma', email: 'rina@bumiraya.co.id', role: 'admin_company', company: 'PT Bumi Raya', status: 'active', lastLogin: '06 Apr 2026', createdAt: '05 Mar 2024' },
  { id: '12', name: 'Tono Sudarsono', email: 'tono@webgis.id', role: 'super_admin', company: 'PT Nusantara Jaya', status: 'active', lastLogin: '08 Apr 2026', createdAt: '01 Jan 2024' },
]

const ROLE_CONFIG: Record<UserRole, { label: string; color: string; bg: string; Icon: React.ElementType }> = {
  super_admin: { label: 'Super Admin', color: 'text-accent-purple', bg: 'bg-fill-purple', Icon: Shield },
  admin_company: { label: 'Admin Perusahaan', color: 'text-accent-blue', bg: 'bg-fill-blue', Icon: Building2 },
  kepala_instansi: { label: 'Kepala Instansi', color: 'text-accent-cyan', bg: 'bg-fill-cyan', Icon: ShieldCheck },
  supervisor: { label: 'Supervisor', color: 'text-accent-amber', bg: 'bg-fill-amber', Icon: Cpu },
}

const ROLE_COUNTS = {
  all: MOCK_USERS.length,
  super_admin: MOCK_USERS.filter(u => u.role === 'super_admin').length,
  admin_company: MOCK_USERS.filter(u => u.role === 'admin_company').length,
  kepala_instansi: MOCK_USERS.filter(u => u.role === 'kepala_instansi').length,
  supervisor: MOCK_USERS.filter(u => u.role === 'supervisor').length,
}

/* ── Invite Modal ──────────────────────────────────────────────────── */
function InviteModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ name: '', email: '', role: 'supervisor' as UserRole, company: '' })
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-bg-card border border-border-base rounded-2xl shadow-[0_20px_60px_rgba(15,23,42,0.15)] w-[440px]"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-6 py-5 border-b border-border-base">
          <div className="w-9 h-9 rounded-xl bg-fill-blue flex items-center justify-center">
            <UserPlus size={16} className="text-accent-blue" />
          </div>
          <div>
            <p className="text-[13px] font-bold text-text-primary">Undang Pengguna Baru</p>
            <p className="text-[10px] text-text-muted">Kirim undangan via email</p>
          </div>
          <button onClick={onClose} className="ml-auto text-text-muted hover:text-text-primary transition-colors"><X size={16} /></button>
        </div>
        <div className="p-6 space-y-4">
          {[
            { label: 'Nama Lengkap', key: 'name', type: 'text', ph: 'John Doe' },
            { label: 'Email', key: 'email', type: 'email', ph: 'john@company.co.id' },
          ].map(({ label, key, type, ph }) => (
            <div key={key}>
              <label className="block text-[10px] font-semibold text-text-secondary mb-1.5">{label}</label>
              <input type={type} placeholder={ph}
                value={form[key as 'name' | 'email']}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                className="w-full bg-bg-card3 border border-border-base rounded-lg px-3 h-9 text-[11px] text-text-primary outline-none focus:border-accent-cyan transition-colors placeholder:text-text-muted" />
            </div>
          ))}
          <div>
            <label className="block text-[10px] font-semibold text-text-secondary mb-1.5">Role</label>
            <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as UserRole }))}
              className="w-full bg-bg-card3 border border-border-base rounded-lg px-3 h-9 text-[11px] text-text-secondary outline-none focus:border-accent-cyan cursor-pointer transition-colors">
              {Object.entries(ROLE_CONFIG).filter(([k]) => k !== 'super_admin').map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </div>
          {form.role !== 'super_admin' && (
            <div>
              <label className="block text-[10px] font-semibold text-text-secondary mb-1.5">Perusahaan / Instansi</label>
              <input type="text" placeholder="PT Nama Perusahaan"
                value={form.company}
                onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                className="w-full bg-bg-card3 border border-border-base rounded-lg px-3 h-9 text-[11px] text-text-primary outline-none focus:border-accent-cyan transition-colors placeholder:text-text-muted" />
            </div>
          )}
        </div>
        <div className="flex gap-2 px-6 pb-6">
          <button onClick={onClose} className="flex-1 border border-border-base rounded-xl py-2.5 text-[11px] font-semibold text-text-secondary hover:bg-bg-card3 transition-colors">Batal</button>
          <button className="flex-1 bg-accent-blue text-white rounded-xl py-2.5 text-[11px] font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
            <Mail size={13} /> Kirim Undangan
          </button>
        </div>
      </div>
    </div>
  )
}

export default function UsersPage() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all')
  const [showInvite, setShowInvite] = useState(false)
  const [menuOpen, setMenuOpen] = useState<string | null>(null)

  const filtered = useMemo(() => MOCK_USERS.filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false
    if (search) {
      const q = search.toLowerCase()
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.company.toLowerCase().includes(q)
    }
    return true
  }), [search, roleFilter])

  const pendingCount = MOCK_USERS.filter(u => u.status === 'pending').length

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar
        breadcrumbs={[{ label: 'Super Admin' }, { label: 'Pengguna' }]}
        actions={
          <button onClick={() => setShowInvite(true)}
            className="flex items-center gap-1.5 text-[11px] font-semibold bg-accent-blue text-white rounded-lg px-3 h-8 hover:bg-blue-700 transition-colors">
            <UserPlus size={13} /> Undang Pengguna
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto p-5 space-y-4">

        {/* Summary cards */}
        <div className="grid grid-cols-5 gap-3">
          <div className="col-span-1 bg-bg-card border border-border-base rounded-xl p-4 shadow-card flex flex-col gap-1">
            <p className="text-[9px] text-text-muted uppercase tracking-wide font-mono">Total Pengguna</p>
            <p className="text-[26px] font-bold text-text-primary font-mono leading-none">{MOCK_USERS.length}</p>
            {pendingCount > 0 && (
              <p className="text-[10px] text-accent-amber font-medium">{pendingCount} menunggu verifikasi</p>
            )}
          </div>
          {Object.entries(ROLE_CONFIG).map(([key, cfg]) => {
            const Icon = cfg.Icon
            const count = ROLE_COUNTS[key as UserRole]
            return (
              <div key={key} className={cn('bg-bg-card border border-border-base rounded-xl p-4 shadow-card cursor-pointer hover:shadow-card-hover transition-shadow',
                roleFilter === key && 'ring-2 ring-accent-cyan/30')}
                onClick={() => setRoleFilter(roleFilter === key ? 'all' : key as UserRole)}>
                <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center mb-2', cfg.bg)}>
                  <Icon size={14} className={cfg.color} />
                </div>
                <p className="text-[18px] font-bold font-mono text-text-primary leading-none">{count}</p>
                <p className="text-[9px] text-text-muted mt-1">{cfg.label}</p>
              </div>
            )
          })}
        </div>

        {/* Table */}
        <Panel
          title="Daftar Pengguna"
          icon={<Users size={12} className="text-accent-blue" />}
          headerRight={
            <span className="text-[10px] font-mono text-text-muted">{filtered.length} pengguna</span>
          }
        >
          {/* Filter bar */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border-base bg-bg-card3">
            <div className="flex items-center gap-2 bg-bg-card border border-border-base rounded-lg px-3 h-8 min-w-[220px]">
              <Search size={12} className="text-text-muted flex-shrink-0" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Cari nama, email, perusahaan..."
                className="bg-transparent outline-none text-[11px] text-text-primary placeholder:text-text-muted flex-1" />
              {search && <button onClick={() => setSearch('')}><X size={11} className="text-text-muted hover:text-text-primary" /></button>}
            </div>
            <div className="flex items-center gap-1 bg-bg-card border border-border-base rounded-lg p-1">
              <button onClick={() => setRoleFilter('all')}
                className={cn('px-2.5 py-1 rounded-md text-[10px] font-medium transition-all',
                  roleFilter === 'all' ? 'bg-bg-card3 text-text-primary shadow-sm border border-border-base' : 'text-text-muted hover:text-text-secondary')}>
                Semua
              </button>
              {Object.entries(ROLE_CONFIG).map(([k, v]) => (
                <button key={k} onClick={() => setRoleFilter(k as UserRole)}
                  className={cn('px-2.5 py-1 rounded-md text-[10px] font-medium transition-all',
                    roleFilter === k ? 'bg-bg-card3 text-text-primary shadow-sm border border-border-base' : 'text-text-muted hover:text-text-secondary')}>
                  {v.label.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <table className="data-table">
            <thead>
              <tr>
                <th>Pengguna</th>
                <th>Role</th>
                <th>Perusahaan</th>
                <th>Status</th>
                <th>Terakhir Login</th>
                <th>Bergabung</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => {
                const role = ROLE_CONFIG[user.role]
                const RoleIcon = role.Icon
                return (
                  <tr key={user.id} className="group">
                    <td>
                      <div className="flex items-center gap-2.5">
                        <div className={cn('w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0', role.bg.replace('bg-fill-', 'bg-accent-').replace('bg-accent-', 'bg-'))}>
                          <span className={role.color}>{user.name.split(' ').map(n => n[0]).slice(0, 2).join('')}</span>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold text-text-primary">{user.name}</p>
                          <p className="text-[9px] text-text-muted font-mono">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={cn('inline-flex items-center gap-1.5 text-[9px] font-mono font-semibold px-2 py-1 rounded-lg', role.bg, role.color)}>
                        <RoleIcon size={9} /> {role.label}
                      </span>
                    </td>
                    <td className="text-text-secondary text-[11px]">{user.company}</td>
                    <td>
                      {user.status === 'active' && <StatusPill variant="online" />}
                      {user.status === 'inactive' && <StatusPill variant="offline" />}
                      {user.status === 'pending' && <Badge label="PENDING" variant="warning" />}
                    </td>
                    <td className="td-mono text-text-muted">{user.lastLogin}</td>
                    <td className="td-mono text-text-muted">{user.createdAt}</td>
                    <td>
                      <div className="relative">
                        <button onClick={() => setMenuOpen(menuOpen === user.id ? null : user.id)}
                          className="p-1 rounded-lg hover:bg-bg-card3 transition-colors text-text-muted hover:text-text-secondary">
                          <MoreVertical size={14} />
                        </button>
                        {menuOpen === user.id && (
                          <div className="absolute right-0 top-8 z-10 bg-white border border-border-base rounded-xl shadow-card-hover min-w-[140px] overflow-hidden">
                            {['Lihat Detail', 'Edit Role', 'Reset Password', 'Nonaktifkan'].map((action) => (
                              <button key={action} onClick={() => setMenuOpen(null)}
                                className={cn('w-full text-left px-4 py-2.5 text-[11px] hover:bg-bg-card3 transition-colors',
                                  action === 'Nonaktifkan' ? 'text-accent-red' : 'text-text-secondary')}>
                                {action}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Panel>
      </div>

      {showInvite && <InviteModal onClose={() => setShowInvite(false)} />}
    </div>
  )
}
