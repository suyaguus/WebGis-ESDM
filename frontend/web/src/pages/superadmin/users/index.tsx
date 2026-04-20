import { useState, useMemo } from 'react';
import { Users, Search, Plus, MoreHorizontal, CheckCircle, Clock, XCircle, ArrowUpDown } from 'lucide-react';
import { Card, SectionHeader } from '../../../components/ui';
import { MOCK_USERS } from '../../../constants/mockData';
import { cn } from '../../../lib/utils';
import type { User } from '../../../constants/mockData';

const ROLE_LABELS: Record<User['role'], string> = {
  super_admin:      'Super Admin',
  admin_perusahaan: 'Admin Perusahaan',
  kepala_instansi:  'Kepala Instansi',
  supervisor:       'Supervisor',
};

const ROLE_COLORS: Record<User['role'], string> = {
  super_admin:      'bg-purple-50 text-purple-700 border-purple-200',
  admin_perusahaan: 'bg-amber-50 text-amber-700 border-amber-200',
  kepala_instansi:  'bg-teal-50 text-teal-700 border-teal-200',
  supervisor:       'bg-blue-50 text-blue-700 border-blue-200',
};

const STATUS_ICON = {
  active:   <CheckCircle size={12} className="text-emerald-500" />,
  inactive: <XCircle    size={12} className="text-slate-400"  />,
  pending:  <Clock      size={12} className="text-amber-500"  />,
};

