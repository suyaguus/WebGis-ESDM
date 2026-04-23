import { useState } from 'react';
import { Shield, Check, X, Info } from 'lucide-react';
import { Card, SectionHeader } from '../../../../../web/src/components/ui';
import { cn } from '../../../../../web/src/lib/utils';

const ROLES = [
  { key: 'super_admin',      label: 'Super Admin',        color: 'bg-purple-50 text-purple-700 border-purple-200', count: 1, desc: 'Verifikasi data dari semua pihak, kelola sistem, & kirim laporan ke Kadis' },
  { key: 'admin_perusahaan', label: 'Admin Perusahaan',   color: 'bg-amber-50 text-amber-700 border-amber-200',    count: 4, desc: 'Input data sumur perusahaan & ajukan dokumen legalitas sumur' },
  { key: 'surveyor',         label: 'Surveyor',            color: 'bg-blue-50 text-blue-700 border-blue-200',       count: 6, desc: 'Petakan sensor air tanah & subsidence berdasarkan data sumur perusahaan' },
  { key: 'kadis',            label: 'Kepala Dinas',        color: 'bg-teal-50 text-teal-700 border-teal-200',       count: 2, desc: 'Terima & review laporan terverifikasi dari Super Admin, setujui izin' },
];

// columns: [Super Admin, Admin Perusahaan, Surveyor, Kadis]
const PERMISSION_GROUPS = [
  {
    group: 'Dashboard & Peta',
    items: [
      { label: 'Lihat Dashboard',              perms: [true,  true,  true,  true]  },
      { label: 'Peta Semua Sensor (Provinsi)', perms: [true,  false, false, true]  },
      { label: 'Peta Sensor Perusahaan',       perms: [true,  true,  true,  false] },
    ],
  },
  {
    group: 'Manajemen Sumur (Admin Perusahaan)',
    items: [
      { label: 'Input Data Sumur',             perms: [false, true,  false, false] },
      { label: 'Edit Data Sumur',              perms: [false, true,  false, false] },
      { label: 'Hapus Data Sumur',             perms: [true,  false, false, false] },
      { label: 'Ajukan Dokumen Legalitas',     perms: [false, true,  false, false] },
      { label: 'Lihat Status Pengajuan',       perms: [true,  true,  false, false] },
      { label: 'Kirim Data ke Surveyor',       perms: [false, true,  false, false] },
    ],
  },
  {
    group: 'Pemetaan Sensor (Surveyor)',
    items: [
      { label: 'Lihat Sumur Ditugaskan',       perms: [true,  false, true,  false] },
      { label: 'Input Pemetaan Sensor',        perms: [false, false, true,  false] },
      { label: 'Edit Pemetaan Sensor',         perms: [false, false, true,  false] },
      { label: 'Verifikasi Dokumen Legalitas', perms: [false, false, true,  false] },
      { label: 'Kirim Laporan ke Super Admin', perms: [false, false, true,  false] },
    ],
  },
  {
    group: 'Verifikasi & Pengiriman (Super Admin)',
    items: [
      { label: 'Verifikasi Data Perusahaan',   perms: [true,  false, false, false] },
      { label: 'Verifikasi Data Pemetaan',     perms: [true,  false, false, false] },
      { label: 'Bandingkan Kesesuaian Data',   perms: [true,  false, false, false] },
      { label: 'Kirim Laporan ke Kadis',       perms: [true,  false, false, false] },
    ],
  },
  {
    group: 'Laporan & Persetujuan (Kadis)',
    items: [
      { label: 'Terima Laporan Terverifikasi', perms: [true,  false, false, true]  },
      { label: 'Review & Analitik Tren',       perms: [true,  false, false, true]  },
      { label: 'Setujui / Tolak Izin Sumur',   perms: [false, false, false, true]  },
      { label: 'Ekspor Laporan',               perms: [true,  true,  false, true]  },
    ],
  },
  {
    group: 'Manajemen Sistem',
    items: [
      { label: 'Kelola Pengguna & Role',       perms: [true,  false, false, false] },
      { label: 'Kelola Data Perusahaan',       perms: [true,  false, false, false] },
      { label: 'Konfigurasi Sistem',           perms: [true,  false, false, false] },
      { label: 'Lihat Audit Log',              perms: [true,  false, false, false] },
      { label: 'Kelola Server & API',          perms: [true,  false, false, false] },
    ],
  },
];

