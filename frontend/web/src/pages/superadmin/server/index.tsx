import { useState } from 'react'
import {
  Server, Activity, Copy, Eye, EyeOff,
  RefreshCw, Plus, Check, Trash2, Wifi,
  Database, Cpu, HardDrive, Globe,
} from 'lucide-react'
import Topbar from '@/components/layout/Topbar'
import { Panel, Badge } from '@/components/ui'
import { cn } from '@/lib/utils'

/* ── Mock server data ─────────────────────────────────────────────── */
const SERVICES = [
  { name: 'API Gateway',       status: 'online',  latency: 42,   uptime: '99.98%', region: 'Jakarta IDC-1' },
  { name: 'Database Primary',  status: 'online',  latency: 8,    uptime: '99.99%', region: 'Jakarta IDC-1' },
  { name: 'Database Replica',  status: 'online',  latency: 12,   uptime: '99.95%', region: 'Surabaya IDC-2'},
  { name: 'File Storage',      status: 'online',  latency: 65,   uptime: '99.90%', region: 'Jakarta IDC-1' },
  { name: 'Email Service',     status: 'online',  latency: 120,  uptime: '99.85%', region: 'Cloud'         },
  { name: 'Sensor Data Ingestion', status:'online',latency: 28,   uptime: '99.97%', region: 'Jakarta IDC-1' },
  { name: 'Map Tile Server',   status: 'online',  latency: 55,   uptime: '99.80%', region: 'CDN'           },
  { name: 'WebSocket Server',  status: 'warning', latency: 280,  uptime: '97.50%', region: 'Jakarta IDC-1' },
]

const API_KEYS = [
  { id:'1', name:'Production API',         key:'wg_prod_sk_a1b2c3d4e5f6g7h8i9j0',    created:'01 Jan 2026', lastUsed:'10 Apr 2026', scopes:['read','write'],       status:'active'   as const },
  { id:'2', name:'Sensor Ingest Key',      key:'wg_sensor_sk_x1y2z3w4v5u6t7s8r9q0', created:'15 Mar 2026', lastUsed:'10 Apr 2026', scopes:['sensor:write'],       status:'active'   as const },
  { id:'3', name:'Read-Only Analytics',    key:'wg_ro_sk_m1n2o3p4q5r6s7t8u9v0',     created:'01 Apr 2026', lastUsed:'09 Apr 2026', scopes:['read'],               status:'active'   as const },
  { id:'4', name:'Legacy Integration',     key:'wg_legacy_sk_a9b8c7d6e5f4g3h2i1j0', created:'01 Jun 2025', lastUsed:'01 Jan 2026', scopes:['read','write'],       status:'revoked'  as const },
]

const ENDPOINTS = [
  { method: 'GET',    path: '/api/v1/sensors',          desc: 'List semua sensor',         rps: 1240, p99: '45ms'  },
  { method: 'GET',    path: '/api/v1/sensors/:id',       desc: 'Detail sensor',             rps: 890,  p99: '32ms'  },
  { method: 'POST',   path: '/api/v1/sensor-data',       desc: 'Ingest data sensor',        rps: 3400, p99: '28ms'  },
  { method: 'GET',    path: '/api/v1/companies',         desc: 'List perusahaan',           rps: 210,  p99: '55ms'  },
  { method: 'GET',    path: '/api/v1/reports',           desc: 'List laporan',              rps: 180,  p99: '62ms'  },
  { method: 'POST',   path: '/api/v1/reports/:id/approve', desc: 'Setujui laporan',        rps: 15,   p99: '88ms'  },
  { method: 'GET',    path: '/api/v1/analytics/trend',   desc: 'Data tren subsidence',     rps: 430,  p99: '120ms' },
]

const METHOD_COLORS = {
  GET:    'bg-fill-green  text-accent-green',
  POST:   'bg-fill-blue   text-accent-blue',
  PUT:    'bg-fill-amber  text-accent-amber',
  DELETE: 'bg-fill-red    text-accent-red',
}

