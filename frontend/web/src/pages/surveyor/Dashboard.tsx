import { ClipboardEdit, Map, Radio, FileText } from 'lucide-react';
import { useAppStore } from '../../store';
import { cn } from '../../lib/utils';
import { SURVEYOR_PROFILE, TODAY_TASKS, SURVEYOR_MEASUREMENTS } from '../../constants/surveyorData';
import SurveyorStatsRow     from './sections/StatsRow';
import SurveyorTaskList     from './sections/TaskList';
import RecentMeasurements   from './sections/RecentMeasurements';
import SensorSummary        from './sections/SensorSummary';

const QUICK_ACTIONS = [
  { key: 'sv-input',   label: 'Input Pengukuran', icon: ClipboardEdit, color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100', primary: true },
  { key: 'sv-peta',    label: 'Peta Sensor',       icon: Map,           color: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' },
  { key: 'sv-sensor',  label: 'Sensor Saya',       icon: Radio,         color: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100' },
  { key: 'sv-laporan', label: 'Riwayat Laporan',   icon: FileText,      color: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' },
];

export default function SurveyorDashboard() {
  const { setActivePage } = useAppStore();

  const completedToday = TODAY_TASKS.filter(t => t.status === 'selesai').length;
  const totalToday     = TODAY_TASKS.length;
  const pendingVerif   = SURVEYOR_MEASUREMENTS.filter(m => m.status === 'pending').length;

  return (
    <div className="p-3 md:p-5 space-y-3 md:space-y-4 w-full">
      {/* Page heading */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-[18px] font-semibold text-slate-800 leading-tight">
            Selamat Pagi, {SURVEYOR_PROFILE.name.split(' ')[0]} 👋
          </h1>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
            {SURVEYOR_PROFILE.company} · {SURVEYOR_PROFILE.region}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
          <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap">Online</span>
        </div>
      </div>

      {/* Status banner */}
      {pendingVerif > 0 && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <span className="text-amber-500 text-base flex-shrink-0">⏳</span>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-amber-800">
              {pendingVerif} pengukuran menunggu verifikasi
            </p>
            <p className="text-[10px] text-amber-600 font-mono mt-0.5">
              Data akan diverifikasi oleh Admin Perusahaan
            </p>
          </div>
          <button
            onClick={() => setActivePage('sv-laporan')}
            className="text-[10px] font-mono text-amber-700 hover:text-amber-900 font-semibold flex-shrink-0"
          >
            Lihat →
          </button>
        </div>
      )}

      {completedToday === totalToday && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
          <span className="text-emerald-500 text-base flex-shrink-0">✅</span>
          <p className="text-[12px] font-semibold text-emerald-800">
            Semua tugas hari ini selesai! ({totalToday}/{totalToday})
          </p>
        </div>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {QUICK_ACTIONS.map(({ key, label, icon: Icon, color, primary }) => (
          <button
            key={key}
            onClick={() => setActivePage(key)}
            className={cn(
              'flex items-center gap-2.5 px-4 py-3 rounded-xl border font-medium text-[12px] transition-all shadow-sm hover:shadow',
              color,
              primary && 'ring-1 ring-blue-300',
            )}
          >
            <Icon size={14} className="flex-shrink-0" />
            <span className="truncate">{label}</span>
          </button>
        ))}
      </div>

      {/* Stats row */}
      <SurveyorStatsRow />

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        {/* Left */}
        <div className="space-y-4">
          <SurveyorTaskList />
          <RecentMeasurements />
        </div>
        {/* Right */}
        <div className="space-y-4">
          <SensorSummary />

          {/* Info card */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
            <p className="text-[11px] font-semibold text-slate-700 mb-3">Panduan Pengukuran</p>
            <div className="space-y-2.5">
              {[
                { step: '1', text: 'Kunjungi lokasi sensor sesuai jadwal', color: 'bg-blue-100 text-blue-700' },
                { step: '2', text: 'Input kedalaman, debit, dan kualitas air', color: 'bg-emerald-100 text-emerald-700' },
                { step: '3', text: 'Upload minimal 2 foto kondisi lapangan', color: 'bg-amber-100 text-amber-700' },
                { step: '4', text: 'Submit dan tunggu verifikasi admin', color: 'bg-purple-100 text-purple-700' },
              ].map(({ step, text, color }) => (
                <div key={step} className="flex items-start gap-2.5">
                  <span className={cn('w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 mt-0.5', color)}>
                    {step}
                  </span>
                  <p className="text-[10px] text-slate-500 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
