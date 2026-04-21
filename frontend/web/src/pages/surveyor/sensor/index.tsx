import { useState } from 'react';
import { Radio, AlertTriangle, CheckCircle2, Droplets, Activity, ClipboardEdit } from 'lucide-react';
import { Card, SectionHeader, StatusPill } from '../../../components/ui';
import { cn, getSubsidenceColor } from '../../../lib/utils';
import { SURVEYOR_SENSORS, SURVEYOR_MEASUREMENTS } from '../../../constants/surveyorData';
import { useAppStore } from '../../../store';
import type { Sensor } from '../../../types';

function SensorDetailPanel({ sensor, onInput }: { sensor: Sensor; onInput: () => void }) {
  const measurements = SURVEYOR_MEASUREMENTS.filter(m => m.sensorId === sensor.id);
  const lastMeasurement = measurements[0];
  const verified = measurements.filter(m => m.status === 'verified').length;
  const pending  = measurements.filter(m => m.status === 'pending').length;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className={cn(
        'rounded-xl border p-4',
        sensor.status === 'alert' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200',
      )}>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h3 className="text-[18px] font-bold font-mono text-slate-800">{sensor.code}</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">{sensor.location}</p>
          </div>
          <StatusPill status={sensor.status} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">Tipe Sensor</p>
            <p className="text-[12px] font-semibold text-slate-800">
              {sensor.type === 'gnss' ? 'GNSS' : 'Air Tanah'}
            </p>
          </div>
          <div>
            <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">Update Terakhir</p>
            <p className="text-[12px] font-semibold text-slate-800">{sensor.lastUpdate}</p>
          </div>
          <div>
            <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">Subsidence</p>
            <p className={cn('text-[14px] font-bold font-mono', getSubsidenceColor(sensor.subsidence))}>
              {sensor.subsidence.toFixed(2)} cm/thn
            </p>
          </div>
          {sensor.waterLevel && (
            <div>
              <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">Muka Air</p>
              <p className="text-[14px] font-bold font-mono text-blue-700">{sensor.waterLevel} m</p>
            </div>
          )}
        </div>

        {sensor.status === 'alert' && (
          <div className="mt-3 flex items-center gap-2 bg-red-100 border border-red-300 rounded-lg px-3 py-2">
            <AlertTriangle size={13} className="text-red-600 flex-shrink-0" />
            <p className="text-[10px] text-red-700 font-mono">Nilai subsidence melebihi batas aman. Segera lakukan pengukuran.</p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm px-3 py-3 text-center">
          <p className="text-[20px] font-bold font-mono text-slate-800">{measurements.length}</p>
          <p className="text-[9px] font-mono text-slate-400">Total Ukur</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm px-3 py-3 text-center">
          <p className="text-[20px] font-bold font-mono text-emerald-600">{verified}</p>
          <p className="text-[9px] font-mono text-slate-400">Terverifikasi</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm px-3 py-3 text-center">
          <p className="text-[20px] font-bold font-mono text-amber-600">{pending}</p>
          <p className="text-[9px] font-mono text-slate-400">Pending</p>
        </div>
      </div>

      {/* Last measurement */}
      {lastMeasurement && (
        <Card>
          <p className="text-[11px] font-semibold text-slate-700 mb-3">Pengukuran Terakhir</p>
          <div className="grid grid-cols-2 gap-y-2.5 gap-x-4">
            {[
              { label: 'Tanggal', value: lastMeasurement.date },
              { label: 'Waktu', value: lastMeasurement.submittedAt },
              ...(lastMeasurement.waterLevel !== 0 ? [
                { label: 'Muka Air', value: `${lastMeasurement.waterLevel} m` },
                { label: 'Debit', value: `${lastMeasurement.debit} m³/hr` },
                { label: 'pH', value: String(lastMeasurement.pH) },
                { label: 'TDS', value: `${lastMeasurement.tds} mg/L` },
              ] : []),
              { label: 'Kondisi Fisik', value: lastMeasurement.kondisiFisik.replace('_', ' ') },
              { label: 'Foto', value: `${lastMeasurement.fotoCount} file` },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[9px] font-mono text-slate-400 uppercase">{label}</p>
                <p className="text-[11px] font-semibold text-slate-700 capitalize">{value}</p>
              </div>
            ))}
          </div>
          {lastMeasurement.catatan && (
            <div className="mt-3 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
              <p className="text-[9px] font-mono text-slate-400 mb-1">CATATAN</p>
              <p className="text-[10px] text-slate-600 leading-relaxed">{lastMeasurement.catatan}</p>
            </div>
          )}
        </Card>
      )}

      {/* Action */}
      <button
        onClick={onInput}
        className="w-full flex items-center justify-center gap-2 py-3 text-[13px] font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-sm hover:shadow"
      >
        <ClipboardEdit size={15} /> Input Pengukuran Baru
      </button>
    </div>
  );
}

