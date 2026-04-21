import React from 'react';
import {
  LayoutDashboard, Map, Droplets, FileText,
  ScanLine, FileBadge, User, X, ChevronRight, Send, Radio,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useAppStore } from '../../../store';
import { SURVEYOR_PROFILE, TODAY_TASKS } from '../../../constants/surveyorData';

interface NavItem {
  key: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
  badgeColor?: 'red' | 'blue';
  section: string;
}

const pendingCount = TODAY_TASKS.filter(t => t.status === 'belum').length;

const NAV_ITEMS: NavItem[] = [
  { key: 'sv-dashboard', label: 'Dashboard',           icon: LayoutDashboard, section: 'overview' },
  { key: 'sv-sumur',     label: 'Sumur Ditugaskan',    icon: Droplets,        badge: 3, badgeColor: 'blue', section: 'pemetaan' },
  { key: 'sv-input',     label: 'Input Pemetaan Sensor', icon: ScanLine,      badge: pendingCount > 0 ? pendingCount : undefined, badgeColor: 'red', section: 'pemetaan' },
  { key: 'sv-dokumen',   label: 'Verifikasi Dokumen',  icon: FileBadge,       badge: 2, badgeColor: 'blue', section: 'pemetaan' },
  { key: 'sv-peta',      label: 'Peta Sensor',         icon: Map,             section: 'pemetaan' },
  { key: 'sv-laporan',   label: 'Riwayat Laporan',     icon: FileText,        section: 'laporan' },
  { key: 'sv-kirim',     label: 'Kirim ke Super Admin', icon: Send,           section: 'laporan' },
];

const SECTIONS = [
  { key: 'overview',  label: 'Overview'  },
  { key: 'pemetaan',  label: 'Pemetaan'  },
  { key: 'laporan',   label: 'Laporan'   },
];

interface SidebarProps {
  onClose?: () => void;
}

export default function SurveyorSidebar({ onClose }: SidebarProps) {
  const { activePage, setActivePage } = useAppStore();

  const completedToday = TODAY_TASKS.filter(t => t.status === 'selesai').length;
  const totalToday     = TODAY_TASKS.length;
  const pct            = Math.round((completedToday / totalToday) * 100);

  return (
    <aside className="w-56 flex-shrink-0 bg-white border-r border-slate-100 flex flex-col h-full shadow-sm overflow-hidden">
      {/* Logo */}
      <div className="h-[64px] flex items-center gap-2.5 px-3.5 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-white flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 ring-1 ring-blue-200/80 flex items-center justify-center shadow-sm flex-shrink-0">
          <User size={16} className="text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold text-slate-800 leading-none tracking-[0.04em]">SIGAT</p>
          <p className="text-[9px] font-mono text-blue-700/90 tracking-wide mt-0.5">Sistem Informasi Geologi dan Air Tanah</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg border border-transparent hover:border-slate-200 hover:bg-white transition-colors"
          >
            <X size={16} className="text-slate-500" />
          </button>
        )}
      </div>

      {/* User info */}
      <div className="px-3 py-3 border-b border-slate-100 bg-white flex-shrink-0">
        <div className="rounded-xl border border-slate-100 bg-slate-50/70 px-2.5 py-2">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 ring-1 ring-blue-200 flex items-center justify-center text-[11px] font-semibold text-blue-700 flex-shrink-0">
              {SURVEYOR_PROFILE.initials}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-slate-800 truncate">{SURVEYOR_PROFILE.name}</p>
              <p className="text-[9px] font-mono text-blue-700 tracking-wider">{SURVEYOR_PROFILE.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 rounded-lg px-2 py-1.5">
            <Radio size={10} className="text-blue-600 flex-shrink-0" />
            <p className="text-[9px] font-mono text-blue-700 font-medium truncate">{SURVEYOR_PROFILE.company}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 min-h-0">
        {SECTIONS.map(section => {
          const items = NAV_ITEMS.filter(n => n.section === section.key);
          return (
            <div key={section.key} className="mb-1">
              <p className="text-[9px] font-mono text-slate-400 tracking-widest uppercase px-4 py-1.5">
                {section.label}
              </p>
              {items.map(item => {
                const Icon = item.icon;
                const isActive = activePage === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => setActivePage(item.key)}
                    className={cn(
                      'w-full flex items-center gap-2.5 px-4 py-2.5 text-[12px] font-medium transition-all duration-150 group',
                      isActive
                        ? 'text-blue-700 bg-blue-50 border-r-2 border-blue-500'
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50',
                    )}
                  >
                    <Icon size={14} className={cn('flex-shrink-0', isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-500')} />
                    <span className="flex-1 text-left truncate">{item.label}</span>
                    {item.badge != null && (
                      <span className={cn('text-[9px] font-mono font-medium px-1.5 py-0.5 rounded-full flex-shrink-0',
                        item.badgeColor === 'red' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700')}>
                        {item.badge}
                      </span>
                    )}
                    {isActive && <ChevronRight size={10} className="text-blue-400 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Task progress footer */}
      <div className="px-4 py-3 border-t border-slate-100 bg-blue-50/40 flex-shrink-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[9px] font-mono text-slate-500">Tugas Hari Ini</span>
          <span className="text-[9px] font-mono font-semibold text-blue-700">{completedToday}/{totalToday}</span>
        </div>
        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden mb-1">
          <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-[8px] font-mono text-slate-400">{pct}% selesai · {pendingCount} belum dikerjakan</p>
      </div>
    </aside>
  );
}
