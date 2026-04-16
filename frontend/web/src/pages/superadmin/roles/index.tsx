import { useState } from 'react';
import { Shield, Check, X, Info } from 'lucide-react';
import { Card, SectionHeader } from '../../../../../web/src/components/ui';
import { cn } from '../../../../../web/src/lib/utils';

const ROLES = [
  { key: 'super_admin',      label: 'Super Admin',        color: 'bg-purple-50 text-purple-700 border-purple-200', count: 1, desc: 'Akses penuh ke seluruh sistem, konfigurasi, dan audit' },
  { key: 'admin_perusahaan', label: 'Admin Perusahaan',   color: 'bg-amber-50 text-amber-700 border-amber-200',    count: 4, desc: 'Kelola sensor dan laporan dalam lingkup perusahaan sendiri' },
  { key: 'kepala_instansi',  label: 'Kepala Instansi',    color: 'bg-teal-50 text-teal-700 border-teal-200',       count: 2, desc: 'Pantau kepatuhan lintas perusahaan, setujui izin' },
  { key: 'supervisor',       label: 'Supervisor Lapangan', color: 'bg-blue-50 text-blue-700 border-blue-200',      count: 6, desc: 'Input data pengukuran lapangan, upload foto' },
];

const PERMISSION_GROUPS = [
  {
    group: 'Dashboard',
    items: [
      { label: 'Lihat Dashboard',           perms: [true,  true,  true,  true]  },
      { label: 'Lihat Peta Semua Sensor',   perms: [true,  false, true,  false] },
      { label: 'Lihat Peta Sensor Sendiri', perms: [true,  true,  true,  true]  },
    ],
  },
  {
    group: 'Sensor',
    items: [
      { label: 'Lihat Sensor',    perms: [true,  true,  true,  true]  },
      { label: 'Tambah Sensor',   perms: [true,  true,  false, false] },
      { label: 'Edit Sensor',     perms: [true,  true,  false, false] },
      { label: 'Hapus Sensor',    perms: [true,  false, false, false] },
      { label: 'Input Pengukuran',perms: [true,  true,  false, true]  },
      { label: 'Upload Foto',     perms: [true,  true,  false, true]  },
    ],
  },
  {
    group: 'Perusahaan',
    items: [
      { label: 'Lihat Perusahaan',  perms: [true,  true,  true,  false] },
      { label: 'Tambah Perusahaan', perms: [true,  false, false, false] },
      { label: 'Edit Perusahaan',   perms: [true,  true,  false, false] },
      { label: 'Hapus Perusahaan',  perms: [true,  false, false, false] },
    ],
  },
  {
    group: 'Pengguna',
    items: [
      { label: 'Lihat Pengguna',  perms: [true,  false, true,  false] },
      { label: 'Tambah Pengguna', perms: [true,  false, false, false] },
      { label: 'Edit Pengguna',   perms: [true,  false, false, false] },
      { label: 'Hapus Pengguna',  perms: [true,  false, false, false] },
      { label: 'Kelola Role',     perms: [true,  false, false, false] },
    ],
  },
  {
    group: 'Laporan',
    items: [
      { label: 'Lihat Laporan',  perms: [true,  true,  true,  true]  },
      { label: 'Buat Laporan',   perms: [true,  true,  false, false] },
      { label: 'Ekspor Data',    perms: [true,  true,  true,  false] },
      { label: 'Setujui Izin',   perms: [true,  false, true,  false] },
    ],
  },
  {
    group: 'Sistem',
    items: [
      { label: 'Konfigurasi Sistem', perms: [true, false, false, false] },
      { label: 'Lihat Audit Log',    perms: [true, false, false, false] },
      { label: 'Kelola Server',      perms: [true, false, false, false] },
      { label: 'Backup Data',        perms: [true, false, false, false] },
    ],
  },
];

export default function RolesPage() {
  const [selected, setSelected] = useState('super_admin');
  const selectedIdx = ROLES.findIndex(r => r.key === selected);

  return (
    <div className="p-5 space-y-4">
      <div>
        <h1 className="text-[18px] font-semibold text-slate-800">Role & Akses</h1>
        <p className="text-[11px] text-slate-400 font-mono mt-0.5">Konfigurasi hak akses per role pengguna</p>
      </div>

      {/* Role cards */}
      <div className="grid grid-cols-4 gap-3">
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
          <table className="w-full" style={{ minWidth: '560px' }}>
            <thead className="bg-slate-50/60 border-b border-slate-100">
              <tr>
                <th className="text-[9px] font-mono text-slate-400 uppercase tracking-wider px-4 py-3 text-left" style={{ width: '42%' }}>
                  Hak Akses
                </th>
                {ROLES.map((r, i) => (
                  <th key={r.key}
                    className={cn(
                      'text-[9px] font-mono uppercase tracking-wider px-4 py-3 text-center transition-all',
                      selected === r.key ? 'text-cyan-700 bg-cyan-50/60' : 'text-slate-400',
                    )}>
                    {r.label.split(' ')[0]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERMISSION_GROUPS.map(group => (
                <tbody key={group.group}>
                  <tr className="bg-slate-50/40">
                    <td colSpan={5} className="px-4 py-1.5 text-[9px] font-mono font-semibold text-slate-500 uppercase tracking-widest">
                      {group.group}
                    </td>
                  </tr>
                  {group.items.map(item => (
                    <tr key={item.label} className="border-b border-slate-50 hover:bg-slate-50/40 transition-colors">
                      <td className="px-4 py-2 text-[11px] text-slate-600">{item.label}</td>
                      {item.perms.map((allowed, i) => (
                        <td key={i}
                          className={cn('px-4 py-2 text-center transition-all', selected === ROLES[i].key ? 'bg-cyan-50/40' : '')}>
                          {allowed
                            ? <Check size={14} className="text-emerald-500 mx-auto" />
                            : <X     size={14} className="text-slate-200 mx-auto" />}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              ))}
            </tbody>
          </table>
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
