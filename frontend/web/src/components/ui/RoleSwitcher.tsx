import { useAppStore } from '../../store';
import { cn } from '../../lib/utils';
import type { Role } from '../../types';

const ROLES: { key: Role; label: string; color: string }[] = [
  { key: 'superadmin', label: 'Super Admin',  color: 'bg-cyan-100 text-cyan-700 border-cyan-300'       },
  { key: 'admin',      label: 'Admin Peru.',  color: 'bg-amber-100 text-amber-700 border-amber-300'     },
  { key: 'kadis',      label: 'Kepala Dinas', color: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
];

export default function RoleSwitcher() {
  const { role, setRole } = useAppStore();
  return (
    <div className="px-3 py-2.5 border-t border-slate-100 bg-slate-50/60 flex-shrink-0">
      <p className="text-[8px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Demo: Ganti Role</p>
      <div className="grid grid-cols-3 gap-1">
        {ROLES.map(r => (
          <button key={r.key} onClick={() => setRole(r.key)}
            className={cn('text-[8px] font-mono font-medium py-1 rounded-lg border transition-all',
              role === r.key ? r.color : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50')}>
            {r.label}
          </button>
        ))}
      </div>
    </div>
  );
}
