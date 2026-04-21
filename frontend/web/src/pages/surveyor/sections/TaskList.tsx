import { CheckCircle2, Clock, AlertTriangle, Radio, Satellite } from 'lucide-react';
import { Card, SectionHeader } from '../../../components/ui';
import { cn } from '../../../lib/utils';
import { TODAY_TASKS } from '../../../constants/surveyorData';
import { useAppStore } from '../../../store';

export default function SurveyorTaskList() {
  const { setActivePage } = useAppStore();

  return (
    <Card padding={false} className="flex flex-col">
      <SectionHeader
        title="Tugas Hari Ini"
        subtitle={`${TODAY_TASKS.filter(t => t.status === 'selesai').length}/${TODAY_TASKS.length} SELESAI`}
        icon={<Clock size={13} />}
        accent="#3B82F6"
      />
      <div className="divide-y divide-slate-50">
        {TODAY_TASKS.map(task => {
          const isSelesai  = task.status === 'selesai';
          const isTerlambat = task.status === 'terlambat';

          return (
            <div key={task.sensorCode} className={cn(
              'px-4 py-3 flex items-center gap-3',
              isSelesai ? 'bg-emerald-50/30' : isTerlambat ? 'bg-red-50/30' : 'bg-white',
            )}>
              {/* Status icon */}
              <div className="flex-shrink-0">
                {isSelesai ? (
                  <CheckCircle2 size={18} className="text-emerald-500" />
                ) : isTerlambat ? (
                  <AlertTriangle size={18} className="text-red-500" />
                ) : (
                  <div className="w-[18px] h-[18px] rounded-full border-2 border-slate-300 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-slate-300" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[12px] font-bold font-mono text-slate-800">{task.sensorCode}</span>
                  <span className={cn(
                    'text-[9px] font-mono px-1.5 py-0.5 rounded border',
                    task.type === 'gnss'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-blue-50 text-blue-700 border-blue-200',
                  )}>
                    {task.type === 'gnss' ? 'GNSS' : 'AIR TANAH'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 truncate">{task.location}</p>
              </div>

              {/* Time info */}
              <div className="text-right flex-shrink-0">
                <p className="text-[9px] font-mono text-slate-400">Target: {task.targetTime}</p>
                {isSelesai && task.submittedAt && (
                  <p className="text-[9px] font-mono text-emerald-600 font-medium">✓ {task.submittedAt}</p>
                )}
                {!isSelesai && (
                  <button
                    onClick={() => setActivePage('sv-input')}
                    className="mt-0.5 text-[9px] font-mono font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md transition-colors"
                  >
                    Input →
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/50 flex-shrink-0">
        <button
          onClick={() => setActivePage('sv-input')}
          className="text-[11px] text-blue-600 hover:text-blue-700 font-medium w-full text-center"
        >
          Input pengukuran baru →
        </button>
      </div>
    </Card>
  );
}
