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
  UserRoundCheck,
  ShieldCheck,
  FileCheck2,
  ClipboardEdit,
} from 'lucide-react';
import { Card, SectionHeader } from '../../../components/ui';
import { cn } from '../../../lib/utils';
import {
  loadWellSubmissionWorkflows,
  updateWellSubmissionWorkflow,
  getOverallSubmissionStatus,
  OVERALL_STATUS_CLASS,
  OVERALL_STATUS_LABEL,
  type WellSubmissionWorkflow,
} from '@/lib/wellSubmissionWorkflow';

type DocStatus = 'draft' | 'review' | 'complete' | 'rejected';
type SortKey = 'wellCode' | 'updatedAt' | 'status';

const STATUS_LABEL: Record<DocStatus, string> = {
  draft: 'Draft',
  review: 'Review Surveyor',
  complete: 'Lengkap & Approved',
  rejected: 'Perlu Revisi',
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

function getDocStatus(row: WellSubmissionWorkflow): DocStatus {
  if (row.superAdminStatus === 'approved') return 'complete';
  if (row.surveyorStatus === 'needs_revision' || row.superAdminStatus === 'rejected') return 'rejected';
  if (row.uploadedDocumentCount >= row.requiredDocumentCount) return 'review';
  return 'draft';
}

function withDocStatus(row: WellSubmissionWorkflow) {
  return { ...row, docStatus: getDocStatus(row) };
}

export default function AdminDokumenPage() {
  const [rows, setRows] = useState<WellSubmissionWorkflow[]>(() => loadWellSubmissionWorkflows());
  const [search, setSearch] = useState('');
  const [statusF, setStatusF] = useState<DocStatus | 'all'>('all');
  const [sortKey, setSortKey] = useState<SortKey>('updatedAt');
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedId, setSelectedId] = useState<string>(rows[0]?.id ?? '');

  const filtered = useMemo(() => {
    let data = rows.map(withDocStatus);
    if (statusF !== 'all') data = data.filter((row) => row.docStatus === statusF);
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(
        (row) =>
          row.wellCode.toLowerCase().includes(q) ||
          row.wellName.toLowerCase().includes(q) ||
          row.location.toLowerCase().includes(q),
      );
    }
    data.sort((a, b) => {
      if (sortKey === 'status') {
        const av = STATUS_WEIGHT[a.docStatus];
        const bv = STATUS_WEIGHT[b.docStatus];
        return sortAsc ? av - bv : bv - av;
      }
      if (sortKey === 'updatedAt') {
        return sortAsc ? a.updatedAt.localeCompare(b.updatedAt) : b.updatedAt.localeCompare(a.updatedAt);
      }
      return sortAsc ? a.wellCode.localeCompare(b.wellCode) : b.wellCode.localeCompare(a.wellCode);
    });
    return data;
  }, [rows, search, statusF, sortKey, sortAsc]);

  const selected = useMemo(
    () => rows.find((row) => row.id === selectedId) ?? filtered[0] ?? null,
    [rows, selectedId, filtered],
  );

  const summary = useMemo(() => {
    const withStatus = rows.map(withDocStatus);
    return {
      total: rows.length,
      review: withStatus.filter((r) => r.docStatus === 'review').length,
      complete: withStatus.filter((r) => r.docStatus === 'complete').length,
      rejected: withStatus.filter((r) => r.docStatus === 'rejected').length,
    };
  }, [rows]);

  const sort = (key: SortKey) => {
    if (sortKey === key) { setSortAsc((p) => !p); return; }
    setSortKey(key);
    setSortAsc(true);
  };

  const refresh = () => {
    const latest = loadWellSubmissionWorkflows();
    setRows(latest);
    if (!selectedId && latest[0]) setSelectedId(latest[0].id);
  };

  const addOneAttachment = (id: string) => {
    updateWellSubmissionWorkflow(id, (row) => ({
      ...row,
      uploadedDocumentCount: Math.min(row.requiredDocumentCount, row.uploadedDocumentCount + 1),
    }));
    refresh();
  };

  const markAllComplete = (id: string) => {
    updateWellSubmissionWorkflow(id, (row) => ({
      ...row,
      uploadedDocumentCount: row.requiredDocumentCount,
      surveyorStatus: row.submissionPath === 'licensed' ? 'not_required' : 'pending',
      superAdminStatus: 'pending',
    }));
    refresh();
  };

  const markNeedsRevision = (id: string) => {
    updateWellSubmissionWorkflow(id, (row) => ({
      ...row,
      surveyorStatus: 'needs_revision',
      superAdminStatus: 'pending',
      surveyorNote: 'Dokumen belum lengkap. Mohon upload ulang foto koordinat, form inspeksi, dan bukti alat ukur.',
    }));
    refresh();
  };

  const markReadyForSuperAdmin = (id: string) => {
    updateWellSubmissionWorkflow(id, (row) => ({
      ...row,
      surveyorStatus: row.submissionPath === 'licensed' ? 'not_required' : 'matched',
      superAdminStatus: 'pending',
      surveyorNote:
        row.submissionPath === 'licensed'
          ? 'Jalur berperizinan — tidak memerlukan cross-check surveyor.'
          : 'Dokumen cocok dengan data lapangan surveyor. Siap cross-check super admin.',
    }));
    refresh();
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
        <p className="text-[11px] text-slate-400 font-mono mt-0.5">
          Monitoring kelengkapan dokumen pengajuan data sumur
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Pengajuan', value: summary.total, color: '#F59E0B' },
          { label: 'Siap Review', value: summary.review, color: '#3B82F6' },
          { label: 'Approved Final', value: summary.complete, color: '#22C55E' },
          { label: 'Perlu Revisi', value: summary.rejected, color: '#EF4444' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-100 shadow-sm px-4 py-3 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl" style={{ background: color }} />
            <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-1">{label}</p>
            <p className="text-[20px] font-bold font-mono" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        <Card padding={false}>
          <SectionHeader
            title="Daftar Berkas Pengajuan"
            icon={<FileBadge size={13} />}
            accent="#F59E0B"
            subtitle={`${filtered.length} ITEM`}
            action={
              <div className="relative">
                <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari kode / nama sumur"
                  className="pl-7 pr-3 py-1 text-[10px] font-mono border border-slate-200 rounded-lg bg-slate-50 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-amber-400 w-48"
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
            <table className="w-full" style={{ minWidth: '690px' }}>
              <thead className="bg-slate-50/60 border-b border-slate-100">
                <tr>
                  <Th label="Kode" k="wellCode" />
                  <th className="text-[9px] font-mono text-slate-400 uppercase tracking-wider px-4 py-3 text-left whitespace-nowrap">
                    Nama Sumur
                  </th>
                  <th className="text-[9px] font-mono text-slate-400 uppercase tracking-wider px-4 py-3 text-left whitespace-nowrap">
                    Jalur
                  </th>
                  <th className="text-[9px] font-mono text-slate-400 uppercase tracking-wider px-4 py-3 text-left whitespace-nowrap">
                    Progress
                  </th>
                  <Th label="Status" k="status" />
                  <Th label="Update" k="updatedAt" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((row) => {
                  const active = selected?.id === row.id;
                  const pct = Math.round((row.uploadedDocumentCount / row.requiredDocumentCount) * 100);
                  return (
                    <tr
                      key={row.id}
                      onClick={() => setSelectedId(row.id)}
                      className={cn('cursor-pointer transition-colors hover:bg-slate-50/60', active && 'bg-amber-50/30')}
                    >
                      <td className="px-4 py-3">
                        <p className="text-[12px] font-bold font-mono text-slate-800">{row.wellCode}</p>
                      </td>
                      <td className="px-4 py-3 text-[11px] text-slate-600">{row.wellName}</td>
                      <td className="px-4 py-3">
                        {row.submissionPath === 'licensed' ? (
                          <span className="inline-flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.5 rounded border bg-emerald-50 text-emerald-700 border-emerald-200">
                            <FileCheck2 size={9} /> Berperizinan
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.5 rounded border bg-blue-50 text-blue-700 border-blue-200">
                            <ClipboardEdit size={9} /> Pengajuan Baru
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-amber-500" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-[9px] font-mono text-slate-500">
                            {row.uploadedDocumentCount}/{row.requiredDocumentCount}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn('text-[9px] font-mono px-2 py-0.5 rounded-full border', STATUS_STYLE[row.docStatus])}>
                          {STATUS_LABEL[row.docStatus]}
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
            <SectionHeader title="Detail Dokumen" icon={<FileText size={13} />} accent="#F59E0B" subtitle={selected.wellCode} />
            <div className="p-4 space-y-3.5">
              <div>
                <p className="text-[9px] font-mono text-slate-400">Nama Sumur</p>
                <p className="text-[12px] font-semibold text-slate-800">{selected.wellName}</p>
              </div>

              {/* Jalur Pengajuan Badge */}
              {selected.submissionPath === 'licensed' ? (
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                  <FileCheck2 size={13} className="text-emerald-600 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] font-semibold text-emerald-800">Jalur Berperizinan</p>
                    <p className="text-[9px] text-emerald-600 font-mono">Tidak memerlukan cross-check surveyor</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                  <ClipboardEdit size={13} className="text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] font-semibold text-blue-800">Jalur Pengajuan Baru</p>
                    <p className="text-[9px] text-blue-600 font-mono">Super Admin akan menugaskan surveyor</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2.5">
                <div className="rounded-lg border border-slate-100 bg-white px-2.5 py-2">
                  <p className="text-[9px] font-mono text-slate-400">Lokasi</p>
                  <p className="text-[11px] font-semibold text-slate-700">{selected.location}</p>
                </div>
                <div className="rounded-lg border border-slate-100 bg-white px-2.5 py-2">
                  <p className="text-[9px] font-mono text-slate-400">Progress</p>
                  <p className="text-[11px] font-semibold font-mono text-slate-700">
                    {selected.uploadedDocumentCount}/{selected.requiredDocumentCount}
                  </p>
                </div>
              </div>

              {selected.submissionPath === 'licensed' && selected.licenseNumber && (
                <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5 space-y-1">
                  <p className="text-[9px] font-mono text-slate-400 mb-1">Info Perizinan</p>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-500">No. Izin</span>
                    <span className="font-mono text-slate-700">{selected.licenseNumber}</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-500">Penerbit</span>
                    <span className="font-mono text-slate-700">{selected.licenseIssuedBy}</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-500">Berlaku s.d.</span>
                    <span className="font-mono text-slate-700">{selected.licenseValidUntil}</span>
                  </div>
                </div>
              )}

              <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5">
                <p className="text-[9px] font-mono text-slate-400 mb-1">Status Pipeline</p>
                <div className="space-y-1.5">
                  <p className="text-[10px] text-slate-600 flex items-center gap-1.5">
                    <UserRoundCheck size={11} className="text-amber-500" />
                    <span>Surveyor:</span>
                    <span className="font-semibold">
                      {selected.submissionPath === 'licensed'
                        ? 'Tidak Diperlukan'
                        : selected.surveyorStatus.replace('_', ' ')}
                    </span>
                  </p>
                  <p className="text-[10px] text-slate-600 flex items-center gap-1.5">
                    <ShieldCheck size={11} className="text-sky-500" />
                    <span>Super Admin:</span>
                    <span className="font-semibold">{selected.superAdminStatus}</span>
                  </p>
                </div>
              </div>

              {(selected.adminNote || selected.surveyorNote || selected.superAdminNote) && (
                <div className="rounded-lg border border-slate-100 bg-white px-3 py-2.5 space-y-2">
                  {selected.adminNote && (
                    <div>
                      <p className="text-[9px] font-mono text-slate-400">Catatan Admin</p>
                      <p className="text-[10px] text-slate-600">{selected.adminNote}</p>
                    </div>
                  )}
                  {selected.surveyorNote && (
                    <div>
                      <p className="text-[9px] font-mono text-slate-400">Catatan Surveyor</p>
                      <p className="text-[10px] text-slate-600">{selected.surveyorNote}</p>
                    </div>
                  )}
                  {selected.superAdminNote && (
                    <div>
                      <p className="text-[9px] font-mono text-slate-400">Catatan Super Admin</p>
                      <p className="text-[10px] text-slate-600">{selected.superAdminNote}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <button
                  onClick={() => addOneAttachment(selected.id)}
                  disabled={selected.uploadedDocumentCount >= selected.requiredDocumentCount}
                  className={cn(
                    'w-full text-[11px] font-semibold rounded-lg px-3 py-2 inline-flex items-center justify-center gap-1.5',
                    selected.uploadedDocumentCount >= selected.requiredDocumentCount
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-amber-500 text-white hover:bg-amber-600',
                  )}
                >
                  <Upload size={12} /> Tambah Lampiran
                </button>

                <button
                  onClick={() => markAllComplete(selected.id)}
                  className="w-full text-[11px] font-semibold rounded-lg px-3 py-2 border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 inline-flex items-center justify-center gap-1.5"
                >
                  <Clock3 size={12} />
                  {selected.submissionPath === 'licensed'
                    ? 'Tandai Lengkap & Kirim Super Admin'
                    : 'Tandai Lengkap & Kirim Surveyor'}
                </button>

                {selected.submissionPath === 'new_application' && (
                  <button
                    onClick={() => markReadyForSuperAdmin(selected.id)}
                    className="w-full text-[11px] font-semibold rounded-lg px-3 py-2 border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 inline-flex items-center justify-center gap-1.5"
                  >
                    <Check size={12} /> Simulasikan Cocok Surveyor
                  </button>
                )}

                <button
                  onClick={() => markNeedsRevision(selected.id)}
                  className="w-full text-[11px] font-semibold rounded-lg px-3 py-2 border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 inline-flex items-center justify-center gap-1.5"
                >
                  <AlertTriangle size={12} /> Simulasikan Perlu Revisi
                </button>
              </div>

              <div className="pt-1 border-t border-slate-100">
                {(() => {
                  const overall = getOverallSubmissionStatus(selected);
                  return (
                    <span className={cn('text-[9px] font-mono px-2 py-0.5 rounded-full border', OVERALL_STATUS_CLASS[overall])}>
                      {OVERALL_STATUS_LABEL[overall]}
                    </span>
                  );
                })()}
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
