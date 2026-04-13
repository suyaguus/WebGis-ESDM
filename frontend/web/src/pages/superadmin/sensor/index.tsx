import { useState, useMemo } from 'react'
import {
  Search, Filter, Download, RefreshCw,
  ChevronUp, ChevronDown, ChevronsUpDown,
  Cpu, Droplets, Radio, AlertTriangle,
  CheckCircle2, WifiOff, X, ExternalLink,
} from 'lucide-react'
import Topbar from '@/components/layout/Topbar'
import { Badge, StatusPill, Panel } from '@/components/ui'
import { MOCK_SENSORS, MOCK_COMPANIES } from '@/constants/mockData'
import { cn } from '@/lib/utils'
import type { Sensor, SensorStatus, SensorType } from '@/types'

/* ── Sort config ───────────────────────────────────────────────────── */
type SortKey = 'code' | 'type' | 'location' | 'status' | 'value' | 'companyName' | 'lastUpdate'
type SortDir = 'asc' | 'desc'

/* ── Status display ────────────────────────────────────────────────── */
const STATUS_CONFIG: Record<SensorStatus, { label: string; icon: React.ElementType; color: string; pill: 'online'|'offline'|'warning' }> = {
  online:   { label: 'Online',  icon: CheckCircle2,   color: 'text-accent-green', pill: 'online'  },
  warning:  { label: 'Waspada', icon: AlertTriangle,  color: 'text-accent-amber', pill: 'warning' },
  critical: { label: 'Kritis',  icon: AlertTriangle,  color: 'text-accent-red',   pill: 'warning' },
  offline:  { label: 'Offline', icon: WifiOff,        color: 'text-text-muted',   pill: 'offline' },
}

/* ── Sensor type icon ──────────────────────────────────────────────── */
function TypeIcon({ type }: { type: SensorType }) {
  return type === 'air_tanah'
    ? <span className="inline-flex items-center gap-1 text-[9px] font-mono bg-fill-blue text-accent-blue px-1.5 py-0.5 rounded-md"><Droplets size={9} />Air Tanah</span>
    : <span className="inline-flex items-center gap-1 text-[9px] font-mono bg-fill-amber text-accent-amber px-1.5 py-0.5 rounded-md"><Radio size={9} />GNSS</span>
}

/* ── Stat mini cards ───────────────────────────────────────────────── */
function MiniStat({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-3 bg-bg-card border border-border-base rounded-xl px-4 py-3 shadow-card">
      <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', color.replace('text-', 'bg-').replace('accent-', 'fill-'))}>
        <Icon size={15} className={color} />
      </div>
      <div>
        <p className="text-[18px] font-bold font-mono text-text-primary leading-none">{value}</p>
        <p className="text-[9px] text-text-muted mt-0.5">{label}</p>
      </div>
    </div>
  )
}