export default function UsersPage() {
  const [search, setSearch]   = useState('');
  const [roleF,  setRoleF]    = useState<User['role'] | 'all'>('all');
  const [statusF, setStatusF] = useState<User['status'] | 'all'>('all');
  const [sortKey, setSortKey] = useState<keyof User>('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [menuId, setMenuId]   = useState<string | null>(null);

  const data = useMemo(() => {
    let d = [...MOCK_USERS];
    if (roleF   !== 'all') d = d.filter(u => u.role === roleF);
    if (statusF !== 'all') d = d.filter(u => u.status === statusF);
    if (search) d = d.filter(u =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.company.toLowerCase().includes(search.toLowerCase()));
    d.sort((a, b) => {
      const av = String(a[sortKey]), bv = String(b[sortKey]);
      return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
    });
    return d;
  }, [search, roleF, statusF, sortKey, sortAsc]);

  const sort = (k: keyof User) => { setSortKey(k); if (sortKey === k) setSortAsc(p => !p); else setSortAsc(true); };
  const Th = ({ label, k }: { label: string; k: keyof User }) => (
    <th onClick={() => sort(k)} className="text-[9px] font-mono text-slate-400 uppercase tracking-wider px-4 py-3 text-left cursor-pointer hover:text-slate-600 whitespace-nowrap select-none">
      <span className="flex items-center gap-1">{label}<ArrowUpDown size={9} className={sortKey === k ? 'text-cyan-500' : 'text-slate-300'} /></span>
    </th>
  );

  const summary = {
    total:    MOCK_USERS.length,
    active:   MOCK_USERS.filter(u => u.status === 'active').length,
    pending:  MOCK_USERS.filter(u => u.status === 'pending').length,
    inactive: MOCK_USERS.filter(u => u.status === 'inactive').length,
  };

  return (
    <div className="p-3 sm:p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-[18px] font-semibold text-slate-800">Pengguna</h1>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">Kelola akses pengguna dan role</p>
        </div>
        <button className="px-3 sm:px-4 py-2 bg-cyan-600 text-white text-[12px] font-semibold rounded-xl hover:bg-cyan-700 transition-colors flex items-center justify-center gap-2 whitespace-nowrap w-full sm:w-auto flex-shrink-0">
          <Plus size={13} /><span className="hidden sm:inline">Tambah Pengguna</span>
          <span className="sm:hidden">Tambah Pengguna</span>
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Pengguna', value: summary.total, color: '#0891B2', bg: 'bg-cyan-50', border: 'border-cyan-200' },
          { label: 'Aktif', value: summary.active, color: '#22C55E', bg: 'bg-emerald-50', border: 'border-emerald-200' },
          { label: 'Menunggu Verifikasi', value: summary.pending, color: '#F59E0B', bg: 'bg-amber-50', border: 'border-amber-200' },
          { label: 'Nonaktif', value: summary.inactive, color: '#94A3B8', bg: 'bg-slate-50', border: 'border-slate-200' },
        ].map(({ label, value, color, bg, border }) => (
          <div key={label} className={cn('rounded-xl border px-4 py-3', bg, border)}>
            <p className="text-[9px] font-mono text-slate-400 uppercase mb-1">{label}</p>
            <p className="text-[22px] font-bold font-mono" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Pending verifikasi banner */}
      {summary.pending > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Clock size={16} className="text-amber-600 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[12px] font-semibold text-amber-800">{summary.pending} pengguna menunggu verifikasi</p>
              <p className="text-[11px] text-amber-600">Setujui atau tolak akses akun baru</p>
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button className="px-3 py-1.5 bg-emerald-600 text-white text-[11px] font-semibold rounded-lg hover:bg-emerald-700 transition-colors whitespace-nowrap">Setujui Semua</button>
            <button className="px-3 py-1.5 bg-white border border-amber-200 text-amber-700 text-[11px] font-semibold rounded-lg hover:bg-amber-50 transition-colors whitespace-nowrap hidden sm:block">Tinjau Satu per Satu</button>
          </div>
        </div>
      )}

      {/* Table */}
      <Card padding={false}>
        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 px-4 py-3 border-b border-slate-100">
          <div className="relative flex-1 sm:flex-none">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Nama / email / perusahaan..."
              className="w-full sm:w-48 pl-8 pr-3 py-1.5 text-[11px] font-mono border border-slate-200 rounded-lg bg-slate-50 text-slate-700 focus:outline-none focus:border-cyan-400" />
          </div>
          <div className="flex flex-wrap gap-1">
            {(['all','active','pending','inactive'] as const).map(s => (
              <button key={s} onClick={() => setStatusF(s)}
                className={cn('text-[9px] font-mono px-2.5 py-1 rounded-full border transition-all whitespace-nowrap',
                  statusF === s ? 'bg-cyan-50 text-cyan-700 border-cyan-200' : 'text-slate-400 border-transparent hover:bg-slate-50')}>
                {s === 'all' ? 'Semua' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
          <select value={roleF} onChange={e => setRoleF(e.target.value as User['role'] | 'all')}
            className="w-full sm:w-auto text-[10px] font-mono border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 text-slate-600 focus:outline-none focus:border-cyan-400">
            <option value="all">Semua Role</option>
            <option value="super_admin">Super Admin</option>
            <option value="admin_perusahaan">Admin Perusahaan</option>
            <option value="kepala_instansi">Kepala Instansi</option>
            <option value="supervisor">Supervisor</option>
          </select>
          <span className="sm:ml-auto text-[10px] text-slate-400 font-mono">{data.length} pengguna</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full" style={{ minWidth: '680px' }}>
            <thead className="bg-slate-50/60 border-b border-slate-100">
              <tr>
                <Th label="Nama" k="name" />
                <Th label="Email" k="email" />
                <Th label="Role" k="role" />
                <Th label="Perusahaan" k="company" />
                <Th label="Status" k="status" />
                <Th label="Login Terakhir" k="lastLogin" />
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/40 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">{u.avatar}</div>
                      <span className="text-[12px] font-semibold text-slate-800">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[11px] text-slate-500 font-mono">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={cn('text-[9px] font-mono font-medium px-2 py-0.5 rounded-full border', ROLE_COLORS[u.role])}>
                      {ROLE_LABELS[u.role]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[11px] text-slate-600">{u.company}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {STATUS_ICON[u.status]}
                      <span className={cn('text-[10px] font-mono',
                        u.status === 'active' ? 'text-emerald-600' : u.status === 'pending' ? 'text-amber-600' : 'text-slate-400')}>
                        {u.status === 'active' ? 'Aktif' : u.status === 'pending' ? 'Menunggu' : 'Nonaktif'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[10px] text-slate-400 font-mono">{u.lastLogin}</td>
                  <td className="px-4 py-3 relative">
                    <button onClick={() => setMenuId(menuId === u.id ? null : u.id)}
                      className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors">
                      <MoreHorizontal size={14} className="text-slate-400" />
                    </button>
                    {menuId === u.id && (
                      <div className="absolute right-4 top-10 bg-white border border-slate-100 rounded-xl shadow-lg z-10 overflow-hidden min-w-[140px]">
                        {['Edit Pengguna','Reset Password','Ubah Role',u.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'].map((action, i) => (
                          <button key={action} onClick={() => setMenuId(null)}
                            className={cn('w-full text-left px-3 py-2 text-[11px] hover:bg-slate-50 transition-colors',
                              i === 3 ? 'text-red-600' : 'text-slate-700')}>
                            {action}
                          </button>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
