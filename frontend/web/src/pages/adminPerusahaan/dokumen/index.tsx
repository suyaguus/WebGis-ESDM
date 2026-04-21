import { useMemo, useState } from 'react';
import {
  FileBadge,
  Search,
  ArrowUpDown,
  Upload,
  Check,
  Clock3,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import { Card, SectionHeader } from '../../../components/ui';
import { COMPANY_SENSORS } from '../../../constants/mockData';
import { cn } from '../../../lib/utils';

type DocStatus = 'draft' | 'review' | 'complete' | 'rejected';
type SortKey = 'sensorCode' | 'updatedAt' | 'status';

interface DocumentItem {
  id: string;
  sensorCode: string;
  location: string;
  type: 'water' | 'gnss';
  required: number;
  uploaded: number;
  status: DocStatus;
  updatedAt: string;
  note: string;
}

const STATUS_LABEL: Record<DocStatus, string> = {
  draft: 'Draft',
  review: 'Review',
  complete: 'Lengkap',
  rejected: 'Ditolak',
};

const STATUS_STYLE: Record<DocStatus, string> = {
  draft: 'bg-slate-100 text-slate-600 border-slate-200',
  review: 'bg-blue-50 text-blue-700 border-blue-200',
  complete: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
};

const STATUS_WEIGHT: Record<DocStatus, number> = {
  draft: 0,
  review: 1,
  complete: 2,
  rejected: 3,
};

const INITIAL_DOCS: DocumentItem[] = [
  {
    id: 'doc1',
    sensorCode: 'SW-007',
    location: 'Rajabasa',
    type: 'water',
    required: 5,
    uploaded: 5,
    status: 'review',
    updatedAt: '08:22 WIB',
    note: 'Form lapangan, foto panel, dan bukti sampling sudah lengkap.',
  },
  {
    id: 'doc2',
    sensorCode: 'GN-022',
    location: 'Tanjung Karang',
    type: 'gnss',
    required: 4,
    uploaded: 2,
    status: 'draft',
    updatedAt: '08:03 WIB',
    note: 'Masih kurang foto koordinat dan checklist perangkat.',
  },
  {
    id: 'doc3',
    sensorCode: 'SW-021',
    location: 'Panjang',
    type: 'water',
    required: 5,
    uploaded: 5,
    status: 'complete',
    updatedAt: 'Kemarin',
    note: 'Dokumen disetujui dan siap dimasukkan ke laporan bulanan.',
  },
  {
    id: 'doc4',
    sensorCode: 'GN-055',
    location: 'Tanjung Seneng',
    type: 'gnss',
    required: 4,
    uploaded: 4,
    status: 'rejected',
    updatedAt: '2 hari lalu',
    note: 'File foto blur, diminta upload ulang untuk verifikasi.',
  },
];

function parseClockText(value: string): number {
  const match = value.match(/(\d{1,2}):(\d{2})/);
  if (!match) return 0;
  return Number(match[1]) * 60 + Number(match[2]);
}

export default function AdminDokumenPage() {
  const [rows, setRows] = useState<DocumentItem[]>(INITIAL_DOCS);
  const [search, setSearch] = useState('');
  const [statusF, setStatusF] = useState<DocStatus | 'all'>('all');
  const [sortKey, setSortKey] = useState<SortKey>('updatedAt');
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedId, setSelectedId] = useState<string>(INITIAL_DOCS[0]?.id ?? '');

  const filtered = useMemo(() => {
    let data = [...rows];

    if (statusF !== 'all') {
      data = data.filter((row) => row.status === statusF);
    }

    if (search) {
      const q = search.toLowerCase();
      data = data.filter((row) =>
        row.sensorCode.toLowerCase().includes(q) || row.location.toLowerCase().includes(q),
      );
    }

    data.sort((a, b) => {
      if (sortKey === 'status') {
        const av = STATUS_WEIGHT[a.status];
        const bv = STATUS_WEIGHT[b.status];
        return sortAsc ? av - bv : bv - av;
      }
      if (sortKey === 'updatedAt') {
        const av = parseClockText(a.updatedAt);
        const bv = parseClockText(b.updatedAt);
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
      review: rows.filter((row) => row.status === 'review').length,
      complete: rows.filter((row) => row.status === 'complete').length,
      rejected: rows.filter((row) => row.status === 'rejected').length,
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

  const updateStatus = (id: string, status: DocStatus) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, status, updatedAt: '09:11 WIB' } : row)));
  };

  const addOneAttachment = (id: string) => {
    setRows((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;
        const next = Math.min(row.required, row.uploaded + 1);
        return {
          ...row,
          uploaded: next,
          status: next >= row.required ? 'review' : row.status,
          updatedAt: '09:10 WIB',
        };
      }),
    );
  };

  const Th = ({ label, k }: { label: string; k: SortKey }) => (
    <th
      onClick={() => sort(k)}
      className="text-[9px] font-mono text-slate-400 uppercase tracking-wider px-4 py-3 text-left cursor-pointer hover:text-slate-600 whitespace-nowrap select-none"
    >
      <span className="flex items-center gap-1">
        {label}
        <ArrowUpDown size={9} className={sortKey === k ? 'text-amber-500' : 'text-slate-300'} />
      </span>
    </th>
  );

  return (
    <div className="p-3 md:p-5 space-y-3 md:space-y-4">
      <div>
        <h1 className="text-[18px] font-semibold text-slate-800">Pengajuan Dokumen</h1>
        <p className="text-[11px] text-slate-400 font-mono mt-0.5">Monitoring kelengkapan berkas per sensor</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Sensor', value: summary.total, color: '#F59E0B' },
          { label: 'Siap Review', value: summary.review, color: '#3B82F6' },
          { label: 'Lengkap', value: summary.complete, color: '#22C55E' },
          { label: 'Ditolak', value: summary.rejected, color: '#EF4444' },
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
            title="Daftar Berkas Sensor"
            icon={<FileBadge size={13} />}
            accent="#F59E0B"
            subtitle={`${filtered.length} SENSOR`}
            action={
              <div className="relative">
                <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari sensor / lokasi"
                  className="pl-7 pr-3 py-1 text-[10px] font-mono border border-slate-200 rounded-lg bg-slate-50 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-amber-400 w-44"
                />
              </div>
            }
          />

          <div className="px-4 py-2.5 border-b border-slate-100 flex items-center gap-1 flex-wrap bg-slate-50/50">
            {(['all', 'draft', 'review', 'complete', 'rejected'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusF(s)}
                className={cn(
                  'text-[9px] font-mono px-2.5 py-0.5 rounded-full border transition-all',
                  statusF === s
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'text-slate-400 border-slate-200 hover:bg-slate-100',
                )}
              >
                {s === 'all' ? 'Semua' : STATUS_LABEL[s]}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full" style={{ minWidth: '640px' }}>
              <thead className="bg-slate-50/60 border-b border-slate-100">
                <tr>
                  <Th label="Sensor" k="sensorCode" />
                  <th className="text-[9px] font-mono text-slate-400 uppercase tracking-wider px-4 py-3 text-left whitespace-nowrap">Lokasi</th>
                  <th className="text-[9px] font-mono text-slate-400 uppercase tracking-wider px-4 py-3 text-left whitespace-nowrap">Progress</th>
                  <Th label="Status" k="status" />
                  <Th label="Update" k="updatedAt" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((row) => {
                  const active = selected?.id === row.id;
                  return (
                    <tr
                      key={row.id}
                      onClick={() => setSelectedId(row.id)}
                      className={cn('cursor-pointer transition-colors hover:bg-slate-50/60', active && 'bg-amber-50/30')}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {row.status === 'rejected' && <AlertTriangle size={12} className="text-red-500" />}
                          <p className="text-[12px] font-bold font-mono text-slate-800">{row.sensorCode}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[11px] text-slate-600">{row.location}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-amber-500"
                              style={{ width: `${Math.round((row.uploaded / row.required) * 100)}%` }}
                            />
                          </div>
                          <span className="text-[9px] font-mono text-slate-500">{row.uploaded}/{row.required}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn('text-[9px] font-mono px-2 py-0.5 rounded-full border', STATUS_STYLE[row.status])}>
                          {STATUS_LABEL[row.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[10px] font-mono text-slate-400">{row.updatedAt}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {selected ? (
          <Card padding={false}>
            <SectionHeader title="Detail Dokumen" icon={<FileText size={13} />} accent="#F59E0B" subtitle={selected.sensorCode} />
            <div className="p-4 space-y-3.5">
              <div>
                <p className="text-[9px] font-mono text-slate-400">Lokasi</p>
                <p className="text-[12px] font-semibold text-slate-800">{selected.location}</p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="rounded-lg border border-slate-100 bg-white px-2.5 py-2">
                  <p className="text-[9px] font-mono text-slate-400">Tipe</p>
                  <p className="text-[11px] font-semibold text-slate-700">{selected.type === 'water' ? 'Air Tanah' : 'GNSS'}</p>
                </div>
                <div className="rounded-lg border border-slate-100 bg-white px-2.5 py-2">
                  <p className="text-[9px] font-mono text-slate-400">Progress</p>
                  <p className="text-[11px] font-semibold font-mono text-slate-700">{selected.uploaded}/{selected.required}</p>
                </div>
              </div>

              <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5">
                <p className="text-[9px] font-mono text-slate-400 mb-1">Catatan</p>
                <p className="text-[10px] text-slate-600 leading-relaxed">{selected.note}</p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => addOneAttachment(selected.id)}
                  disabled={selected.uploaded >= selected.required}
                  className={cn(
                    'w-full text-[11px] font-semibold rounded-lg px-3 py-2 inline-flex items-center justify-center gap-1.5',
                    selected.uploaded >= selected.required
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-amber-500 text-white hover:bg-amber-600',
                  )}
                >
                  <Upload size={12} /> Tambah Lampiran
                </button>

                {selected.status !== 'complete' && (
                  <button
                    onClick={() => updateStatus(selected.id, 'complete')}
                    className="w-full text-[11px] font-semibold rounded-lg px-3 py-2 border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 inline-flex items-center justify-center gap-1.5"
                  >
                    <Check size={12} /> Tandai Lengkap
                  </button>
                )}

                {selected.status !== 'review' && (
                  <button
                    onClick={() => updateStatus(selected.id, 'review')}
                    className="w-full text-[11px] font-semibold rounded-lg px-3 py-2 border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 inline-flex items-center justify-center gap-1.5"
                  >
                    <Clock3 size={12} /> Kirim untuk Review
                  </button>
                )}

                {selected.status !== 'rejected' && (
                  <button
                    onClick={() => updateStatus(selected.id, 'rejected')}
                    className="w-full text-[11px] font-semibold rounded-lg px-3 py-2 border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 inline-flex items-center justify-center gap-1.5"
                  >
                    <AlertTriangle size={12} /> Tandai Revisi
                  </button>
                )}
              </div>

              <div className="pt-1 border-t border-slate-100">
                <p className="text-[9px] font-mono text-slate-400 mb-1">Sensor Aktif Perusahaan</p>
                <div className="flex flex-wrap gap-1">
                  {COMPANY_SENSORS.slice(0, 8).map((sensor) => (
                    <span
                      key={sensor.id}
                      className={cn(
                        'text-[9px] font-mono px-1.5 py-0.5 rounded border',
                        sensor.code === selected.sensorCode
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-slate-50 text-slate-500 border-slate-200',
                      )}
                    >
                      {sensor.code}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm flex items-center justify-center" style={{ minHeight: 220 }}>
            <p className="text-[11px] text-slate-400 font-mono text-center">Pilih dokumen untuk melihat detail</p>
          </div>
        )}
      </div>
    </div>
  );
}
