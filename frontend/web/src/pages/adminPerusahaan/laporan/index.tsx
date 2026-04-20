import { useState } from 'react';
import { FileText, Download, CheckCircle, Clock, BarChart3, TrendingDown, Droplets, Shield } from 'lucide-react';
import { Card, SectionHeader } from '../../../components/ui';
import { MOCK_COMPANIES, COMPANY_SENSORS } from '../../../constants/mockData';
import { cn } from '../../../lib/utils';

const REPORT_TYPES = [
  { key: 'subsidence', label: 'Laporan Subsidence',    desc: 'Tren penurunan tanah per sensor',    icon: TrendingDown, color: 'bg-red-50 border-red-200 text-red-700'         },
  { key: 'water',      label: 'Laporan Muka Air',      desc: 'Fluktuasi level air tanah',           icon: Droplets,     color: 'bg-blue-50 border-blue-200 text-blue-700'       },
  { key: 'quota',      label: 'Laporan Kuota',         desc: 'Penggunaan izin pengambilan air',     icon: BarChart3,    color: 'bg-amber-50 border-amber-200 text-amber-700'   },
  { key: 'compliance', label: 'Laporan Kepatuhan',     desc: 'Kesesuaian regulasi dan izin',        icon: Shield,       color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
];

const RECENT_REPORTS = [
  { id: 'r1', name: 'Laporan Subsidence Q1 2026',       type: 'Subsidence', date: '15 Apr 2026', size: '2.4 MB', format: 'PDF',  status: 'done'       },
  { id: 'r2', name: 'Laporan Kuota Maret 2026',         type: 'Kuota',      date: '01 Apr 2026', size: '0.8 MB', format: 'XLSX', status: 'done'       },
  { id: 'r3', name: 'Laporan Muka Air Q1 2026',         type: 'Muka Air',   date: '31 Mar 2026', size: '1.9 MB', format: 'PDF',  status: 'done'       },
  { id: 'r4', name: 'Laporan Kepatuhan Feb 2026',       type: 'Kepatuhan',  date: '28 Feb 2026', size: '1.1 MB', format: 'PDF',  status: 'done'       },
  { id: 'r5', name: 'Ekspor Data Sensor Bulanan',       type: 'Custom',     date: '16 Apr 2026', size: '-',      format: 'CSV',  status: 'generating' },
];

export default function AdminLaporanPage() {
  const [selectedType, setSelectedType] = useState('');
  const [period, setPeriod]             = useState('Q1 2026');
  const [format, setFormat]             = useState('PDF');
  const [includeSensors, setInclude]    = useState<string[]>(COMPANY_SENSORS.slice(0, 3).map(s => s.code));
  const [generating, setGenerating]     = useState(false);
  const [done, setDone]                 = useState(false);

  const handleGenerate = () => {
    if (!selectedType) return;
    setGenerating(true);
    setDone(false);
    setTimeout(() => { setGenerating(false); setDone(true); }, 2000);
  };

  const toggleSensor = (code: string) =>
    setInclude(prev => prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]);

  const co = MOCK_COMPANIES[0];
  const pct = Math.round((co.quotaUsed / co.quota) * 100);

  return (
    <div className="p-3 md:p-5 space-y-3 md:space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[18px] font-semibold text-slate-800">Laporan & Ekspor</h1>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">Generate dan unduh laporan PT Maju Jaya Tbk</p>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Laporan Bulan Ini',   value: '3',      color: '#F59E0B' },
          { label: 'Total Unduhan',       value: '12',     color: '#3B82F6' },
          { label: 'Penggunaan Kuota',    value: `${pct}%`, color: pct >= 85 ? '#EF4444' : '#22C55E' },
          { label: 'Sensor Dilaporkan',   value: String(COMPANY_SENSORS.length), color: '#8B5CF6' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-100 shadow-sm px-4 py-3 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl" style={{ background: color }} />
            <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-1">{label}</p>
            <p className="text-[18px] md:text-[22px] font-bold font-mono" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
        {/* Left: Generator */}
        <div className="space-y-4">
          {/* Report type */}
          <Card padding={false}>
            <SectionHeader title="Pilih Jenis Laporan" icon={<FileText size={13} />} accent="#F59E0B" />
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {REPORT_TYPES.map(t => {
                const Icon = t.icon;
                return (
                  <button key={t.key} onClick={() => setSelectedType(t.key)}
                    className={cn('text-left p-3 rounded-xl border transition-all bg-white',
                      selectedType === t.key ? 'border-amber-300 ring-1 ring-amber-200 shadow-sm' : 'border-slate-100 hover:border-slate-200 hover:shadow-sm')}>
                    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center mb-2 border', t.color)}>
                      <Icon size={14} />
                    </div>
                    <p className="text-[12px] font-semibold text-slate-800 mb-0.5">{t.label}</p>
                    <p className="text-[9px] text-slate-400 font-mono leading-relaxed">{t.desc}</p>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Parameters */}
          <Card>
            <h3 className="text-[13px] font-semibold text-slate-800 mb-4">Parameter Laporan</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">Periode</label>
                <select value={period} onChange={e => setPeriod(e.target.value)}
                  className="w-full text-[11px] font-mono border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-slate-700 focus:outline-none focus:border-amber-400">
                  {['Q1 2026','Q4 2025','Q3 2025','Q2 2025','Q1 2025','Kustom'].map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">Format Output</label>
                <div className="flex gap-2">
                  {['PDF','XLSX','CSV'].map(f => (
                    <button key={f} onClick={() => setFormat(f)}
                      className={cn('flex-1 py-2 text-[10px] font-mono font-semibold rounded-lg border transition-all',
                        format === f ? 'bg-amber-500 text-white border-amber-500' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100')}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sensor selector */}
            <div className="mb-4">
              <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
                Sensor ({includeSensors.length}/{COMPANY_SENSORS.length} dipilih)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {COMPANY_SENSORS.map(s => (
                  <button key={s.code} onClick={() => toggleSensor(s.code)}
                    className={cn('text-[9px] font-mono font-semibold px-2 py-0.5 rounded-md border transition-all',
                      includeSensors.includes(s.code)
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100')}>
                    {s.code}
                  </button>
                ))}
              </div>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
              {['Sertakan grafik','Sertakan peta sensor','Sertakan histori pengukuran','Kirim ke email admin'].map(o => (
                <label key={o} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked={o.includes('grafik') || o.includes('histori')} className="w-3 h-3 accent-amber-500" />
                  <span className="text-[10px] text-slate-600">{o}</span>
                </label>
              ))}
            </div>

            <button onClick={handleGenerate} disabled={!selectedType || generating}
              className={cn('w-full py-2.5 text-[12px] font-semibold rounded-xl transition-all',
                selectedType && !generating ? 'bg-amber-500 text-white hover:bg-amber-600' : 'bg-slate-100 text-slate-400 cursor-not-allowed')}>
              {generating ? '⏳ Membuat laporan...' : done ? '✅ Laporan siap diunduh' : '📄 Generate Laporan'}
            </button>
          </Card>
        </div>

        {/* Right: Recent reports */}
        <Card padding={false} className="flex flex-col">
          <SectionHeader title="Laporan Terbaru" icon={<Download size={13} />} accent="#F59E0B" subtitle={`${RECENT_REPORTS.length} FILE`} />
          <div className="flex-1 divide-y divide-slate-50 overflow-y-auto">
            {RECENT_REPORTS.map(r => (
              <div key={r.id} className="px-4 py-3 hover:bg-slate-50/60 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <p className="text-[11px] font-semibold text-slate-700 leading-tight">{r.name}</p>
                  {r.status === 'done'
                    ? <CheckCircle size={12} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                    : <Clock       size={12} className="text-amber-500 flex-shrink-0 mt-0.5 animate-pulse" />}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono text-slate-400">{r.date}</span>
                    <span className="text-[9px] font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{r.format}</span>
                    {r.size !== '-' && <span className="text-[9px] font-mono text-slate-400">{r.size}</span>}
                  </div>
                  {r.status === 'done' && (
                    <button className="text-[10px] text-amber-600 hover:text-amber-800 font-mono font-semibold">↓</button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex-shrink-0">
            <button className="text-[10px] text-amber-600 hover:text-amber-700 font-medium w-full text-center">
              Lihat semua laporan →
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
