import { CheckCircle2, Clock } from 'lucide-react';
import { Card, SectionHeader } from '../../../components/ui';
import { cn } from '../../../lib/utils';
import { useAppStore } from '../../../store';
import { useSupervisorWells, useMeasurements } from '../../../hooks';

interface Props {
  selectedWellId?: string | null;
  onSelect?: (id: string | null) => void;
}

export default function SurveyorTaskList({ selectedWellId, onSelect }: Props) {
  const { setActivePage } = useAppStore();

  const { data: wellsData, isLoading: loadingWells } = useSupervisorWells(1, 100);
  const wells = wellsData?.data ?? [];

  const { data: measurements = [], isLoading: loadingMeasurements } = useMeasurements(
    undefined,
    { refetchInterval: 30_000 },
  );

  const today = new Date().toLocaleDateString('id-ID');
  const tasks = wells.map((sensor) => ({
    ...sensor,
    doneToday: measurements.some(
      (m) => m.sensorId === sensor.id && m.submittedAt === today,
    ),
  }));
  const doneCount = tasks.filter((t) => t.doneToday).length;
  const isLoading = loadingWells || loadingMeasurements;

  return (
    <Card padding={false} className="flex flex-col">
      <SectionHeader
        title="Tugas Hari Ini"
        subtitle={isLoading ? 'Memuat...' : `${doneCount}/${tasks.length} SELESAI`}
        icon={<Clock size={13} />}
        accent="#3B82F6"
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-10 text-[11px] text-slate-400 font-mono">
          Memuat tugas...
        </div>
      ) : tasks.length === 0 ? (
        <div className="flex items-center justify-center py-10 text-[11px] text-slate-400 font-mono">
          Tidak ada sumur yang ditugaskan
        </div>
      ) : (
        <div className="divide-y divide-slate-50">
          {tasks.map((task) => {
            const isSelected = selectedWellId === task.id;
            return (
              <button
                key={task.id}
                onClick={() => onSelect?.(isSelected ? null : task.id)}
                className={cn(
                  'w-full text-left px-4 py-3 flex items-center gap-3 transition-colors',
                  isSelected
                    ? 'bg-blue-50 border-r-2 border-blue-500'
                    : task.doneToday
                      ? 'bg-emerald-50/30 hover:bg-emerald-50/60'
                      : 'bg-white hover:bg-slate-50/60',
                )}
              >
                <div className="flex-shrink-0">
                  {task.doneToday ? (
                    <CheckCircle2 size={18} className="text-emerald-500" />
                  ) : (
                    <div className="w-[18px] h-[18px] rounded-full border-2 border-slate-300 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-slate-300" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[12px] font-bold font-mono text-slate-800">
                      {task.code}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded border bg-blue-50 text-blue-700 border-blue-200">
                      AIR TANAH
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 truncate">{task.location}</p>
                </div>

                <div className="text-right flex-shrink-0">
                  {task.doneToday ? (
                    <p className="text-[9px] font-mono text-emerald-600 font-medium">
                      ✓ Terkirim hari ini
                    </p>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivePage('sv-input');
                      }}
                      className="mt-0.5 text-[9px] font-mono font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md transition-colors"
                    >
                      Input →
                    </button>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

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
