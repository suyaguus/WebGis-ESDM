import { useMemo, useState } from 'react';
import { ClipboardList, Search, CircleDashed, CheckCircle2, Clock3, XCircle } from 'lucide-react';
import { Card, SectionHeader } from '../../../components/ui';
import { COMPANY_MEASUREMENTS } from '../../../constants/mockData';
import { cn, getSubsidenceColor } from '../../../lib/utils';

type SubmissionStatus = 'pending' | 'verified' | 'rejected';

interface SubmissionItem {
  id: string;
  title: string;
  sensorCode: string;
  surveyorName: string;
  submittedAt: string;
  status: SubmissionStatus;
  note: string;
  subsidence: number;
  location: string;
}

const STATUS_TEXT: Record<SubmissionStatus, string> = {
  pending: 'Menunggu',
  verified: 'Disetujui',
  rejected: 'Revisi',
};

const STATUS_CLASS: Record<SubmissionStatus, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  verified: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
};

const STATUS_ICON = {
  pending: Clock3,
  verified: CheckCircle2,
  rejected: XCircle,
} satisfies Record<SubmissionStatus, typeof Clock3>;

const INITIAL_ITEMS: SubmissionItem[] = COMPANY_MEASUREMENTS.map((measurement) => {
  const status: SubmissionStatus =
    measurement.status === 'verified' ? 'verified' : measurement.status === 'rejected' ? 'rejected' : 'pending';
  return {
    id: measurement.id,
    title: `Pengajuan ${measurement.sensorCode}`,
    sensorCode: measurement.sensorCode,
    surveyorName: measurement.surveyorName,
    submittedAt: measurement.submittedAt,
    status,
    note: measurement.catatan || 'Tidak ada catatan.',
    subsidence: measurement.subsidence,
    location: measurement.location,
  };
});

function progressValue(items: SubmissionItem[]): number {
  if (items.length === 0) return 0;
  const done = items.filter((item) => item.status === 'verified').length;
  return Math.round((done / items.length) * 100);
}

