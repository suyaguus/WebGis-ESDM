import { useState } from 'react';
import { FileText, Download, CheckCircle, Clock, BarChart3, TrendingDown, Shield, BookOpen } from 'lucide-react';
import { Card, SectionHeader } from '../../../components/ui';
import { MOCK_COMPANIES, KADIS_RECENT_REPORTS } from '../../../constants/mockData';
import { cn } from '../../../lib/utils';

const REPORT_TYPES = [
  { key: 'kepatuhan',   label: 'Laporan Kepatuhan',        desc: 'Kesesuaian regulasi & izin seluruh perusahaan',  icon: Shield,      color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
  { key: 'kuota',       label: 'Rekapitulasi Kuota',       desc: 'Penggunaan izin pengambilan air per perusahaan', icon: BarChart3,   color: 'bg-blue-50 border-blue-200 text-blue-700'         },
  { key: 'subsidence',  label: 'Laporan Subsidence',       desc: 'Tren penurunan tanah regional & per perusahaan', icon: TrendingDown,color: 'bg-red-50 border-red-200 text-red-700'           },
  { key: 'pengawasan',  label: 'Laporan Pengawasan',       desc: 'Ringkasan kegiatan pengawasan & rekomendasi',    icon: BookOpen,    color: 'bg-amber-50 border-amber-200 text-amber-700'     },
];

const PERIODS = ['Q1 2026', 'Q4 2025', 'Q3 2025', 'Q2 2025', 'Q1 2025', 'Tahunan 2025', 'Kustom'];

export default function KadisLaporanPage() {
  const [selectedType, setSelectedType] = useState('');
  const [period, setPeriod]             = useState('Q1 2026');
  const [format, setFormat]             = useState('PDF');
  const [selectedCompanies, setCompanies] = useState<string[]>(MOCK_COMPANIES.map(c => c.id));
  const [generating, setGenerating]     = useState(false);
  const [done, setDone]                 = useState(false);

  const handleGenerate = () => {
    if (!selectedType) return;
    setGenerating(true);
    setDone(false);
    setTimeout(() => { setGenerating(false); setDone(true); }, 2200);
  };

  const toggleCompany = (id: string) =>
    setCompanies(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);

  return (
    <div className="p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[18px] font-semibold text-slate-800">Laporan & Ekspor</h1>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">Generate laporan pengawasan · Provinsi Lampung</p>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Laporan Q1 2026', value: '4',  color: '#059669' },
          { label: 'Total Laporan',   value: '21', color: '#3B82F6' },
          { label: 'Perusahaan',      value: String(MOCK_COMPANIES.length), color: '#8B5CF6' },
          { label: 'Perlu Tindak Lanjut', value: '2', color: '#EF4444' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-100 shadow-sm px-4 py-3 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl" style={{ background: color }} />
            <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-1">{label}</p>
            <p className="text-[22px] font-bold font-mono" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: 'minmax(0,1fr) 300px' }}>
        {/* Left: Generator */}
        <div className="space-y-4">
          {/* Report type */}
          <Card padding={false}>
            <SectionHeader title="Pilih Jenis Laporan" icon={<FileText size={13} />} accent="#059669" />
            <div className="p-4 grid grid-cols-2 gap-3">
              {REPORT_TYPES.map(t => {
                const Icon = t.icon;
                return (
                  <button key={t.key} onClick={() => setSelectedType(t.key)}
                    className={cn('text-left p-3 rounded-xl border transition-all bg-white',
                      selectedType === t.key
                        ? 'border-emerald-300 ring-1 ring-emerald-200 shadow-sm'
                        : 'border-slate-100 hover:border-slate-200 hover:shadow-sm')}>
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

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">Periode</label>
                <select value={period} onChange={e => setPeriod(e.target.value)}
                  className="w-full text-[11px] font-mono border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-slate-700 focus:outline-none focus:border-emerald-400">
                  {PERIODS.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">Format Output</label>
                <div className="flex gap-2">
                  {['PDF', 'XLSX', 'CSV'].map(f => (
                    <button key={f} onClick={() => setFormat(f)}
                      className={cn('flex-1 py-2 text-[10px] font-mono font-semibold rounded-lg border transition-all',
                        format === f ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100')}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Company selector */}
            <div className="mb-4">
              <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
                Cakupan Perusahaan ({selectedCompanies.length}/{MOCK_COMPANIES.length} dipilih)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {MOCK_COMPANIES.map(c => (
                  <button key={c.id} onClick={() => toggleCompany(c.id)}
                    className={cn('text-[9px] font-mono font-semibold px-2 py-0.5 rounded-md border transition-all',
                      selectedCompanies.includes(c.id)
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100')}>
                    {c.name.replace('PT ', '')}
                  </button>
                ))}
              </div>
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                'Sertakan grafik tren',
                'Sertakan peta sebaran',
                'Sertakan histori kuota',
                'Kirim ke email dinas',
              ].map(o => (
                <label key={o} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked={o.includes('grafik') || o.includes('peta')} className="w-3 h-3 accent-emerald-600" />
                  <span className="text-[10px] text-slate-600">{o}</span>
                </label>
              ))}
            </div>

            <button onClick={handleGenerate} disabled={!selectedType || generating}
              className={cn('w-full py-2.5 text-[12px] font-semibold rounded-xl transition-all',
                selectedType && !generating
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed')}>
              {generating ? '⏳ Membuat laporan...' : done ? '✅ Laporan siap diunduh' : '📄 Generate Laporan'}
            </button>
          </Card>
        </div>

        {/* Right: Recent reports */}
        <Card padding={false} className="flex flex-col">
          <SectionHeader title="Laporan Terbaru" icon={<Download size={13} />} accent="#059669" subtitle={`${KADIS_RECENT_REPORTS.length} FILE`} />
          <div className="flex-1 divide-y divide-slate-50 overflow-y-auto">
            {KADIS_RECENT_REPORTS.map(r => (
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
                    <button className="text-[10px] text-emerald-600 hover:text-emerald-800 font-mono font-semibold">↓</button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex-shrink-0">
            <button className="text-[10px] text-emerald-600 hover:text-emerald-700 font-medium w-full text-center">
              Lihat semua laporan →
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
