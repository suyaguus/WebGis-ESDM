import { useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import {
  Layers, Search, Filter, ChevronRight,
  MapPin, Wifi, WifiOff, AlertTriangle, Navigation,
} from 'lucide-react'
import Topbar from '@/components/layout/Topbar'
import { Badge, StatusPill } from '@/components/ui'
import { MOCK_SENSORS, MOCK_COMPANIES } from '@/constants/mockData'
import { cn } from '@/lib/utils'
import type { Sensor, SensorStatus } from '@/types'

/* ── Tile layers ───────────────────────────────────────────────────── */
const TILES = {
  voyager:   { url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',        label: 'Voyager',   attr: '© CARTO' },
  osm:       { url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',                               label: 'Street',    attr: '© OSM'   },
  positron:  { url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',                   label: 'Positron',  attr: '© CARTO' },
  satellite: { url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', label: 'Satellite', attr: '© Esri'  },
}
type TileKey = keyof typeof TILES

/* ── Marker style ──────────────────────────────────────────────────── */
const MARKER: Record<SensorStatus, { fill: string; stroke: string; r: number }> = {
  online:   { fill: '#2563eb', stroke: '#1d4ed8', r: 8  },
  warning:  { fill: '#d97706', stroke: '#b45309', r: 8  },
  critical: { fill: '#dc2626', stroke: '#b91c1c', r: 10 },
  offline:  { fill: '#94a3b8', stroke: '#64748b', r: 6  },
}

/* ── Status filter config ──────────────────────────────────────────── */
const STATUS_FILTERS: { key: SensorStatus | 'all'; label: string; color: string }[] = [
  { key: 'all',      label: 'Semua',   color: 'text-text-secondary' },
  { key: 'online',   label: 'Online',  color: 'text-accent-green'  },
  { key: 'warning',  label: 'Waspada', color: 'text-accent-amber'  },
  { key: 'critical', label: 'Kritis',  color: 'text-accent-red'    },
  { key: 'offline',  label: 'Offline', color: 'text-text-muted'    },
]

/* ── Popup content ─────────────────────────────────────────────────── */
function SensorPopup({ sensor, onSelect }: { sensor: Sensor; onSelect: (s: Sensor) => void }) {
  const accent =
    sensor.status === 'critical' ? '#dc2626' :
    sensor.status === 'warning'  ? '#d97706' :
    sensor.status === 'offline'  ? '#94a3b8' : '#2563eb'

  return (
    <div style={{ minWidth: 175, fontFamily: '"Plus Jakarta Sans",sans-serif' }}>
      <p style={{ fontSize: 9, margin: '0 0 3px', color: accent, fontWeight: 600, fontFamily: '"JetBrains Mono",monospace' }}>
        ● {sensor.code} · {sensor.type === 'air_tanah' ? 'AIR TANAH' : 'GNSS'}
      </p>
      <p style={{ fontSize: 13, fontWeight: 700, margin: '0 0 8px', color: '#0f172a' }}>{sensor.location}</p>
      {[
        { k: 'Perusahaan', v: sensor.companyName },
        { k: 'Koordinat',  v: `${sensor.lng.toFixed(4)}, ${sensor.lat.toFixed(4)}` },
        { k: sensor.type === 'air_tanah' ? 'Muka Air' : 'Trend', v: `${sensor.value} ${sensor.unit}` },
        { k: 'Update',     v: sensor.lastUpdate },
      ].map(({ k, v }) => (
        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 9, color: '#64748b' }}>{k}</span>
          <span style={{ fontSize: 9, color: '#0f172a', fontFamily: '"JetBrains Mono",monospace', textAlign: 'right' }}>{v}</span>
        </div>
      ))}
      <button
        onClick={() => onSelect(sensor)}
        style={{
          width: '100%', marginTop: 10, background: accent, color: '#fff',
          border: 'none', borderRadius: 7, padding: '7px 0', fontSize: 10,
          fontWeight: 700, cursor: 'pointer', fontFamily: '"Plus Jakarta Sans",sans-serif',
        }}
      >
        Lihat Detail Lengkap →
      </button>
    </div>
  )
}

/* ── Sensor detail side panel ─────────────────────────────────────── */
function DetailPanel({ sensor, onClose }: { sensor: Sensor; onClose: () => void }) {
  const statusVariant =
    sensor.status === 'online'   ? 'online'  :
    sensor.status === 'offline'  ? 'offline' : 'warning'

  return (
    <div className="w-[280px] flex-shrink-0 flex flex-col bg-bg-card border-l border-border-base overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border-base bg-bg-card3 flex items-start gap-2">
        <div>
          <p className="text-[10px] font-mono text-text-muted mb-0.5">{sensor.code}</p>
          <p className="text-[14px] font-bold text-text-primary leading-tight">{sensor.location}</p>
          <div className="mt-1.5 flex items-center gap-2">
            <StatusPill variant={statusVariant} />
            <span className="text-[9px] text-text-muted font-mono">{sensor.type === 'air_tanah' ? 'Air Tanah' : 'GNSS'}</span>
          </div>
        </div>
        <button onClick={onClose} className="ml-auto text-text-muted hover:text-text-primary transition-colors text-lg leading-none mt-0.5">×</button>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 gap-2 p-4 border-b border-border-base">
        {[
          { label: sensor.type === 'air_tanah' ? 'Muka Air'   : 'Nilai Vertikal', value: `${sensor.value} ${sensor.unit}`, color: sensor.status === 'critical' ? 'text-accent-red' : sensor.status === 'warning' ? 'text-accent-amber' : 'text-accent-blue' },
          { label: 'Perusahaan',  value: sensor.companyName, color: 'text-text-primary' },
          { label: 'Latitude',   value: sensor.lat.toFixed(5),  color: 'text-text-primary' },
          { label: 'Longitude',  value: sensor.lng.toFixed(5),  color: 'text-text-primary' },
        ].map((m) => (
          <div key={m.label} className="bg-bg-card3 rounded-lg p-2.5">
            <p className="text-[8px] text-text-muted uppercase tracking-wide mb-1">{m.label}</p>
            <p className={cn('text-[12px] font-bold font-mono truncate', m.color)}>{m.value}</p>
          </div>
        ))}
      </div>

      {/* Info rows */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <p className="text-[10px] font-semibold text-text-primary">Informasi Sensor</p>
        {[
          { k: 'Kode Sensor',   v: sensor.code },
          { k: 'Tipe',          v: sensor.type === 'air_tanah' ? 'Sensor Air Tanah' : 'Sensor GNSS' },
          { k: 'Perusahaan',    v: sensor.companyName },
          { k: 'Terakhir Update', v: sensor.lastUpdate },
          { k: 'Status',        v: sensor.status.toUpperCase() },
        ].map(({ k, v }) => (
          <div key={k} className="flex justify-between items-center py-2 border-b border-border-light">
            <span className="text-[10px] text-text-muted">{k}</span>
            <span className="text-[10px] font-medium text-text-primary font-mono">{v}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-border-base space-y-2">
        <button className="w-full bg-accent-blue text-white rounded-lg py-2 text-[11px] font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
          <Navigation size={13} />
          Navigasi ke Lokasi
        </button>
        <button className="w-full bg-bg-card3 text-text-primary border border-border-base rounded-lg py-2 text-[11px] font-semibold hover:bg-border-light transition-colors">
          Lihat Grafik Time-Series
        </button>
      </div>
    </div>
  )
}

/* ── Layer Switcher ────────────────────────────────────────────────── */
function LayerSwitcher({ active, onChange }: { active: TileKey; onChange: (k: TileKey) => void }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="absolute top-3 right-3 z-[1000]">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm border border-border-base shadow-card rounded-lg px-2.5 py-1.5 text-[10px] text-text-secondary hover:text-text-primary font-mono transition-colors"
      >
        <Layers size={11} />
        {TILES[active].label}
      </button>
      {open && (
        <div className="absolute right-0 mt-1 bg-white border border-border-base shadow-card-hover rounded-lg overflow-hidden min-w-[110px]">
          {(Object.keys(TILES) as TileKey[]).map((k) => (
            <button key={k}
              onClick={() => { onChange(k); setOpen(false) }}
              className={cn(
                'w-full text-left px-3 py-2 text-[10px] font-mono transition-colors hover:bg-bg-card3',
                active === k ? 'text-accent-cyan font-semibold' : 'text-text-secondary'
              )}>
              {TILES[k].label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Main Page ─────────────────────────────────────────────────────── */
export default function PetaPage() {
  const [tile, setTile]           = useState<TileKey>('voyager')
  const [search, setSearch]       = useState('')
  const [statusFilter, setStatus] = useState<SensorStatus | 'all'>('all')
  const [typeFilter, setType]     = useState<'all' | 'air_tanah' | 'gnss'>('all')
  const [company, setCompany]     = useState<string>('all')
  const [selected, setSelected]   = useState<Sensor | null>(null)

  /* filter logic */
  const visible = MOCK_SENSORS.filter((s) => {
    if (statusFilter !== 'all' && s.status !== statusFilter) return false
    if (typeFilter   !== 'all' && s.type   !== typeFilter)   return false
    if (company      !== 'all' && s.companyId !== company)   return false
    if (search && !s.code.toLowerCase().includes(search.toLowerCase()) &&
        !s.location.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  /* counts */
  const counts = {
    online:   MOCK_SENSORS.filter(s => s.status === 'online').length,
    warning:  MOCK_SENSORS.filter(s => s.status === 'warning').length,
    critical: MOCK_SENSORS.filter(s => s.status === 'critical').length,
    offline:  MOCK_SENSORS.filter(s => s.status === 'offline').length,
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar breadcrumbs={[{ label: 'Super Admin' }, { label: 'Peta Interaktif' }]} />

      {/* Toolbar */}
      <div className="flex items-center gap-3 px-5 py-2.5 bg-bg-card border-b border-border-base flex-shrink-0">
        {/* Search */}
        <div className="flex items-center gap-2 bg-bg-card3 border border-border-base rounded-lg px-3 h-8 text-[11px] min-w-[200px]">
          <Search size={13} className="text-text-muted flex-shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari sensor / lokasi..."
            className="bg-transparent outline-none text-text-primary placeholder:text-text-muted flex-1 text-[11px]"
          />
        </div>

        {/* Status filter chips */}
        <div className="flex items-center gap-1.5">
          {STATUS_FILTERS.map(({ key, label, color }) => (
            <button key={key}
              onClick={() => setStatus(key as SensorStatus | 'all')}
              className={cn(
                'flex items-center gap-1.5 px-2.5 h-8 rounded-lg text-[10px] font-medium border transition-all',
                statusFilter === key
                  ? 'bg-bg-card3 border-border-strong text-text-primary shadow-sm'
                  : 'border-transparent text-text-muted hover:text-text-secondary hover:bg-bg-card3'
              )}>
              <span className={cn('w-[6px] h-[6px] rounded-full', color.replace('text-', 'bg-'))} />
              <span>{label}</span>
              {key !== 'all' && (
                <span className="text-[9px] font-mono text-text-muted">
                  {counts[key as SensorStatus]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Type filter */}
        <div className="flex items-center gap-1 bg-bg-card3 border border-border-base rounded-lg p-1 ml-1">
          {([['all','Semua'],['air_tanah','Air Tanah'],['gnss','GNSS']] as const).map(([k, l]) => (
            <button key={k}
              onClick={() => setType(k)}
              className={cn(
                'px-2.5 py-1 rounded-md text-[10px] font-medium transition-all',
                typeFilter === k
                  ? 'bg-bg-card text-text-primary shadow-sm border border-border-base'
                  : 'text-text-muted hover:text-text-secondary'
              )}>
              {l}
            </button>
          ))}
        </div>

        {/* Company filter */}
        <select
          value={company}
          onChange={e => setCompany(e.target.value)}
          className="h-8 bg-bg-card3 border border-border-base rounded-lg px-2.5 text-[10px] text-text-secondary outline-none hover:border-border-strong transition-colors cursor-pointer"
        >
          <option value="all">Semua Perusahaan</option>
          {MOCK_COMPANIES.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        {/* Count badge */}
        <div className="ml-auto flex items-center gap-1.5 text-[10px] text-text-muted font-mono">
          <MapPin size={11} />
          <span className="text-text-primary font-semibold">{visible.length}</span>
          <span>/ {MOCK_SENSORS.length} titik</span>
        </div>
      </div>

      {/* Map + optional detail panel */}
      <div className="flex flex-1 min-h-0">

        {/* Map */}
        <div className="flex-1 relative min-w-0">
          <MapContainer
            center={[-6.2, 106.82]}
            zoom={11}
            style={{ height: '100%', width: '100%' }}
            zoomControl
          >
            <TileLayer url={TILES[tile].url} attribution={TILES[tile].attr} />

            {visible.map((sensor) => {
              const m = MARKER[sensor.status]
              return (
                <CircleMarker
                  key={sensor.id}
                  center={[sensor.lat, sensor.lng]}
                  radius={m.r}
                  pathOptions={{
                    color: m.stroke, fillColor: m.fill,
                    fillOpacity: 0.92, weight: 2, opacity: 1,
                  }}
                >
                  <Popup closeButton={false} minWidth={178}>
                    <SensorPopup sensor={sensor} onSelect={(s) => { setSelected(s) }} />
                  </Popup>
                </CircleMarker>
              )
            })}
          </MapContainer>

          {/* Layer switcher */}
          <LayerSwitcher active={tile} onChange={setTile} />

          {/* Legend */}
          <div className="absolute bottom-5 left-4 z-[1000] bg-white/95 backdrop-blur-sm border border-border-base shadow-card rounded-xl px-3 py-2.5 space-y-2">
            <p className="text-[8px] font-semibold text-text-muted uppercase tracking-wide mb-1">Legenda</p>
            {[
              { color: '#2563eb', label: 'Online',        count: counts.online   },
              { color: '#d97706', label: 'Waspada',       count: counts.warning  },
              { color: '#dc2626', label: 'Kritis',        count: counts.critical },
              { color: '#94a3b8', label: 'Offline',       count: counts.offline  },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-2.5 justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: l.color }} />
                  <span className="text-[9px] text-text-secondary">{l.label}</span>
                </div>
                <span className="text-[9px] font-mono font-semibold text-text-primary">{l.count}</span>
              </div>
            ))}
          </div>

          {/* Sensor type legend */}
          <div className="absolute bottom-5 left-44 z-[1000] bg-white/95 backdrop-blur-sm border border-border-base shadow-card rounded-xl px-3 py-2.5 space-y-2">
            <p className="text-[8px] font-semibold text-text-muted uppercase tracking-wide mb-1">Tipe Sensor</p>
            {[
              { label: 'Air Tanah', desc: 'Muka air groundwater' },
              { label: 'GNSS',      desc: 'Land subsidence GPS'  },
            ].map((t) => (
              <div key={t.label}>
                <p className="text-[9px] font-semibold text-text-primary">{t.label}</p>
                <p className="text-[8px] text-text-muted">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Detail side panel */}
        {selected && (
          <DetailPanel sensor={selected} onClose={() => setSelected(null)} />
        )}
      </div>
    </div>
  )
}
