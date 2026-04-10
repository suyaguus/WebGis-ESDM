import { useState } from 'react'
import {
  FileText, Download, Eye, Check, X,
  Filter, Search, Clock, CheckCircle2, XCircle,
  FileDown, ChevronRight, Calendar,
} from 'lucide-react'
import Topbar from '@/components/layout/Topbar'
import { Panel, Badge, StatusPill } from '@/components/ui'
import { cn } from '@/lib/utils'

type ReportStatus = 'approved' | 'pending' | 'draft' | 'rejected'

interface Report {
  id: string
  title: string
  company: string
  type: 'subsidence' | 'air_tanah' | 'tahunan' | 'bulanan'
  period: string
  status: ReportStatus
  submittedBy: string
  submittedAt: string
  approvedBy?: string
  approvedAt?: string
  pages: number
  sensorCount: number
}

const REPORTS: Report[] = [
  { id:'1',  title:'Laporan Subsidence Q1 2026',       company:'PT Maju Jaya Tbk',    type:'subsidence', period:'Jan–Mar 2026', status:'pending',  submittedBy:'Budi Raharjo',   submittedAt:'08 Apr 2026', pages:24, sensorCount:34 },
  { id:'2',  title:'Laporan Muka Air Q1 2026',          company:'PT Tirta Mandiri',    type:'air_tanah',  period:'Jan–Mar 2026', status:'pending',  submittedBy:'Sari Wulandari', submittedAt:'07 Apr 2026', pages:18, sensorCount:27 },
  { id:'3',  title:'Laporan Tahunan 2025',              company:'PT Karya Makmur',     type:'tahunan',    period:'Jan–Des 2025', status:'approved', submittedBy:'Dedi Haryanto',  submittedAt:'05 Apr 2026', approvedBy:'Ahmad Fauzi', approvedAt:'07 Apr 2026', pages:48, sensorCount:15 },
  { id:'4',  title:'Laporan Subsidence Q4 2025',        company:'PT Bumi Raya',        type:'subsidence', period:'Okt–Des 2025', status:'rejected', submittedBy:'Rina Kusuma',    submittedAt:'15 Jan 2026', pages:20, sensorCount:18 },
  { id:'5',  title:'Laporan Bulanan Mar 2026',          company:'PT Sumber Air',       type:'bulanan',    period:'Mar 2026',     status:'draft',    submittedBy:'Agus Pratama',   submittedAt:'01 Apr 2026', pages:12, sensorCount:21 },
  { id:'6',  title:'Laporan Tahunan 2025',              company:'PT Maju Jaya Tbk',    type:'tahunan',    period:'Jan–Des 2025', status:'approved', submittedBy:'Budi Raharjo',   submittedAt:'10 Jan 2026', approvedBy:'Ahmad Fauzi', approvedAt:'12 Jan 2026', pages:52, sensorCount:34 },
  { id:'7',  title:'Laporan Muka Air Q4 2025',          company:'PT Indo Nusantara',   type:'air_tanah',  period:'Okt–Des 2025', status:'approved', submittedBy:'Hendra Saputra', submittedAt:'08 Jan 2026', approvedBy:'Ahmad Fauzi', approvedAt:'10 Jan 2026', pages:15, sensorCount:11 },
  { id:'8',  title:'Laporan Subsidence Semester II 2025', company:'PT Tirta Mandiri', type:'subsidence', period:'Jul–Des 2025', status:'approved', submittedBy:'Sari Wulandari', submittedAt:'03 Jan 2026', approvedBy:'Ahmad Fauzi', approvedAt:'05 Jan 2026', pages:30, sensorCount:27 },
]

const STATUS_CFG: Record<ReportStatus, { label: string; icon: React.ElementType; color: string; bg: string; badgeVariant: 'success'|'warning'|'info'|'critical' }> = {
  approved: { label: 'Disetujui', icon: CheckCircle2, color: 'text-accent-green', bg: 'bg-fill-green', badgeVariant: 'success'  },
  pending:  { label: 'Menunggu',  icon: Clock,        color: 'text-accent-amber', bg: 'bg-fill-amber', badgeVariant: 'warning'  },
  draft:    { label: 'Draft',     icon: FileText,     color: 'text-accent-blue',  bg: 'bg-fill-blue',  badgeVariant: 'info'     },
  rejected: { label: 'Ditolak',   icon: XCircle,      color: 'text-accent-red',   bg: 'bg-fill-red',   badgeVariant: 'critical' },
}

const TYPE_LABELS = { subsidence: 'Subsidence', air_tanah: 'Air Tanah', tahunan: 'Tahunan', bulanan: 'Bulanan' }

