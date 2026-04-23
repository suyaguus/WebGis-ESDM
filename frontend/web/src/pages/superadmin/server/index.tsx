import { useRef, useEffect } from 'react';
import { Server, Activity, Globe, Database, CheckCircle, AlertTriangle } from 'lucide-react';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip } from 'chart.js';
import { Card, SectionHeader } from '../../../components/ui';
import { SERVER_METRICS } from '../../../constants/mockData';
import { cn } from '../../../lib/utils';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip);

const SERVICES = [
  { name: 'API Gateway',     status: 'ok',   latency: '12ms',  uptime: '99.98%', endpoint: 'api.sigat.go.id' },
  { name: 'GIS Service',     status: 'ok',   latency: '38ms',  uptime: '99.94%', endpoint: 'gis.sigat.go.id' },
  { name: 'Auth Service',    status: 'ok',   latency: '8ms',   uptime: '99.99%', endpoint: 'auth.sigat.go.id' },
  { name: 'Analytics Svc',   status: 'warn', latency: '142ms', uptime: '99.72%', endpoint: 'analytics.sigat.go.id' },
  { name: 'WebSocket Hub',   status: 'ok',   latency: '5ms',   uptime: '99.95%', endpoint: 'ws.sigat.go.id' },
  { name: 'PostgreSQL + PostGIS', status: 'ok', latency: '4ms', uptime: '100%', endpoint: 'db-primary' },
  { name: 'Redis Cache',     status: 'ok',   latency: '1ms',   uptime: '100%',   endpoint: 'redis-01' },
  { name: 'MinIO Storage',   status: 'ok',   latency: '22ms',  uptime: '99.91%', endpoint: 'storage.sigat.go.id' },
];

const API_ENDPOINTS = [
  { method: 'GET',    path: '/api/v1/sensors',          calls: 14382, p95: '45ms',  status: 200 },
  { method: 'GET',    path: '/api/v1/sensors/:id/data', calls: 9211,  p95: '82ms',  status: 200 },
  { method: 'POST',   path: '/api/v1/measurements',     calls: 4102,  p95: '120ms', status: 201 },
  { method: 'GET',    path: '/api/v1/companies',        calls: 3318,  p95: '38ms',  status: 200 },
  { method: 'POST',   path: '/api/v1/auth/login',       calls: 891,   p95: '55ms',  status: 200 },
  { method: 'DELETE', path: '/api/v1/sensors/:id',      calls: 12,    p95: '200ms', status: 204 },
];

function MiniChart({ color }: { color: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current;
    const chart = new ChartJS(ctx, {
      type: 'line',
      data: {
        labels: Array.from({ length: 12 }, (_, i) => i),
        datasets: [{
          data: Array.from({ length: 12 }, () => 20 + Math.random() * 60),
          borderColor: color, borderWidth: 1.5,
          backgroundColor: color + '15', fill: true,
          tension: 0.4, pointRadius: 0,
        }],
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { enabled: false } }, scales: { x: { display: false }, y: { display: false } }, animation: false },
    });
    return () => chart.destroy();
  }, [color]);
  return <div style={{ position: 'relative', height: 40 }}><canvas ref={ref} /></div>;
}

