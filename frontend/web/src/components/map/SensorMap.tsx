import { useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import { Layers } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MOCK_SENSORS } from '@/constants/mockData'
import type { Sensor } from '@/types'

const TILE_LAYERS = {
  voyager: {
    url:   'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attr:  '© OpenStreetMap, © CARTO',
    label: 'Voyager',
  },
  osm: {
    url:   'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attr:  '© OpenStreetMap contributors',
    label: 'Street',
  },
  positron: {
    url:   'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attr:  '© OpenStreetMap, © CARTO',
    label: 'Positron',
  },
  satellite: {
    url:   'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attr:  '© Esri',
    label: 'Satellite',
  },
}

type LayerKey = keyof typeof TILE_LAYERS

const MARKER_STYLE: Record<string, { color: string; fillColor: string; radius: number; weight: number }> = {
  online:   { color: '#1d4ed8', fillColor: '#3b82f6', radius: 8,  weight: 2   },
  warning:  { color: '#b45309', fillColor: '#f59e0b', radius: 8,  weight: 2   },
  critical: { color: '#b91c1c', fillColor: '#ef4444', radius: 10, weight: 2.5 },
  offline:  { color: '#334155', fillColor: '#64748b', radius: 6,  weight: 1.5 },
}

function LayerSwitcher({ active, onChange }: { active: LayerKey; onChange: (l: LayerKey) => void }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="absolute top-3 right-3 z-[1000]">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm border border-gray-200 shadow-md rounded-lg px-2.5 py-1.5 text-[10px] text-gray-700 hover:text-gray-900 transition-colors font-mono"
      >
        <Layers size={11} />
        {TILE_LAYERS[active].label}
      </button>
      {open && (
        <div className="absolute right-0 mt-1 bg-white border border-gray-200 shadow-xl rounded-lg overflow-hidden min-w-[110px]">
          {(Object.keys(TILE_LAYERS) as LayerKey[]).map((k) => (
            <button
              key={k}
              onClick={() => { onChange(k); setOpen(false) }}
              className={cn(
                'w-full text-left px-3 py-2 text-[10px] font-mono transition-colors hover:bg-gray-50',
                active === k ? 'text-blue-600 font-semibold' : 'text-gray-600',
              )}
            >
              {TILE_LAYERS[k].label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function SensorPopup({ sensor }: { sensor: Sensor }) {
  const isCritical = sensor.status === 'critical'
  const isWarning  = sensor.status === 'warning'
  const accent = isCritical ? '#dc2626' : isWarning ? '#d97706' : '#2563eb'
  return (
    <div style={{ minWidth: 168, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
      <p style={{ fontSize: 9, margin: '0 0 3px', fontFamily: '"JetBrains Mono", monospace', color: accent, fontWeight: 600 }}>
        ● {sensor.code} · {sensor.type === 'air_tanah' ? 'AIR TANAH' : 'GNSS'}
      </p>
      <p style={{ fontSize: 12, fontWeight: 700, margin: '0 0 8px', color: '#0f172a' }}>{sensor.location}</p>
      {[
        { k: 'Perusahaan', v: sensor.companyName },
        { k: 'Koordinat',  v: `${sensor.lng.toFixed(3)} / ${sensor.lat.toFixed(3)}` },
        { k: 'Nilai',      v: `${sensor.value} ${sensor.unit}` },
        { k: 'Update',     v: sensor.lastUpdate },
      ].map(({ k, v }) => (
        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 3 }}>
          <span style={{ fontSize: 9, color: '#64748b' }}>{k}</span>
          <span style={{ fontSize: 9, color: '#0f172a', fontFamily: '"JetBrains Mono", monospace', textAlign: 'right' }}>{v}</span>
        </div>
      ))}
      <button style={{
        width: '100%', marginTop: 9, background: accent, color: '#fff',
        border: 'none', borderRadius: 6, padding: '6px 0', fontSize: 9,
        fontWeight: 700, cursor: 'pointer',
      }}>
        Lihat Detail →
      </button>
    </div>
  )
}

const FILTER_TABS = ['Semua', 'Air Tanah', 'GNSS', 'Alert'] as const
type FilterTab = typeof FILTER_TABS[number]

export default function SensorMap() {
  const [layer,  setLayer]  = useState<LayerKey>('voyager')
  const [filter, setFilter] = useState<FilterTab>('Semua')

  const tile = TILE_LAYERS[layer]

  const visible = MOCK_SENSORS.filter((s) => {
    if (filter === 'Air Tanah') return s.type === 'air_tanah'
    if (filter === 'GNSS')      return s.type === 'gnss'
    if (filter === 'Alert')     return s.status === 'critical' || s.status === 'warning'
    return true
  })

  const alertCount = MOCK_SENSORS.filter(
    (s) => s.status === 'critical' || s.status === 'warning',
  ).length

  return (
    <div className="flex flex-col h-full">
      {/* Filter bar */}
      <div className="flex items-center gap-1.5 px-4 py-2 border-b border-border-base">
        {FILTER_TABS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'text-[9px] px-2.5 py-[5px] rounded-md font-mono border transition-colors',
              filter === f
                ? 'bg-accent-blue/15 text-blue-400 border-accent-blue/30'
                : 'text-text-muted border-transparent hover:text-text-secondary',
            )}
          >
            {f}
            {f === 'Alert' && <span className="ml-1 text-red-400">({alertCount})</span>}
          </button>
        ))}
        <span className="ml-auto text-[9px] text-text-muted font-mono">{visible.length} titik</span>
      </div>

      {/* Map */}
      <div className="flex-1 relative min-h-0">
        <MapContainer
          center={[-5.12, 105.10]}
          zoom={8}
          style={{ height: '100%', width: '100%' }}
          zoomControl
        >
          <TileLayer url={tile.url} attribution={tile.attr} />

          {visible.map((sensor) => {
            const s = MARKER_STYLE[sensor.status] ?? MARKER_STYLE.online
            return (
              <CircleMarker
                key={sensor.id}
                center={[sensor.lat, sensor.lng]}
                radius={s.radius}
                pathOptions={{
                  color: s.color, fillColor: s.fillColor,
                  fillOpacity: 0.92, weight: s.weight, opacity: 1,
                }}
              >
                <Popup closeButton={false} minWidth={172}>
                  <SensorPopup sensor={sensor} />
                </Popup>
              </CircleMarker>
            )
          })}
        </MapContainer>

        <LayerSwitcher active={layer} onChange={setLayer} />

        {/* Legend */}
        <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-sm border border-border-base shadow-card rounded-lg px-2.5 py-2 space-y-1.5">
          {[
            { color: '#3b82f6', label: 'Sensor Air Tanah' },
            { color: '#f59e0b', label: 'Sensor GNSS'      },
            { color: '#ef4444', label: 'Alert / Kritis'   },
            { color: '#64748b', label: 'Offline'           },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-2">
              <span className="w-[8px] h-[8px] rounded-full flex-shrink-0" style={{ background: l.color }} />
              <span className="text-[8px] text-text-secondary font-mono">{l.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}