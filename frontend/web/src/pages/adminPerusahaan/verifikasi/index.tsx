import { useState } from 'react';
import { CheckSquare, Check, X, Eye, AlertTriangle } from 'lucide-react';
import { Card, SectionHeader, Badge } from '../../../components/ui';
import { COMPANY_MEASUREMENTS } from '../../../constants/mockData';
import { cn, getSubsidenceColor } from '../../../lib/utils';
import type { Measurement } from '../../../constants/mockData';

type FilterStatus = 'all' | Measurement['status'];

const STATUS_CONFIG: Record<Measurement['status'], { label: string; color: string; bg: string }> = {
  pending:  { label: 'Menunggu',   color: 'text-amber-700',  bg: 'bg-amber-50  border-amber-200'   },
  verified: { label: 'Diverifikasi', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  rejected: { label: 'Ditolak',    color: 'text-red-700',    bg: 'bg-red-50     border-red-200'     },
  draft:    { label: 'Draft',      color: 'text-slate-600',  bg: 'bg-slate-100  border-slate-200'   },
};

const KONDISI_LABEL: Record<Measurement['kondisiFisik'], string> = {
  baik:         'Baik',
  rusak_ringan: 'Rusak Ringan',
  rusak_berat:  'Rusak Berat',
};

const KONDISI_COLOR: Record<Measurement['kondisiFisik'], string> = {
  baik:         'text-emerald-700 bg-emerald-50 border-emerald-200',
  rusak_ringan: 'text-amber-700 bg-amber-50 border-amber-200',
  rusak_berat:  'text-red-700 bg-red-50 border-red-200',
};

function MeasurementRow({ m, onAction }: { m: Measurement; onAction: (id: string, action: 'verify' | 'reject') => void }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_CONFIG[m.status];

  return (
    <>
      <tr className={cn('hover:bg-slate-50/60 transition-colors', m.status === 'pending' && 'bg-amber-50/20')}>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
              {m.surveyorAvatar}
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-800">{m.surveyorName}</p>
              <p className="text-[9px] font-mono text-slate-400">{m.submittedAt}</p>
            </div>
          </div>
        </td>
        <td className="px-4 py-3">
          <p className="text-[12px] font-bold font-mono text-slate-800">{m.sensorCode}</p>
          <p className="text-[10px] text-slate-500">{m.location}</p>
        </td>
        <td className="px-4 py-3">
          <span className={cn('text-[12px] font-semibold font-mono', getSubsidenceColor(m.subsidence))}>{m.subsidence.toFixed(2)}</span>
          <span className="text-[9px] text-slate-400 font-mono ml-0.5">cm/thn</span>
        </td>
        <td className="px-4 py-3">
          <span className="text-[11px] font-mono text-slate-700">{m.waterLevel > 0 ? `${m.waterLevel} m` : '-'}</span>
        </td>
        <td className="px-4 py-3">
          <span className={cn('text-[9px] font-mono font-medium px-2 py-0.5 rounded-full border', KONDISI_COLOR[m.kondisiFisik])}>
            {KONDISI_LABEL[m.kondisiFisik]}
          </span>
        </td>
        <td className="px-4 py-3">
          <span className={cn('text-[9px] font-mono font-semibold flex items-center gap-1', cfg.color)}>
            {m.status === 'pending' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
            {cfg.label}
          </span>
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono text-slate-500">{m.fotoCount} foto</span>
          </div>
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-1.5">
            <button onClick={() => setExpanded(p => !p)}
              className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
              <Eye size={12} className="text-slate-500" />
            </button>
            {m.status === 'pending' && (
              <>
                <button onClick={() => onAction(m.id, 'verify')}
                  className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center hover:bg-emerald-100 transition-colors">
                  <Check size={12} className="text-emerald-600" />
                </button>
                <button onClick={() => onAction(m.id, 'reject')}
                  className="w-7 h-7 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center hover:bg-red-100 transition-colors">
                  <X size={12} className="text-red-600" />
                </button>
              </>
            )}
          </div>
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={8} className="px-4 pb-3">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-1">Catatan Surveyor</p>
                  <p className="text-[11px] text-slate-700 leading-relaxed">{m.catatan || 'Tidak ada catatan'}</p>
                </div>
                <div>
                  <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-1">Detail Pengukuran</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]"><span className="text-slate-400 font-mono">Nilai Vertikal</span><span className="font-mono font-semibold">{m.verticalValue} mm</span></div>
                    {m.verifiedAt && <div className="flex justify-between text-[10px]"><span className="text-slate-400 font-mono">Diverifikasi</span><span className="font-mono">{m.verifiedAt}</span></div>}
                  </div>
                </div>
                <div>
                  <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-2">Foto Lapangan</p>
                  <div className="grid grid-cols-4 gap-1.5">
                    {Array.from({ length: m.fotoCount }).map((_, i) => (
                      <div key={i} className="aspect-square bg-slate-200 rounded-lg flex items-center justify-center">
                        <span className="text-[9px] text-slate-500 font-mono">{i+1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function AdminVerifikasiPage() {
  const [filter, setFilter]       = useState<FilterStatus>('all');
  const [measurements, setMeasurements] = useState(COMPANY_MEASUREMENTS);

  const handleAction = (id: string, action: 'verify' | 'reject') => {
    setMeasurements(prev => prev.map(m =>
      m.id === id ? { ...m, status: action === 'verify' ? 'verified' : 'rejected', verifiedAt: '08:' + Math.floor(Math.random()*60).toString().padStart(2,'0') + ' WIB' } : m
    ));
  };

  const filtered = measurements.filter(m => filter === 'all' || m.status === filter);
  const pending  = measurements.filter(m => m.status === 'pending').length;

  return (
    <div className="p-3 md:p-5 space-y-3 md:space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[18px] font-semibold text-slate-800">Verifikasi Data</h1>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">Review pengukuran lapangan dari surveyor</p>
        </div>
      </div>

      {/* Pending alert */}
      {pending > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-0 justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle size={16} className="text-amber-600 flex-shrink-0" />
            <div>
              <p className="text-[12px] font-semibold text-amber-800">{pending} data pengukuran menunggu verifikasi</p>
              <p className="text-[11px] text-amber-600">Segera verifikasi untuk memastikan akurasi data sensor</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => measurements.filter(m=>m.status==='pending').forEach(m=>handleAction(m.id,'verify'))}
              className="px-3 py-1.5 bg-emerald-600 text-white text-[11px] font-semibold rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-1.5">
              <Check size={12} /> Setujui Semua
            </button>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Data',    value: measurements.length,                                    color: '#F59E0B', bg: 'bg-amber-50  border-amber-200'   },
          { label: 'Menunggu',      value: measurements.filter(m=>m.status==='pending').length,    color: '#F59E0B', bg: 'bg-amber-50  border-amber-200'   },
          { label: 'Diverifikasi',  value: measurements.filter(m=>m.status==='verified').length,   color: '#22C55E', bg: 'bg-emerald-50 border-emerald-200' },
          { label: 'Ditolak',       value: measurements.filter(m=>m.status==='rejected').length,   color: '#EF4444', bg: 'bg-red-50     border-red-200'     },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={cn('rounded-xl border px-4 py-3', bg)}>
            <p className="text-[9px] font-mono text-slate-400 uppercase mb-1">{label}</p>
            <p className="text-[18px] md:text-[22px] font-bold font-mono" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <Card padding={false}>
        <div className="flex flex-wrap items-center gap-2 px-3 md:px-4 py-3 border-b border-slate-100 flex-shrink-0">
          <span className="text-[13px] font-semibold text-slate-800 flex items-center gap-1.5">
            <CheckSquare size={14} className="text-amber-600" /> Data Pengukuran
          </span>
          <div className="flex gap-1 ml-auto">
            {(['all','pending','verified','rejected'] as const).map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={cn('text-[9px] font-mono px-2.5 py-1 rounded-full border transition-all',
                  filter===s ? 'bg-amber-50 text-amber-700 border-amber-200' : 'text-slate-400 border-transparent hover:bg-slate-50')}>
                {s==='all'?'Semua':STATUS_CONFIG[s as Measurement['status']]?.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full" style={{ minWidth: '760px' }}>
            <thead className="bg-slate-50/60 border-b border-slate-100">
              <tr>
                {['Surveyor','Sensor','Subsidence','Muka Air','Kondisi','Status','Foto','Aksi'].map(h => (
                  <th key={h} className="text-[9px] font-mono text-slate-400 uppercase tracking-wider px-4 py-2.5 text-left whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(m => <MeasurementRow key={m.id} m={m} onAction={handleAction} />)}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
