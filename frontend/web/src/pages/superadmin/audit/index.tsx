import { useState, useMemo } from 'react';
import { ScrollText, Search, Download, AlertTriangle, Info, Shield } from 'lucide-react';
import { Card, SectionHeader, SeverityBadge } from '../../../components/ui';
import { MOCK_AUDIT_LOGS } from '../../../constants/mockData';
import { cn, getSeverityColor } from '../../../lib/utils';
import type { AuditLog } from '../../../constants/mockData';

const ACTION_ICONS: Record<string, string> = {
  LOGIN: '🔐', LOGIN_FAILED: '⛔', LOGOUT: '🚪',
  CREATE_USER: '👤', DELETE_USER: '🗑️', UPDATE_USER: '✏️',
  CREATE_SENSOR: '📡', UPDATE_SENSOR: '🔧', DELETE_SENSOR: '🗑️',
  SUBMIT_MEASUREMENT: '📊', EXPORT_REPORT: '📄', APPROVE_PERMIT: '✅',
  UPDATE_COMPANY: '🏢', CONFIG_CHANGE: '⚙️',
};

const ACTION_LABELS: Record<string, string> = {
  LOGIN: 'Login berhasil', LOGIN_FAILED: 'Login gagal', LOGOUT: 'Logout',
  CREATE_USER: 'Buat pengguna', DELETE_USER: 'Hapus pengguna', UPDATE_USER: 'Edit pengguna',
  CREATE_SENSOR: 'Tambah sensor', UPDATE_SENSOR: 'Edit sensor', DELETE_SENSOR: 'Hapus sensor',
  SUBMIT_MEASUREMENT: 'Submit pengukuran', EXPORT_REPORT: 'Ekspor laporan',
  APPROVE_PERMIT: 'Setujui izin', UPDATE_COMPANY: 'Edit perusahaan', CONFIG_CHANGE: 'Ubah konfigurasi',
};

export default function AuditPage() {
  const [search, setSearch]   = useState('');
  const [sevF, setSevF]       = useState<AuditLog['severity'] | 'all'>('all');
  const [dateF, setDateF]     = useState('Hari Ini');

  const data = useMemo(() => {
    return MOCK_AUDIT_LOGS.filter(log => {
      if (sevF !== 'all' && log.severity !== sevF) return false;
      if (search && !log.userName.toLowerCase().includes(search.toLowerCase()) &&
          !log.action.toLowerCase().includes(search.toLowerCase()) &&
          !log.target.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [search, sevF]);

  const summary = {
    total:    MOCK_AUDIT_LOGS.length,
    critical: MOCK_AUDIT_LOGS.filter(l => l.severity === 'critical').length,
    warning:  MOCK_AUDIT_LOGS.filter(l => l.severity === 'warning').length,
    info:     MOCK_AUDIT_LOGS.filter(l => l.severity === 'info').length,
  };

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[18px] font-semibold text-slate-800">Audit Log</h1>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">Rekam jejak aktivitas seluruh pengguna sistem</p>
        </div>
        <button className="px-3 py-2 bg-white border border-slate-200 text-slate-600 text-[11px] font-semibold rounded-xl hover:bg-slate-50 flex items-center gap-1.5">
          <Download size={12} /> Ekspor Log
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Aktivitas', value: summary.total, color: '#0891B2', bg: 'bg-cyan-50 border-cyan-200' },
          { label: 'Kritis', value: summary.critical, color: '#EF4444', bg: 'bg-red-50 border-red-200' },
          { label: 'Peringatan', value: summary.warning, color: '#F59E0B', bg: 'bg-amber-50 border-amber-200' },
          { label: 'Informasi', value: summary.info, color: '#3B82F6', bg: 'bg-blue-50 border-blue-200' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={cn('rounded-xl border px-4 py-3', bg)}>
            <p className="text-[9px] font-mono text-slate-400 uppercase mb-1">{label}</p>
            <p className="text-[22px] font-bold font-mono" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Log table */}
      <Card padding={false}>
        {/* Controls */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 flex-wrap">
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Cari pengguna / aksi / target..."
              className="pl-8 pr-3 py-1.5 text-[11px] font-mono border border-slate-200 rounded-lg bg-slate-50 text-slate-700 w-56 focus:outline-none focus:border-cyan-400" />
          </div>
          <div className="flex gap-1">
            {(['all', 'critical', 'warning', 'info'] as const).map(s => (
              <button key={s} onClick={() => setSevF(s)}
                className={cn('text-[9px] font-mono px-2.5 py-1 rounded-full border transition-all',
                  sevF === s ? 'bg-cyan-50 text-cyan-700 border-cyan-200' : 'text-slate-400 border-transparent hover:bg-slate-50')}>
                {s === 'all' ? 'Semua' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex gap-1 ml-1">
            {['Hari Ini', '7 Hari', '30 Hari'].map(d => (
              <button key={d} onClick={() => setDateF(d)}
                className={cn('text-[9px] font-mono px-2.5 py-1 rounded-full border transition-all',
                  dateF === d ? 'bg-slate-800 text-white border-slate-800' : 'text-slate-400 border-transparent hover:bg-slate-50')}>
                {d}
              </button>
            ))}
          </div>
          <span className="ml-auto text-[10px] text-slate-400 font-mono">{data.length} entri</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full" style={{ minWidth: '640px' }}>
            <thead className="bg-slate-50/60 border-b border-slate-100">
              <tr>
                {['Waktu','Pengguna','Aksi','Target','IP','Severity'].map(h => (
                  <th key={h} className="text-[9px] font-mono text-slate-400 uppercase tracking-wider px-4 py-2.5 text-left whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.map(log => {
                const borderLeft = log.severity === 'critical' ? 'border-l-2 border-l-red-400'
                  : log.severity === 'warning' ? 'border-l-2 border-l-amber-400' : '';
                return (
                  <tr key={log.id} className={cn('hover:bg-slate-50/40 transition-colors', borderLeft)}>
                    <td className="px-4 py-2.5 text-[10px] font-mono text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-[8px] font-bold text-white flex-shrink-0">
                          {log.userName.split(' ').map(n => n[0]).join('').slice(0,2)}
                        </div>
                        <span className="text-[11px] font-medium text-slate-700 whitespace-nowrap">{log.userName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <span>{ACTION_ICONS[log.action] ?? '📋'}</span>
                        <span className="text-[10px] font-mono text-slate-600 whitespace-nowrap">
                          {ACTION_LABELS[log.action] ?? log.action}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-[10px] font-mono text-slate-500">{log.target}</td>
                    <td className="px-4 py-2.5 text-[10px] font-mono text-slate-400">{log.ip}</td>
                    <td className="px-4 py-2.5"><SeverityBadge severity={log.severity} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5">
            <Shield size={10} /> Log tersimpan selama 365 hari sesuai kebijakan retensi
          </p>
          <button className="text-[10px] text-cyan-600 hover:text-cyan-800 font-mono font-medium">Muat lebih banyak →</button>
        </div>
      </Card>
    </div>
  );
}
