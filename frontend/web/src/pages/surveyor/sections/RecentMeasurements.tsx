import { FileText, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { Card, SectionHeader } from '../../../components/ui';
import { cn } from '../../../lib/utils';
import { SURVEYOR_MEASUREMENTS } from '../../../constants/surveyorData';
import { useAppStore } from '../../../store';
import type { MeasurementStatus } from '../../../constants/surveyorData';

function StatusBadge({ status }: { status: MeasurementStatus }) {
  if (status === 'verified')
    return (
      <span className="flex items-center gap-1 text-[9px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full">
        <CheckCircle2 size={9} /> Terverifikasi
      </span>
    );
  if (status === 'rejected')
    return (
      <span className="flex items-center gap-1 text-[9px] font-mono text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-full">
        <XCircle size={9} /> Ditolak
      </span>
    );
  return (
    <span className="flex items-center gap-1 text-[9px] font-mono text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full">
      <Clock size={9} /> Menunggu
    </span>
  );
}

export default function RecentMeasurements() {
  const { setActivePage } = useAppStore();
  const recent = SURVEYOR_MEASUREMENTS.slice(0, 5);

  return (
    <Card padding={false} className="flex flex-col">
      <SectionHeader
        title="Pengukuran Terbaru"
        subtitle={`${SURVEYOR_MEASUREMENTS.length} ENTRI`}
        icon={<FileText size={13} />}
        accent="#3B82F6"
      />
      <div className="flex-1 divide-y divide-slate-50 overflow-y-auto">
        {recent.map(m => (
          <div key={m.id} className={cn(
            'px-4 py-3 hover:bg-slate-50/60 transition-colors',
            m.status === 'rejected' && 'border-l-2 border-l-red-400',
          )}>
            <div className="flex items-center justify-between mb-1.5 gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-bold font-mono text-slate-800">{m.sensorCode}</span>
                <StatusBadge status={m.status} />
              </div>
              <span className="text-[9px] font-mono text-slate-400 flex-shrink-0">{m.date}</span>
            </div>
            <div className="flex items-center gap-3">
              {m.waterLevel !== 0 && (
                <span className="text-[10px] font-mono text-blue-600 font-semibold">
                  MAT: {m.waterLevel} m
                </span>
              )}
              {m.debit !== 0 && (
                <span className="text-[10px] font-mono text-slate-500">
                  {m.debit} m³/hr
                </span>
              )}
              <span className="text-[9px] text-slate-400 ml-auto">{m.submittedAt}</span>
            </div>
            {m.status === 'rejected' && m.rejectionNote && (
              <p className="mt-1.5 text-[9px] text-red-600 bg-red-50 border border-red-100 rounded px-2 py-1 font-mono">
                ✕ {m.rejectionNote}
              </p>
            )}
          </div>
        ))}
      </div>
      <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/50 flex-shrink-0">
        <button
          onClick={() => setActivePage('sv-laporan')}
          className="text-[11px] text-blue-600 hover:text-blue-700 font-medium w-full text-center"
        >
          Lihat semua riwayat →
        </button>
      </div>
    </Card>
  );
}