export default function AdminStatusPage() {
  const [rows] = useState<SubmissionItem[]>(INITIAL_ITEMS);
  const [search, setSearch] = useState('');
  const [statusF, setStatusF] = useState<SubmissionStatus | 'all'>('all');
  const [selectedId, setSelectedId] = useState<string>(INITIAL_ITEMS[0]?.id ?? '');

  const filtered = useMemo(() => {
    let data = [...rows];

    if (statusF !== 'all') {
      data = data.filter((item) => item.status === statusF);
    }

    if (search) {
      const q = search.toLowerCase();
      data = data.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.sensorCode.toLowerCase().includes(q) ||
          item.surveyorName.toLowerCase().includes(q),
      );
    }

    return data;
  }, [rows, search, statusF]);

  const selected = useMemo(
    () => rows.find((item) => item.id === selectedId) ?? filtered[0] ?? null,
    [rows, selectedId, filtered],
  );

  const summary = useMemo(
    () => ({
      total: rows.length,
      pending: rows.filter((item) => item.status === 'pending').length,
      verified: rows.filter((item) => item.status === 'verified').length,
      rejected: rows.filter((item) => item.status === 'rejected').length,
      completion: progressValue(rows),
    }),
    [rows],
  );

  return (
    <div className="p-3 md:p-5 space-y-3 md:space-y-4">
      <div>
        <h1 className="text-[18px] font-semibold text-slate-800">Status Pengajuan</h1>
        <p className="text-[11px] text-slate-400 font-mono mt-0.5">Pantau progres pengajuan data dan dokumen lapangan</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { label: 'Total Pengajuan', value: summary.total, color: '#F59E0B' },
          { label: 'Menunggu', value: summary.pending, color: '#F59E0B' },
          { label: 'Disetujui', value: summary.verified, color: '#22C55E' },
          { label: 'Revisi', value: summary.rejected, color: '#EF4444' },
          { label: 'Progress', value: `${summary.completion}%`, color: '#3B82F6' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-100 shadow-sm px-4 py-3 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl" style={{ background: color }} />
            <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-1">{label}</p>
            <p className="text-[20px] font-bold font-mono" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
        <Card padding={false}>
          <SectionHeader
            title="Daftar Pengajuan"
            icon={<ClipboardList size={13} />}
            accent="#F59E0B"
            subtitle={`${filtered.length} ITEM`}
            action={
              <div className="relative">
                <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari pengajuan"
                  className="pl-7 pr-3 py-1 text-[10px] font-mono border border-slate-200 rounded-lg bg-slate-50 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-amber-400 w-44"
                />
              </div>
            }
          />

          <div className="px-4 py-2.5 border-b border-slate-100 flex items-center gap-1 flex-wrap bg-slate-50/50">
            {(['all', 'pending', 'verified', 'rejected'] as const).map((s) => {
              const Icon = s === 'all' ? CircleDashed : STATUS_ICON[s];
              return (
                <button
                  key={s}
                  onClick={() => setStatusF(s)}
                  className={cn(
                    'text-[9px] font-mono px-2.5 py-0.5 rounded-full border transition-all inline-flex items-center gap-1',
                    statusF === s
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'text-slate-400 border-slate-200 hover:bg-slate-100',
                  )}
                >
                  <Icon size={10} />
                  {s === 'all' ? 'Semua' : STATUS_TEXT[s]}
                </button>
              );
            })}
          </div>

          <div className="divide-y divide-slate-50">
            {filtered.map((item) => {
              const Icon = STATUS_ICON[item.status];
              const active = selected?.id === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={cn(
                    'w-full px-4 py-3 text-left hover:bg-slate-50/60 transition-colors',
                    active && 'bg-amber-50/30',
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[12px] font-semibold text-slate-800">{item.title}</p>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                        {item.sensorCode} • {item.surveyorName}
                      </p>
                    </div>
                    <span className={cn('text-[9px] font-mono px-2 py-0.5 rounded-full border inline-flex items-center gap-1', STATUS_CLASS[item.status])}>
                      <Icon size={9} />
                      {STATUS_TEXT[item.status]}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full',
                        item.status === 'verified'
                          ? 'bg-emerald-500'
                          : item.status === 'rejected'
                            ? 'bg-red-500'
                            : 'bg-amber-500',
                      )}
                      style={{ width: item.status === 'verified' ? '100%' : item.status === 'rejected' ? '40%' : '70%' }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {selected ? (
          <Card padding={false}>
            <SectionHeader title="Detail Status" icon={<Clock3 size={13} />} accent="#F59E0B" subtitle={selected.sensorCode} />
            <div className="p-4 space-y-3.5">
              <div className="rounded-lg border border-slate-100 bg-white px-3 py-2.5">
                <p className="text-[9px] font-mono text-slate-400">Judul</p>
                <p className="text-[12px] font-semibold text-slate-800">{selected.title}</p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="rounded-lg border border-slate-100 bg-white px-2.5 py-2">
                  <p className="text-[9px] font-mono text-slate-400">Surveyor</p>
                  <p className="text-[11px] font-semibold text-slate-700">{selected.surveyorName}</p>
                </div>
                <div className="rounded-lg border border-slate-100 bg-white px-2.5 py-2">
                  <p className="text-[9px] font-mono text-slate-400">Submitted</p>
                  <p className="text-[11px] font-semibold font-mono text-slate-700">{selected.submittedAt}</p>
                </div>
                <div className="rounded-lg border border-slate-100 bg-white px-2.5 py-2">
                  <p className="text-[9px] font-mono text-slate-400">Lokasi</p>
                  <p className="text-[11px] font-semibold text-slate-700">{selected.location}</p>
                </div>
                <div className="rounded-lg border border-slate-100 bg-white px-2.5 py-2">
                  <p className="text-[9px] font-mono text-slate-400">Subsidence</p>
                  <p className={cn('text-[11px] font-semibold font-mono', getSubsidenceColor(selected.subsidence))}>
                    {selected.subsidence.toFixed(2)} cm/thn
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5">
                <p className="text-[9px] font-mono text-slate-400 mb-1">Catatan Surveyor</p>
                <p className="text-[10px] text-slate-600 leading-relaxed">{selected.note}</p>
              </div>

              <div className="rounded-lg border border-slate-100 bg-white px-3 py-2.5">
                <p className="text-[9px] font-mono text-slate-400 mb-2">Timeline</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-500">Pengajuan dibuat</span>
                    <span className="font-mono text-slate-700">{selected.submittedAt}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-500">Review admin perusahaan</span>
                    <span className="font-mono text-slate-700">
                      {selected.status === 'pending' ? 'Sedang proses' : selected.status === 'verified' ? 'Disetujui' : 'Perlu revisi'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-500">Sinkronisasi ke super admin</span>
                    <span className="font-mono text-slate-700">{selected.status === 'verified' ? 'Siap kirim' : '-'}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm flex items-center justify-center" style={{ minHeight: 220 }}>
            <p className="text-[11px] text-slate-400 font-mono text-center">Pilih data untuk melihat detail status</p>
          </div>
        )}
      </div>
    </div>
  );
}
