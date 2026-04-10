import { useState } from 'react'
import { Shield, ShieldCheck, Building2, Cpu, Check, X, Info } from 'lucide-react'
import Topbar from '@/components/layout/Topbar'
import { Panel } from '@/components/ui'
import { cn } from '@/lib/utils'

type Role = 'super_admin' | 'admin_company' | 'kepala_instansi' | 'supervisor'

const ROLES: { key: Role; label: string; Icon: React.ElementType; color: string; bg: string; desc: string; userCount: number }[] = [
  { key: 'super_admin',     label: 'Super Admin',      Icon: Shield,      color: 'text-accent-purple', bg: 'bg-fill-purple', desc: 'Akses penuh ke seluruh sistem, semua perusahaan, konfigurasi, dan manajemen pengguna.',      userCount: 2  },
  { key: 'admin_company',   label: 'Admin Perusahaan', Icon: Building2,   color: 'text-accent-blue',   bg: 'bg-fill-blue',   desc: 'Mengelola data sensor, pengguna, dan laporan dalam lingkup perusahaannya sendiri.',          userCount: 5  },
  { key: 'kepala_instansi', label: 'Kepala Instansi',  Icon: ShieldCheck, color: 'text-accent-cyan',   bg: 'bg-fill-cyan',   desc: 'Memantau dan menyetujui laporan dari beberapa perusahaan di bawah instansinya. Read-only untuk data sensor.', userCount: 2 },
  { key: 'supervisor',      label: 'Supervisor',        Icon: Cpu,         color: 'text-accent-amber',  bg: 'bg-fill-amber',  desc: 'Melakukan input data lapangan, melihat peta dan sensor yang menjadi tanggung jawabnya.',   userCount: 4  },
]

type PermKey = string
interface Permission {
  id: PermKey
  module: string
  label: string
  super_admin: boolean
  admin_company: boolean
  kepala_instansi: boolean
  supervisor: boolean
}

const PERMISSIONS: Permission[] = [
  // Dashboard
  { id:'d1',  module:'Dashboard',      label:'Lihat Dashboard',            super_admin:true,  admin_company:true,  kepala_instansi:true,  supervisor:true  },
  { id:'d2',  module:'Dashboard',      label:'Export Laporan Dashboard',   super_admin:true,  admin_company:true,  kepala_instansi:true,  supervisor:false },
  // Peta
  { id:'p1',  module:'Peta',           label:'Lihat Peta Interaktif',      super_admin:true,  admin_company:true,  kepala_instansi:true,  supervisor:true  },
  { id:'p2',  module:'Peta',           label:'Filter Semua Perusahaan',    super_admin:true,  admin_company:false, kepala_instansi:true,  supervisor:false },
  { id:'p3',  module:'Peta',           label:'Tambah Marker Kustom',       super_admin:true,  admin_company:true,  kepala_instansi:false, supervisor:false },
  // Sensor
  { id:'s1',  module:'Sensor',         label:'Lihat Data Sensor',          super_admin:true,  admin_company:true,  kepala_instansi:true,  supervisor:true  },
  { id:'s2',  module:'Sensor',         label:'Input Data Sensor',          super_admin:true,  admin_company:false, kepala_instansi:false, supervisor:true  },
  { id:'s3',  module:'Sensor',         label:'Tambah/Hapus Sensor',        super_admin:true,  admin_company:true,  kepala_instansi:false, supervisor:false },
  { id:'s4',  module:'Sensor',         label:'Lihat Sensor Semua Perusahaan', super_admin:true, admin_company:false, kepala_instansi:true, supervisor:false },
  // Laporan
  { id:'l1',  module:'Laporan',        label:'Lihat Laporan',              super_admin:true,  admin_company:true,  kepala_instansi:true,  supervisor:true  },
  { id:'l2',  module:'Laporan',        label:'Buat Laporan',               super_admin:true,  admin_company:true,  kepala_instansi:false, supervisor:false },
  { id:'l3',  module:'Laporan',        label:'Setujui / Tolak Laporan',    super_admin:true,  admin_company:false, kepala_instansi:true,  supervisor:false },
  { id:'l4',  module:'Laporan',        label:'Ekspor Laporan PDF/Excel',   super_admin:true,  admin_company:true,  kepala_instansi:true,  supervisor:false },
  // Pengguna
  { id:'u1',  module:'Pengguna',       label:'Lihat Daftar Pengguna',      super_admin:true,  admin_company:true,  kepala_instansi:false, supervisor:false },
  { id:'u2',  module:'Pengguna',       label:'Undang / Tambah Pengguna',   super_admin:true,  admin_company:true,  kepala_instansi:false, supervisor:false },
  { id:'u3',  module:'Pengguna',       label:'Edit / Nonaktifkan User',    super_admin:true,  admin_company:false, kepala_instansi:false, supervisor:false },
  // Perusahaan
  { id:'c1',  module:'Perusahaan',     label:'Lihat Data Perusahaan',      super_admin:true,  admin_company:true,  kepala_instansi:true,  supervisor:false },
  { id:'c2',  module:'Perusahaan',     label:'Tambah / Edit Perusahaan',   super_admin:true,  admin_company:false, kepala_instansi:false, supervisor:false },
  // Sistem
  { id:'sy1', module:'Sistem',         label:'Akses Konfigurasi Sistem',   super_admin:true,  admin_company:false, kepala_instansi:false, supervisor:false },
  { id:'sy2', module:'Sistem',         label:'Lihat Audit Log',            super_admin:true,  admin_company:false, kepala_instansi:false, supervisor:false },
  { id:'sy3', module:'Sistem',         label:'Kelola Server & API',        super_admin:true,  admin_company:false, kepala_instansi:false, supervisor:false },
]

