import { useState, useRef, useEffect } from 'react';
import { ClipboardList, Download } from 'lucide-react';
import { Chart as ChartJS, LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip } from 'chart.js';
import { Card, SectionHeader } from '../../../components/ui';
import { COMPANY_MEASUREMENTS, COMPANY_SENSORS, COMPANY_TREND_DATA } from '../../../constants/mockData';
import { cn, getSubsidenceColor } from '../../../lib/utils';

ChartJS.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip);

function MiniHistoryChart({ color, data }: { color: string; data: number[] }) {
  const ref   = useRef<HTMLCanvasElement>(null);
  const chart = useRef<ChartJS | null>(null);
  useEffect(() => {
    if (!ref.current) return;
    chart.current?.destroy();
    chart.current = new ChartJS(ref.current, {
      type: 'line',
      data: {
        labels: COMPANY_TREND_DATA.map(d => d.label),
        datasets: [{ data, borderColor: color, backgroundColor: color + '15', fill: true, tension: 0.4, pointRadius: 0, borderWidth: 1.5 }],
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { enabled: false } }, scales: { x: { display: false }, y: { display: false } }, animation: false },
    });
    return () => chart.current?.destroy();
  }, [color, data]);
  return <div style={{ position: 'relative', height: 36 }}><canvas ref={ref} /></div>;
}

export default function AdminHistoriPage() {
  const [selectedSensor, setSelectedSensor] = useState('all');
  const [period, setPeriod]                 = useState('12 Bulan');

  const histori = COMPANY_MEASUREMENTS.filter(m =>
    selectedSensor === 'all' || m.sensorCode === selectedSensor);

  return (
    <div className="p-3 md:p-5 space-y-3 md:space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[18px] font-semibold text-slate-800">Histori Pengukuran</h1>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">Riwayat data pengukuran lapangan</p>
        </div>
        <button className="px-3 md:px-4 py-2 bg-white border border-amber-200 text-amber-700 text-[12px] font-semibold rounded-xl hover:bg-amber-50 flex items-center gap-2 whitespace-nowrap">
          <Download size={13} /> Ekspor CSV
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2">
        <select value={selectedSensor} onChange={e => setSelectedSensor(e.target.value)}
          className="text-[11px] font-mono border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:border-amber-400">
          <option value="all">Semua Sensor</option>
          {COMPANY_SENSORS.map(s => <option key={s.id} value={s.code}>{s.code} — {s.location}</option>)}
        </select>
        <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
          {['1 Bulan','3 Bulan','6 Bulan','12 Bulan'].map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={cn('text-[10px] font-mono px-2.5 py-1 rounded-md transition-all',
                period===p ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700')}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Sensor sparkline cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {COMPANY_SENSORS.slice(0, 5).map(s => (
          <button key={s.id} onClick={() => setSelectedSensor(selectedSensor === s.code ? 'all' : s.code)}
            className={cn('bg-white rounded-xl border shadow-sm p-3 text-left transition-all hover:border-amber-300',
              selectedSensor === s.code ? 'border-amber-400 ring-1 ring-amber-300' : 'border-slate-100')}>
            <p className="text-[11px] font-bold font-mono text-slate-800 mb-0.5">{s.code}</p>
            <p className={cn('text-[10px] font-mono font-semibold', getSubsidenceColor(s.subsidence))}>
              {s.subsidence.toFixed(2)} cm/thn
            </p>
            <div className="mt-2">
              <MiniHistoryChart
                color={s.status === 'alert' ? '#EF4444' : s.subsidence <= -2.5 ? '#F59E0B' : '#22C55E'}
                data={COMPANY_TREND_DATA.map(d => d.subsidence + (Math.random() * 0.3 - 0.15))}
              />
            </div>
          </button>
        ))}
      </div>

      {/* History table */}
      <Card padding={false}>
        <SectionHeader title="Riwayat Data Pengukuran" icon={<ClipboardList size={13} />} accent="#F59E0B"
          subtitle={`${histori.length} ENTRI`} />
        <div className="overflow-x-auto">
          <table className="w-full" style={{ minWidth: '700px' }}>
            <thead className="bg-slate-50/60 border-b border-slate-100">
              <tr>
                {['Tanggal/Waktu','Sensor','Lokasi','Surveyor','Subsidence','Muka Air','Nilai Vertikal','Status'].map(h => (
                  <th key={h} className="text-[9px] font-mono text-slate-400 uppercase tracking-wider px-4 py-2.5 text-left whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {histori.map(m => (
                <tr key={m.id} className="hover:bg-slate-50/40 transition-colors">
                  <td className="px-4 py-2.5 text-[10px] font-mono text-slate-500 whitespace-nowrap">{m.submittedAt}</td>
                  <td className="px-4 py-2.5 text-[12px] font-bold font-mono text-slate-800">{m.sensorCode}</td>
                  <td className="px-4 py-2.5 text-[11px] text-slate-600">{m.location}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-[8px] font-bold text-amber-700 flex-shrink-0">{m.surveyorAvatar}</div>
                      <span className="text-[11px] text-slate-700">{m.surveyorName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={cn('text-[12px] font-semibold font-mono', getSubsidenceColor(m.subsidence))}>{m.subsidence.toFixed(2)}</span>
                    <span className="text-[9px] text-slate-400 font-mono ml-0.5">cm/thn</span>
                  </td>
                  <td className="px-4 py-2.5 text-[11px] font-mono text-slate-600">{m.waterLevel > 0 ? `${m.waterLevel} m` : '-'}</td>
                  <td className="px-4 py-2.5 text-[11px] font-mono text-slate-600">{m.verticalValue} mm</td>
                  <td className="px-4 py-2.5">
                    <span className={cn('text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full border',
                      m.status === 'verified' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : m.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200')}>
                      {m.status === 'verified' ? 'Verified' : m.status === 'rejected' ? 'Ditolak' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
