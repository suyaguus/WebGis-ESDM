import { useMemo, useState } from 'react';
import {
  FileBadge,
  Search,
  Upload,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  ArrowUpDown,
  FileText,
} from 'lucide-react';
import { Card, SectionHeader } from '../../../components/ui';
import { SURVEYOR_SENSORS } from '../../../constants/surveyorData';
import { cn } from '../../../lib/utils';

type DocStatus = 'belum_upload' | 'lengkap' | 'perlu_revisi' | 'diverifikasi';
type SortKey = 'sensorCode' | 'updatedAt' | 'status';

interface SensorDocItem {
  id: string;
  sensorId: string;
  sensorCode: string;
  location: string;
  requiredDocs: number;
  uploadedDocs: number;
  status: DocStatus;
  updatedAt: string;
  note?: string;
}

const STATUS_LABEL: Record<DocStatus, string> = {
  belum_upload: 'Belum Upload',
  lengkap: 'Lengkap',
  perlu_revisi: 'Perlu Revisi',
  diverifikasi: 'Diverifikasi',
};

const STATUS_STYLE: Record<DocStatus, string> = {
  belum_upload: 'bg-slate-100 text-slate-600 border-slate-200',
  lengkap: 'bg-blue-50 text-blue-700 border-blue-200',
  perlu_revisi: 'bg-amber-50 text-amber-700 border-amber-200',
  diverifikasi: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const STATUS_WEIGHT: Record<DocStatus, number> = {
  perlu_revisi: 0,
  belum_upload: 1,
  lengkap: 2,
  diverifikasi: 3,
};

const INITIAL_DOCS: SensorDocItem[] = [
  {
    id: 'd1',
    sensorId: 's1',
    sensorCode: 'SW-007',
    location: 'Rajabasa',
    requiredDocs: 4,
    uploadedDocs: 4,
    status: 'lengkap',
    updatedAt: '08:20 WIB',
    note: 'Dokumen foto alat, kondisi sumur, dan form lapangan sudah lengkap.',
  },
  {
    id: 'd2',
    sensorId: 's16',
    sensorCode: 'SW-021',
    location: 'Kemiling',
    requiredDocs: 4,
    uploadedDocs: 1,
    status: 'belum_upload',
    updatedAt: '07:45 WIB',
    note: 'Masih kurang foto panel sensor dan bukti catatan manual.',
  },
  {
    id: 'd3',
    sensorId: 's17',
    sensorCode: 'GN-055',
    location: 'Labuhan Ratu',
    requiredDocs: 3,
    uploadedDocs: 3,
    status: 'perlu_revisi',
    updatedAt: 'Kemarin',
    note: 'Foto koordinat kurang jelas, diminta upload ulang dari sudut berbeda.',
  },
];

function parseClock(value: string): number {
  const match = value.match(/(\d{1,2}):(\d{2})/);
  if (!match) return 0;
  return Number(match[1]) * 60 + Number(match[2]);
}

export default function SurveyorDokumenPage() {
  const [rows, setRows] = useState<SensorDocItem[]>(INITIAL_DOCS);
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
        row.sensorCode.toLowerCase().includes(q) ||
        row.location.toLowerCase().includes(q),
      );
    }

    data.sort((a, b) => {
      if (sortKey === 'status') {
        const av = STATUS_WEIGHT[a.status];
        const bv = STATUS_WEIGHT[b.status];
        return sortAsc ? av - bv : bv - av;
      }

      if (sortKey === 'updatedAt') {
        const av = parseClock(a.updatedAt);
        const bv = parseClock(b.updatedAt);
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
      lengkap: rows.filter((row) => row.status === 'lengkap').length,
      revisi: rows.filter((row) => row.status === 'perlu_revisi').length,
      diverifikasi: rows.filter((row) => row.status === 'diverifikasi').length,
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

  const setStatus = (id: string, status: DocStatus) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? {
              ...row,
              status,
              uploadedDocs: status === 'belum_upload' ? Math.max(1, row.uploadedDocs) : row.requiredDocs,
              updatedAt: '09:05 WIB',
            }
          : row,
      ),
    );
  };

  const addOneDoc = (id: string) => {
    setRows((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;
        const nextCount = Math.min(row.requiredDocs, row.uploadedDocs + 1);
        return {
          ...row,
          uploadedDocs: nextCount,
          status: nextCount >= row.requiredDocs ? 'lengkap' : row.status,
          updatedAt: '09:03 WIB',
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
        <ArrowUpDown size={9} className={sortKey === k ? 'text-blue-500' : 'text-slate-300'} />
      </span>
    </th>
  );

  return (
    <div className="p-3 md:p-5 space-y-3 md:space-y-4 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[18px] font-semibold text-slate-800">Verifikasi Dokumen</h1>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">Lengkapi berkas pendukung pengukuran sebelum dikirim</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Sensor', value: summary.total, color: '#3B82F6' },
          { label: 'Dokumen Lengkap', value: summary.lengkap, color: '#2563EB' },
          { label: 'Perlu Revisi', value: summary.revisi, color: '#F59E0B' },
          { label: 'Terverifikasi', value: summary.diverifikasi, color: '#22C55E' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-100 shadow-sm px-4 py-3 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl" style={{ background: color }} />
            <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-1">{label}</p>
            <p className="text-[20px] font-bold font-mono" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
        <Card padding={false}>
          <SectionHeader
            title="Daftar Dokumen Sensor"
            icon={<FileBadge size={13} />}
            accent="#3B82F6"
            subtitle={`${filtered.length} SENSOR`}
            action={
              <div className="relative">
                <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari sensor / lokasi"
                  className="pl-7 pr-3 py-1 text-[10px] font-mono border border-slate-200 rounded-lg bg-slate-50 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-400 w-44"
                />
              </div>
            }
          />

          <div className="px-4 py-2.5 border-b border-slate-100 flex items-center gap-1 flex-wrap bg-slate-50/50">
            {(['all', 'belum_upload', 'lengkap', 'perlu_revisi', 'diverifikasi'] as const).map((s) => (
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
                      className={cn('cursor-pointer transition-colors hover:bg-slate-50/60', active && 'bg-blue-50/40')}
                    >
                      <td className="px-4 py-3 text-[12px] font-bold font-mono text-slate-800">{row.sensorCode}</td>
                      <td className="px-4 py-3 text-[11px] text-slate-600">{row.location}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-blue-500"
                              style={{ width: `${Math.round((row.uploadedDocs / row.requiredDocs) * 100)}%` }}
                            />
                          </div>
                          <span className="text-[9px] font-mono text-slate-500">{row.uploadedDocs}/{row.requiredDocs}</span>
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
            <SectionHeader title="Detail Dokumen" icon={<FileText size={13} />} accent="#3B82F6" subtitle={selected.sensorCode} />
            <div className="p-4 space-y-3.5">
              <div>
                <p className="text-[9px] font-mono text-slate-400">Lokasi</p>
                <p className="text-[12px] font-semibold text-slate-800">{selected.location}</p>
              </div>

              <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5">
                <p className="text-[9px] font-mono text-slate-400 mb-1">Catatan</p>
                <p className="text-[10px] text-slate-600 leading-relaxed">{selected.note ?? '-'}</p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="rounded-lg border border-slate-100 bg-white px-2.5 py-2">
                  <p className="text-[9px] font-mono text-slate-400">Wajib</p>
                  <p className="text-[12px] font-semibold font-mono text-slate-800">{selected.requiredDocs}</p>
                </div>
                <div className="rounded-lg border border-slate-100 bg-white px-2.5 py-2">
                  <p className="text-[9px] font-mono text-slate-400">Terupload</p>
                  <p className="text-[12px] font-semibold font-mono text-slate-800">{selected.uploadedDocs}</p>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => addOneDoc(selected.id)}
                  disabled={selected.uploadedDocs >= selected.requiredDocs}
                  className={cn(
                    'w-full text-[11px] font-semibold rounded-lg px-3 py-2 inline-flex items-center justify-center gap-1.5',
                    selected.uploadedDocs >= selected.requiredDocs
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700',
                  )}
                >
                  <Upload size={12} /> Tambah 1 Lampiran
                </button>

                {(selected.status === 'belum_upload' || selected.status === 'perlu_revisi') && (
                  <button
                    onClick={() => setStatus(selected.id, 'lengkap')}
                    className="w-full text-[11px] font-semibold rounded-lg px-3 py-2 border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 inline-flex items-center justify-center gap-1.5"
                  >
                    <Clock3 size={12} /> Tandai Lengkap
                  </button>
                )}

                {(selected.status === 'lengkap' || selected.status === 'perlu_revisi') && (
                  <button
                    onClick={() => setStatus(selected.id, 'diverifikasi')}
                    className="w-full text-[11px] font-semibold rounded-lg px-3 py-2 bg-emerald-600 text-white hover:bg-emerald-700 inline-flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 size={12} /> Siap Dikirim
                  </button>
                )}

                {(selected.status === 'lengkap' || selected.status === 'diverifikasi') && (
                  <button
                    onClick={() => setStatus(selected.id, 'perlu_revisi')}
                    className="w-full text-[11px] font-semibold rounded-lg px-3 py-2 border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 inline-flex items-center justify-center gap-1.5"
                  >
                    <AlertTriangle size={12} /> Minta Revisi
                  </button>
                )}
              </div>

              <div className="pt-1">
                <p className="text-[9px] font-mono text-slate-400">Sensor Ditugaskan</p>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {SURVEYOR_SENSORS.map((sensor) => (
                    <span key={sensor.id} className={cn('text-[9px] font-mono px-1.5 py-0.5 rounded border', sensor.id === selected.sensorId ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-50 text-slate-500 border-slate-200')}>
                      {sensor.code}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm flex items-center justify-center" style={{ minHeight: 220 }}>
            <p className="text-[11px] text-slate-400 font-mono text-center">Pilih data dokumen untuk melihat detail</p>
          </div>
        )}
      </div>
    </div>
  );
}
