import { useMemo, useState } from 'react';
import {
  ClipboardCheck,
  Search,
  Check,
  X,
  Clock3,
  ArrowUpDown,
  Eye,
  Image as ImageIcon,
} from 'lucide-react';
import { Card, StatusPill } from '../../../components/ui';
import { COMPANY_MEASUREMENTS } from '../../../constants/mockData';
import { cn, getSubsidenceColor } from '../../../lib/utils';
import type { Measurement } from '../../../constants/mockData';

type VerificationStatus = Measurement['status'];
type FilterStatus = VerificationStatus | 'all';
type SortKey = 'sensorCode' | 'surveyorName' | 'submittedAt' | 'status' | 'subsidence';
type MeasurementWithPhotos = Measurement & { fotoUrls?: string[] };

function buildPhotoPlaceholder(sensorCode: string, location: string, index: number): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#dbeafe"/>
        <stop offset="100%" stop-color="#e2e8f0"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="800" fill="url(#bg)"/>
    <rect x="80" y="80" width="1040" height="640" rx="32" fill="#ffffff" stroke="#bae6fd" stroke-width="6"/>
    <text x="600" y="335" text-anchor="middle" font-family="monospace" font-size="54" fill="#0f172a">Lampiran ${index}</text>
    <text x="600" y="405" text-anchor="middle" font-family="monospace" font-size="34" fill="#0369a1">${sensorCode}</text>
    <text x="600" y="460" text-anchor="middle" font-family="monospace" font-size="28" fill="#475569">${location}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const KONDISI_LABEL: Record<Measurement['kondisiFisik'], string> = {
  baik: 'Baik',
  rusak_ringan: 'Rusak Ringan',
  rusak_berat: 'Rusak Berat',
};

const KONDISI_COLOR: Record<Measurement['kondisiFisik'], string> = {
  baik: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  rusak_ringan: 'text-amber-700 bg-amber-50 border-amber-200',
  rusak_berat: 'text-red-700 bg-red-50 border-red-200',
};

const STATUS_ORDER: Record<VerificationStatus, number> = {
  pending: 0,
  draft: 1,
  rejected: 2,
  verified: 3,
};

const STATUS_LABEL: Record<VerificationStatus, string> = {
  pending: 'Menunggu',
  verified: 'Diverifikasi',
  rejected: 'Ditolak',
  draft: 'Draft',
};

function parseClockText(value: string): number {
  const match = value.match(/(\d{1,2}):(\d{2})/);
  if (!match) return 0;
  const h = Number(match[1]);
  const m = Number(match[2]);
  return h * 60 + m;
}

