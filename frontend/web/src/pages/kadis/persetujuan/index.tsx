import { useMemo, useState } from 'react';
import {
  CheckSquare,
  Search,
  Clock3,
  Check,
  X,
  FileWarning,
  ArrowUpDown,
  Building2,
} from 'lucide-react';
import { Card, SectionHeader } from '../../../components/ui';
import { MOCK_COMPANIES } from '../../../constants/mockData';
import { cn } from '../../../lib/utils';

type PermitStatus = 'pending' | 'approved' | 'revision' | 'rejected';
type SortKey = 'code' | 'companyName' | 'requestedAt' | 'status';

interface PermitRequest {
  id: string;
  code: string;
  companyId: string;
  companyName: string;
  requestedBy: string;
  requestedAt: string;
  period: string;
  requestedQuota: number;
  usedQuota: number;
  status: PermitStatus;
  priority: 'normal' | 'urgent';
  notes: string;
  recommendation: string;
}

const STATUS_LABEL: Record<PermitStatus, string> = {
  pending: 'Menunggu',
  approved: 'Disetujui',
  revision: 'Perlu Revisi',
  rejected: 'Ditolak',
};

const STATUS_STYLE: Record<PermitStatus, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  revision: 'bg-blue-50 text-blue-700 border-blue-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
};

const SORT_WEIGHT: Record<PermitStatus, number> = {
  pending: 0,
  revision: 1,
  approved: 2,
  rejected: 3,
};

const PERMIT_REQUESTS: PermitRequest[] = [
  {
    id: 'pr1',
    code: 'IZN-2026-014',
    companyId: 'c2',
    companyName: 'PT Bumi Raya',
    requestedBy: 'Citra Dewi',
    requestedAt: '08:21 WIB',
    period: 'Q2 2026',
    requestedQuota: 175000,
    usedQuota: 154500,
    status: 'pending',
    priority: 'urgent',
    notes: 'Permintaan tambahan kuota karena peningkatan produksi 15% di wilayah Metro.',
    recommendation: 'Perlu evaluasi dampak subsidence pada 2 sensor GNSS aktif.',
  },
  {
    id: 'pr2',
    code: 'IZN-2026-015',
    companyId: 'c1',
    companyName: 'PT Maju Jaya Tbk',
    requestedBy: 'Budi Santoso',
    requestedAt: '07:58 WIB',
    period: 'Q2 2026',
    requestedQuota: 210000,
    usedQuota: 174000,
    status: 'pending',
    priority: 'normal',
    notes: 'Penyesuaian kuota untuk kebutuhan operasional tambahan area Rajabasa.',
    recommendation: 'Masih dalam batas aman, bisa disetujui bertahap.',
  },
  {
    id: 'pr3',
    code: 'IZN-2026-011',
    companyId: 'c4',
    companyName: 'PT Sumber Air',
    requestedBy: 'Gilang Ramadhan',
    requestedAt: 'Kemarin',
    period: 'Q2 2026',
    requestedQuota: 125000,
    usedQuota: 114000,
    status: 'revision',
    priority: 'normal',
    notes: 'Pengajuan belum melampirkan data kalibrasi sensor bulan terakhir.',
    recommendation: 'Minta revisi dokumen lampiran sebelum persetujuan.',
  },
  {
    id: 'pr4',
    code: 'IZN-2026-009',
    companyId: 'c3',
    companyName: 'PT Tirta Mandiri',
    requestedBy: 'Fitri Handayani',
    requestedAt: '14 Apr 2026',
    period: 'Q2 2026',
    requestedQuota: 180000,
    usedQuota: 109800,
    status: 'approved',
    priority: 'normal',
    notes: 'Pengajuan kuota regular tahunan dengan tren subsidence stabil.',
    recommendation: 'Disetujui penuh, monitoring berkala tetap berjalan.',
  },
  {
    id: 'pr5',
    code: 'IZN-2026-008',
    companyId: 'c5',
    companyName: 'PT Karya Makmur',
    requestedBy: 'Hana Wijaya',
    requestedAt: '10 Apr 2026',
    period: 'Q2 2026',
    requestedQuota: 145000,
    usedQuota: 48000,
    status: 'rejected',
    priority: 'normal',
    notes: 'Data pendukung tidak konsisten dengan histori pengambilan air.',
    recommendation: 'Ditolak dan diajukan ulang dengan data valid.',
  },
];

function parseClockToMinutes(value: string): number {
  const match = value.match(/(\d{1,2}):(\d{2})/);
  if (!match) return 0;
  return Number(match[1]) * 60 + Number(match[2]);
}

