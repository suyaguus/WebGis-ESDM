import { useState, useMemo } from 'react';
import {
  Search, Plus, ArrowUpDown, X, FileCheck2, ClipboardEdit,
  Droplets, Gauge, Waves, Upload, Camera, AlertTriangle, CheckCircle2,
  MapPin, ChevronRight, ChevronLeft,
} from 'lucide-react';
import { Card, SectionHeader, StatusPill, Badge } from '../../../components/ui';
import { COMPANY_SENSORS } from '../../../constants/mockData';
import { cn, getSubsidenceColor } from '../../../lib/utils';
import { addWellSubmissionWorkflow } from '@/lib/wellSubmissionWorkflow';
import { useAppStore } from '@/store';
import type { Sensor, SensorStatus, SensorType } from '@/types';

type SortKey = 'code' | 'location' | 'subsidence' | 'status' | 'lastUpdate';
type SubmissionRoute = null | 'licensed' | 'new_application';
type WellType = 'sumur_bor' | 'sumur_dangkal' | 'sumur_besar' | '';
type KondisiFisik = 'baik' | 'rusak_ringan' | 'rusak_berat';
type StepLicensed = 'route' | 'info' | 'license_docs' | 'success';
type StepNewApp = 'route' | 'info' | 'technical' | 'documentation' | 'success';

const WELL_TYPE_LABELS: Record<string, string> = {
  sumur_bor: 'Sumur Bor',
  sumur_dangkal: 'Sumur Dangkal',
  sumur_besar: 'Sumur Besar / Artesis',
};

const KONDISI_OPTIONS: { value: KondisiFisik; label: string; color: string }[] = [
  { value: 'baik', label: 'Baik', color: 'border-emerald-300 bg-emerald-50 text-emerald-700' },
  { value: 'rusak_ringan', label: 'Rusak Ringan', color: 'border-amber-300 bg-amber-50 text-amber-700' },
  { value: 'rusak_berat', label: 'Rusak Berat', color: 'border-red-300 bg-red-50 text-red-700' },
];