/* ── Preview Modal ─────────────────────────────────────────────────── */
function ReportPreviewModal({ report, onClose, onApprove, onReject }: {
  report: Report; onClose: () => void
  onApprove: () => void; onReject: () => void
}) {
  const cfg = STATUS_CFG[report.status]
  const Icon = cfg.icon
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-bg-card border border-border-base rounded-2xl shadow-[0_20px_60px_rgba(15,23,42,0.15)] w-[520px] max-h-[85vh] flex flex-col"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-start gap-3 px-6 py-5 border-b border-border-base bg-bg-card3">
          <div className="w-10 h-10 rounded-xl bg-fill-blue flex items-center justify-center flex-shrink-0">
            <FileText size={18} className="text-accent-blue" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-text-primary truncate">{report.title}</p>
            <p className="text-[10px] text-text-muted mt-0.5">{report.company} · {report.period}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <div className={cn('inline-flex items-center gap-1 text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full', cfg.bg, cfg.color)}>
                <Icon size={9} /> {cfg.label}
              </div>
              <span className="text-[9px] text-text-muted">{report.pages} hal · {report.sensorCount} sensor</span>
            </div>
          </div>
          <button onClick={onClose}><X size={16} className="text-text-muted hover:text-text-primary transition-colors" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { k: 'Disubmit oleh', v: report.submittedBy },
              { k: 'Tanggal Submit', v: report.submittedAt },
              { k: 'Tipe Laporan',  v: TYPE_LABELS[report.type] },
              { k: 'Periode',       v: report.period },
              { k: 'Jumlah Sensor', v: `${report.sensorCount} sensor` },
              { k: 'Halaman',       v: `${report.pages} halaman` },
            ].map(({ k, v }) => (
              <div key={k} className="bg-bg-card3 rounded-lg p-3">
                <p className="text-[8px] text-text-muted uppercase tracking-wide mb-1">{k}</p>
                <p className="text-[11px] font-semibold text-text-primary">{v}</p>
              </div>
            ))}
          </div>

          {report.approvedBy && (
            <div className="bg-fill-green border border-accent-green/20 rounded-xl p-4">
              <p className="text-[10px] font-semibold text-accent-green mb-1">Disetujui oleh</p>
              <p className="text-[12px] font-bold text-text-primary">{report.approvedBy}</p>
              <p className="text-[10px] text-text-muted mt-0.5">{report.approvedAt}</p>
            </div>
          )}

          {/* Mock PDF preview */}
          <div className="bg-bg-card3 border border-border-base rounded-xl h-48 flex flex-col items-center justify-center gap-3 text-text-muted">
            <FileText size={32} className="opacity-30" />
            <p className="text-[11px]">Preview dokumen PDF</p>
            <button className="flex items-center gap-1.5 text-[10px] text-accent-blue hover:text-blue-700 transition-colors">
              <FileDown size={12} /> Unduh PDF ({report.pages} hal)
            </button>
          </div>
        </div>

        <div className="flex gap-2 px-6 py-4 border-t border-border-base bg-bg-card3">
          <button onClick={onClose} className="flex-1 border border-border-base rounded-xl py-2.5 text-[11px] font-semibold text-text-secondary hover:bg-bg-card3 transition-colors flex items-center justify-center gap-2">
            <Download size={13} /> Unduh
          </button>
          {report.status === 'pending' && (
            <>
              <button onClick={onReject} className="flex-1 bg-fill-red border border-accent-red/20 rounded-xl py-2.5 text-[11px] font-semibold text-accent-red hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5">
                <X size={13} /> Tolak
              </button>
              <button onClick={onApprove} className="flex-1 bg-accent-green text-white rounded-xl py-2.5 text-[11px] font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-1.5">
                <Check size={13} /> Setujui
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>(REPORTS)
  const [search,   setSearch]   = useState('')
  const [status,   setStatus]   = useState<ReportStatus | 'all'>('all')
  const [preview,  setPreview]  = useState<Report | null>(null)

  const filtered = reports.filter(r => {
    if (status !== 'all' && r.status !== status) return false
    if (search) {
      const q = search.toLowerCase()
      return r.title.toLowerCase().includes(q) || r.company.toLowerCase().includes(q)
    }
    return true
  })

  const approve = (id: string) => {
    setReports(rs => rs.map(r => r.id === id ? { ...r, status: 'approved', approvedBy: 'Ahmad Fauzi', approvedAt: '10 Apr 2026' } : r))
    setPreview(null)
  }
  const reject = (id: string) => {
    setReports(rs => rs.map(r => r.id === id ? { ...r, status: 'rejected' } : r))
    setPreview(null)
  }

  const pendingCount = reports.filter(r => r.status === 'pending').length

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar breadcrumbs={[{ label: 'Super Admin' }, { label: 'Laporan' }]} />

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-4 gap-3">
          {([
            ['all', 'Total Laporan', reports.length, 'text-accent-blue'],
            ['approved', 'Disetujui', reports.filter(r => r.status === 'approved').length, 'text-accent-green'],
            ['pending',  'Menunggu',  pendingCount, 'text-accent-amber'],
            ['rejected', 'Ditolak',   reports.filter(r => r.status === 'rejected').length, 'text-accent-red'],
          ] as const).map(([key, label, val, color]) => (
            <div key={key}
              onClick={() => setStatus(key)}
              className={cn('bg-bg-card border border-border-base rounded-xl p-4 shadow-card cursor-pointer hover:shadow-card-hover transition-shadow',
                status === key && 'ring-2 ring-accent-cyan/30')}>
              <p className="text-[9px] text-text-muted uppercase tracking-wide font-mono mb-1">{label}</p>
              <p className={cn('text-[26px] font-bold font-mono leading-none', color)}>{val}</p>
              {key === 'pending' && val > 0 && (
                <p className="text-[9px] text-accent-amber mt-1">Butuh persetujuan</p>
              )}
            </div>
          ))}
        </div>

        {/* Pending alert */}
        {pendingCount > 0 && (
          <div className="flex items-center gap-3 px-4 py-3 bg-fill-amber border border-accent-amber/20 rounded-xl">
            <Clock size={16} className="text-accent-amber flex-shrink-0" />
            <p className="text-[11px] text-accent-amber font-medium">
              {pendingCount} laporan menunggu persetujuan Anda
            </p>
            <button onClick={() => setStatus('pending')} className="ml-auto text-[10px] font-semibold text-accent-amber hover:text-amber-700 transition-colors flex items-center gap-1">
              Tinjau Sekarang <ChevronRight size={12} />
            </button>
          </div>
        )}

        <Panel
          title="Semua Laporan"
          icon={<FileText size={12} className="text-accent-blue" />}
          headerRight={<span className="text-[10px] font-mono text-text-muted">{filtered.length} laporan</span>}
        >
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border-base bg-bg-card3">
            <div className="flex items-center gap-2 bg-bg-card border border-border-base rounded-lg px-3 h-8 min-w-[220px]">
              <Search size={12} className="text-text-muted flex-shrink-0" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Cari laporan, perusahaan..."
                className="bg-transparent outline-none text-[11px] text-text-primary placeholder:text-text-muted flex-1" />
            </div>
            <div className="flex items-center gap-1 bg-bg-card border border-border-base rounded-lg p-1">
              {(['all','pending','approved','rejected','draft'] as const).map((s) => (
                <button key={s} onClick={() => setStatus(s)}
                  className={cn('px-2.5 py-1 rounded-md text-[10px] font-medium transition-all',
                    status === s ? 'bg-bg-card3 text-text-primary shadow-sm border border-border-base' : 'text-text-muted hover:text-text-secondary')}>
                  {s === 'all' ? 'Semua' : STATUS_CFG[s]?.label ?? s}
                </button>
              ))}
            </div>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Laporan</th>
                <th>Perusahaan</th>
                <th>Tipe</th>
                <th>Periode</th>
                <th>Disubmit</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((report) => {
                const cfg = STATUS_CFG[report.status]
                const Icon = cfg.icon
                return (
                  <tr key={report.id} className="cursor-pointer group" onClick={() => setPreview(report)}>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-fill-blue flex items-center justify-center flex-shrink-0">
                          <FileText size={13} className="text-accent-blue" />
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold text-text-primary">{report.title}</p>
                          <p className="text-[9px] text-text-muted">{report.pages} hal · {report.sensorCount} sensor</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-text-secondary text-[11px]">{report.company}</td>
                    <td>
                      <span className="text-[9px] font-mono bg-bg-card3 text-text-secondary px-2 py-0.5 rounded-md">
                        {TYPE_LABELS[report.type]}
                      </span>
                    </td>
                    <td className="td-mono text-text-muted">{report.period}</td>
                    <td className="td-mono text-text-muted">{report.submittedAt}</td>
                    <td>
                      <div className={cn('inline-flex items-center gap-1.5 text-[9px] font-mono font-semibold px-2 py-1 rounded-full', cfg.bg, cfg.color)}>
                        <Icon size={9} /> {cfg.label}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-text-muted hover:text-accent-cyan transition-colors"><Eye size={13} /></button>
                        <button className="text-text-muted hover:text-accent-blue transition-colors"><Download size={13} /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Panel>

        <div className="h-2" />
      </div>

      {preview && (
        <ReportPreviewModal
          report={preview}
          onClose={() => setPreview(null)}
          onApprove={() => approve(preview.id)}
          onReject={() => reject(preview.id)}
        />
      )}
    </div>
  )
}
