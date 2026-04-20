import { useState } from 'react';
import { Settings, Save, AlertTriangle, Bell, Map, Database } from 'lucide-react';
import { Card, SectionHeader } from '../../../../../web/src/components/ui';
import { cn } from '../../../../../web/src/lib/utils';

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)}
      className={cn('relative w-9 h-5 rounded-full transition-colors flex-shrink-0', value ? 'bg-cyan-500' : 'bg-slate-200')}>
      <span className={cn('absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all', value ? 'left-4' : 'left-0.5')} />
    </button>
  );
}

export default function ConfigPage() {
  const [saved, setSaved] = useState(false);
  const [config, setConfig] = useState({
    subsidenceThreshold: -4.0,
    alertEmail: true,
    alertSMS: false,
    alertPush: true,
    autoRefresh: 30,
    dataRetention: 365,
    mapDefault: 'Street',
    tileServer: 'OpenStreetMap',
    enableHeatmap: true,
    enableClustering: true,
    maintenanceMode: false,
    debugMode: false,
    backupFreq: 'Harian',
    maxFileSize: 10,
    sessionTimeout: 60,
  });

  const update = <K extends keyof typeof config>(k: K, v: typeof config[K]) => setConfig(c => ({ ...c, [k]: v }));
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="p-3 sm:p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-[18px] font-semibold text-slate-800">Konfigurasi Sistem</h1>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">Pengaturan global aplikasi SIGAT</p>
        </div>
        <button onClick={handleSave}
          className={cn('px-4 py-2 text-[12px] font-semibold rounded-xl flex items-center justify-center gap-2 transition-all w-full sm:w-auto',
            saved ? 'bg-emerald-600 text-white' : 'bg-cyan-600 text-white hover:bg-cyan-700')}>
          <Save size={13} /> {saved ? 'Tersimpan ✓' : 'Simpan Perubahan'}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Alert settings */}
        <Card padding={false}>
          <SectionHeader title="Threshold & Alert" icon={<AlertTriangle size={13} />} accent="#EF4444" />
          <div className="p-4 space-y-4">
            <div>
              <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">Threshold Subsidence (cm/tahun)</label>
              <input type="number" step="0.1" value={config.subsidenceThreshold}
                onChange={e => update('subsidenceThreshold', parseFloat(e.target.value))}
                className="w-full text-[13px] font-mono font-semibold border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-red-600 focus:outline-none focus:border-red-300" />
              <p className="text-[9px] text-slate-400 font-mono mt-1">Sensor melebihi nilai ini akan masuk status KRITIS</p>
            </div>
            <div>
              <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-2">Saluran Notifikasi Alert</label>
              <div className="space-y-2.5">
                {[
                  { label: 'Email Notifikasi', key: 'alertEmail' as const },
                  { label: 'SMS Notifikasi',   key: 'alertSMS'   as const },
                  { label: 'Push Notification',key: 'alertPush'  as const },
                ].map(({ label, key }) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-600">{label}</span>
                    <Toggle value={config[key] as boolean} onChange={v => update(key, v)} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Map settings */}
        <Card padding={false}>
          <SectionHeader title="Pengaturan Peta" icon={<Map size={13} />} />
          <div className="p-4 space-y-4">
            <div>
              <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">Layer Peta Default</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {['Street','Satellite','Terrain'].map(l => (
                  <button key={l} onClick={() => update('mapDefault', l)}
                    className={cn('py-2 text-[10px] font-mono font-medium rounded-lg border transition-all',
                      config.mapDefault === l ? 'bg-cyan-600 text-white border-cyan-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100')}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">Tile Server</label>
              <select value={config.tileServer} onChange={e => update('tileServer', e.target.value)}
                className="w-full text-[11px] font-mono border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-slate-700 focus:outline-none focus:border-cyan-400">
                {['OpenStreetMap','Mapbox Streets','Mapbox Satellite','CartoDB Light'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div className="space-y-2.5">
              {[
                { label: 'Aktifkan Heatmap Layer', key: 'enableHeatmap'   as const },
                { label: 'Aktifkan Marker Clustering', key: 'enableClustering' as const },
              ].map(({ label, key }) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-600">{label}</span>
                  <Toggle value={config[key] as boolean} onChange={v => update(key, v)} />
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* System settings */}
        <Card padding={false}>
          <SectionHeader title="Sistem & Performa" icon={<Settings size={13} />} />
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: 'Auto Refresh (detik)', key: 'autoRefresh' as const, min: 10, max: 300, step: 5 },
                { label: 'Session Timeout (menit)', key: 'sessionTimeout' as const, min: 15, max: 480, step: 15 },
                { label: 'Max File Upload (MB)', key: 'maxFileSize' as const, min: 1, max: 50, step: 1 },
              ].map(({ label, key, min, max, step }) => (
                <div key={key}>
                  <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">{label}</label>
                  <input type="number" min={min} max={max} step={step} value={config[key] as number}
                    onChange={e => update(key, parseInt(e.target.value))}
                    className="w-full text-[12px] font-mono border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-slate-800 focus:outline-none focus:border-cyan-400" />
                </div>
              ))}
            </div>
            <div className="space-y-2.5 pt-1">
              {[
                { label: 'Mode Maintenance', key: 'maintenanceMode' as const, danger: true },
                { label: 'Mode Debug (log verbose)', key: 'debugMode'       as const, danger: false },
              ].map(({ label, key, danger }) => (
                <div key={key} className="flex items-center justify-between">
                  <span className={cn('text-[11px]', danger && config[key] ? 'text-red-600 font-semibold' : 'text-slate-600')}>{label}</span>
                  <Toggle value={config[key] as boolean} onChange={v => update(key, v)} />
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Database settings */}
        <Card padding={false}>
          <SectionHeader title="Database & Backup" icon={<Database size={13} />} />
          <div className="p-4 space-y-4">
            <div>
              <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">Retensi Data (hari)</label>
              <input type="number" value={config.dataRetention} min={90} max={3650}
                onChange={e => update('dataRetention', parseInt(e.target.value))}
                className="w-full text-[12px] font-mono border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-slate-800 focus:outline-none focus:border-cyan-400" />
              <p className="text-[9px] text-slate-400 font-mono mt-1">Data lebih lama dari ini akan diarsipkan otomatis</p>
            </div>
            <div>
              <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">Frekuensi Backup</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {['Harian','Mingguan','Manual'].map(f => (
                  <button key={f} onClick={() => update('backupFreq', f)}
                    className={cn('py-2 text-[10px] font-mono font-medium rounded-lg border transition-all',
                      config.backupFreq === f ? 'bg-cyan-600 text-white border-cyan-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100')}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="pt-1">
              <button className="w-full py-2 bg-slate-800 text-white text-[11px] font-semibold rounded-xl hover:bg-slate-900 transition-colors">
                Jalankan Backup Sekarang
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
