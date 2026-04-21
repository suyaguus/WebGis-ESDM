import { useState } from 'react';
import { FileText, CheckCircle2, Clock, XCircle, Filter, Camera } from 'lucide-react';
import { Card, SectionHeader } from '../../../components/ui';
import { cn } from '../../../lib/utils';
import { SURVEYOR_MEASUREMENTS, SURVEYOR_SENSORS } from '../../../constants/surveyorData';
import type { MeasurementStatus } from '../../../constants/surveyorData';

type FilterStatus = MeasurementStatus | 'all';

function StatusBadge({ status }: { status: MeasurementStatus }) {
  if (status === 'verified')
    return (
      <span className="flex items-center gap-1 text-[9px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full whitespace-nowrap">
        <CheckCircle2 size={9} /> Terverifikasi
      </span>
    );
  if (status === 'rejected')
    return (
      <span className="flex items-center gap-1 text-[9px] font-mono text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full whitespace-nowrap">
        <XCircle size={9} /> Ditolak
      </span>
    );
  return (
    <span className="flex items-center gap-1 text-[9px] font-mono text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full whitespace-nowrap">
      <Clock size={9} /> Menunggu
    </span>
  );
}

export default function SurveyorLaporanPage() {
  const [filterStatus,  setFilterStatus]  = useState<FilterStatus>('all');
  const [filterSensor,  setFilterSensor]  = useState<string>('all');
  const [expandedId,    setExpandedId]    = useState<string | null>(null);

  const filtered = SURVEYOR_MEASUREMENTS.filter(m => {
    if (filterStatus !== 'all' && m.status !== filterStatus) return false;
    if (filterSensor !== 'all' && m.sensorCode !== filterSensor) return false;
    return true;
  });

  const stats = {
    total:    SURVEYOR_MEASUREMENTS.length,
    verified: SURVEYOR_MEASUREMENTS.filter(m => m.status === 'verified').length,
    pending:  SURVEYOR_MEASUREMENTS.filter(m => m.status === 'pending').length,
    rejected: SURVEYOR_MEASUREMENTS.filter(m => m.status === 'rejected').length,
  };

  return (
    <div className="p-3 md:p-5 space-y-3 md:space-y-4 w-full">
      {/* Header */}
      <div>
        <h1 className="text-[18px] font-semibold text-slate-800">Riwayat Laporan</h1>
        <p className="text-[11px] text-slate-400 font-mono mt-0.5">
          Semua pengukuran yang telah Anda submit · Read only
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Pengukuran', value: stats.total,    color: '#3B82F6' },
          { label: 'Terverifikasi',    value: stats.verified, color: '#22C55E' },
          { label: 'Menunggu',         value: stats.pending,  color: '#F59E0B' },
          { label: 'Ditolak',          value: stats.rejected, color: '#EF4444' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-100 shadow-sm px-4 py-3 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl" style={{ background: color }} />
            <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-1">{label}</p>
            <p className="text-[20px] font-bold font-mono" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-4">
        {/* Main list */}
        <Card padding={false} className="flex flex-col">
          <SectionHeader
            title="Daftar Pengukuran"
            icon={<FileText size={13} />}
            accent="#3B82F6"
            subtitle={`${filtered.length} ENTRI`}
          />

          {/* Filter bar */}
          <div className="px-4 py-2.5 border-b border-slate-100 flex items-center gap-2 flex-wrap bg-slate-50/50">
            <Filter size={11} className="text-slate-400 flex-shrink-0" />

            {/* Status filter */}
            <div className="flex gap-1 flex-wrap">
              {([
                { key: 'all',      label: 'Semua' },
                { key: 'verified', label: 'Terverifikasi' },
                { key: 'pending',  label: 'Menunggu' },
                { key: 'rejected', label: 'Ditolak' },
              ] as { key: FilterStatus; label: string }[]).map(f => (
                <button
                  key={f.key}
                  onClick={() => setFilterStatus(f.key)}
                  className={cn(
                    'text-[9px] font-mono px-2.5 py-0.5 rounded-full border transition-all',
                    filterStatus === f.key
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'text-slate-400 border-slate-200 hover:bg-slate-100',
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Sensor filter */}
            <select
              value={filterSensor}
              onChange={e => setFilterSensor(e.target.value)}
              className="text-[10px] font-mono border border-slate-200 rounded-lg px-2 py-0.5 bg-white text-slate-600 focus:outline-none focus:border-blue-400 ml-auto"
            >
              <option value="all">Semua Sensor</option>
              {SURVEYOR_SENSORS.map(s => (
                <option key={s.code} value={s.code}>{s.code}</option>
              ))}
            </select>
          </div>

          {/* List */}
          <div className="flex-1 divide-y divide-slate-50 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText size={28} className="text-slate-300 mb-2" />
                <p className="text-[11px] text-slate-400 font-mono">Tidak ada data ditemukan</p>
              </div>
            ) : filtered.map(m => {
              const isExpanded = expandedId === m.id;
              return (
                <div key={m.id} className={cn(
                  m.status === 'rejected' && 'border-l-2 border-l-red-400',
                )}>
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : m.id)}
                    className="w-full text-left px-4 py-3 hover:bg-slate-50/60 transition-colors"
                  >
                    {/* Top row */}
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-[13px] font-bold font-mono text-slate-800">{m.sensorCode}</span>
                        <span className={cn(
                          'text-[9px] font-mono px-1.5 py-0.5 rounded border flex-shrink-0',
                          SURVEYOR_SENSORS.find(s => s.code === m.sensorCode)?.type === 'gnss'
                            ? 'bg-amber-50 text-amber-600 border-amber-200'
                            : 'bg-blue-50 text-blue-600 border-blue-200',
                        )}>
                          {SURVEYOR_SENSORS.find(s => s.code === m.sensorCode)?.type === 'gnss' ? 'GNSS' : 'AT'}
                        </span>
                      </div>
                      <StatusBadge status={m.status} />
                    </div>

                    {/* Date + time */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-mono">{m.date} · {m.submittedAt}</span>
                      {m.fotoCount > 0 && (
                        <span className="flex items-center gap-1 text-[9px] text-slate-400 font-mono">
                          <Camera size={9} /> {m.fotoCount} foto
                        </span>
                      )}
                    </div>

                    {/* Summary values */}
                    {m.waterLevel !== 0 && (
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[10px] font-mono text-blue-600 font-semibold">MAT: {m.waterLevel} m</span>
                        <span className="text-[10px] font-mono text-slate-500">{m.debit} m³/hr</span>
                        {m.pH > 0 && <span className="text-[10px] font-mono text-slate-500">pH: {m.pH}</span>}
                      </div>
                    )}
                  </button>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div className="px-4 pb-4 bg-slate-50/50 border-t border-slate-100">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2.5 mt-3">
                        {m.waterLevel !== 0 && <>
                          <div>
                            <p className="text-[9px] font-mono text-slate-400 uppercase">Muka Air</p>
                            <p className="text-[11px] font-semibold text-slate-700">{m.waterLevel} m</p>
                          </div>
                          <div>
                            <p className="text-[9px] font-mono text-slate-400 uppercase">Debit</p>
                            <p className="text-[11px] font-semibold text-slate-700">{m.debit} m³/hr</p>
                          </div>
                          {m.pH > 0 && <>
                            <div>
                              <p className="text-[9px] font-mono text-slate-400 uppercase">pH</p>
                              <p className="text-[11px] font-semibold text-slate-700">{m.pH}</p>
                            </div>
                            <div>
                              <p className="text-[9px] font-mono text-slate-400 uppercase">TDS</p>
                              <p className="text-[11px] font-semibold text-slate-700">{m.tds} mg/L</p>
                            </div>
                            <div>
                              <p className="text-[9px] font-mono text-slate-400 uppercase">Kekeruhan</p>
                              <p className="text-[11px] font-semibold text-slate-700">{m.kekeruhan} NTU</p>
                            </div>
                          </>}
                        </>}
                        <div>
                          <p className="text-[9px] font-mono text-slate-400 uppercase">Kondisi Fisik</p>
                          <p className="text-[11px] font-semibold text-slate-700 capitalize">{m.kondisiFisik.replace('_', ' ')}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-mono text-slate-400 uppercase">Foto</p>
                          <p className="text-[11px] font-semibold text-slate-700">{m.fotoCount} file</p>
                        </div>
                        {m.verifiedBy && (
                          <div>
                            <p className="text-[9px] font-mono text-slate-400 uppercase">Diverifikasi Oleh</p>
                            <p className="text-[11px] font-semibold text-slate-700">{m.verifiedBy}</p>
                          </div>
                        )}
                      </div>

                      {m.catatan && (
                        <div className="mt-3 bg-white rounded-lg border border-slate-100 px-3 py-2">
                          <p className="text-[9px] font-mono text-slate-400 mb-1">CATATAN</p>
                          <p className="text-[10px] text-slate-600 leading-relaxed">{m.catatan}</p>
                        </div>
                      )}

                      {m.status === 'rejected' && m.rejectionNote && (
                        <div className="mt-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                          <p className="text-[9px] font-mono text-red-500 mb-1">ALASAN PENOLAKAN</p>
                          <p className="text-[10px] text-red-700 font-medium leading-relaxed">{m.rejectionNote}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Summary sidebar */}
        <div className="space-y-4">
          {/* Per-sensor summary */}
          <Card padding={false}>
            <SectionHeader title="Per Sensor" icon={<Filter size={13} />} accent="#3B82F6" />
            <div className="divide-y divide-slate-50">
              {SURVEYOR_SENSORS.map(sensor => {
                const sensorMeasurements = SURVEYOR_MEASUREMENTS.filter(m => m.sensorCode === sensor.code);
                const verified = sensorMeasurements.filter(m => m.status === 'verified').length;
                const pending  = sensorMeasurements.filter(m => m.status === 'pending').length;
                const rejected = sensorMeasurements.filter(m => m.status === 'rejected').length;

                return (
                  <div key={sensor.code} className="px-4 py-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[12px] font-bold font-mono text-slate-800">{sensor.code}</span>
                      <span className="text-[9px] font-mono text-slate-400">{sensorMeasurements.length} total</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-[9px] font-mono text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                        ✓ {verified}
                      </span>
                      <span className="text-[9px] font-mono text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                        ⏳ {pending}
                      </span>
                      {rejected > 0 && (
                        <span className="text-[9px] font-mono text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
                          ✕ {rejected}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Read-only notice */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <p className="text-[11px] font-semibold text-slate-600 mb-2">ℹ Informasi</p>
            <p className="text-[10px] text-slate-500 font-mono leading-relaxed">
              Halaman ini menampilkan riwayat pengukuran Anda. Hanya Admin Perusahaan yang dapat memverifikasi atau menolak data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
