import { useState } from 'react'
import {
  Search, Plus, MoreVertical, Building2,
  MapPin, Cpu, TrendingDown, X, ChevronRight,
} from 'lucide-react'
import Topbar from '@/components/layout/Topbar'
import { Panel, StatusPill } from '@/components/ui'
import { cn } from '@/lib/utils'

const COMPANIES = [
  { id:'1', name:'PT Maju Jaya Tbk',   region:'Jakarta Utara', sensors:34, active:34, status:'active'     as const, avg:-2.41, admin:'Budi Raharjo',  email:'admin@majujaya.co.id',  joined:'15 Mar 2024', izin:'2024-2027' },
  { id:'2', name:'PT Bumi Raya',        region:'Bekasi',        sensors:18, active:17, status:'evaluation' as const, avg:-4.82, admin:'Rina Kusuma',   email:'admin@bumiraya.co.id',  joined:'01 Feb 2024', izin:'2023-2026' },
  { id:'3', name:'PT Tirta Mandiri',    region:'Tangerang',     sensors:27, active:27, status:'active'     as const, avg:-1.10, admin:'Sari Wulandari',email:'admin@tirta.co.id',     joined:'10 Mar 2024', izin:'2024-2027' },
  { id:'4', name:'PT Sumber Air',       region:'Depok',         sensors:21, active:20, status:'active'     as const, avg:-3.30, admin:'Agus Pratama',  email:'admin@sumberair.co.id', joined:'20 Jan 2024', izin:'2023-2026' },
  { id:'5', name:'PT Karya Makmur',     region:'Bogor',         sensors:15, active:15, status:'active'     as const, avg:-0.82, admin:'Dedi Haryanto', email:'admin@karya.co.id',     joined:'20 Feb 2024', izin:'2024-2027' },
  { id:'6', name:'PT Indo Nusantara',   region:'Jakarta Barat', sensors:11, active:11, status:'active'     as const, avg:-2.90, admin:'Hendra Saputra',email:'admin@indo.co.id',      joined:'05 Mar 2024', izin:'2024-2027' },
]

type StatusFilter = 'all' | 'active' | 'evaluation' | 'inactive'

