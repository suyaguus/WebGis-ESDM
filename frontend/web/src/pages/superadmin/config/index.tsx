import { useState } from 'react'
import { Settings, Save, RotateCcw, Check, Mail, Bell, AlertTriangle, Globe } from 'lucide-react'
import Topbar from '@/components/layout/Topbar'
import { Panel } from '@/components/ui'
import { cn } from '@/lib/utils'

const TABS = [
  { key: 'umum',       label: 'Umum',         Icon: Globe        },
  { key: 'threshold',  label: 'Threshold',    Icon: AlertTriangle},
  { key: 'email',      label: 'Email & SMTP', Icon: Mail         },
  { key: 'notifikasi', label: 'Notifikasi',   Icon: Bell         },
]

function Field({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-8 py-5 border-b border-border-light last:border-b-0">
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-semibold text-text-primary">{label}</p>
        {desc && <p className="text-[10px] text-text-muted mt-0.5 leading-relaxed">{desc}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  )
}

function Toggle({ value, onChange }: { value: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange}
      className={cn('w-10 h-5 rounded-full transition-all relative flex-shrink-0',
        value ? 'bg-accent-cyan' : 'bg-border-strong')}>
      <span className={cn('absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all',
        value ? 'left-[22px]' : 'left-0.5')} />
    </button>
  )
}

function TextInput({ value, onChange, placeholder, type = 'text', width = 'w-64' }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string; width?: string
}) {
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className={cn('bg-bg-card3 border border-border-base rounded-lg px-3 h-9 text-[11px] text-text-primary outline-none focus:border-accent-cyan placeholder:text-text-muted transition-colors', width)} />
  )
}

function NumberInput({ value, onChange, unit }: { value: number; onChange: (v: number) => void; unit?: string }) {
  return (
    <div className="flex items-center gap-2">
      <input type="number" value={value} onChange={e => onChange(Number(e.target.value))}
        className="w-24 bg-bg-card3 border border-border-base rounded-lg px-3 h-9 text-[11px] text-text-primary outline-none focus:border-accent-cyan text-right transition-colors" />
      {unit && <span className="text-[10px] text-text-muted font-mono">{unit}</span>}
    </div>
  )
}

