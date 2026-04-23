import { useState } from 'react';
import { Users, Phone, MapPin, CheckCircle, Clock, WifiOff, Activity } from 'lucide-react';
import { Card, SectionHeader } from '../../../components/ui';
import { SURVEYOR_TASKS, COMPANY_SENSORS } from '../../../constants/mockData';
import { cn } from '../../../lib/utils';
import type { SurveyorTask } from '../../../constants/mockData';

const STATUS_CONFIG = {
  online:    { label: 'Online',     color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', icon: CheckCircle },
  measuring: { label: 'Mengukur',   color: 'bg-blue-50 text-blue-700 border-blue-200',         dot: 'bg-blue-500',    icon: Activity },
  offline:   { label: 'Offline',    color: 'bg-slate-100 text-slate-500 border-slate-200',     dot: 'bg-slate-400',   icon: WifiOff },
};

function SurveyorCard({ sv }: { sv: SurveyorTask }) {
  const cfg = STATUS_CONFIG[sv.status];
  const StatusIcon = cfg.icon;
  const progress = sv.totalToday > 0 ? (sv.completedToday / sv.totalToday) * 100 : 0;

  return (
    <div className={cn('bg-white rounded-xl border shadow-sm p-4 flex flex-col gap-3', sv.status === 'offline' ? 'border-slate-100 opacity-70' : 'border-slate-100 hover:border-amber-200 hover:shadow-md transition-all')}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-[13px] font-bold text-white flex-shrink-0">
              {sv.surveyorAvatar}
            </div>
            <span className={cn('absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white flex-shrink-0', cfg.dot)} />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-slate-800 leading-tight">{sv.surveyorName}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <Phone size={9} className="text-slate-400" />
              <span className="text-[9px] font-mono text-slate-400">{sv.phone}</span>
            </div>
          </div>
        </div>
        <span className={cn('text-[9px] font-mono font-medium px-2 py-0.5 rounded-full border flex items-center gap-1', cfg.color)}>
          <StatusIcon size={9} /> {cfg.label}
        </span>
      </div>

      {/* Location */}
      {sv.status !== 'offline' && (
        <div className="flex items-center gap-1.5 bg-slate-50 rounded-lg px-2.5 py-1.5">
          <MapPin size={10} className="text-amber-500 flex-shrink-0" />
          <span className="text-[10px] text-slate-600 font-mono">{sv.location}</span>
          <span className="text-[9px] text-slate-400 font-mono ml-auto">{sv.lastActivity}</span>
        </div>
      )}

      {/* Assigned sensors */}
      <div>
        <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">Sensor Ditugaskan</p>
        <div className="flex flex-wrap gap-1.5">
          {sv.assignedSensors.map(code => {
            const sensor = COMPANY_SENSORS.find(s => s.code === code);
            return (
              <span key={code} className={cn('text-[9px] font-mono font-semibold px-2 py-0.5 rounded-md border',
                sensor?.status === 'alert' ? 'bg-red-50 text-red-700 border-red-200'
                : sensor?.status === 'maintenance' ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-slate-50 text-slate-600 border-slate-200')}>
                {code}
              </span>
            );
          })}
        </div>
      </div>

      {/* Progress */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[9px] font-mono text-slate-400">Progress Hari Ini</span>
          <span className="text-[10px] font-mono font-semibold text-slate-700">{sv.completedToday}/{sv.totalToday} tugas</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: progress === 100 ? '#22C55E' : progress >= 50 ? '#F59E0B' : '#EF4444' }} />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[8px] font-mono text-slate-400">{sv.completedToday} selesai</span>
          <span className="text-[8px] font-mono text-slate-400">{sv.totalToday - sv.completedToday} tersisa</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1 border-t border-slate-100">
        <button className="flex-1 py-1.5 text-[10px] font-mono font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors">
          Kirim Pesan
        </button>
        <button className="flex-1 py-1.5 text-[10px] font-mono font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors">
          Lihat Tugas
        </button>
      </div>
    </div>
  );
}

export default function AdminTimPage() {
  const totalTasks     = SURVEYOR_TASKS.reduce((a, s) => a + s.totalToday, 0);
  const completedTasks = SURVEYOR_TASKS.reduce((a, s) => a + s.completedToday, 0);
  const online         = SURVEYOR_TASKS.filter(s => s.status !== 'offline').length;

  return (
    <div className="p-3 md:p-5 space-y-3 md:space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[18px] font-semibold text-slate-800">Tim Lapangan</h1>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">Surveyor aktif PT Maju Jaya Tbk</p>
        </div>
        <button className="px-3 md:px-4 py-2 bg-amber-500 text-white text-[12px] font-semibold rounded-xl hover:bg-amber-600 flex items-center gap-2 whitespace-nowrap">
          <Users size={13} /><span className="hidden sm:block">Atur Penugasan</span>
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Surveyor', value: SURVEYOR_TASKS.length, color: '#F59E0B', bg: 'bg-amber-50  border-amber-200'   },
          { label: 'Online / Aktif',   value: online,                   color: '#22C55E', bg: 'bg-emerald-50 border-emerald-200' },
          { label: 'Tugas Selesai',    value: completedTasks,            color: '#3B82F6', bg: 'bg-blue-50    border-blue-200'   },
          { label: 'Total Tugas',      value: totalTasks,                color: '#8B5CF6', bg: 'bg-purple-50  border-purple-200' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={cn('rounded-xl border px-4 py-3', bg)}>
            <p className="text-[9px] font-mono text-slate-400 uppercase mb-1">{label}</p>
            <p className="text-[18px] md:text-[22px] font-bold font-mono" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Overall progress */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[13px] font-semibold text-slate-800">Progress Keseluruhan Hari Ini</p>
          <span className="text-[13px] font-bold font-mono text-amber-700">{totalTasks > 0 ? Math.round((completedTasks/totalTasks)*100) : 0}%</span>
        </div>
        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all"
            style={{ width: `${totalTasks > 0 ? (completedTasks/totalTasks)*100 : 0}%` }} />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[10px] font-mono text-slate-500">{completedTasks} tugas selesai</span>
          <span className="text-[10px] font-mono text-slate-500">{totalTasks - completedTasks} tugas tersisa</span>
        </div>
      </Card>

      {/* Surveyor cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SURVEYOR_TASKS.map(sv => <SurveyorCard key={sv.id} sv={sv} />)}
      </div>
    </div>
  );
}
