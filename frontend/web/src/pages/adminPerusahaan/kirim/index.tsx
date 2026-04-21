import { useMemo, useState } from 'react';
import { Send, Users, Radio, CheckCircle2, Plus } from 'lucide-react';
import { Card, SectionHeader } from '../../../components/ui';
import { COMPANY_SENSORS, SURVEYOR_TASKS } from '../../../constants/mockData';
import { cn } from '../../../lib/utils';

type TaskStatus = 'draft' | 'sent' | 'in_progress' | 'done';

interface DispatchItem {
  id: string;
  title: string;
  surveyorId: string;
  surveyorName: string;
  sensorCodes: string[];
  dueDate: string;
  status: TaskStatus;
  note: string;
}

const STATUS_LABEL: Record<TaskStatus, string> = {
  draft: 'Draft',
  sent: 'Terkirim',
  in_progress: 'Diproses',
  done: 'Selesai',
};

const STATUS_STYLE: Record<TaskStatus, string> = {
  draft: 'bg-slate-100 text-slate-600 border-slate-200',
  sent: 'bg-blue-50 text-blue-700 border-blue-200',
  in_progress: 'bg-amber-50 text-amber-700 border-amber-200',
  done: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const INITIAL_DISPATCHES: DispatchItem[] = [
  {
    id: 'd1',
    title: 'Batch Monitoring Pagi',
    surveyorId: 'u5',
    surveyorName: 'Eka Prasetya',
    sensorCodes: ['SW-007', 'SW-021'],
    dueDate: 'Hari ini 12:00',
    status: 'in_progress',
    note: 'Fokus pada lokasi dengan alert subsidence tinggi.',
  },
  {
    id: 'd2',
    title: 'Cek GNSS Barat',
    surveyorId: 'u11',
    surveyorName: 'Rudi Hermawan',
    sensorCodes: ['GN-022', 'GN-055'],
    dueDate: 'Hari ini 16:00',
    status: 'sent',
    note: 'Prioritaskan sinkronisasi data vertikal GNSS.',
  },
  {
    id: 'd3',
    title: 'Verifikasi Follow-up',
    surveyorId: 'u12',
    surveyorName: 'Sinta Wulandari',
    sensorCodes: ['SW-014'],
    dueDate: 'Besok 10:00',
    status: 'draft',
    note: 'Ambil ulang foto panel dan bukti koordinat.',
  },
];

export default function AdminKirimSurveyorPage() {
  const [dispatches, setDispatches] = useState<DispatchItem[]>(INITIAL_DISPATCHES);
  const [selectedId, setSelectedId] = useState<string>(INITIAL_DISPATCHES[0]?.id ?? '');

  const selected = useMemo(
    () => dispatches.find((item) => item.id === selectedId) ?? dispatches[0] ?? null,
    [dispatches, selectedId],
  );

  const summary = useMemo(
    () => ({
      total: dispatches.length,
      sent: dispatches.filter((item) => item.status === 'sent').length,
      inProgress: dispatches.filter((item) => item.status === 'in_progress').length,
      done: dispatches.filter((item) => item.status === 'done').length,
    }),
    [dispatches],
  );

  const setStatus = (id: string, status: TaskStatus) => {
    setDispatches((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
  };

  const createDraft = () => {
    const fallbackSurveyor = SURVEYOR_TASKS[0];
    const freeSensors = COMPANY_SENSORS.slice(0, 2).map((sensor) => sensor.code);

    const draft: DispatchItem = {
      id: `d${Date.now()}`,
      title: 'Draft Penugasan Baru',
      surveyorId: fallbackSurveyor.surveyorId,
      surveyorName: fallbackSurveyor.surveyorName,
      sensorCodes: freeSensors,
      dueDate: 'Besok 15:00',
      status: 'draft',
      note: 'Tentukan prioritas sensor sebelum kirim.',
    };

    setDispatches((prev) => [draft, ...prev]);
    setSelectedId(draft.id);
  };

  return (
    <div className="p-3 md:p-5 space-y-3 md:space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-[18px] font-semibold text-slate-800">Kirim ke Surveyor</h1>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">Buat dan kirim paket tugas lapangan ke tim surveyor</p>
        </div>
        <button
          onClick={createDraft}
          className="px-3 py-2 bg-amber-500 text-white text-[12px] font-semibold rounded-xl hover:bg-amber-600 transition-colors flex items-center gap-1.5"
        >
          <Plus size={12} /> Draft Baru
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Paket', value: summary.total, color: '#F59E0B' },
          { label: 'Terkirim', value: summary.sent, color: '#3B82F6' },
          { label: 'Diproses', value: summary.inProgress, color: '#F59E0B' },
          { label: 'Selesai', value: summary.done, color: '#22C55E' },
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
            title="Paket Penugasan"
            icon={<Send size={13} />}
            accent="#F59E0B"
            subtitle={`${dispatches.length} PAKET`}
          />

          <div className="overflow-x-auto">
            <table className="w-full" style={{ minWidth: '620px' }}>
              <thead className="bg-slate-50/60 border-b border-slate-100">
                <tr>
                  {['Paket', 'Surveyor', 'Sensor', 'Deadline', 'Status', 'Aksi'].map((h) => (
                    <th
                      key={h}
                      className="text-[9px] font-mono text-slate-400 uppercase tracking-wider px-4 py-3 text-left whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {dispatches.map((item) => {
                  const active = selected?.id === item.id;

                  return (
                    <tr
                      key={item.id}
                      className={cn('cursor-pointer hover:bg-slate-50/60 transition-colors', active && 'bg-amber-50/30')}
                      onClick={() => setSelectedId(item.id)}
                    >
                      <td className="px-4 py-3">
                        <p className="text-[12px] font-semibold text-slate-800">{item.title}</p>
                        <p className="text-[10px] font-mono text-slate-400">{item.id}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-[11px] text-slate-700">{item.surveyorName}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1 max-w-48">
                          {item.sensorCodes.map((code) => (
                            <span key={code} className="text-[9px] font-mono px-1.5 py-0.5 rounded border bg-slate-50 text-slate-600 border-slate-200">
                              {code}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[10px] font-mono text-slate-500">{item.dueDate}</td>
                      <td className="px-4 py-3">
                        <span className={cn('text-[9px] font-mono px-2 py-0.5 rounded-full border', STATUS_STYLE[item.status])}>
                          {STATUS_LABEL[item.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setStatus(item.id, item.status === 'draft' ? 'sent' : item.status === 'sent' ? 'in_progress' : 'done');
                          }}
                          className="text-[10px] font-mono text-amber-600 hover:text-amber-800"
                        >
                          Update
                        </button>
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
            <SectionHeader title="Detail Paket" icon={<Users size={13} />} accent="#F59E0B" subtitle={selected.surveyorName} />
            <div className="p-4 space-y-3.5">
              <div className="rounded-lg border border-slate-100 bg-white px-3 py-2.5">
                <p className="text-[9px] font-mono text-slate-400">Judul Paket</p>
                <p className="text-[12px] font-semibold text-slate-800">{selected.title}</p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="rounded-lg border border-slate-100 bg-white px-2.5 py-2">
                  <p className="text-[9px] font-mono text-slate-400">Surveyor</p>
                  <p className="text-[11px] font-semibold text-slate-700">{selected.surveyorName}</p>
                </div>
                <div className="rounded-lg border border-slate-100 bg-white px-2.5 py-2">
                  <p className="text-[9px] font-mono text-slate-400">Deadline</p>
                  <p className="text-[11px] font-semibold font-mono text-slate-700">{selected.dueDate}</p>
                </div>
              </div>

              <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5">
                <p className="text-[9px] font-mono text-slate-400 mb-1">Catatan Briefing</p>
                <p className="text-[10px] text-slate-600 leading-relaxed">{selected.note}</p>
              </div>

              <div>
                <p className="text-[9px] font-mono text-slate-400 mb-1.5">Sensor Ditugaskan</p>
                <div className="flex flex-wrap gap-1">
                  {selected.sensorCodes.map((code) => (
                    <span key={code} className="text-[9px] font-mono px-1.5 py-0.5 rounded border bg-amber-50 text-amber-700 border-amber-200">
                      {code}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                {selected.status !== 'sent' && (
                  <button
                    onClick={() => setStatus(selected.id, 'sent')}
                    className="w-full text-[11px] font-semibold rounded-lg px-3 py-2 bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 inline-flex items-center justify-center gap-1.5"
                  >
                    <Send size={12} /> Kirim Paket
                  </button>
                )}

                {selected.status !== 'in_progress' && (
                  <button
                    onClick={() => setStatus(selected.id, 'in_progress')}
                    className="w-full text-[11px] font-semibold rounded-lg px-3 py-2 bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 inline-flex items-center justify-center gap-1.5"
                  >
                    <Radio size={12} /> Tandai Diproses
                  </button>
                )}

                {selected.status !== 'done' && (
                  <button
                    onClick={() => setStatus(selected.id, 'done')}
                    className="w-full text-[11px] font-semibold rounded-lg px-3 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 inline-flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 size={12} /> Tandai Selesai
                  </button>
                )}
              </div>

              <div className="pt-1 border-t border-slate-100">
                <p className="text-[9px] font-mono text-slate-400 mb-1">Status Live Surveyor</p>
                <div className="space-y-1.5">
                  {SURVEYOR_TASKS.slice(0, 3).map((surveyor) => (
                    <div key={surveyor.id} className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-600">{surveyor.surveyorName}</span>
                      <span
                        className={cn(
                          'font-mono px-1.5 py-0.5 rounded border',
                          surveyor.status === 'online'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : surveyor.status === 'measuring'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200',
                        )}
                      >
                        {surveyor.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm flex items-center justify-center" style={{ minHeight: 220 }}>
            <p className="text-[11px] text-slate-400 font-mono text-center">Pilih paket untuk melihat detail</p>
          </div>
        )}
      </div>
    </div>
  );
}