/* ── Detail Modal ──────────────────────────────────────────────────── */
function SensorDetailModal({ sensor, onClose }: { sensor: Sensor; onClose: () => void }) {
  const statusCfg = STATUS_CONFIG[sensor.status]
  const StatusIcon = statusCfg.icon

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-bg-card border border-border-base rounded-2xl shadow-[0_20px_60px_rgba(15,23,42,0.15)] w-[480px] max-h-[80vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-start gap-3 px-6 py-5 border-b border-border-base bg-bg-card3">
          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
            sensor.type === 'air_tanah' ? 'bg-fill-blue' : 'bg-fill-amber')}>
            {sensor.type === 'air_tanah'
              ? <Droplets size={18} className="text-accent-blue" />
              : <Radio size={18} className="text-accent-amber" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <p className="text-[13px] font-bold text-text-primary">{sensor.code}</p>
              <StatusPill variant={statusCfg.pill} />
            </div>
            <p className="text-[11px] text-text-secondary truncate">{sensor.location}</p>
            <p className="text-[10px] text-text-muted font-mono">{sensor.companyName}</p>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors mt-0.5">
            <X size={16} />
          </button>
        </div>

        {/* Modal body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Key metric */}
          <div className={cn('rounded-xl border-2 p-4 text-center',
            sensor.status === 'critical' ? 'border-accent-red/30 bg-fill-red' :
            sensor.status === 'warning'  ? 'border-accent-amber/30 bg-fill-amber' : 'border-border-base bg-bg-card3')}>
            <p className="text-[10px] text-text-muted uppercase tracking-wide mb-1">
              {sensor.type === 'air_tanah' ? 'Nilai Muka Air' : 'Trend Subsidence'}
            </p>
            <p className={cn('text-[32px] font-bold font-mono',
              sensor.status === 'critical' ? 'text-accent-red' :
              sensor.status === 'warning'  ? 'text-accent-amber' : 'text-accent-blue')}>
              {sensor.value}
              <span className="text-[14px] ml-1 font-medium">{sensor.unit}</span>
            </p>
            <div className="flex items-center justify-center gap-1.5 mt-2">
              <StatusIcon size={12} className={statusCfg.color} />
              <span className={cn('text-[10px] font-semibold', statusCfg.color)}>{statusCfg.label}</span>
            </div>
          </div>

          {/* Info grid */}
          <div>
            <p className="text-[10px] font-semibold text-text-primary mb-3">Informasi Sensor</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { k: 'Kode',         v: sensor.code },
                { k: 'Tipe',         v: sensor.type === 'air_tanah' ? 'Sensor Air Tanah' : 'Sensor GNSS' },
                { k: 'Perusahaan',   v: sensor.companyName },
                { k: 'Terakhir Update', v: sensor.lastUpdate },
              ].map(({ k, v }) => (
                <div key={k} className="bg-bg-card3 border border-border-light rounded-lg p-3">
                  <p className="text-[8px] text-text-muted uppercase tracking-wide mb-1">{k}</p>
                  <p className="text-[11px] font-semibold text-text-primary">{v}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Coordinates */}
          <div>
            <p className="text-[10px] font-semibold text-text-primary mb-3">Koordinat</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { k: 'Latitude',  v: sensor.lat.toFixed(6) },
                { k: 'Longitude', v: sensor.lng.toFixed(6) },
              ].map(({ k, v }) => (
                <div key={k} className="bg-bg-card3 border border-border-light rounded-lg p-3">
                  <p className="text-[8px] text-text-muted uppercase tracking-wide mb-1">{k}</p>
                  <p className="text-[12px] font-bold text-text-primary font-mono">{v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal footer */}
        <div className="flex gap-2 px-6 py-4 border-t border-border-base bg-bg-card3">
          <button className="flex-1 bg-accent-blue text-white rounded-xl py-2.5 text-[11px] font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
            <ExternalLink size={13} />
            Buka di Peta
          </button>
          <button className="flex-1 bg-bg-card border border-border-base rounded-xl py-2.5 text-[11px] font-semibold text-text-primary hover:bg-bg-card3 transition-colors">
            Lihat Time-Series
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Sort header cell ──────────────────────────────────────────────── */
function SortTh({ label, col, active, dir, onSort }: {
  label: string; col: SortKey; active: SortKey; dir: SortDir; onSort: (c: SortKey) => void
}) {
  const isActive = active === col
  return (
    <th>
      <button onClick={() => onSort(col)} className="inline-flex items-center gap-1 hover:text-text-secondary transition-colors">
        {label}
        {isActive
          ? dir === 'asc' ? <ChevronUp size={9} className="text-accent-cyan" /> : <ChevronDown size={9} className="text-accent-cyan" />
          : <ChevronsUpDown size={9} className="text-text-muted opacity-50" />}
      </button>
    </th>
  )
}

/* ── Main page ─────────────────────────────────────────────────────── */
export default function SensorPage() {
  const [search,    setSearch]    = useState('')
  const [status,    setStatus]    = useState<SensorStatus | 'all'>('all')
  const [type,      setType]      = useState<SensorType | 'all'>('all')
  const [company,   setCompany]   = useState<string>('all')
  const [sortKey,   setSortKey]   = useState<SortKey>('code')
  const [sortDir,   setSortDir]   = useState<SortDir>('asc')
  const [selected,  setSelected]  = useState<Sensor | null>(null)
  const [page,      setPage]      = useState(1)
  const PAGE_SIZE = 6

  const handleSort = (col: SortKey) => {
    if (sortKey === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(col); setSortDir('asc') }
    setPage(1)
  }

  const filtered = useMemo(() => {
    return MOCK_SENSORS.filter((s) => {
      if (status  !== 'all' && s.status    !== status)   return false
      if (type    !== 'all' && s.type      !== type)     return false
      if (company !== 'all' && s.companyId !== company)  return false
      if (search) {
        const q = search.toLowerCase()
        return s.code.toLowerCase().includes(q) ||
               s.location.toLowerCase().includes(q) ||
               s.companyName.toLowerCase().includes(q)
      }
      return true
    }).sort((a, b) => {
      const va = a[sortKey], vb = b[sortKey]
      const cmp = typeof va === 'number' && typeof vb === 'number'
        ? va - vb : String(va).localeCompare(String(vb))
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [search, status, type, company, sortKey, sortDir])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const counts = {
    all:      MOCK_SENSORS.length,
    online:   MOCK_SENSORS.filter(s => s.status === 'online').length,
    warning:  MOCK_SENSORS.filter(s => s.status === 'warning').length,
    critical: MOCK_SENSORS.filter(s => s.status === 'critical').length,
    offline:  MOCK_SENSORS.filter(s => s.status === 'offline').length,
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar
        breadcrumbs={[{ label: 'Super Admin' }, { label: 'Semua Sensor' }]}
        actions={
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 text-[10px] text-text-secondary border border-border-base rounded-lg px-2.5 h-8 hover:bg-bg-card3 transition-colors font-medium">
              <Download size={12} /> Ekspor CSV
            </button>
            <button className="flex items-center gap-1.5 text-[10px] text-accent-blue border border-accent-blue/30 bg-fill-blue rounded-lg px-2.5 h-8 hover:bg-blue-50 transition-colors font-semibold">
              <RefreshCw size={12} /> Refresh
            </button>
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto p-5 space-y-4">

        {/* Mini stats */}
        <div className="grid grid-cols-4 gap-3">
          <MiniStat icon={Cpu}          label="Total Sensor"   value={counts.all}      color="text-accent-cyan"  />
          <MiniStat icon={CheckCircle2} label="Online"         value={counts.online}   color="text-accent-green" />
          <MiniStat icon={AlertTriangle}label="Perlu Perhatian"value={counts.warning + counts.critical} color="text-accent-amber" />
          <MiniStat icon={WifiOff}      label="Offline"        value={counts.offline}  color="text-text-muted"   />
        </div>

        {/* Filters + Table */}
        <Panel
          title="Daftar Sensor"
          icon={<Cpu size={12} className="text-accent-cyan" />}
          headerRight={
            <span className="text-[10px] font-mono text-text-muted">
              {filtered.length} dari {MOCK_SENSORS.length} sensor
            </span>
          }
        >
          {/* Filter bar */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border-base bg-bg-card3 flex-wrap">
            {/* Search */}
            <div className="flex items-center gap-2 bg-bg-card border border-border-base rounded-lg px-3 h-8 min-w-[200px]">
              <Search size={12} className="text-text-muted flex-shrink-0" />
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }}
                placeholder="Cari kode, lokasi, perusahaan..."
                className="bg-transparent outline-none text-[11px] text-text-primary placeholder:text-text-muted flex-1"
              />
              {search && (
                <button onClick={() => setSearch('')} className="text-text-muted hover:text-text-primary">
                  <X size={11} />
                </button>
              )}
            </div>

            {/* Status tabs */}
            <div className="flex items-center gap-1 bg-bg-card border border-border-base rounded-lg p-1">
              {([
                ['all',      'Semua',  counts.all],
                ['online',   'Online', counts.online],
                ['warning',  'Waspada',counts.warning],
                ['critical', 'Kritis', counts.critical],
                ['offline',  'Offline',counts.offline],
              ] as const).map(([k, l, c]) => (
                <button key={k}
                  onClick={() => { setStatus(k); setPage(1) }}
                  className={cn(
                    'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-medium transition-all',
                    status === k
                      ? 'bg-bg-card3 text-text-primary shadow-sm border border-border-base'
                      : 'text-text-muted hover:text-text-secondary'
                  )}>
                  {l}
                  <span className={cn('text-[9px] font-mono rounded-full px-1',
                    status === k ? 'text-text-primary' : 'text-text-muted')}>
                    {c}
                  </span>
                </button>
              ))}
            </div>

            {/* Type */}
            <select
              value={type}
              onChange={e => { setType(e.target.value as SensorType | 'all'); setPage(1) }}
              className="h-8 bg-bg-card border border-border-base rounded-lg px-2.5 text-[10px] text-text-secondary outline-none hover:border-border-strong transition-colors cursor-pointer">
              <option value="all">Semua Tipe</option>
              <option value="air_tanah">Air Tanah</option>
              <option value="gnss">GNSS</option>
            </select>

            {/* Company */}
            <select
              value={company}
              onChange={e => { setCompany(e.target.value); setPage(1) }}
              className="h-8 bg-bg-card border border-border-base rounded-lg px-2.5 text-[10px] text-text-secondary outline-none hover:border-border-strong transition-colors cursor-pointer">
              <option value="all">Semua Perusahaan</option>
              {MOCK_COMPANIES.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            {/* Clear */}
            {(search || status !== 'all' || type !== 'all' || company !== 'all') && (
              <button
                onClick={() => { setSearch(''); setStatus('all'); setType('all'); setCompany('all'); setPage(1) }}
                className="flex items-center gap-1 text-[10px] text-accent-red hover:text-red-700 transition-colors ml-auto">
                <X size={11} /> Reset Filter
              </button>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <SortTh label="Kode"        col="code"        active={sortKey} dir={sortDir} onSort={handleSort} />
                  <SortTh label="Tipe"        col="type"        active={sortKey} dir={sortDir} onSort={handleSort} />
                  <SortTh label="Lokasi"      col="location"    active={sortKey} dir={sortDir} onSort={handleSort} />
                  <SortTh label="Perusahaan"  col="companyName" active={sortKey} dir={sortDir} onSort={handleSort} />
                  <SortTh label="Nilai"       col="value"       active={sortKey} dir={sortDir} onSort={handleSort} />
                  <SortTh label="Status"      col="status"      active={sortKey} dir={sortDir} onSort={handleSort} />
                  <SortTh label="Update"      col="lastUpdate"  active={sortKey} dir={sortDir} onSort={handleSort} />
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-text-muted text-[12px]">
                      Tidak ada sensor ditemukan
                    </td>
                  </tr>
                ) : paginated.map((sensor) => {
                  const statusCfg = STATUS_CONFIG[sensor.status]
                  const StatusIcon = statusCfg.icon
                  return (
                    <tr key={sensor.id} className="cursor-pointer group" onClick={() => setSelected(sensor)}>
                      <td className="td-primary td-mono">{sensor.code}</td>
                      <td><TypeIcon type={sensor.type} /></td>
                      <td>{sensor.location}</td>
                      <td className="text-text-secondary">{sensor.companyName}</td>
                      <td className={cn('td-mono font-semibold',
                        sensor.status === 'critical' ? 'text-accent-red' :
                        sensor.status === 'warning'  ? 'text-accent-amber' : 'text-text-primary')}>
                        {sensor.value} {sensor.unit}
                      </td>
                      <td>
                        <div className="flex items-center gap-1.5">
                          <StatusIcon size={11} className={statusCfg.color} />
                          <span className={cn('text-[10px] font-medium', statusCfg.color)}>{statusCfg.label}</span>
                        </div>
                      </td>
                      <td className="td-mono text-text-muted">{sensor.lastUpdate}</td>
                      <td>
                        <ExternalLink size={12} className="text-text-muted group-hover:text-accent-cyan transition-colors" />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border-base bg-bg-card3">
              <p className="text-[10px] text-text-muted font-mono">
                Menampilkan {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} dari {filtered.length}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-7 h-7 rounded-lg border border-border-base flex items-center justify-center text-text-muted hover:bg-bg-card3 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                  <ChevronUp size={12} className="-rotate-90" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p}
                    onClick={() => setPage(p)}
                    className={cn(
                      'w-7 h-7 rounded-lg border text-[10px] font-mono transition-colors',
                      page === p
                        ? 'bg-accent-cyan text-white border-accent-cyan font-bold'
                        : 'border-border-base text-text-muted hover:bg-bg-card3'
                    )}>
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-7 h-7 rounded-lg border border-border-base flex items-center justify-center text-text-muted hover:bg-bg-card3 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                  <ChevronDown size={12} className="-rotate-90" />
                </button>
              </div>
            </div>
          )}
        </Panel>
      </div>

      {/* Detail modal */}
      {selected && (
        <SensorDetailModal sensor={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}