function MetricGauge({ label, value, max, unit, color }: { label: string; value: number; max: number; unit: string; color: string }) {
  const pct = Math.min((value / max) * 100, 100)
  const isDanger = pct > 80
  return (
    <div className="bg-bg-card3 rounded-xl p-3 border border-border-light">
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-[9px] text-text-muted uppercase tracking-wide">{label}</span>
        <span className={cn('text-[13px] font-bold font-mono', isDanger ? 'text-accent-red' : color)}>{value}{unit}</span>
      </div>
      <div className="h-2 bg-bg-card rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full transition-all', isDanger ? 'bg-accent-red' : color.replace('text-', 'bg-'))}
          style={{ width: `${pct}%` }} />
      </div>
      <p className="text-[8px] text-text-muted mt-1 text-right">{pct.toFixed(0)}% dari {max}{unit}</p>
    </div>
  )
}

function CopyBtn({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard?.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={copy} className="p-1.5 rounded-lg hover:bg-bg-card3 transition-colors">
      {copied ? <Check size={12} className="text-accent-green" /> : <Copy size={12} className="text-text-muted hover:text-text-secondary" />}
    </button>
  )
}

export default function ServerPage() {
  const [showKey, setShowKey]   = useState<string | null>(null)
  const [showAdd, setShowAdd]   = useState(false)

  const onlineCount  = SERVICES.filter(s => s.status === 'online').length
  const warningCount = SERVICES.filter(s => s.status === 'warning').length

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar
        breadcrumbs={[{ label: 'Super Admin' }, { label: 'Server & API' }]}
        actions={
          <button className="flex items-center gap-1.5 text-[10px] text-text-secondary border border-border-base rounded-lg px-2.5 h-8 hover:bg-bg-card3 transition-colors">
            <RefreshCw size={12} /> Refresh Status
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto p-5 space-y-4">

        {/* System metrics */}
        <div className="grid grid-cols-4 gap-3">
          <MetricGauge label="CPU Usage"     value={34}  max={100} unit="%" color="text-accent-cyan"   />
          <MetricGauge label="Memory"        value={12}  max={32}  unit="GB" color="text-accent-blue"  />
          <MetricGauge label="Disk Usage"    value={480} max={2000} unit="GB" color="text-accent-purple"/>
          <MetricGauge label="Network In/s"  value={45}  max={100} unit="MB" color="text-accent-green" />
        </div>

        {/* Services + API Keys side by side */}
        <div className="grid grid-cols-[1.2fr_1fr] gap-4">

          {/* Services */}
          <Panel
            title="Status Layanan"
            icon={<Server size={12} className="text-accent-cyan" />}
            headerRight={
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono text-accent-green">{onlineCount} online</span>
                {warningCount > 0 && <span className="text-[9px] font-mono text-accent-amber">{warningCount} warning</span>}
              </div>
            }
          >
            <div className="divide-y divide-border-light">
              {SERVICES.map((svc) => (
                <div key={svc.name} className="flex items-center gap-3 px-4 py-3 hover:bg-bg-card3 transition-colors">
                  <div className={cn('w-2 h-2 rounded-full flex-shrink-0',
                    svc.status === 'online' ? 'bg-accent-green animate-pulse-soft' : 'bg-accent-amber animate-blink')} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-text-primary truncate">{svc.name}</p>
                    <p className="text-[9px] text-text-muted">{svc.region}</p>
                  </div>
                  <div className="flex items-center gap-3 text-right flex-shrink-0">
                    <div>
                      <p className={cn('text-[10px] font-bold font-mono',
                        svc.latency > 200 ? 'text-accent-amber' : 'text-accent-green')}>{svc.latency}ms</p>
                      <p className="text-[8px] text-text-muted">latency</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold font-mono text-text-primary">{svc.uptime}</p>
                      <p className="text-[8px] text-text-muted">uptime</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          {/* API Keys */}
          <Panel
            title="API Keys"
            icon={<Globe size={12} className="text-accent-purple" />}
            headerRight={
              <button onClick={() => setShowAdd(!showAdd)}
                className="flex items-center gap-1 text-[9px] font-semibold text-accent-blue hover:text-blue-700 transition-colors">
                <Plus size={11} /> Buat Key Baru
              </button>
            }
          >
            {showAdd && (
              <div className="px-4 py-3 border-b border-border-base bg-fill-blue">
                <p className="text-[10px] font-semibold text-accent-blue mb-2">Buat API Key Baru</p>
                <div className="flex gap-2">
                  <input placeholder="Nama key..." className="flex-1 bg-white border border-accent-blue/30 rounded-lg px-3 h-8 text-[10px] outline-none focus:border-accent-cyan" />
                  <button onClick={() => setShowAdd(false)} className="bg-accent-blue text-white rounded-lg px-3 h-8 text-[10px] font-semibold hover:bg-blue-700 transition-colors">Buat</button>
                  <button onClick={() => setShowAdd(false)} className="text-text-muted hover:text-text-primary p-2"><Trash2 size={12} /></button>
                </div>
              </div>
            )}
            <div className="divide-y divide-border-light">
              {API_KEYS.map((ak) => (
                <div key={ak.id} className="px-4 py-3">
                  <div className="flex items-start justify-between mb-1.5">
                    <div>
                      <p className="text-[11px] font-semibold text-text-primary">{ak.name}</p>
                      <div className="flex gap-1 mt-0.5">
                        {ak.scopes.map(s => (
                          <span key={s} className="text-[8px] bg-bg-card3 text-text-muted px-1.5 py-0.5 rounded font-mono">{s}</span>
                        ))}
                      </div>
                    </div>
                    {ak.status === 'active'
                      ? <Badge label="AKTIF"   variant="success"  />
                      : <Badge label="DICABUT" variant="critical" />}
                  </div>
                  <div className="flex items-center gap-1 bg-bg-card3 rounded-lg px-2.5 py-1.5">
                    <code className="text-[9px] text-text-secondary font-mono flex-1 truncate">
                      {showKey === ak.id ? ak.key : `${ak.key.slice(0, 16)}${'•'.repeat(20)}`}
                    </code>
                    <button onClick={() => setShowKey(showKey === ak.id ? null : ak.id)}
                      className="p-1 text-text-muted hover:text-text-secondary transition-colors">
                      {showKey === ak.id ? <EyeOff size={11} /> : <Eye size={11} />}
                    </button>
                    <CopyBtn value={ak.key} />
                  </div>
                  <p className="text-[8px] text-text-muted mt-1 font-mono">Dibuat {ak.created} · Terakhir {ak.lastUsed}</p>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* Endpoint stats */}
        <Panel
          title="Endpoint Usage & Performa"
          icon={<Activity size={12} className="text-accent-green" />}
          sub="LAST 24 HOURS"
        >
          <table className="data-table">
            <thead>
              <tr>
                <th>Method</th>
                <th>Endpoint</th>
                <th>Deskripsi</th>
                <th>Req/s (avg)</th>
                <th>Latency p99</th>
              </tr>
            </thead>
            <tbody>
              {ENDPOINTS.map((ep) => (
                <tr key={ep.path} className="hover:bg-bg-card3">
                  <td>
                    <span className={cn('text-[9px] font-mono font-bold px-2 py-1 rounded', METHOD_COLORS[ep.method as keyof typeof METHOD_COLORS] ?? 'bg-bg-card3 text-text-muted')}>
                      {ep.method}
                    </span>
                  </td>
                  <td className="td-mono text-accent-blue">{ep.path}</td>
                  <td className="text-text-secondary">{ep.desc}</td>
                  <td className="td-mono text-text-primary font-semibold">{ep.rps.toLocaleString()}</td>
                  <td>
                    <span className={cn('td-mono font-semibold', parseInt(ep.p99) > 100 ? 'text-accent-amber' : 'text-accent-green')}>
                      {ep.p99}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <div className="h-2" />
      </div>
    </div>
  )
}
