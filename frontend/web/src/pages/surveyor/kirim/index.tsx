import { useMemo, useState } from 'react';
import {
  Send,
  FileText,
  Search,
  CheckCircle2,
  Clock3,
  Upload,
  ArrowUpDown,
  ClipboardCheck,
} from 'lucide-react';
import { Card, SectionHeader } from '../../../components/ui';
import { SURVEYOR_MEASUREMENTS, SURVEYOR_PROFILE } from '../../../constants/surveyorData';
import { cn } from '../../../lib/utils';
import type { SurveyorMeasurement } from '../../../constants/surveyorData';

type SendStatus = 'draft' | 'ready' | 'sent';
type SortKey = 'sensorCode' | 'date' | 'status';

interface SubmissionItem {
  id: string;
  measurementId: string;
  sensorCode: string;
  date: string;
  submittedAt: string;
  status: SendStatus;
  dokumen: number;
  catatan: string;
}

const STATUS_LABEL: Record<SendStatus, string> = {
  draft: 'Draft',
  ready: 'Siap Kirim',
  sent: 'Terkirim',
};

const STATUS_STYLE: Record<SendStatus, string> = {
  draft: 'bg-slate-100 text-slate-600 border-slate-200',
  ready: 'bg-blue-50 text-blue-700 border-blue-200',
  sent: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const STATUS_WEIGHT: Record<SendStatus, number> = {
  draft: 0,
  ready: 1,
  sent: 2,
};

const INITIAL_SUBMISSIONS: SubmissionItem[] = SURVEYOR_MEASUREMENTS.slice(0, 5).map((m, idx) => ({
  id: `sub-${m.id}`,
  measurementId: m.id,
  sensorCode: m.sensorCode,
  date: m.date,
  submittedAt: m.submittedAt,
  status: idx === 0 ? 'ready' : idx === 1 ? 'sent' : 'draft',
  dokumen: m.fotoCount,
  catatan: m.catatan,
}));

function dateWeight(value: string): number {
  const parts = value.match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
  if (!parts) return 0;
  const day = Number(parts[1]);
  const mon = parts[2].toLowerCase();
  const year = Number(parts[3]);
  const monthMap: Record<string, number> = {
    jan: 0,
    feb: 1,
    mar: 2,
    apr: 3,
    mei: 4,
    jun: 5,
    jul: 6,
    agu: 7,
    sep: 8,
    okt: 9,
    nov: 10,
    des: 11,
  };
  return new Date(year, monthMap[mon] ?? 0, day).getTime();
}

export default function SurveyorKirimPage() {
  const [rows, setRows] = useState<SubmissionItem[]>(INITIAL_SUBMISSIONS);
  const [search, setSearch] = useState('');
  const [statusF, setStatusF] = useState<SendStatus | 'all'>('all');
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedId, setSelectedId] = useState<string>(INITIAL_SUBMISSIONS[0]?.id ?? '');
  const [sending, setSending] = useState(false);
  const [memo, setMemo] = useState('Mohon ditinjau, data lapangan hari ini sudah lengkap.');

  const filtered = useMemo(() => {
    let data = [...rows];

    if (statusF !== 'all') {
      data = data.filter((row) => row.status === statusF);
    }

    if (search) {
      const q = search.toLowerCase();
      data = data.filter((row) =>
        row.sensorCode.toLowerCase().includes(q) ||
        row.date.toLowerCase().includes(q),
      );
    }

    data.sort((a, b) => {
      if (sortKey === 'status') {
        const av = STATUS_WEIGHT[a.status];
        const bv = STATUS_WEIGHT[b.status];
        return sortAsc ? av - bv : bv - av;
      }

      if (sortKey === 'date') {
        const av = dateWeight(a.date);
        const bv = dateWeight(b.date);
        return sortAsc ? av - bv : bv - av;
      }

      const av = String(a[sortKey]);
      const bv = String(b[sortKey]);
      return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
    });

    return data;
  }, [rows, search, statusF, sortKey, sortAsc]);

  const selected = useMemo(
    () => rows.find((row) => row.id === selectedId) ?? filtered[0] ?? null,
    [rows, selectedId, filtered],
  );

  const summary = useMemo(
    () => ({
      total: rows.length,
      ready: rows.filter((row) => row.status === 'ready').length,
      sent: rows.filter((row) => row.status === 'sent').length,
      draft: rows.filter((row) => row.status === 'draft').length,
    }),
    [rows],
  );

  const sort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc((prev) => !prev);
      return;
    }
    setSortKey(key);
    setSortAsc(true);
  };

  const setStatus = (id: string, status: SendStatus) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, status } : row)));
  };

  const handleSend = () => {
    if (!selected || selected.status !== 'ready') return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setStatus(selected.id, 'sent');
    }, 1400);
  };

  const Th = ({ label, k }: { label: string; k: SortKey }) => (
    <th
      onClick={() => sort(k)}
      className="text-[9px] font-mono text-slate-400 uppercase tracking-wider px-4 py-3 text-left cursor-pointer hover:text-slate-600 whitespace-nowrap select-none"
    >
      <span className="flex items-center gap-1">
        {label}
        <ArrowUpDown size={9} className={sortKey === k ? 'text-blue-500' : 'text-slate-300'} />
      </span>
    </th>
  );

  return (
    <div className="p-3 md:p-5 space-y-3 md:space-y-4 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[18px] font-semibold text-slate-800">Kirim ke Super Admin</h1>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">Finalisasi paket laporan sebelum diteruskan ke Super Admin</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Paket', value: summary.total, color: '#3B82F6' },
          { label: 'Siap Kirim', value: summary.ready, color: '#2563EB' },
          { label: 'Sudah Terkirim', value: summary.sent, color: '#22C55E' },
          { label: 'Masih Draft', value: summary.draft, color: '#94A3B8' },
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
            title="Antrian Pengiriman"
            icon={<Send size={13} />}
            accent="#3B82F6"
            subtitle={`${filtered.length} ITEM`}
            action={
              <div className="relative">
                <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari sensor / tanggal"
                  className="pl-7 pr-3 py-1 text-[10px] font-mono border border-slate-200 rounded-lg bg-slate-50 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-400 w-44"
                />
              </div>
            }
          />

          <div className="px-4 py-2.5 border-b border-slate-100 flex items-center gap-1 flex-wrap bg-slate-50/50">
            {(['all', 'draft', 'ready', 'sent'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusF(s)}
                className={cn(
                  'text-[9px] font-mono px-2.5 py-0.5 rounded-full border transition-all',
                  statusF === s
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'text-slate-400 border-slate-200 hover:bg-slate-100',
                )}
              >
                {s === 'all' ? 'Semua' : STATUS_LABEL[s]}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full" style={{ minWidth: '620px' }}>
              <thead className="bg-slate-50/60 border-b border-slate-100">
                <tr>
                  <Th label="Sensor" k="sensorCode" />
                  <Th label="Tanggal" k="date" />
                  <th className="text-[9px] font-mono text-slate-400 uppercase tracking-wider px-4 py-3 text-left whitespace-nowrap">Dokumen</th>
                  <Th label="Status" k="status" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((row) => {
                  const active = selected?.id === row.id;
                  return (
                    <tr
                      key={row.id}
                      onClick={() => setSelectedId(row.id)}
                      className={cn('cursor-pointer transition-colors hover:bg-slate-50/60', active && 'bg-blue-50/40')}
                    >
                      <td className="px-4 py-3 text-[12px] font-bold font-mono text-slate-800">{row.sensorCode}</td>
                      <td className="px-4 py-3">
                        <p className="text-[10px] font-mono text-slate-500">{row.date}</p>
                        <p className="text-[9px] text-slate-400">{row.submittedAt}</p>
                      </td>
                      <td className="px-4 py-3 text-[10px] font-mono text-slate-600">{row.dokumen} lampiran</td>
                      <td className="px-4 py-3">
                        <span className={cn('text-[9px] font-mono px-2 py-0.5 rounded-full border', STATUS_STYLE[row.status])}>
                          {STATUS_LABEL[row.status]}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {selected ? (
          <Card padding={false}>
            <SectionHeader title="Review Pengiriman" icon={<ClipboardCheck size={13} />} accent="#3B82F6" subtitle={selected.sensorCode} />
            <div className="p-4 space-y-3.5">
              <div>
                <p className="text-[9px] font-mono text-slate-400">PIC Surveyor</p>
                <p className="text-[12px] font-semibold text-slate-800">{SURVEYOR_PROFILE.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="rounded-lg border border-slate-100 bg-white px-2.5 py-2">
                  <p className="text-[9px] font-mono text-slate-400">Tanggal</p>
                  <p className="text-[11px] font-semibold text-slate-700">{selected.date}</p>
                </div>
                <div className="rounded-lg border border-slate-100 bg-white px-2.5 py-2">
                  <p className="text-[9px] font-mono text-slate-400">Dokumen</p>
                  <p className="text-[11px] font-semibold text-slate-700">{selected.dokumen} file</p>
                </div>
              </div>

              <div>
                <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">Catatan Kirim</label>
                <textarea
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 text-[11px] border border-slate-200 rounded-lg bg-white text-slate-700 resize-none focus:outline-none focus:border-blue-400"
                />
              </div>

              <div className="space-y-2">
                {selected.status === 'draft' && (
                  <button
                    onClick={() => setStatus(selected.id, 'ready')}
                    className="w-full text-[11px] font-semibold rounded-lg px-3 py-2 border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 inline-flex items-center justify-center gap-1.5"
                  >
                    <Upload size={12} /> Tandai Siap Kirim
                  </button>
                )}

                {selected.status === 'ready' && (
                  <button
                    onClick={handleSend}
                    disabled={sending}
                    className={cn(
                      'w-full text-[11px] font-semibold rounded-lg px-3 py-2 inline-flex items-center justify-center gap-1.5',
                      sending ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700',
                    )}
                  >
                    <Send size={12} /> {sending ? 'Mengirim...' : 'Kirim ke Super Admin'}
                  </button>
                )}

                {selected.status === 'sent' && (
                  <div className="w-full text-[10px] font-mono rounded-lg px-3 py-2 border border-emerald-200 bg-emerald-50 text-emerald-700 inline-flex items-center justify-center gap-1.5">
                    <CheckCircle2 size={12} /> Paket sudah diterima Super Admin
                  </div>
                )}
              </div>

              <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5">
                <p className="text-[9px] font-mono text-slate-400 mb-1">Ringkasan Data</p>
                <p className="text-[10px] text-slate-600 leading-relaxed">{selected.catatan}</p>
              </div>

              <div className="text-[9px] font-mono text-slate-400 inline-flex items-center gap-1.5">
                <FileText size={11} /> Format kirim: paket JSON + lampiran foto
              </div>
            </div>
          </Card>
        ) : (
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm flex items-center justify-center" style={{ minHeight: 220 }}>
            <p className="text-[11px] text-slate-400 font-mono text-center">Pilih paket untuk review pengiriman</p>
          </div>
        )}
      </div>
    </div>
  );
}