export default function SensorSayaPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { setActivePage } = useAppStore();
  const selected = SURVEYOR_SENSORS.find(s => s.id === selectedId);

  return (
    <div className="p-3 md:p-5 space-y-3 md:space-y-4 w-full">
      {/* Header */}
      <div>
        <h1 className="text-[18px] font-semibold text-slate-800">Sensor Ditugaskan</h1>
        <p className="text-[11px] text-slate-400 font-mono mt-0.5">
          {SURVEYOR_SENSORS.length} sensor aktif · PT Maju Jaya Tbk
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Sensor',  value: SURVEYOR_SENSORS.length,                                    color: '#3B82F6' },
          { label: 'Online',        value: SURVEYOR_SENSORS.filter(s => s.status === 'online').length, color: '#22C55E' },
          { label: 'Perlu Perhatian', value: SURVEYOR_SENSORS.filter(s => s.status === 'alert').length, color: '#EF4444' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-100 shadow-sm px-4 py-3 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl" style={{ background: color }} />
            <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-1">{label}</p>
            <p className="text-[22px] font-bold font-mono" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
        {/* Sensor list */}
        <Card padding={false} className="flex flex-col">
          <SectionHeader
            title="Daftar Sensor"
            icon={<Radio size={13} />}
            accent="#3B82F6"
            subtitle={`${SURVEYOR_SENSORS.length} SENSOR`}
          />
          <div className="divide-y divide-slate-50">
            {SURVEYOR_SENSORS.map(sensor => {
              const isSelected = selectedId === sensor.id;
              const lastM = SURVEYOR_MEASUREMENTS.find(m => m.sensorId === sensor.id);

              return (
                <button
                  key={sensor.id}
                  onClick={() => setSelectedId(isSelected ? null : sensor.id)}
                  className={cn(
                    'w-full text-left px-4 py-3 transition-all',
                    isSelected ? 'bg-blue-50 border-r-2 border-blue-500' : 'hover:bg-slate-50/60',
                    sensor.status === 'alert' && !isSelected && 'border-l-2 border-l-red-400',
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0',
                      sensor.status === 'alert' ? 'bg-red-100' : isSelected ? 'bg-blue-100' : 'bg-slate-100',
                    )}>
                      {sensor.status === 'alert'
                        ? <AlertTriangle size={16} className="text-red-600" />
                        : sensor.type === 'gnss'
                        ? <Activity size={16} className={isSelected ? 'text-blue-600' : 'text-slate-500'} />
                        : <Droplets size={16} className={isSelected ? 'text-blue-600' : 'text-slate-500'} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[12px] font-bold font-mono text-slate-800">{sensor.code}</span>
                        <span className={cn(
                          'text-[8px] font-mono px-1 py-0.5 rounded',
                          sensor.type === 'gnss' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600',
                        )}>
                          {sensor.type === 'gnss' ? 'GNSS' : 'AT'}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate">{sensor.location}</p>
                      {lastM && (
                        <p className="text-[9px] font-mono text-slate-400 mt-0.5">
                          Ukur terakhir: {lastM.date}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className={cn('text-[11px] font-mono font-semibold', getSubsidenceColor(sensor.subsidence))}>
                      {sensor.subsidence.toFixed(2)} cm/thn
                    </span>
                    <StatusPill status={sensor.status} />
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Detail panel */}
        <div>
          {selected ? (
            <SensorDetailPanel
              sensor={selected}
              onInput={() => setActivePage('sv-input')}
            />
          ) : (
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center py-16 px-6 text-center h-full min-h-[300px]">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center mb-4">
                <Radio size={24} className="text-blue-400" />
              </div>
              <p className="text-[13px] font-semibold text-slate-700 mb-2">Pilih Sensor</p>
              <p className="text-[11px] text-slate-400 font-mono max-w-xs leading-relaxed">
                Klik salah satu sensor di kiri untuk melihat detail dan riwayat pengukuran
              </p>
              <button
                onClick={() => setActivePage('sv-input')}
                className="mt-4 flex items-center gap-2 text-[11px] font-mono text-blue-600 bg-blue-50 border border-blue-200 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <ClipboardEdit size={13} /> Input Pengukuran Baru
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