export default function KadisPersetujuanPage() {
  const [rows, setRows] = useState<PermitRequest[]>(PERMIT_REQUESTS);
  const [search, setSearch] = useState('');
  const [statusF, setStatusF] = useState<PermitStatus | 'all'>('all');
  const [sortKey, setSortKey] = useState<SortKey>('requestedAt');
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(PERMIT_REQUESTS[0]?.id ?? null);

  const filtered = useMemo(() => {
    let data = [...rows];

    if (statusF !== 'all') {
      data = data.filter((row) => row.status === statusF);
    }

    if (search) {
      const q = search.toLowerCase();
      data = data.filter((row) =>
        row.code.toLowerCase().includes(q) ||
        row.companyName.toLowerCase().includes(q) ||
        row.requestedBy.toLowerCase().includes(q),
      );
    }

    data.sort((a, b) => {
      if (sortKey === 'status') {
        const av = SORT_WEIGHT[a.status];
        const bv = SORT_WEIGHT[b.status];
        return sortAsc ? av - bv : bv - av;
      }

      if (sortKey === 'requestedAt') {
        const av = parseClockToMinutes(a.requestedAt);
        const bv = parseClockToMinutes(b.requestedAt);
        return sortAsc ? av - bv : bv - av;
      }

      const av = String(a[sortKey]);
      const bv = String(b[sortKey]);
      return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
    });

    return data;
  }, [rows, search, statusF, sortKey, sortAsc]);

  const selected = useMemo(() => {
    if (!selectedId) return filtered[0] ?? null;
    return rows.find((row) => row.id === selectedId) ?? filtered[0] ?? null;
  }, [selectedId, filtered, rows]);

  const summary = useMemo(
    () => ({
      total: rows.length,
      pending: rows.filter((row) => row.status === 'pending').length,
      revision: rows.filter((row) => row.status === 'revision').length,
      approved: rows.filter((row) => row.status === 'approved').length,
    }),
    [rows],
  );

  const setStatus = (id: string, status: PermitStatus) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, status } : row)));
  };

  const sort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc((prev) => !prev);
      return;
    }
    setSortKey(key);
    setSortAsc(true);
  };

  const Th = ({ label, k }: { label: string; k: SortKey }) => (
    <th
      onClick={() => sort(k)}
      className="text-[9px] font-mono text-slate-400 uppercase tracking-wider px-4 py-3 text-left cursor-pointer hover:text-slate-600 whitespace-nowrap select-none"
    >
      <span className="flex items-center gap-1">
        {label}
        <ArrowUpDown size={9} className={sortKey === k ? 'text-emerald-500' : 'text-slate-300'} />
      </span>
    </th>
  );

  return (
    <div className="p-3 sm:p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[18px] font-semibold text-slate-800">Persetujuan Izin</h1>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">Validasi dan keputusan izin pengambilan air tanah</p>
        </div>
        {summary.pending > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 rounded-full">
            <FileWarning size={12} className="text-red-600" />
            <span className="text-[10px] font-mono text-red-700 font-semibold">{summary.pending} izin menunggu</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Pengajuan', value: summary.total, color: '#059669' },
          { label: 'Menunggu', value: summary.pending, color: '#F59E0B' },
          { label: 'Perlu Revisi', value: summary.revision, color: '#3B82F6' },
          { label: 'Disetujui', value: summary.approved, color: '#22C55E' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-100 shadow-sm px-4 py-3 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl" style={{ background: color }} />
            <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-1">{label}</p>
            <p className="text-[22px] font-bold font-mono" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-[1fr_320px]">
        <Card padding={false}>
          <SectionHeader
            title="Daftar Pengajuan Izin"
            icon={<CheckSquare size={13} />}
            accent="#059669"
            subtitle={`${filtered.length} pengajuan`}
            action={
              <div className="relative">
                <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Kode / perusahaan / pemohon"
                  className="pl-7 pr-3 py-1 text-[10px] font-mono border border-slate-200 rounded-lg bg-slate-50 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-emerald-400 w-52"
                />
              </div>
            }
          />

          <div className="flex items-center gap-1 px-4 py-2.5 border-b border-slate-100 flex-wrap">
            {(['all', 'pending', 'revision', 'approved', 'rejected'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusF(s)}
                className={cn(
                  'text-[9px] font-mono px-2.5 py-1 rounded-full border transition-all',
                  statusF === s
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'text-slate-400 border-transparent hover:bg-slate-50',
                )}
              >
                {s === 'all' ? 'Semua' : STATUS_LABEL[s]}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full" style={{ minWidth: '760px' }}>
              <thead className="bg-slate-50/60 border-b border-slate-100">
                <tr>
                  <Th label="Kode" k="code" />
                  <Th label="Perusahaan" k="companyName" />
                  <th className="text-[9px] font-mono text-slate-400 uppercase tracking-wider px-4 py-3 text-left whitespace-nowrap">Pemohon</th>
                  <Th label="Waktu" k="requestedAt" />
                  <Th label="Status" k="status" />
                  <th className="text-[9px] font-mono text-slate-400 uppercase tracking-wider px-4 py-3 text-left whitespace-nowrap">Prioritas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((row) => {
                  const active = selected?.id === row.id;
                  return (
                    <tr
                      key={row.id}
                      onClick={() => setSelectedId(row.id)}
                      className={cn(
                        'cursor-pointer transition-colors hover:bg-slate-50/40',
                        active && 'bg-emerald-50/50',
                        row.priority === 'urgent' && !active && 'bg-red-50/20',
                      )}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {row.priority === 'urgent' && <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />}
                          <span className="text-[11px] font-semibold font-mono text-slate-800">{row.code}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[11px] text-slate-700">{row.companyName}</td>
                      <td className="px-4 py-3 text-[11px] text-slate-600">{row.requestedBy}</td>
                      <td className="px-4 py-3 text-[10px] font-mono text-slate-500 whitespace-nowrap">{row.requestedAt}</td>
                      <td className="px-4 py-3">
                        <span className={cn('text-[9px] font-mono px-2 py-0.5 rounded-full border', STATUS_STYLE[row.status])}>
                          {STATUS_LABEL[row.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            'text-[9px] font-mono px-2 py-0.5 rounded-full border',
                            row.priority === 'urgent'
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200',
                          )}
                        >
                          {row.priority === 'urgent' ? 'Urgent' : 'Normal'}
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
            <SectionHeader title="Detail Pengajuan" icon={<Building2 size={13} />} accent="#059669" subtitle={selected.code} />
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[9px] font-mono text-slate-400">Perusahaan</p>
                  <p className="text-[12px] font-semibold text-slate-800">{selected.companyName}</p>
                </div>
                <div>
                  <p className="text-[9px] font-mono text-slate-400">Periode</p>
                  <p className="text-[12px] font-semibold text-slate-800">{selected.period}</p>
                </div>
                <div>
                  <p className="text-[9px] font-mono text-slate-400">Kuota Diminta</p>
                  <p className="text-[12px] font-semibold font-mono text-slate-800">{(selected.requestedQuota / 1000).toFixed(0)}k m3</p>
                </div>
                <div>
                  <p className="text-[9px] font-mono text-slate-400">Kuota Terpakai</p>
                  <p className="text-[12px] font-semibold font-mono text-slate-800">{(selected.usedQuota / 1000).toFixed(0)}k m3</p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-3">
                <p className="text-[9px] font-mono text-slate-400 uppercase mb-1">Catatan Pemohon</p>
                <p className="text-[11px] text-slate-700 leading-relaxed">{selected.notes}</p>
              </div>

              <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 px-3 py-3">
                <p className="text-[9px] font-mono text-emerald-700 uppercase mb-1">Rekomendasi Sistem</p>
                <p className="text-[11px] text-emerald-800 leading-relaxed">{selected.recommendation}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                {selected.status === 'pending' || selected.status === 'revision' ? (
                  <>
                    <button
                      onClick={() => setStatus(selected.id, 'rejected')}
                      className="px-3 py-2 text-[11px] font-semibold rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 inline-flex items-center gap-1.5"
                    >
                      <X size={12} /> Tolak
                    </button>
                    <button
                      onClick={() => setStatus(selected.id, 'revision')}
                      className="px-3 py-2 text-[11px] font-semibold rounded-lg border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 inline-flex items-center gap-1.5"
                    >
                      <Clock3 size={12} /> Revisi
                    </button>
                    <button
                      onClick={() => setStatus(selected.id, 'approved')}
                      className="w-full sm:w-auto sm:ml-auto px-3 py-2 text-[11px] font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 inline-flex items-center justify-center gap-1.5"
                    >
                      <Check size={12} /> Setujui
                    </button>
                  </>
                ) : (
                  <div className="text-[10px] font-mono text-slate-500">
                    Status saat ini: <span className="font-semibold">{STATUS_LABEL[selected.status]}</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ) : (
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm flex items-center justify-center" style={{ minHeight: 220 }}>
            <p className="text-[11px] text-slate-400 font-mono text-center">Pilih pengajuan untuk melihat detail</p>
          </div>
        )}
      </div>

      <Card padding={false}>
        <SectionHeader title="Ringkasan Kuota Perusahaan" icon={<Building2 size={13} />} accent="#059669" />
        <div className="px-4 py-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {MOCK_COMPANIES.map((company) => {
            const pct = Math.round((company.quotaUsed / company.quota) * 100);
            const barColor = pct >= 100 ? '#EF4444' : pct >= 85 ? '#F59E0B' : '#22C55E';
            return (
              <div key={company.id} className="rounded-lg border border-slate-100 bg-white px-2.5 py-2">
                <p className="text-[9px] font-mono text-slate-500 truncate">{company.name.replace('PT ', '')}</p>
                <div className="h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${Math.min(pct, 100)}%`, background: barColor }} />
                </div>
                <p className="text-[10px] font-mono mt-1" style={{ color: barColor }}>{pct}% kuota</p>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