/* ──── Sensor Detail Modal ──── */
function SensorDetailModal({ sensor, onClose }: { sensor: Sensor; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <p className="text-[15px] font-bold font-mono text-slate-800">{sensor.code}</p>
            <p className="text-[11px] text-slate-500">{sensor.location}</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusPill status={sensor.status} />
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200">
              <X size={14} className="text-slate-500" />
            </button>
          </div>
        </div>
        <div className="px-6 py-5 grid grid-cols-2 gap-3">
          {[
            ['Tipe Sensor', sensor.type === 'water' ? 'Air Tanah (Groundwater)' : 'GNSS'],
            ['Koordinat', `${sensor.lat.toFixed(4)}, ${sensor.lng.toFixed(4)}`],
            ['Subsidence', `${sensor.subsidence.toFixed(2)} cm/tahun`],
            ['Muka Air Tanah', sensor.waterLevel ? `${sensor.waterLevel} m` : '-'],
            ['Nilai Vertikal', sensor.verticalValue ? `${sensor.verticalValue} mm` : '-'],
            ['Update Terakhir', sensor.lastUpdate],
          ].map(([k, v]) => (
            <div key={k} className="bg-slate-50 rounded-xl px-3 py-2.5">
              <p className="text-[9px] text-slate-400 font-mono uppercase tracking-wider mb-1">{k}</p>
              <p className={cn('text-[12px] font-semibold', k === 'Subsidence' ? getSubsidenceColor(sensor.subsidence) : 'text-slate-800')}>{v}</p>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex gap-2">
          <button className="flex-1 px-4 py-2 bg-amber-500 text-white text-[12px] font-semibold rounded-xl hover:bg-amber-600 transition-colors">Lihat Histori</button>
          <button className="px-4 py-2 bg-slate-100 text-slate-600 text-[12px] font-semibold rounded-xl hover:bg-slate-200">Edit</button>
          <button className="px-4 py-2 bg-red-50 text-red-600 text-[12px] font-semibold rounded-xl hover:bg-red-100 border border-red-200">Nonaktifkan</button>
        </div>
      </div>
    </div>
  );
}

/* ──── Field Component ──── */
function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = 'w-full px-3 py-2 text-[12px] font-mono border border-slate-200 rounded-lg bg-slate-50 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-amber-400';

/* ──── Pengajuan Sumur Modal ──── */
function PengajuanSumurModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [route, setRoute] = useState<SubmissionRoute>(null);

  // Step trackers
  const [stepLicensed, setStepLicensed] = useState<StepLicensed>('route');
  const [stepNewApp, setStepNewApp] = useState<StepNewApp>('route');

  // Basic info (shared)
  const [wellCode, setWellCode] = useState('');
  const [wellName, setWellName] = useState('');
  const [location, setLocation] = useState('');
  const [wellType, setWellType] = useState<WellType>('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [wellDepth, setWellDepth] = useState('');

  // Licensed path
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseIssuedBy, setLicenseIssuedBy] = useState('');
  const [licenseValidUntil, setLicenseValidUntil] = useState('');
  const [licenseDocCount, setLicenseDocCount] = useState(0);

  // New application path — technical
  const [waterLevel, setWaterLevel] = useState('');
  const [debit, setDebit] = useState('');
  const [pH, setPH] = useState('');
  const [tds, setTDS] = useState('');
  const [kekeruhan, setKekeruhan] = useState('');
  const [kualitasAir, setKualitasAir] = useState('');

  // New application path — documentation
  const [kondisi, setKondisi] = useState<KondisiFisik>('baik');
  const [fotoCount, setFotoCount] = useState(0);
  const [catatan, setCatatan] = useState('');

  const [submitting, setSubmitting] = useState(false);

  const currentStep = route === 'licensed' ? stepLicensed : stepNewApp;

  const isInfoValid = wellCode.trim() !== '' && wellName.trim() !== '' && location.trim() !== '' && wellType !== '';
  const isLicenseDocsValid = licenseNumber.trim() !== '' && licenseIssuedBy.trim() !== '' && licenseValidUntil !== '' && licenseDocCount >= 1;
  const isTechnicalValid = waterLevel !== '' && debit !== '';
  const isDocumentationValid = fotoCount >= 1;

  const handleSubmitLicensed = () => {
    setSubmitting(true);
    setTimeout(() => {
      addWellSubmissionWorkflow({
        wellCode: wellCode.trim(),
        wellName: wellName.trim(),
        location: location.trim(),
        wellType,
        submissionPath: 'licensed',
        lat: lat ? parseFloat(lat) : undefined,
        lng: lng ? parseFloat(lng) : undefined,
        wellDepth: wellDepth ? parseFloat(wellDepth) : undefined,
        licenseNumber: licenseNumber.trim(),
        licenseIssuedBy: licenseIssuedBy.trim(),
        licenseValidUntil,
        uploadedDocumentCount: licenseDocCount,
        requiredDocumentCount: 3,
        surveyorStatus: 'not_required',
        superAdminStatus: 'pending',
        adminNote: `Jalur berperizinan — SIPA ${licenseNumber.trim()}`,
      });
      setSubmitting(false);
      setStepLicensed('success');
    }, 1200);
  };

  const handleSubmitNewApp = () => {
    setSubmitting(true);
    setTimeout(() => {
      addWellSubmissionWorkflow({
        wellCode: wellCode.trim(),
        wellName: wellName.trim(),
        location: location.trim(),
        wellType,
        submissionPath: 'new_application',
        lat: lat ? parseFloat(lat) : undefined,
        lng: lng ? parseFloat(lng) : undefined,
        wellDepth: wellDepth ? parseFloat(wellDepth) : undefined,
        uploadedDocumentCount: fotoCount,
        requiredDocumentCount: 7,
        surveyorStatus: 'pending',
        superAdminStatus: 'pending',
        adminNote: catatan.trim() || undefined,
      });
      setSubmitting(false);
      setStepNewApp('success');
    }, 1200);
  };

  const stepLabels = route === 'licensed'
    ? ['Pilih Jalur', 'Info Sumur', 'Dokumen Izin']
    : ['Pilih Jalur', 'Info Sumur', 'Data Teknis', 'Dokumentasi'];

  const currentStepIndex = route === 'licensed'
    ? ['route', 'info', 'license_docs'].indexOf(stepLicensed)
    : ['route', 'info', 'technical', 'documentation'].indexOf(stepNewApp);

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-2xl overflow-hidden flex flex-col"
        style={{ maxHeight: '90vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <div>
            <p className="text-[15px] font-bold text-slate-800">Daftarkan Sumur Baru</p>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
              {route === 'licensed' ? 'Jalur Berperizinan (tanpa cross-check surveyor)' :
               route === 'new_application' ? 'Jalur Pengajuan Baru (surveyor akan ditugaskan)' :
               'Pilih jalur pengajuan yang sesuai'}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200">
            <X size={14} className="text-slate-500" />
          </button>
        </div>

        {/* Stepper — only show when route is selected and not success */}
        {route !== null && currentStep !== 'success' && (
          <div className="px-6 py-3 border-b border-slate-50 bg-slate-50/50 flex-shrink-0">
            <div className="flex items-center gap-1">
              {stepLabels.map((label, i) => (
                <div key={i} className="flex items-center gap-1 flex-1 min-w-0">
                  <div className={cn(
                    'w-5 h-5 rounded-full text-[9px] font-bold flex items-center justify-center flex-shrink-0',
                    i < currentStepIndex ? 'bg-amber-500 text-white' :
                    i === currentStepIndex ? 'bg-amber-500 text-white ring-2 ring-amber-200' :
                    'bg-slate-200 text-slate-500',
                  )}>
                    {i < currentStepIndex ? '✓' : i + 1}
                  </div>
                  <span className={cn('text-[9px] font-mono truncate', i === currentStepIndex ? 'text-amber-700 font-semibold' : 'text-slate-400')}>
                    {label}
                  </span>
                  {i < stepLabels.length - 1 && <div className="h-px bg-slate-200 flex-1 mx-1" />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* ── Route Selection ── */}
          {currentStep === 'route' && (
            <div className="space-y-4">
              <p className="text-[13px] font-semibold text-slate-700 text-center">
                Apakah sumur Anda sudah memiliki dokumen perizinan (SIPA/SIPAS)?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <button
                  onClick={() => { setRoute('licensed'); setStepLicensed('info'); }}
                  className="group text-left p-5 rounded-2xl border-2 border-slate-100 hover:border-emerald-300 hover:bg-emerald-50/40 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center mb-3 group-hover:bg-emerald-200 transition-colors">
                    <FileCheck2 size={20} className="text-emerald-600" />
                  </div>
                  <p className="text-[13px] font-bold text-slate-800 mb-1">Sudah Punya Izin</p>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Sumur memiliki SIPA / SIPAS. Cukup upload dokumen — tidak perlu cross-check ulang dari surveyor.
                  </p>
                  <div className="mt-3 flex items-center gap-1 text-[10px] font-mono text-emerald-700">
                    <span>Proses lebih cepat</span>
                    <ChevronRight size={11} />
                  </div>
                </button>

                <button
                  onClick={() => { setRoute('new_application'); setStepNewApp('info'); }}
                  className="group text-left p-5 rounded-2xl border-2 border-slate-100 hover:border-blue-300 hover:bg-blue-50/40 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
                    <ClipboardEdit size={20} className="text-blue-600" />
                  </div>
                  <p className="text-[13px] font-bold text-slate-800 mb-1">Belum Punya Izin</p>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Sumur belum memiliki dokumen perizinan. Daftarkan lengkap dari awal — Super Admin akan menugaskan surveyor untuk cross-check.
                  </p>
                  <div className="mt-3 flex items-center gap-1 text-[10px] font-mono text-blue-700">
                    <span>Perlu verifikasi surveyor</span>
                    <ChevronRight size={11} />
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* ── Shared: Info Sumur Step ── */}
          {(stepLicensed === 'info' || stepNewApp === 'info') && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Kode Sumur" required>
                  <input value={wellCode} onChange={e => setWellCode(e.target.value)}
                    placeholder="SW-BDL-005" className={inputCls} />
                </Field>
                <Field label="Nama Sumur" required>
                  <input value={wellName} onChange={e => setWellName(e.target.value)}
                    placeholder="Sumur Bor Dalam Lampung 5" className={inputCls} />
                </Field>
              </div>
              <Field label="Lokasi / Alamat" required>
                <input value={location} onChange={e => setLocation(e.target.value)}
                  placeholder="Bandar Lampung, Lampung" className={inputCls} />
              </Field>
              <Field label="Tipe Sumur" required>
                <select value={wellType} onChange={e => setWellType(e.target.value as WellType)} className={inputCls}>
                  <option value="">— Pilih tipe —</option>
                  {Object.entries(WELL_TYPE_LABELS).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </Field>
              <div className="border-t border-slate-100 pt-4">
                <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                  <MapPin size={10} className="text-amber-500" /> Koordinat & Kedalaman (opsional)
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <Field label="Latitude">
                    <input type="number" step="0.0001" value={lat} onChange={e => setLat(e.target.value)}
                      placeholder="-5.3971" className={inputCls} />
                  </Field>
                  <Field label="Longitude">
                    <input type="number" step="0.0001" value={lng} onChange={e => setLng(e.target.value)}
                      placeholder="105.2668" className={inputCls} />
                  </Field>
                  <Field label="Kedalaman (m)">
                    <input type="number" value={wellDepth} onChange={e => setWellDepth(e.target.value)}
                      placeholder="80" className={inputCls} />
                  </Field>
                </div>
              </div>
            </div>
          )}

          {/* ── Path A: License Docs Step ── */}
          {stepLicensed === 'license_docs' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 flex items-start gap-3">
                <FileCheck2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] font-semibold text-emerald-800">Jalur Berperizinan</p>
                  <p className="text-[10px] text-emerald-600 font-mono mt-0.5">
                    Isi detail dokumen perizinan yang Anda miliki. Pengajuan akan langsung diproses Super Admin tanpa pengecekan surveyor.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Nomor Perizinan (SIPA/SIPAS)" required>
                  <input value={licenseNumber} onChange={e => setLicenseNumber(e.target.value)}
                    placeholder="SIPA/2024/BDL/001" className={inputCls} />
                </Field>
                <Field label="Instansi Penerbit" required>
                  <input value={licenseIssuedBy} onChange={e => setLicenseIssuedBy(e.target.value)}
                    placeholder="Dinas ESDM Lampung" className={inputCls} />
                </Field>
              </div>
              <Field label="Berlaku Sampai" required>
                <input type="date" value={licenseValidUntil} onChange={e => setLicenseValidUntil(e.target.value)} className={inputCls} />
              </Field>
              <div>
                <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
                  Upload Dokumen Perizinan <span className="text-red-400">*</span>
                </label>
                <p className="text-[10px] text-slate-400 font-mono mb-3">
                  Upload SIPA, SIPAS, atau dokumen izin lainnya (min. 1 dokumen)
                </p>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      onClick={() => i < licenseDocCount
                        ? setLicenseDocCount(p => Math.max(p - 1, 0))
                        : setLicenseDocCount(p => Math.min(p + 1, 3))}
                      className={cn(
                        'aspect-[4/3] rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors',
                        i < licenseDocCount
                          ? 'border-emerald-300 bg-emerald-50 hover:bg-red-50 hover:border-red-300 group'
                          : 'border-slate-200 bg-slate-50 hover:border-amber-300 hover:bg-amber-50',
                      )}
                    >
                      {i < licenseDocCount ? (
                        <>
                          <FileCheck2 size={16} className="text-emerald-500 group-hover:text-red-400" />
                          <span className="text-[9px] font-mono text-emerald-600 group-hover:text-red-400">
                            Dok. {i + 1}
                          </span>
                        </>
                      ) : (
                        <>
                          <Upload size={14} className="text-slate-400" />
                          <span className="text-[9px] font-mono text-slate-400">Upload</span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
                {licenseDocCount === 0 && (
                  <p className="text-[9px] text-red-500 font-mono">* Minimal 1 dokumen wajib diunggah</p>
                )}
              </div>
            </div>
          )}

          {/* ── Path B: Technical Data Step ── */}
          {stepNewApp === 'technical' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-start gap-3">
                <ClipboardEdit size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] font-semibold text-blue-800">Pengajuan Baru</p>
                  <p className="text-[10px] text-blue-600 font-mono mt-0.5">
                    Isi data teknis sumur. Super Admin akan menugaskan surveyor untuk melakukan cross-check lapangan.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Kedalaman Muka Air Tanah (m)" required>
                  <div className="relative">
                    <Droplets size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-blue-400" />
                    <input type="number" value={waterLevel} onChange={e => setWaterLevel(e.target.value)}
                      placeholder="-38.2" className="w-full pl-7 pr-8 py-2 text-[12px] font-mono border border-slate-200 rounded-lg bg-slate-50 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-amber-400" />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-slate-400 font-mono">m</span>
                  </div>
                  <p className="text-[9px] text-slate-400 font-mono mt-1">Negatif = di bawah permukaan (contoh: -38.2)</p>
                </Field>
                <Field label="Debit Pengambilan (m³/hari)" required>
                  <div className="relative">
                    <Gauge size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-blue-400" />
                    <input type="number" value={debit} onChange={e => setDebit(e.target.value)}
                      placeholder="124.5" className="w-full pl-7 pr-14 py-2 text-[12px] font-mono border border-slate-200 rounded-lg bg-slate-50 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-amber-400" />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-slate-400 font-mono">m³/hr</span>
                  </div>
                </Field>
              </div>
              <div className="border-t border-slate-100 pt-4">
                <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                  <Waves size={10} className="text-blue-500" /> Kualitas Air (opsional)
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <Field label="pH Air">
                    <input type="number" step="0.1" min="0" max="14" value={pH} onChange={e => setPH(e.target.value)}
                      placeholder="7.1" className={inputCls} />
                    <p className="text-[9px] text-slate-400 font-mono mt-0.5">Normal: 6.5–8.5</p>
                  </Field>
                  <Field label="TDS (mg/L)">
                    <input type="number" value={tds} onChange={e => setTDS(e.target.value)}
                      placeholder="320" className={inputCls} />
                    <p className="text-[9px] text-slate-400 font-mono mt-0.5">Batas: &lt;500</p>
                  </Field>
                  <Field label="Kekeruhan (NTU)">
                    <input type="number" step="0.1" value={kekeruhan} onChange={e => setKekeruhan(e.target.value)}
                      placeholder="2.4" className={inputCls} />
                    <p className="text-[9px] text-slate-400 font-mono mt-0.5">Batas: &lt;5</p>
                  </Field>
                </div>
                <div className="mt-3">
                  <Field label="Penilaian Kualitas Air">
                    <select value={kualitasAir} onChange={e => setKualitasAir(e.target.value)} className={inputCls}>
                      <option value="">— Pilih penilaian —</option>
                      <option value="baik">Baik (Layak minum)</option>
                      <option value="sedang">Sedang (Perlu filtrasi)</option>
                      <option value="buruk">Buruk (Tidak layak)</option>
                    </select>
                  </Field>
                </div>
              </div>
            </div>
          )}

          {/* ── Path B: Documentation Step ── */}
          {stepNewApp === 'documentation' && (
            <div className="space-y-4">
              {/* Kondisi Fisik */}
              <div>
                <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
                  Kondisi Fisik Alat <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {KONDISI_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setKondisi(opt.value)}
                      className={cn(
                        'py-3 px-2 rounded-xl border-2 text-[11px] font-semibold transition-all',
                        kondisi === opt.value
                          ? opt.color + ' ring-2 ring-offset-1 ' + (
                            opt.value === 'baik' ? 'ring-emerald-200' :
                            opt.value === 'rusak_ringan' ? 'ring-amber-200' : 'ring-red-200'
                          )
                          : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50',
                      )}
                    >
                      {opt.value === 'baik' ? '✓ ' : opt.value === 'rusak_ringan' ? '⚠ ' : '✕ '}
                      {opt.label}
                    </button>
                  ))}
                </div>
                {kondisi !== 'baik' && (
                  <div className={cn(
                    'mt-3 flex items-start gap-2 rounded-lg px-3 py-2 border',
                    kondisi === 'rusak_ringan' ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200',
                  )}>
                    <AlertTriangle size={12} className={cn('flex-shrink-0 mt-0.5', kondisi === 'rusak_ringan' ? 'text-amber-500' : 'text-red-500')} />
                    <p className={cn('text-[10px] font-mono', kondisi === 'rusak_ringan' ? 'text-amber-700' : 'text-red-700')}>
                      {kondisi === 'rusak_ringan'
                        ? 'Catat detail kerusakan di kolom catatan dan pastikan upload foto dokumentasi.'
                        : 'Kerusakan berat wajib dilaporkan ke Super Admin segera. Sertakan foto lengkap.'}
                    </p>
                  </div>
                )}
              </div>

              {/* Foto */}
              <div className="border-t border-slate-100 pt-4">
                <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
                  Foto Lapangan <span className="text-red-400">*</span>
                  <span className="text-slate-400 ml-1">({fotoCount}/8)</span>
                </label>
                <p className="text-[10px] text-slate-400 font-mono mb-3">Minimal 1 foto · Wajib: foto sumur, kondisi fisik, dan sekitar lokasi</p>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      onClick={() => i < fotoCount
                        ? setFotoCount(p => Math.max(p - 1, 0))
                        : setFotoCount(p => Math.min(p + 1, 8))}
                      className={cn(
                        'aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors',
                        i < fotoCount
                          ? 'border-amber-300 bg-amber-50 hover:bg-red-50 hover:border-red-300 group'
                          : 'border-slate-200 bg-slate-50 hover:border-amber-300',
                      )}
                    >
                      {i < fotoCount ? (
                        <>
                          <Camera size={14} className="text-amber-500 group-hover:text-red-400 transition-colors" />
                          <span className="text-[8px] font-mono text-amber-500 group-hover:text-red-400 transition-colors">Foto {i + 1}</span>
                        </>
                      ) : (
                        <span className="text-slate-300 text-lg">+</span>
                      )}
                    </div>
                  ))}
                </div>
                {fotoCount === 0 && (
                  <p className="text-[9px] text-red-500 font-mono">* Minimal 1 foto wajib diunggah</p>
                )}
              </div>

              {/* Catatan */}
              <div className="border-t border-slate-100 pt-4">
                <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                  Catatan (opsional)
                </label>
                <textarea
                  value={catatan}
                  onChange={e => setCatatan(e.target.value)}
                  rows={3}
                  placeholder="Contoh: Ditemukan kebocoran kecil di pipa inlet, kondisi sumur bor masih stabil..."
                  className="w-full px-3 py-2 text-[11px] font-mono border border-slate-200 rounded-lg bg-slate-50 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-amber-400 resize-none"
                />
                <p className="text-[9px] text-slate-400 font-mono mt-1">{catatan.length}/500 karakter</p>
              </div>
            </div>
          )}

          {/* ── Success ── */}
          {currentStep === 'success' && (
            <div className="flex flex-col items-center text-center py-6 gap-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 size={32} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-[16px] font-bold text-slate-800">Pengajuan Berhasil Dikirim!</p>
                {route === 'licensed' ? (
                  <>
                    <p className="text-[12px] text-slate-500 mt-1">
                      Sumur <span className="font-semibold text-slate-700">{wellCode}</span> berhasil didaftarkan via jalur berperizinan.
                    </p>
                    <div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-left">
                      <p className="text-[11px] font-semibold text-emerald-800 mb-1">Langkah selanjutnya:</p>
                      <p className="text-[10px] text-emerald-600 font-mono">
                        Pengajuan Anda sedang menunggu persetujuan Super Admin. Tidak diperlukan cross-check dari surveyor karena sumur sudah berperizinan.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-[12px] text-slate-500 mt-1">
                      Sumur <span className="font-semibold text-slate-700">{wellCode}</span> berhasil didaftarkan untuk proses perizinan baru.
                    </p>
                    <div className="mt-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-left">
                      <p className="text-[11px] font-semibold text-blue-800 mb-1">Langkah selanjutnya:</p>
                      <p className="text-[10px] text-blue-600 font-mono">
                        Super Admin akan menugaskan surveyor untuk melakukan cross-check data lapangan yang Anda ajukan. Pantau status di halaman "Status Pengajuan".
                      </p>
                    </div>
                  </>
                )}
              </div>
              <button
                onClick={() => { onSuccess(); }}
                className="px-6 py-2.5 bg-amber-500 text-white text-[13px] font-semibold rounded-xl hover:bg-amber-600 transition-colors"
              >
                Selesai
              </button>
            </div>
          )}
        </div>

        {/* Footer actions */}
        {currentStep !== 'route' && currentStep !== 'success' && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between flex-shrink-0 bg-slate-50/50">
            <button
              onClick={() => {
                if (route === 'licensed') {
                  if (stepLicensed === 'info') { setRoute(null); setStepLicensed('route'); }
                  else if (stepLicensed === 'license_docs') setStepLicensed('info');
                } else {
                  if (stepNewApp === 'info') { setRoute(null); setStepNewApp('route'); }
                  else if (stepNewApp === 'technical') setStepNewApp('info');
                  else if (stepNewApp === 'documentation') setStepNewApp('technical');
                }
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-[12px] font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={14} /> Kembali
            </button>

            {/* Next / Submit */}
            {route === 'licensed' && (
              <>
                {stepLicensed === 'info' && (
                  <button
                    disabled={!isInfoValid}
                    onClick={() => setStepLicensed('license_docs')}
                    className={cn(
                      'flex items-center gap-1.5 px-5 py-2 text-[12px] font-semibold rounded-xl transition-colors',
                      isInfoValid ? 'bg-amber-500 text-white hover:bg-amber-600' : 'bg-slate-100 text-slate-400 cursor-not-allowed',
                    )}
                  >
                    Selanjutnya <ChevronRight size={14} />
                  </button>
                )}
                {stepLicensed === 'license_docs' && (
                  <button
                    disabled={!isLicenseDocsValid || submitting}
                    onClick={handleSubmitLicensed}
                    className={cn(
                      'flex items-center gap-1.5 px-5 py-2 text-[12px] font-semibold rounded-xl transition-colors',
                      isLicenseDocsValid && !submitting ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-slate-100 text-slate-400 cursor-not-allowed',
                    )}
                  >
                    {submitting ? <><span className="animate-spin">⏳</span> Mengirim...</> : <><FileCheck2 size={14} /> Submit Pengajuan</>}
                  </button>
                )}
              </>
            )}

            {route === 'new_application' && (
              <>
                {stepNewApp === 'info' && (
                  <button
                    disabled={!isInfoValid}
                    onClick={() => setStepNewApp('technical')}
                    className={cn(
                      'flex items-center gap-1.5 px-5 py-2 text-[12px] font-semibold rounded-xl transition-colors',
                      isInfoValid ? 'bg-amber-500 text-white hover:bg-amber-600' : 'bg-slate-100 text-slate-400 cursor-not-allowed',
                    )}
                  >
                    Selanjutnya <ChevronRight size={14} />
                  </button>
                )}
                {stepNewApp === 'technical' && (
                  <button
                    disabled={!isTechnicalValid}
                    onClick={() => setStepNewApp('documentation')}
                    className={cn(
                      'flex items-center gap-1.5 px-5 py-2 text-[12px] font-semibold rounded-xl transition-colors',
                      isTechnicalValid ? 'bg-amber-500 text-white hover:bg-amber-600' : 'bg-slate-100 text-slate-400 cursor-not-allowed',
                    )}
                  >
                    Selanjutnya <ChevronRight size={14} />
                  </button>
                )}
                {stepNewApp === 'documentation' && (
                  <button
                    disabled={!isDocumentationValid || submitting}
                    onClick={handleSubmitNewApp}
                    className={cn(
                      'flex items-center gap-1.5 px-5 py-2 text-[12px] font-semibold rounded-xl transition-colors',
                      isDocumentationValid && !submitting ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-100 text-slate-400 cursor-not-allowed',
                    )}
                  >
                    {submitting ? <><span className="animate-spin">⏳</span> Mengirim...</> : <><ClipboardEdit size={14} /> Submit Pengajuan</>}
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ──── Main Page ──── */
export default function AdminSumurPage() {
  const { setActivePage } = useAppStore();
  const [search, setSearch]   = useState('');
  const [statusF, setStatusF] = useState<SensorStatus | 'all'>('all');
  const [typeF, setTypeF]     = useState<SensorType | 'all'>('all');
  const [sortKey, setSortKey] = useState<SortKey>('code');
  const [sortAsc, setSortAsc] = useState(true);
  const [detail, setDetail]   = useState<Sensor | null>(null);
  const [showForm, setShowForm] = useState(false);

  const data = useMemo(() => {
    let d = [...COMPANY_SENSORS];
    if (statusF !== 'all') d = d.filter(s => s.status === statusF);
    if (typeF   !== 'all') d = d.filter(s => s.type   === typeF);
    if (search) d = d.filter(s =>
      s.code.toLowerCase().includes(search.toLowerCase()) ||
      s.location.toLowerCase().includes(search.toLowerCase()),
    );
    d.sort((a, b) => {
      const av = a[sortKey] as string | number, bv = b[sortKey] as string | number;
      if (typeof av === 'string') return sortAsc ? av.localeCompare(bv as string) : (bv as string).localeCompare(av);
      return sortAsc ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
    return d;
  }, [search, statusF, typeF, sortKey, sortAsc]);

  const Th = ({ label, k }: { label: string; k: SortKey }) => (
    <th
      onClick={() => { setSortKey(k); if (sortKey === k) setSortAsc(p => !p); else setSortAsc(true); }}
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[18px] font-semibold text-slate-800">Daftar Sumur</h1>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">Semua sensor PT Maju Jaya Tbk</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-3 md:px-4 py-2 bg-amber-500 text-white text-[12px] font-semibold rounded-xl hover:bg-amber-600 transition-colors flex items-center gap-2 whitespace-nowrap shadow-sm"
        >
          <Plus size={13} /><span className="hidden sm:block">Daftarkan Sumur</span>
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Sensor',   value: COMPANY_SENSORS.length,                                     color: '#F59E0B', bg: 'bg-amber-50  border-amber-200'   },
          { label: 'Online',         value: COMPANY_SENSORS.filter(s => s.status === 'online').length,   color: '#22C55E', bg: 'bg-emerald-50 border-emerald-200' },
          { label: 'Alert / Kritis', value: COMPANY_SENSORS.filter(s => s.status === 'alert').length,   color: '#EF4444', bg: 'bg-red-50     border-red-200'     },
          { label: 'Maintenance',    value: COMPANY_SENSORS.filter(s => s.status === 'maintenance').length, color: '#8B5CF6', bg: 'bg-purple-50  border-purple-200' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={cn('rounded-xl border px-4 py-3', bg)}>
            <p className="text-[9px] font-mono text-slate-400 uppercase mb-1">{label}</p>
            <p className="text-[18px] md:text-[22px] font-bold font-mono" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <Card padding={false}>
        <div className="flex flex-wrap items-center gap-2 px-3 md:px-4 py-3 border-b border-slate-100">
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari kode / lokasi..."
              className="pl-8 pr-3 py-1.5 text-[11px] font-mono border border-slate-200 rounded-lg bg-slate-50 text-slate-700 w-full sm:w-48 focus:outline-none focus:border-amber-400"
            />
          </div>
          <div className="flex gap-1">
            {(['all', 'online', 'alert', 'maintenance', 'offline'] as const).map(s => (
              <button key={s} onClick={() => setStatusF(s)}
                className={cn('text-[9px] font-mono px-2.5 py-1 rounded-full border transition-all',
                  statusF === s ? 'bg-amber-50 text-amber-700 border-amber-200' : 'text-slate-400 border-transparent hover:bg-slate-50')}>
                {s === 'all' ? 'Semua' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex gap-1">
            {(['all', 'water', 'gnss'] as const).map(t => (
              <button key={t} onClick={() => setTypeF(t)}
                className={cn('text-[9px] font-mono px-2.5 py-1 rounded-full border transition-all',
                  typeF === t ? 'bg-blue-50 text-blue-700 border-blue-200' : 'text-slate-400 border-transparent hover:bg-slate-50')}>
                {t === 'all' ? 'Semua Tipe' : t === 'water' ? 'Air Tanah' : 'GNSS'}
              </button>
            ))}
          </div>
          <span className="ml-auto text-[10px] text-slate-400 font-mono">{data.length} sensor</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full" style={{ minWidth: '620px' }}>
            <thead className="bg-slate-50/60 border-b border-slate-100">
              <tr>
                <Th label="Kode"       k="code"       />
                <Th label="Lokasi"     k="location"   />
                <th className="text-[9px] font-mono text-slate-400 uppercase tracking-wider px-4 py-3 text-left">Tipe</th>
                <Th label="Subsidence" k="subsidence" />
                <th className="text-[9px] font-mono text-slate-400 uppercase tracking-wider px-4 py-3 text-left">Muka Air</th>
                <Th label="Status"     k="status"     />
                <Th label="Update"     k="lastUpdate" />
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.map(s => (
                <tr key={s.id} className={cn('hover:bg-slate-50/60 transition-colors', s.status === 'alert' && 'bg-red-50/20')}>
                  <td className="px-4 py-3 font-mono text-[12px] font-bold text-slate-800">{s.code}</td>
                  <td className="px-4 py-3 text-[11px] text-slate-600">{s.location}</td>
                  <td className="px-4 py-3">
                    <Badge variant={s.type === 'water' ? 'info' : 'neutral'}>{s.type === 'water' ? 'Air Tanah' : 'GNSS'}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn('text-[12px] font-semibold font-mono', getSubsidenceColor(s.subsidence))}>{s.subsidence.toFixed(2)}</span>
                    <span className="text-[9px] text-slate-400 font-mono ml-0.5">cm/thn</span>
                  </td>
                  <td className="px-4 py-3 text-[11px] font-mono text-slate-600">{s.waterLevel ? `${s.waterLevel} m` : '-'}</td>
                  <td className="px-4 py-3"><StatusPill status={s.status} /></td>
                  <td className="px-4 py-3 text-[10px] text-slate-400 font-mono">{s.lastUpdate}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => setDetail(s)} className="text-[10px] font-mono text-amber-600 hover:text-amber-800 font-medium">Detail →</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty state + CTA */}
        {data.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-[13px] text-slate-400 font-mono">Tidak ada sensor yang cocok</p>
          </div>
        )}
      </Card>

      {/* Info banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-3">
        <FileCheck2 size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-[11px] font-semibold text-amber-800">Ingin mendaftarkan sumur baru?</p>
          <p className="text-[10px] text-amber-600 font-mono mt-0.5">
            Klik "Daftarkan Sumur" untuk memulai. Jika sudah punya SIPA/SIPAS, proses bisa diselesaikan tanpa cross-check surveyor.
          </p>
        </div>
        <button
          onClick={() => setActivePage('ap-dokumen')}
          className="text-[10px] font-mono text-amber-700 hover:text-amber-900 font-semibold whitespace-nowrap"
        >
          Lihat Pengajuan →
        </button>
      </div>

      {detail && <SensorDetailModal sensor={detail} onClose={() => setDetail(null)} />}

      {showForm && (
        <PengajuanSumurModal
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            setActivePage('ap-dokumen');
          }}
        />
      )}
    </div>
  );
}