export default function ConfigPage() {
  const [tab, setTab] = useState('umum')
  const [saved, setSaved] = useState(false)

  /* ── State ─── */
  const [appName, setAppName]         = useState('WebGIS SIPASTI')
  const [appVersion, setAppVersion]   = useState('2.0.1')
  const [timezone, setTimezone]       = useState('Asia/Jakarta')
  const [language, setLanguage]       = useState('id')
  const [maintenanceMode, setMM]      = useState(false)
  const [autoBackup, setAB]           = useState(true)
  const [backupInterval, setBI]       = useState(24)
  const [dataRetention, setDR]        = useState(365)

  const [threshSubsidence, setTS]     = useState(-4.0)
  const [threshWarning, setTW]        = useState(-3.0)
  const [threshAirKritis, setTAK]     = useState(-3.5)
  const [threshAirWaspada, setTAW]    = useState(-2.0)
  const [threshOffline, setTO]        = useState(120)

  const [smtpHost, setSH]             = useState('smtp.gmail.com')
  const [smtpPort, setSP]             = useState(587)
  const [smtpUser, setSU]             = useState('noreply@webgis.id')
  const [smtpPass, setSPw]            = useState('••••••••••••')
  const [fromName, setFN]             = useState('WebGIS SIPASTI')
  const [fromEmail, setFE]            = useState('noreply@webgis.id')

  const [notifKritis, setNK]          = useState(true)
  const [notifWaspada, setNW]         = useState(true)
  const [notifOffline, setNO]         = useState(true)
  const [notifLaporan, setNL]         = useState(true)
  const [notifUser, setNU]            = useState(false)
  const [alertDelay, setAD]           = useState(5)
  const [digestFreq, setDF]           = useState('daily')

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000) }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar
        breadcrumbs={[{ label: 'Super Admin' }, { label: 'Konfigurasi' }]}
        actions={
          <div className="flex items-center gap-2">
            {saved && <span className="text-[10px] text-accent-green flex items-center gap-1.5 font-medium"><Check size={12} />Tersimpan</span>}
            <button className="flex items-center gap-1.5 text-[10px] font-medium text-text-secondary border border-border-base rounded-lg px-3 h-8 hover:bg-bg-card3 transition-colors">
              <RotateCcw size={12} /> Reset
            </button>
            <button onClick={handleSave}
              className="flex items-center gap-1.5 text-[10px] font-semibold bg-accent-cyan text-white rounded-lg px-3 h-8 hover:bg-teal-700 transition-colors">
              <Save size={12} /> Simpan Perubahan
            </button>
          </div>
        }
      />

      <div className="flex h-full min-h-0 overflow-hidden">
        {/* Vertical tab list */}
        <div className="w-48 flex-shrink-0 bg-bg-card border-r border-border-base p-3 space-y-1">
          {TABS.map(({ key, label, Icon }) => (
            <button key={key} onClick={() => setTab(key)}
              className={cn('w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[11px] font-medium transition-all text-left',
                tab === key ? 'bg-fill-cyan text-accent-cyan' : 'text-text-muted hover:text-text-secondary hover:bg-bg-card3')}>
              <Icon size={13} className="flex-shrink-0" />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {tab === 'umum' && (
            <div className="max-w-2xl space-y-4">
              <Panel title="Informasi Aplikasi" icon={<Globe size={12} className="text-accent-cyan" />}>
                <div className="px-5">
                  <Field label="Nama Aplikasi" desc="Nama yang ditampilkan di halaman dan email notifikasi">
                    <TextInput value={appName} onChange={setAppName} />
                  </Field>
                  <Field label="Versi" desc="Versi current yang sedang berjalan">
                    <TextInput value={appVersion} onChange={setAppVersion} width="w-32" />
                  </Field>
                  <Field label="Timezone" desc="Zona waktu untuk timestamp data dan laporan">
                    <select value={timezone} onChange={e => setTimezone(e.target.value)}
                      className="bg-bg-card3 border border-border-base rounded-lg px-3 h-9 text-[11px] text-text-secondary outline-none focus:border-accent-cyan w-52 cursor-pointer">
                      <option value="Asia/Jakarta">Asia/Jakarta (WIB, UTC+7)</option>
                      <option value="Asia/Makassar">Asia/Makassar (WITA, UTC+8)</option>
                      <option value="Asia/Jayapura">Asia/Jayapura (WIT, UTC+9)</option>
                    </select>
                  </Field>
                  <Field label="Bahasa Default">
                    <select value={language} onChange={e => setLanguage(e.target.value)}
                      className="bg-bg-card3 border border-border-base rounded-lg px-3 h-9 text-[11px] text-text-secondary outline-none focus:border-accent-cyan w-40 cursor-pointer">
                      <option value="id">Bahasa Indonesia</option>
                      <option value="en">English</option>
                    </select>
                  </Field>
                </div>
              </Panel>
              <Panel title="Sistem & Data" icon={<Settings size={12} className="text-accent-purple" />}>
                <div className="px-5">
                  <Field label="Mode Maintenance" desc="Nonaktifkan akses user sementara selama pemeliharaan sistem">
                    <Toggle value={maintenanceMode} onChange={() => setMM(!maintenanceMode)} />
                  </Field>
                  <Field label="Auto Backup" desc="Backup otomatis database setiap interval yang ditentukan">
                    <Toggle value={autoBackup} onChange={() => setAB(!autoBackup)} />
                  </Field>
                  {autoBackup && (
                    <Field label="Interval Backup" desc="Seberapa sering backup otomatis dijalankan">
                      <NumberInput value={backupInterval} onChange={setBI} unit="jam" />
                    </Field>
                  )}
                  <Field label="Retensi Data" desc="Berapa lama data sensor historis disimpan dalam database">
                    <NumberInput value={dataRetention} onChange={setDR} unit="hari" />
                  </Field>
                </div>
              </Panel>
            </div>
          )}

          {tab === 'threshold' && (
            <div className="max-w-2xl space-y-4">
              <Panel title="Threshold Subsidence (GNSS)" icon={<AlertTriangle size={12} className="text-accent-red" />}>
                <div className="px-5">
                  <Field label="Batas Kritis" desc="Sensor GNSS dengan nilai di bawah ini akan ditandai KRITIS dan memicu alert segera">
                    <NumberInput value={threshSubsidence} onChange={setTS} unit="cm/thn" />
                  </Field>
                  <Field label="Batas Waspada" desc="Sensor GNSS dengan nilai di bawah ini akan ditandai WASPADA">
                    <NumberInput value={threshWarning} onChange={setTW} unit="cm/thn" />
                  </Field>
                </div>
              </Panel>
              <Panel title="Threshold Air Tanah" icon={<AlertTriangle size={12} className="text-accent-amber" />}>
                <div className="px-5">
                  <Field label="Batas Kritis Muka Air" desc="Sensor air tanah dengan muka air di bawah ini ditandai KRITIS">
                    <NumberInput value={threshAirKritis} onChange={setTAK} unit="meter" />
                  </Field>
                  <Field label="Batas Waspada Muka Air" desc="Sensor air tanah dengan muka air di bawah ini ditandai WASPADA">
                    <NumberInput value={threshAirWaspada} onChange={setTAW} unit="meter" />
                  </Field>
                </div>
              </Panel>
              <Panel title="Threshold Konektivitas" icon={<AlertTriangle size={12} className="text-accent-blue" />}>
                <div className="px-5">
                  <Field label="Batas Offline" desc="Sensor yang tidak mengirim data lebih dari durasi ini akan ditandai OFFLINE">
                    <NumberInput value={threshOffline} onChange={setTO} unit="menit" />
                  </Field>
                </div>
              </Panel>
            </div>
          )}

          {tab === 'email' && (
            <div className="max-w-2xl space-y-4">
              <Panel title="Konfigurasi SMTP" icon={<Mail size={12} className="text-accent-blue" />}>
                <div className="px-5">
                  <Field label="SMTP Host" desc="Server SMTP untuk pengiriman email">
                    <TextInput value={smtpHost} onChange={setSH} placeholder="smtp.gmail.com" />
                  </Field>
                  <Field label="SMTP Port">
                    <NumberInput value={smtpPort} onChange={setSP} />
                  </Field>
                  <Field label="Username SMTP">
                    <TextInput value={smtpUser} onChange={setSU} type="email" />
                  </Field>
                  <Field label="Password SMTP">
                    <TextInput value={smtpPass} onChange={setSPw} type="password" />
                  </Field>
                </div>
              </Panel>
              <Panel title="Pengirim Email" icon={<Mail size={12} className="text-accent-cyan" />}>
                <div className="px-5">
                  <Field label="From Name" desc="Nama pengirim yang terlihat di inbox penerima">
                    <TextInput value={fromName} onChange={setFN} />
                  </Field>
                  <Field label="From Email" desc="Alamat email pengirim">
                    <TextInput value={fromEmail} onChange={setFE} type="email" />
                  </Field>
                </div>
              </Panel>
              <button className="flex items-center gap-2 text-[11px] font-semibold text-accent-blue border border-accent-blue/30 bg-fill-blue rounded-xl px-4 py-2.5 hover:bg-blue-50 transition-colors">
                <Mail size={13} /> Kirim Email Test
              </button>
            </div>
          )}

          {tab === 'notifikasi' && (
            <div className="max-w-2xl space-y-4">
              <Panel title="Jenis Notifikasi" icon={<Bell size={12} className="text-accent-purple" />}>
                <div className="px-5">
                  {[
                    { label: 'Alert Kritis',          desc: 'Notifikasi segera saat sensor melebihi threshold kritis', value: notifKritis, onChange: () => setNK(!notifKritis) },
                    { label: 'Alert Waspada',          desc: 'Notifikasi saat sensor masuk zona waspada',              value: notifWaspada,onChange: () => setNW(!notifWaspada) },
                    { label: 'Sensor Offline',         desc: 'Notifikasi saat sensor berhenti mengirim data',          value: notifOffline,onChange: () => setNO(!notifOffline) },
                    { label: 'Laporan Baru',           desc: 'Notifikasi saat ada laporan baru menunggu persetujuan', value: notifLaporan,onChange: () => setNL(!notifLaporan) },
                    { label: 'Pendaftaran Pengguna',   desc: 'Notifikasi saat ada user baru menunggu verifikasi',     value: notifUser,   onChange: () => setNU(!notifUser)    },
                  ].map((n) => (
                    <Field key={n.label} label={n.label} desc={n.desc}>
                      <Toggle value={n.value} onChange={n.onChange} />
                    </Field>
                  ))}
                </div>
              </Panel>
              <Panel title="Pengaturan Lanjutan" icon={<Bell size={12} className="text-accent-amber" />}>
                <div className="px-5">
                  <Field label="Delay Alert" desc="Tunggu sebelum mengirim alert (mencegah false positive)">
                    <NumberInput value={alertDelay} onChange={setAD} unit="menit" />
                  </Field>
                  <Field label="Frekuensi Digest Email" desc="Seberapa sering ringkasan harian dikirim">
                    <select value={digestFreq} onChange={e => setDF(e.target.value)}
                      className="bg-bg-card3 border border-border-base rounded-lg px-3 h-9 text-[11px] text-text-secondary outline-none focus:border-accent-cyan w-40 cursor-pointer">
                      <option value="realtime">Real-time</option>
                      <option value="hourly">Per Jam</option>
                      <option value="daily">Harian</option>
                      <option value="weekly">Mingguan</option>
                    </select>
                  </Field>
                </div>
              </Panel>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