const MODULES = [...new Set(PERMISSIONS.map(p => p.module))]

function PermCell({ allowed, editable, onChange }: { allowed: boolean; editable: boolean; onChange?: () => void }) {
  if (!editable) {
    return (
      <td className="text-center px-3 py-[8px] border-b border-border-light">
        {allowed
          ? <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-fill-green"><Check size={11} className="text-accent-green" strokeWidth={2.5} /></div>
          : <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-bg-card3"><X size={10} className="text-text-muted" strokeWidth={2} /></div>}
      </td>
    )
  }
  return (
    <td className="text-center px-3 py-[8px] border-b border-border-light">
      <button onClick={onChange}
        className={cn('w-5 h-5 rounded-full inline-flex items-center justify-center transition-all hover:scale-110',
          allowed ? 'bg-fill-green' : 'bg-bg-card3 hover:bg-fill-red/50')}>
        {allowed
          ? <Check size={11} className="text-accent-green" strokeWidth={2.5} />
          : <X size={10} className="text-text-muted" strokeWidth={2} />}
      </button>
    </td>
  )
}

export default function RolesPage() {
  const [perms, setPerms] = useState<Permission[]>(PERMISSIONS)
  const [activeModule, setActiveModule] = useState<string>('Semua')
  const [editMode, setEditMode] = useState(false)
  const [saved, setSaved] = useState(false)

  const toggle = (id: PermKey, role: Role) => {
    if (!editMode || role === 'super_admin') return
    setPerms(ps => ps.map(p => p.id === id ? { ...p, [role]: !p[role] } : p))
  }

  const handleSave = () => { setSaved(true); setEditMode(false); setTimeout(() => setSaved(false), 3000) }

  const displayed = perms.filter(p => activeModule === 'Semua' || p.module === activeModule)

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar
        breadcrumbs={[{ label: 'Super Admin' }, { label: 'Role & Akses' }]}
        actions={
          <div className="flex items-center gap-2">
            {saved && <span className="text-[10px] text-accent-green flex items-center gap-1"><Check size={11} />Tersimpan</span>}
            {editMode
              ? <>
                  <button onClick={() => setEditMode(false)}
                    className="text-[10px] font-semibold border border-border-base rounded-lg px-3 h-8 text-text-secondary hover:bg-bg-card3 transition-colors">Batal</button>
                  <button onClick={handleSave}
                    className="text-[10px] font-semibold bg-accent-green text-white rounded-lg px-3 h-8 hover:bg-green-700 transition-colors flex items-center gap-1.5">
                    <Check size={12} /> Simpan Perubahan
                  </button>
                </>
              : <button onClick={() => setEditMode(true)}
                  className="text-[10px] font-semibold bg-accent-blue text-white rounded-lg px-3 h-8 hover:bg-blue-700 transition-colors flex items-center gap-1.5">
                  <Shield size={12} /> Edit Hak Akses
                </button>}
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* Role cards */}
        <div className="grid grid-cols-4 gap-3">
          {ROLES.map(({ key, label, Icon, color, bg, desc, userCount }) => (
            <div key={key} className="bg-bg-card border border-border-base rounded-xl p-4 shadow-card">
              <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center mb-3', bg)}>
                <Icon size={16} className={color} />
              </div>
              <p className="text-[12px] font-bold text-text-primary">{label}</p>
              <p className="text-[9px] text-text-muted mt-1 mb-3 leading-relaxed">{desc}</p>
              <div className="flex items-center justify-between pt-2 border-t border-border-light">
                <span className="text-[9px] text-text-muted">{userCount} pengguna aktif</span>
                {key === 'super_admin' && (
                  <span className="text-[8px] font-mono bg-fill-purple text-accent-purple px-1.5 py-0.5 rounded">Tidak bisa diubah</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Edit mode notice */}
        {editMode && (
          <div className="flex items-center gap-2 px-4 py-3 bg-fill-blue border border-accent-blue/20 rounded-xl text-[11px] text-accent-blue">
            <Info size={14} />
            Mode edit aktif. Klik centang/silang pada baris yang ingin diubah. Super Admin tidak dapat diubah.
          </div>
        )}

        {/* Permission matrix */}
        <Panel title="Matriks Hak Akses" icon={<Shield size={12} className="text-accent-purple" />}
          headerRight={<span className="text-[10px] text-text-muted font-mono">{perms.length} permission</span>}>

          {/* Module filter */}
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border-base bg-bg-card3 overflow-x-auto">
            {['Semua', ...MODULES].map((m) => (
              <button key={m} onClick={() => setActiveModule(m)}
                className={cn('px-2.5 py-1 rounded-lg text-[9px] font-mono font-medium whitespace-nowrap border transition-all',
                  activeModule === m
                    ? 'bg-accent-purple/10 text-accent-purple border-accent-purple/30'
                    : 'text-text-muted border-transparent hover:text-text-secondary hover:bg-bg-card3')}>
                {m}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-bg-card3">
                  <th className="text-[9px] text-text-muted uppercase tracking-wide px-4 py-3 text-left font-mono border-b border-border-base w-[200px]">Modul / Fitur</th>
                  {ROLES.map((r) => {
                    const Icon = r.Icon
                    return (
                      <th key={r.key} className="text-center px-3 py-3 border-b border-border-base">
                        <div className="flex flex-col items-center gap-1">
                          <div className={cn('w-6 h-6 rounded-lg flex items-center justify-center', r.bg)}>
                            <Icon size={12} className={r.color} />
                          </div>
                          <span className="text-[9px] text-text-muted font-mono whitespace-nowrap">{r.label.split(' ')[0]}</span>
                        </div>
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {MODULES.filter(m => activeModule === 'Semua' || m === activeModule).map((mod) => (
                  <>
                    <tr key={`header-${mod}`} className="bg-bg-card3/50">
                      <td colSpan={5} className="px-4 py-2 text-[9px] font-bold text-text-muted uppercase tracking-wider border-b border-border-base font-mono">
                        {mod}
                      </td>
                    </tr>
                    {displayed.filter(p => p.module === mod).map((perm) => (
                      <tr key={perm.id} className="hover:bg-bg-card3/30 transition-colors">
                        <td className="px-4 py-[8px] text-[11px] text-text-secondary border-b border-border-light">{perm.label}</td>
                        {ROLES.map((role) => (
                          <PermCell
                            key={role.key}
                            allowed={perm[role.key]}
                            editable={editMode && role.key !== 'super_admin'}
                            onChange={() => toggle(perm.id, role.key)}
                          />
                        ))}
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <div className="h-2" />
      </div>
    </div>
  )
}