/* ── Add Company Modal ─────────────────────────────────────────────── */
function AddCompanyModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0)
  const STEPS = ['Info Perusahaan', 'Admin & Kontak', 'Izin & Sensor']
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-bg-card border border-border-base rounded-2xl shadow-[0_20px_60px_rgba(15,23,42,0.15)] w-[480px]"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-6 py-5 border-b border-border-base">
          <div className="w-9 h-9 rounded-xl bg-fill-blue flex items-center justify-center">
            <Building2 size={16} className="text-accent-blue" />
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-bold text-text-primary">Tambah Perusahaan</p>
            <div className="flex gap-1 mt-1.5">
              {STEPS.map((s, i) => (
                <div key={s} className={cn('flex-1 h-1 rounded-full transition-all',
                  i < step ? 'bg-accent-cyan' : i === step ? 'bg-accent-blue' : 'bg-border-base')} />
              ))}
            </div>
          </div>
          <button onClick={onClose}><X size={16} className="text-text-muted hover:text-text-primary transition-colors" /></button>
        </div>
        <div className="p-6">
          <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wide mb-4">Langkah {step + 1}: {STEPS[step]}</p>
          {step === 0 && (
            <div className="space-y-3">
              {[['Nama Perusahaan', 'PT Nama Perusahaan'], ['Nomor SIUP', '503/BPPM/...'], ['Wilayah Operasi', 'Jakarta Utara']].map(([l, p]) => (
                <div key={l}>
                  <label className="block text-[10px] font-semibold text-text-secondary mb-1.5">{l}</label>
                  <input placeholder={p} className="w-full bg-bg-card3 border border-border-base rounded-lg px-3 h-9 text-[11px] text-text-primary outline-none focus:border-accent-cyan placeholder:text-text-muted transition-colors" />
                </div>
              ))}
            </div>
          )}
          {step === 1 && (
            <div className="space-y-3">
              {[['Nama Admin', 'John Doe'], ['Email Admin', 'admin@company.co.id'], ['No. Telepon', '+62 21 ...']].map(([l, p]) => (
                <div key={l}>
                  <label className="block text-[10px] font-semibold text-text-secondary mb-1.5">{l}</label>
                  <input placeholder={p} className="w-full bg-bg-card3 border border-border-base rounded-lg px-3 h-9 text-[11px] text-text-primary outline-none focus:border-accent-cyan placeholder:text-text-muted transition-colors" />
                </div>
              ))}
            </div>
          )}
          {step === 2 && (
            <div className="space-y-3">
              {[['Masa Berlaku Izin', '2024-2027'], ['Kuota Sensor', '50'], ['Kuota Air (m³/hari)', '1000']].map(([l, p]) => (
                <div key={l}>
                  <label className="block text-[10px] font-semibold text-text-secondary mb-1.5">{l}</label>
                  <input placeholder={p} className="w-full bg-bg-card3 border border-border-base rounded-lg px-3 h-9 text-[11px] text-text-primary outline-none focus:border-accent-cyan placeholder:text-text-muted transition-colors" />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-2 px-6 pb-6">
          <button onClick={() => step > 0 ? setStep(s => s - 1) : onClose()}
            className="flex-1 border border-border-base rounded-xl py-2.5 text-[11px] font-semibold text-text-secondary hover:bg-bg-card3 transition-colors">
            {step === 0 ? 'Batal' : 'Kembali'}
          </button>
          <button onClick={() => step < 2 ? setStep(s => s + 1) : onClose()}
            className="flex-1 bg-accent-blue text-white rounded-xl py-2.5 text-[11px] font-semibold hover:bg-blue-700 transition-colors">
            {step < 2 ? 'Lanjut →' : 'Simpan Perusahaan'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CompaniesPage() {
  const [search,    setSearch]    = useState('')
  const [status,    setStatus]    = useState<StatusFilter>('all')
  const [view,      setView]      = useState<'table' | 'card'>('table')
  const [showAdd,   setShowAdd]   = useState(false)
  const [menuOpen,  setMenuOpen]  = useState<string | null>(null)

  const filtered = COMPANIES.filter(c => {
    if (status !== 'all' && c.status !== status) return false
    if (search) {
      const q = search.toLowerCase()
      return c.name.toLowerCase().includes(q) || c.region.toLowerCase().includes(q) || c.admin.toLowerCase().includes(q)
    }
    return true
  })

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar
        breadcrumbs={[{ label: 'Super Admin' }, { label: 'Perusahaan' }]}
        actions={
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 text-[11px] font-semibold bg-accent-blue text-white rounded-lg px-3 h-8 hover:bg-blue-700 transition-colors">
            <Plus size={13} /> Tambah Perusahaan
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Total Perusahaan',    value: COMPANIES.length,                                        color: 'text-accent-blue'   },
            { label: 'Aktif',               value: COMPANIES.filter(c => c.status === 'active').length,     color: 'text-accent-green'  },
            { label: 'Evaluasi',            value: COMPANIES.filter(c => c.status === 'evaluation').length, color: 'text-accent-amber'  },
            { label: 'Total Sensor Terdaftar', value: COMPANIES.reduce((a, c) => a + c.sensors, 0),          color: 'text-accent-cyan'   },
          ].map((s) => (
            <div key={s.label} className="bg-bg-card border border-border-base rounded-xl p-4 shadow-card">
              <p className="text-[9px] text-text-muted uppercase tracking-wide font-mono mb-1">{s.label}</p>
              <p className={cn('text-[26px] font-bold font-mono leading-none', s.color)}>{s.value}</p>
            </div>
          ))}
        </div>

        <Panel
          title="Daftar Perusahaan"
          icon={<Building2 size={12} className="text-accent-blue" />}
          headerRight={<span className="text-[10px] font-mono text-text-muted">{filtered.length} perusahaan</span>}
        >
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border-base bg-bg-card3">
            <div className="flex items-center gap-2 bg-bg-card border border-border-base rounded-lg px-3 h-8 min-w-[220px]">
              <Search size={12} className="text-text-muted flex-shrink-0" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Cari perusahaan..."
                className="bg-transparent outline-none text-[11px] text-text-primary placeholder:text-text-muted flex-1" />
            </div>
            <div className="flex items-center gap-1 bg-bg-card border border-border-base rounded-lg p-1">
              {(['all', 'active', 'evaluation', 'inactive'] as StatusFilter[]).map((s) => (
                <button key={s} onClick={() => setStatus(s)}
                  className={cn('px-2.5 py-1 rounded-md text-[10px] capitalize transition-all font-medium',
                    status === s ? 'bg-bg-card3 text-text-primary shadow-sm border border-border-base' : 'text-text-muted hover:text-text-secondary')}>
                  {s === 'all' ? 'Semua' : s === 'active' ? 'Aktif' : s === 'evaluation' ? 'Evaluasi' : 'Nonaktif'}
                </button>
              ))}
            </div>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Perusahaan</th>
                <th>Wilayah</th>
                <th>Admin</th>
                <th>Sensor</th>
                <th>Avg Subsidence</th>
                <th>Masa Izin</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((co) => (
                <tr key={co.id} className="cursor-pointer group">
                  <td>
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-fill-blue flex items-center justify-center flex-shrink-0">
                        <Building2 size={13} className="text-accent-blue" />
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-text-primary">{co.name}</p>
                        <p className="text-[9px] text-text-muted font-mono">{co.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1 text-[10px] text-text-secondary">
                      <MapPin size={10} className="text-text-muted" />{co.region}
                    </div>
                  </td>
                  <td className="text-[11px] text-text-secondary">{co.admin}</td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <Cpu size={10} className="text-accent-cyan" />
                      <span className="text-[11px] font-semibold text-text-primary">{co.active}</span>
                      <span className="text-[9px] text-text-muted">/{co.sensors}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <span className={cn('text-[11px] font-bold font-mono',
                        co.avg < -3.5 ? 'text-accent-red' : co.avg < -2.5 ? 'text-accent-amber' : 'text-accent-green')}>
                        {co.avg.toFixed(2)}
                      </span>
                      <div className="w-12 h-1.5 bg-bg-card3 rounded-full overflow-hidden">
                        <div className={cn('h-full rounded-full', co.avg < -3.5 ? 'bg-accent-red' : co.avg < -2.5 ? 'bg-accent-amber' : 'bg-accent-green')}
                          style={{ width: `${Math.abs(co.avg) / 5 * 100}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="td-mono text-text-muted">{co.izin}</td>
                  <td>
                    {co.status === 'active' ? <StatusPill variant="online" /> : <StatusPill variant="warning" />}
                  </td>
                  <td>
                    <div className="relative">
                      <button onClick={() => setMenuOpen(menuOpen === co.id ? null : co.id)}
                        className="p-1 rounded-lg hover:bg-bg-card3 text-text-muted hover:text-text-secondary transition-colors">
                        <MoreVertical size={14} />
                      </button>
                      {menuOpen === co.id && (
                        <div className="absolute right-0 top-8 z-10 bg-white border border-border-base rounded-xl shadow-card-hover min-w-[150px] overflow-hidden">
                          {['Lihat Detail', 'Edit Info', 'Kelola Sensor', 'Laporan Perusahaan', 'Nonaktifkan'].map((action) => (
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
              ))}
            </tbody>
          </table>
        </Panel>
      </div>

      {showAdd && <AddCompanyModal onClose={() => setShowAdd(false)} />}
    </div>
  )
}