export default function SuperAdminVerifikasiPage() {
  const [rows, setRows] = useState<Measurement[]>(COMPANY_MEASUREMENTS);
  const [search, setSearch] = useState('');
  const [statusF, setStatusF] = useState<FilterStatus>('all');
  const [sortKey, setSortKey] = useState<SortKey>('submittedAt');
  const [sortAsc, setSortAsc] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<{ url: string; title: string } | null>(null);

  const detailRow = useMemo(
    () => rows.find((row) => row.id === detailId) ?? null,
    [rows, detailId],
  );

  const detailPhotos = useMemo(() => {
    if (!detailRow) return [] as Array<{ index: number; url: string; isUploaded: boolean }>;

    const rowWithPhotos = detailRow as MeasurementWithPhotos;
    const uploaded = rowWithPhotos.fotoUrls ?? [];
    const total = Math.max(detailRow.fotoCount, uploaded.length);

    return Array.from({ length: total }, (_, idx) => {
      const existingUrl = uploaded[idx];
      return {
        index: idx + 1,
        url: existingUrl ?? buildPhotoPlaceholder(detailRow.sensorCode, detailRow.location, idx + 1),
        isUploaded: Boolean(existingUrl),
      };
    });
  }, [detailRow]);

  const summary = useMemo(() => {
    return {
      total: rows.length,
      pending: rows.filter((r) => r.status === 'pending').length,
      verified: rows.filter((r) => r.status === 'verified').length,
      rejected: rows.filter((r) => r.status === 'rejected').length,
    };
  }, [rows]);

  const filtered = useMemo(() => {
    let data = [...rows];

    if (statusF !== 'all') {
      data = data.filter((r) => r.status === statusF);
    }

    if (search) {
      const q = search.toLowerCase();
      data = data.filter((r) =>
        r.sensorCode.toLowerCase().includes(q) ||
        r.surveyorName.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q),
      );
    }

    data.sort((a, b) => {
      if (sortKey === 'status') {
        const av = STATUS_ORDER[a.status];
        const bv = STATUS_ORDER[b.status];
        return sortAsc ? av - bv : bv - av;
      }

      if (sortKey === 'subsidence') {
        return sortAsc ? a.subsidence - b.subsidence : b.subsidence - a.subsidence;
      }

      if (sortKey === 'submittedAt') {
        const av = parseClockText(a.submittedAt);
        const bv = parseClockText(b.submittedAt);
        return sortAsc ? av - bv : bv - av;
      }

      const av = String(a[sortKey]);
      const bv = String(b[sortKey]);
      return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
    });

    return data;
  }, [rows, search, statusF, sortKey, sortAsc]);

  const setStatus = (id: string, status: VerificationStatus) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, status, verifiedAt: status === 'verified' ? '09:02 WIB' : row.verifiedAt } : row)));
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
        <ArrowUpDown size={9} className={sortKey === k ? 'text-cyan-500' : 'text-slate-300'} />
      </span>
    </th>
  );

  const closeDetail = () => {
    setDetailId(null);
    setPreviewPhoto(null);
  };

  return (
    <div className="p-3 sm:p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[18px] font-semibold text-slate-800">Verifikasi Data</h1>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">Tinjau data lapangan sebelum masuk ke laporan resmi</p>
        </div>
        <button className="px-3 py-2 bg-cyan-600 text-white text-[12px] font-semibold rounded-xl hover:bg-cyan-700 transition-colors flex items-center gap-2">
          <ClipboardCheck size={13} /> Validasi Massal
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Data', value: summary.total, color: '#0891B2', bg: 'bg-cyan-50 border-cyan-200' },
          { label: 'Menunggu', value: summary.pending, color: '#F59E0B', bg: 'bg-amber-50 border-amber-200' },
          { label: 'Diverifikasi', value: summary.verified, color: '#22C55E', bg: 'bg-emerald-50 border-emerald-200' },
          { label: 'Ditolak', value: summary.rejected, color: '#EF4444', bg: 'bg-red-50 border-red-200' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={cn('rounded-xl border px-4 py-3', bg)}>
            <p className="text-[9px] font-mono text-slate-400 uppercase mb-1">{label}</p>
            <p className="text-[22px] font-bold font-mono" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      <Card padding={false}>
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 flex-wrap">
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari sensor / surveyor / lokasi..."
              className="pl-8 pr-3 py-1.5 text-[11px] font-mono border border-slate-200 rounded-lg bg-slate-50 text-slate-700 w-64 focus:outline-none focus:border-cyan-400"
            />
          </div>
          <div className="flex gap-1">
            {(['all', 'pending', 'verified', 'rejected', 'draft'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusF(s)}
                className={cn(
                  'text-[9px] font-mono px-2.5 py-1 rounded-full border transition-all',
                  statusF === s
                    ? 'bg-cyan-50 text-cyan-700 border-cyan-200'
                    : 'text-slate-400 border-transparent hover:bg-slate-50',
                )}
              >
                {s === 'all' ? 'Semua' : STATUS_LABEL[s]}
              </button>
            ))}
          </div>
          <span className="ml-auto text-[10px] text-slate-400 font-mono">{filtered.length} data</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full" style={{ minWidth: '860px' }}>
            <thead className="bg-slate-50/60 border-b border-slate-100">
              <tr>
                <Th label="Sensor" k="sensorCode" />
                <Th label="Surveyor" k="surveyorName" />
                <Th label="Waktu" k="submittedAt" />
                <th className="text-[9px] font-mono text-slate-400 uppercase tracking-wider px-4 py-3 text-left whitespace-nowrap">Lokasi</th>
                <Th label="Status" k="status" />
                <Th label="Subsidence" k="subsidence" />
                <th className="text-[9px] font-mono text-slate-400 uppercase tracking-wider px-4 py-3 text-left whitespace-nowrap">Catatan</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/40 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-[12px] font-mono font-bold text-slate-800">{row.sensorCode}</p>
                      <p className="text-[10px] text-slate-400">{row.fotoCount} foto</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-white text-[10px] font-bold flex items-center justify-center">
                        {row.surveyorAvatar}
                      </div>
                      <span className="text-[11px] font-semibold text-slate-700">{row.surveyorName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[10px] font-mono text-slate-500 whitespace-nowrap">{row.submittedAt}</td>
                  <td className="px-4 py-3 text-[11px] text-slate-600">{row.location}</td>
                  <td className="px-4 py-3">
                    <StatusPill status={row.status} />
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn('text-[12px] font-semibold font-mono', getSubsidenceColor(row.subsidence))}>
                      {row.subsidence.toFixed(2)}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400 ml-1">cm/thn</span>
                  </td>
                  <td className="px-4 py-3 max-w-[220px]">
                    <p className="text-[10px] text-slate-500 truncate">{row.catatan}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setDetailId(row.id)}
                        className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center"
                      >
                        <Eye size={12} className="text-slate-500" />
                      </button>
                      {row.status === 'pending' && (
                        <>
                          <button
                            onClick={() => setStatus(row.id, 'verified')}
                            className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 flex items-center justify-center"
                          >
                            <Check size={12} className="text-emerald-600" />
                          </button>
                          <button
                            onClick={() => setStatus(row.id, 'rejected')}
                            className="w-7 h-7 rounded-lg bg-red-50 border border-red-200 hover:bg-red-100 flex items-center justify-center"
                          >
                            <X size={12} className="text-red-600" />
                          </button>
                        </>
                      )}
                      {row.status !== 'pending' && (
                        <div className="text-[9px] font-mono text-slate-400 px-2 whitespace-nowrap inline-flex items-center gap-1">
                          <Clock3 size={10} />
                          {row.verifiedAt ?? '-'}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {detailRow && (
        <div
          className="fixed inset-0 bg-black/25 backdrop-blur-[1px] z-50 flex items-center justify-center p-4"
          onClick={closeDetail}
        >
          <div
            className="w-full max-w-3xl bg-white rounded-2xl border border-slate-100 shadow-2xl overflow-hidden animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-slate-100 flex items-start justify-between gap-3">
              <div>
                <p className="text-[15px] font-semibold text-slate-800">Detail Laporan Surveyor</p>
                <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                  {detailRow.sensorCode} · {detailRow.submittedAt} · {detailRow.location}
                </p>
              </div>
              <button
                onClick={closeDetail}
                className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 hover:bg-slate-200 flex items-center justify-center"
              >
                <X size={14} className="text-slate-500" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="rounded-xl border border-cyan-100 bg-cyan-50/50 p-4">
                <p className="text-[9px] font-mono text-cyan-700 uppercase tracking-wider mb-1">Deskripsi Laporan</p>
                <p className="text-[12px] leading-relaxed text-slate-700">{detailRow.catatan}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
                  <p className="text-[9px] font-mono text-slate-400 uppercase">Surveyor</p>
                  <p className="text-[12px] font-semibold text-slate-800 mt-1">{detailRow.surveyorName}</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
                  <p className="text-[9px] font-mono text-slate-400 uppercase">Status</p>
                  <div className="mt-1">
                    <StatusPill status={detailRow.status} />
                  </div>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
                  <p className="text-[9px] font-mono text-slate-400 uppercase">Foto</p>
                  <p className="text-[12px] font-semibold text-slate-800 mt-1">{detailRow.fotoCount} lampiran</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
                  <p className="text-[9px] font-mono text-slate-400 uppercase">Kondisi Fisik</p>
                  <span className={cn('mt-1 inline-flex text-[10px] font-mono px-2 py-0.5 rounded-full border', KONDISI_COLOR[detailRow.kondisiFisik])}>
                    {KONDISI_LABEL[detailRow.kondisiFisik]}
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-100 bg-white p-3.5">
                <div className="flex items-center justify-between mb-2.5">
                  <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Lampiran Foto Surveyor</p>
                  <span className="text-[10px] text-slate-500 font-mono">{detailPhotos.length} foto</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {detailPhotos.map((photo) => (
                    <button
                      key={photo.index}
                      onClick={() => setPreviewPhoto({ url: photo.url, title: `Lampiran ${photo.index} - ${detailRow.sensorCode}` })}
                      className="group relative rounded-lg overflow-hidden border border-slate-200 bg-slate-50 hover:border-cyan-300 transition-colors"
                    >
                      <img
                        src={photo.url}
                        alt={`Lampiran ${photo.index} ${detailRow.sensorCode}`}
                        className="w-full h-24 object-cover"
                      />
                      <div className="absolute inset-x-0 bottom-0 px-2 py-1.5 bg-gradient-to-t from-black/65 to-transparent text-left">
                        <p className="text-[9px] font-mono text-white">Lampiran {photo.index}</p>
                      </div>
                      {!photo.isUploaded && (
                        <span className="absolute top-1.5 right-1.5 text-[8px] font-mono bg-white/90 text-slate-500 px-1.5 py-0.5 rounded-full border border-slate-200">
                          Preview
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {detailPhotos.length === 0 && (
                  <div className="rounded-lg border border-dashed border-slate-200 px-3 py-4 text-center text-[11px] text-slate-400">
                    Belum ada lampiran foto
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-xl border border-slate-100 px-3 py-3 bg-white">
                  <p className="text-[9px] font-mono text-slate-400 uppercase mb-1">Subsidence</p>
                  <p className={cn('text-[14px] font-semibold font-mono', getSubsidenceColor(detailRow.subsidence))}>
                    {detailRow.subsidence.toFixed(2)} cm/thn
                  </p>
                </div>
                <div className="rounded-xl border border-slate-100 px-3 py-3 bg-white">
                  <p className="text-[9px] font-mono text-slate-400 uppercase mb-1">Muka Air</p>
                  <p className="text-[14px] font-semibold font-mono text-slate-800">{detailRow.waterLevel.toFixed(1)} m</p>
                </div>
                <div className="rounded-xl border border-slate-100 px-3 py-3 bg-white">
                  <p className="text-[9px] font-mono text-slate-400 uppercase mb-1">Nilai Vertikal</p>
                  <p className="text-[14px] font-semibold font-mono text-slate-800">{detailRow.verticalValue.toFixed(2)} mm</p>
                </div>
              </div>
            </div>

            <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                onClick={closeDetail}
                className="px-3 py-2 bg-slate-100 text-slate-600 text-[12px] font-semibold rounded-xl hover:bg-slate-200"
              >
                Tutup
              </button>

              <div className="flex items-center gap-2">
                {detailRow.status === 'pending' ? (
                  <>
                    <button
                      onClick={() => {
                        setStatus(detailRow.id, 'rejected');
                        closeDetail();
                      }}
                      className="px-3 py-2 bg-red-50 border border-red-200 text-red-600 text-[12px] font-semibold rounded-xl hover:bg-red-100 inline-flex items-center gap-1.5"
                    >
                      <X size={12} /> Tolak
                    </button>
                    <button
                      onClick={() => {
                        setStatus(detailRow.id, 'verified');
                        closeDetail();
                      }}
                      className="px-3 py-2 bg-emerald-600 text-white text-[12px] font-semibold rounded-xl hover:bg-emerald-700 inline-flex items-center gap-1.5"
                    >
                      <Check size={12} /> Verifikasi
                    </button>
                  </>
                ) : (
                  <div className="text-[10px] font-mono text-slate-400 inline-flex items-center gap-1.5">
                    <Clock3 size={11} />
                    Status saat ini: {STATUS_LABEL[detailRow.status]}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {previewPhoto && (
        <div
          className="fixed inset-0 bg-black/70 z-[60] p-4 flex items-center justify-center"
          onClick={() => setPreviewPhoto(null)}
        >
          <div className="w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <div className="bg-slate-900/90 rounded-t-xl px-4 py-2.5 border border-slate-700 border-b-0 flex items-center justify-between">
              <p className="text-[11px] font-mono text-slate-200 inline-flex items-center gap-1.5">
                <ImageIcon size={12} /> {previewPhoto.title}
              </p>
              <button
                onClick={() => setPreviewPhoto(null)}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 flex items-center justify-center"
              >
                <X size={12} className="text-slate-200" />
              </button>
            </div>
            <div className="bg-black border border-slate-700 rounded-b-xl overflow-hidden">
              <img src={previewPhoto.url} alt={previewPhoto.title} className="w-full max-h-[75vh] object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
