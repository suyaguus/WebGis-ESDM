import { useState } from 'react';
import { FileText, Download, Calendar, Building2, CheckCircle, Clock } from 'lucide-react';
import { Card, SectionHeader, StatusPill } from '../../../components/ui';
import {
  faChartSimple,
  faGear,
  faSatelliteDish,
  faCheck,  
  faWater,
  faFile
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MOCK_COMPANIES } from '../../../constants/mockData';
import { cn } from '../../../lib/utils';

const REPORT_TYPES = [
  { key: 'subsidence', label: 'Laporan Subsidence', desc: 'Tren penurunan tanah per sensor & wilayah', icon: <FontAwesomeIcon icon={faFile} />, color: 'bg-red-50 border-red-200 text-red-700' },
  { key: 'water',      label: 'Laporan Muka Air',   desc: 'Fluktuasi level muka air tanah',           icon: <FontAwesomeIcon icon={faWater} />, color: 'bg-blue-50 border-blue-200 text-blue-700' },
  { key: 'quota',      label: 'Laporan Kuota',       desc: 'Penggunaan izin pengambilan air tanah',    icon: <FontAwesomeIcon icon={faChartSimple} />, color: 'bg-amber-50 border-amber-200 text-amber-700' },
  { key: 'compliance', label: 'Laporan Kepatuhan',   desc: 'Status kepatuhan per perusahaan',          icon: <FontAwesomeIcon icon={faCheck} />, color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
  { key: 'sensor',     label: 'Laporan Sensor',      desc: 'Status operasional dan histori sensor',    icon: <FontAwesomeIcon icon={faSatelliteDish} />, color: 'bg-purple-50 border-purple-200 text-purple-700' },
  { key: 'custom',     label: 'Laporan Kustom',      desc: 'Pilih parameter dan rentang sendiri',      icon: <FontAwesomeIcon icon={faGear} />, color: 'bg-slate-50 border-slate-200 text-slate-700' },
];

const RECENT_REPORTS = [
  { id: 'r1', name: 'Laporan Subsidence Q1 2026', type: 'Subsidence', generated: '15 Apr 2026', size: '2.4 MB', format: 'PDF', status: 'done' },
  { id: 'r2', name: 'Kepatuhan Kuota Maret 2026', type: 'Kuota', generated: '01 Apr 2026', size: '1.1 MB', format: 'XLSX', status: 'done' },
  { id: 'r3', name: 'Laporan Sensor Bulanan Mar',  type: 'Sensor',    generated: '31 Mar 2026', size: '3.8 MB', format: 'PDF', status: 'done' },
  { id: 'r4', name: 'Laporan Kepatuhan Feb 2026',  type: 'Kepatuhan', generated: '28 Feb 2026', size: '0.9 MB', format: 'PDF', status: 'done' },
  { id: 'r5', name: 'Ekspor Data GNSS Bulanan',    type: 'Custom',    generated: '15 Apr 2026', size: '-',      format: 'CSV', status: 'generating' },
];

export default function ReportsPage() {
  const [selectedType, setSelectedType] = useState('');
  const [company, setCompany]           = useState('all');
  const [period, setPeriod]             = useState('Q1 2026');
  const [format, setFormat]             = useState('PDF');
  const [generating, setGenerating]     = useState(false);
  const [done, setDone]                 = useState(false);

  const handleGenerate = () => {
    if (!selectedType) return;
    setGenerating(true);
    setDone(false);
    setTimeout(() => { setGenerating(false); setDone(true); }, 2200);
  };

  return (
    <div className="p-3 sm:p-5 space-y-4">
      <div>
        <h1 className="text-[18px] font-semibold text-slate-800">Laporan</h1>
        <p className="text-[11px] text-slate-400 font-mono mt-0.5">Generate dan unduh laporan sistem pemantauan</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        <div className="space-y-4">
          {/* Report type selector */}
          <Card padding={false}>
            <SectionHeader title="Pilih Jenis Laporan" icon={<FileText size={13} />} />
            <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {REPORT_TYPES.map(t => (
                <button key={t.key} onClick={() => setSelectedType(t.key)}
                  className={cn('text-left p-3 rounded-xl border transition-all',
                    selectedType === t.key ? 'border-cyan-300 ring-1 ring-cyan-200 bg-cyan-50/30' : `hover:shadow-sm bg-white border-slate-100`)}>
                  <span className="text-xl mb-2 block">{t.icon}</span>
                  <p className="text-[11px] font-semibold text-slate-800 mb-0.5">{t.label}</p>
                  <p className="text-[9px] text-slate-400 font-mono leading-relaxed">{t.desc}</p>
                </button>
              ))}
            </div>
          </Card>

          {/* Parameters */}
          <Card>
            <h3 className="text-[13px] font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Calendar size={13} className="text-cyan-600" /> Parameter Laporan
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">Periode</label>
                <select value={period} onChange={e => setPeriod(e.target.value)}
                  className="w-full text-[11px] font-mono border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-slate-700 focus:outline-none focus:border-cyan-400">
                  {['Q1 2026','Q4 2025','Q3 2025','Q2 2025','Q1 2025','Kustom'].map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">Perusahaan</label>
                <select value={company} onChange={e => setCompany(e.target.value)}
                  className="w-full text-[11px] font-mono border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-slate-700 focus:outline-none focus:border-cyan-400">
                  <option value="all">Semua Perusahaan</option>
                  {MOCK_COMPANIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">Format Output</label>
                <div className="flex gap-2">
                  {['PDF','XLSX','CSV'].map(f => (
                    <button key={f} onClick={() => setFormat(f)}
                      className={cn('flex-1 py-2 text-[10px] font-mono font-semibold rounded-lg border transition-all',
                        format === f ? 'bg-cyan-600 text-white border-cyan-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100')}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">Opsi Tambahan</label>
                <div className="space-y-1.5">
                  {['Sertakan grafik','Sertakan peta','Kirim ke email'].map(o => (
                    <label key={o} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-3 h-3 accent-cyan-600" />
                      <span className="text-[10px] text-slate-600">{o}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <button onClick={handleGenerate} disabled={!selectedType || generating}
                className={cn('w-full py-2.5 text-[12px] font-semibold rounded-xl transition-all',
                  selectedType && !generating ? 'bg-cyan-600 text-white hover:bg-cyan-700' : 'bg-slate-100 text-slate-400 cursor-not-allowed')}>
                {generating ? '⏳ Membuat laporan...' : done ? '✅ Laporan siap diunduh' : 'Generate Laporan'}
              </button>
            </div>
          </Card>
        </div>

        {/* Recent reports */}
        <Card padding={false} className="flex flex-col">
          <SectionHeader title="Laporan Terbaru" icon={<Download size={13} />} subtitle={`${RECENT_REPORTS.length} FILE`} />
          <div className="flex-1 divide-y divide-slate-50 overflow-y-auto">
            {RECENT_REPORTS.map(r => (
              <div key={r.id} className="px-4 py-3 hover:bg-slate-50/60 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-[11px] font-semibold text-slate-700 leading-tight">{r.name}</p>
                  {r.status === 'done'
                    ? <CheckCircle size={12} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                    : <Clock       size={12} className="text-amber-500 flex-shrink-0 mt-0.5 animate-pulse" />}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono text-slate-400">{r.generated}</span>
                    <span className="text-[9px] font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{r.format}</span>
                    {r.size !== '-' && <span className="text-[9px] font-mono text-slate-400">{r.size}</span>}
                  </div>
                  {r.status === 'done' && (
                    <button className="text-[10px] text-cyan-600 hover:text-cyan-800 font-mono font-medium">↓</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