export default function ServerPage() {
  const overallOk = SERVICES.filter(s => s.status === 'ok').length;
  const overallWarn = SERVICES.filter(s => s.status === 'warn').length;

  return (
    <div className="p-3 sm:p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
        <div>
          <h1 className="text-[18px] font-semibold text-slate-800">Server & API</h1>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">Monitoring infrastruktur dan performa API</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-mono font-semibold',
            overallWarn > 0 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200')}>
            {overallWarn > 0 ? <AlertTriangle size={11} /> : <CheckCircle size={11} />}
            {overallWarn > 0 ? `${overallWarn} peringatan` : 'Semua sistem normal'}
          </div>
          <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
            Live · update 5s
          </div>
        </div>
      </div>

      {/* Server Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        {SERVER_METRICS.map(m => {
          const color = m.status === 'ok' ? '#22C55E' : m.status === 'warn' ? '#F59E0B' : '#EF4444';
          const bg    = m.status === 'ok' ? 'border-emerald-100' : m.status === 'warn' ? 'border-amber-200' : 'border-red-200';
          return (
            <div key={m.label} className={cn('bg-white rounded-xl border shadow-sm p-3', bg)}>
              <p className="text-[9px] font-mono text-slate-400 mb-1">{m.label}</p>
              <p className="text-[16px] font-bold font-mono mb-1" style={{ color }}>{m.value}<span className="text-[9px] text-slate-400 font-mono ml-0.5">{m.unit}</span></p>
              <MiniChart color={color} />
            </div>
          );
        })}
      </div>

      {/* Services */}
      <Card padding={false}>
        <SectionHeader title="Status Layanan" icon={<Server size={13} />} subtitle={`${overallOk}/${SERVICES.length} ONLINE`} />
        <div className="divide-y divide-slate-50">
          {SERVICES.map(s => (
            <div key={s.name} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-4 py-3 hover:bg-slate-50/40 transition-colors">
              <div className={cn('w-2 h-2 rounded-full flex-shrink-0', s.status === 'ok' ? 'bg-emerald-400' : 'bg-amber-400 blink-alert')} />
              <span className="text-[12px] font-semibold text-slate-800 sm:w-40 sm:flex-shrink-0">{s.name}</span>
              <span className="text-[10px] font-mono text-slate-400 sm:flex-1 sm:truncate">{s.endpoint}</span>
              <div className="flex items-center gap-2 sm:ml-auto">
                <span className="text-[10px] font-mono text-slate-500 sm:w-16 sm:text-right">{s.latency}</span>
                <span className={cn('text-[10px] font-mono sm:w-16 sm:text-right font-semibold',
                s.uptime === '100%' ? 'text-emerald-600' : 'text-amber-600')}>{s.uptime}</span>
                <span className={cn('text-[9px] font-mono px-2 py-0.5 rounded-full border',
                  s.status === 'ok' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200')}>
                  {s.status === 'ok' ? 'ONLINE' : 'DEGRADED'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* API Endpoints */}
      <Card padding={false}>
        <SectionHeader title="API Endpoints" icon={<Globe size={13} />} subtitle="LAST 24H" />
        <div className="overflow-x-auto">
          <table className="w-full" style={{ minWidth: '540px' }}>
            <thead className="bg-slate-50/60 border-b border-slate-100">
              <tr>
                {['Method','Endpoint','Calls/hari','P95 Latency','Status'].map(h => (
                  <th key={h} className="text-[9px] font-mono text-slate-400 uppercase tracking-wider px-4 py-2.5 text-left whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {API_ENDPOINTS.map(ep => {
                const methodColor: Record<string, string> = { GET: 'bg-blue-50 text-blue-700 border-blue-200', POST: 'bg-emerald-50 text-emerald-700 border-emerald-200', DELETE: 'bg-red-50 text-red-700 border-red-200' };
                return (
                  <tr key={ep.path} className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-4 py-2.5">
                      <span className={cn('text-[9px] font-mono font-bold px-2 py-0.5 rounded border', methodColor[ep.method] ?? '')}>{ep.method}</span>
                    </td>
                    <td className="px-4 py-2.5 text-[11px] font-mono text-slate-600">{ep.path}</td>
                    <td className="px-4 py-2.5 text-[11px] font-mono font-semibold text-slate-800">{ep.calls.toLocaleString()}</td>
                    <td className="px-4 py-2.5 text-[11px] font-mono text-slate-600">{ep.p95}</td>
                    <td className="px-4 py-2.5">
                      <span className="text-[10px] font-mono font-semibold text-emerald-600">{ep.status}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