export default function RolesPage() {
  const [selected, setSelected] = useState('super_admin');
  const selectedIdx = ROLES.findIndex(r => r.key === selected);

  return (
    <div className="p-3 sm:p-5 space-y-4">
      <div>
        <h1 className="text-[18px] font-semibold text-slate-800">Role & Akses</h1>
        <p className="text-[11px] text-slate-400 font-mono mt-0.5">Konfigurasi hak akses per role pengguna</p>
      </div>

      {/* Role cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {ROLES.map(r => (
          <button key={r.key} onClick={() => setSelected(r.key)}
            className={cn(
              'text-left p-4 rounded-xl border transition-all bg-white shadow-sm',
              selected === r.key ? 'border-cyan-300 ring-1 ring-cyan-200 shadow-md' : 'border-slate-100 hover:border-slate-200 hover:shadow',
            )}>
            <div className="flex items-center justify-between mb-2">
              <span className={cn('text-[9px] font-mono font-medium px-2 py-0.5 rounded-full border', r.color)}>{r.label}</span>
              <span className="text-[10px] font-mono text-slate-400">{r.count} user</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed">{r.desc}</p>
          </button>
        ))}
      </div>

      {/* Permission matrix */}
      <Card padding={false}>
        <SectionHeader title="Matriks Hak Akses" icon={<Shield size={13} />}
          subtitle={`SOROT: ${ROLES.find(r => r.key === selected)?.label.toUpperCase()}`} />
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            {/* Header Row */}
            <div className="flex border-b border-slate-100 bg-slate-50/60">
              <div className="text-[9px] font-mono text-slate-400 uppercase tracking-wider px-4 py-3 text-left font-semibold" style={{ width: '200px', flexShrink: 0 }}>
                Hak Akses
              </div>
              {ROLES.map((r, i) => (
                <div key={r.key}
                  className={cn(
                    'text-[9px] font-mono uppercase tracking-wider px-3 py-3 text-center font-semibold transition-all',
                    selected === r.key ? 'text-cyan-700 bg-cyan-50/60' : 'text-slate-400',
                  )}
                  style={{ width: '80px', flexShrink: 0 }}>
                  {r.label.split(' ')[0]}
                </div>
              ))}
            </div>

            {/* Permission Groups */}
            {PERMISSION_GROUPS.map(group => (
              <div key={group.group}>
                {/* Group Header */}
                <div className="flex bg-slate-50/40 border-b border-slate-50">
                  <div className="px-4 py-2 text-[9px] font-mono font-semibold text-slate-500 uppercase tracking-widest" style={{ width: '200px', flexShrink: 0 }}>
                    {group.group}
                  </div>
                  <div className="flex flex-1"></div>
                </div>

                {/* Permission Items */}
                {group.items.map(item => (
                  <div key={item.label} className="flex border-b border-slate-50 hover:bg-slate-50/40 transition-colors">
                    <div className="px-4 py-3 text-[11px] text-slate-600" style={{ width: '200px', flexShrink: 0 }}>
                      {item.label}
                    </div>
                    {item.perms.map((allowed, i) => (
                      <div key={i}
                        className={cn(
                          'px-3 py-3 flex items-center justify-center transition-all',
                          allowed ? 'bg-emerald-50/60' : 'bg-slate-50/40',
                          selected === ROLES[i].key ? 'ring-1 ring-inset ring-cyan-200' : ''
                        )}
                        style={{ width: '80px', flexShrink: 0 }}>
                        {allowed
                          ? <Check size={16} className="text-emerald-600 font-semibold" />
                          : <X size={16} className="text-slate-300" />}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Info */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
        <Info size={14} className="text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-[11px] font-semibold text-blue-800 mb-0.5">Hak akses terlindungi</p>
          <p className="text-[10px] text-blue-600 leading-relaxed">
            Perubahan hak akses hanya dapat dilakukan oleh Super Admin dan berlaku langsung setelah disimpan.
            Setiap modifikasi role akan tercatat di Audit Log untuk keperluan kepatuhan regulasi.
          </p>
        </div>
      </div>
    </div>
  );
}
