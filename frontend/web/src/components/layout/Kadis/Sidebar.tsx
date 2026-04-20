import React from 'react';
import RoleSwitcher from '../../ui/RoleSwitcher';
import {
  LayoutDashboard, Map, BarChart3, FileText, ChevronRight, Building2, X,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useAppStore } from '../../../store';

interface NavItem {
  key: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
  badgeColor?: 'red' | 'amber';
  section: string;
}

const NAV_ITEMS: NavItem[] = [
  { key: 'kadis-dashboard', label: 'Dashboard',       icon: LayoutDashboard, section: 'overview' },
  { key: 'kadis-peta',      label: 'Peta Wilayah',    icon: Map,             section: 'overview' },
  { key: 'kadis-perusahaan',label: 'Perusahaan',      icon: Building2,       badge: 1, badgeColor: 'red', section: 'analysis' },
  { key: 'kadis-analitik',  label: 'Analitik Tren',   icon: BarChart3,       section: 'analysis' },
  { key: 'kadis-laporan',   label: 'Laporan & Ekspor', icon: FileText,       section: 'reports' },
];

const SECTIONS = [
  { key: 'overview',  label: 'Ikhtisar'  },
  { key: 'analysis',  label: 'Analisis'  },
  { key: 'reports',   label: 'Laporan'   },
];

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const { activePage, setActivePage } = useAppStore();

  return (
    <aside className="w-56 flex-shrink-0 bg-white border-r border-slate-100 flex flex-col h-full shadow-sm overflow-hidden">
      {/* Logo */}
      <div className="h-[64px] flex items-center gap-2.5 px-3.5 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-white flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 ring-1 ring-emerald-200/70 flex items-center justify-center shadow-sm flex-shrink-0">
          <Map size={16} className="text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold text-slate-800 leading-none tracking-[0.04em]">SIGAT</p>
          <p className="text-[9px] font-mono text-emerald-700/90 tracking-wide mt-0.5">Sistem Informasi Geologi dan Air Tanah</p>
        </div>
        {/* Close button — mobile only */}
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg border border-transparent hover:border-slate-200 hover:bg-white transition-colors"
          >
            <X size={16} className="text-slate-500" />
          </button>
        )}
      </div>

      {/* User */}
      <div className="px-3 py-3 border-b border-slate-100 bg-white flex-shrink-0">
        <div className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50/70 px-2.5 py-2">
          <div className="w-8 h-8 rounded-full bg-emerald-100 ring-1 ring-emerald-200 flex items-center justify-center text-[11px] font-semibold text-emerald-700 flex-shrink-0">
            DK
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-slate-800 truncate">Deni Kurniawan</p>
            <p className="text-[9px] font-mono text-emerald-700 tracking-wider">KEPALA DINAS</p>
          </div>
        </div>
      </div>

      {/* Nav — scrollable */}
      <nav className="flex-1 overflow-y-auto py-2 min-h-0">
        {SECTIONS.map((section) => {
          const items = NAV_ITEMS.filter((n) => n.section === section.key);
          return (
            <div key={section.key} className="mb-1">
              <p className="text-[9px] font-mono text-slate-400 tracking-widest uppercase px-4 py-1.5">
                {section.label}
              </p>
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => setActivePage(item.key)}
                    className={cn(
                      'w-full flex items-center gap-2.5 px-4 py-2.5 text-[12px] font-medium transition-all duration-150 relative group',
                      isActive
                        ? 'text-emerald-700 bg-emerald-50 border-r-2 border-emerald-600'
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50',
                    )}
                  >
                    <Icon
                      size={14}
                      className={cn('flex-shrink-0', isActive ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-500')}
                    />
                    <span className="flex-1 text-left truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={cn(
                          'text-[9px] font-mono font-medium px-1.5 py-0.5 rounded-full flex-shrink-0',
                          item.badgeColor === 'red' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700',
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                    {isActive && <ChevronRight size={10} className="text-emerald-400 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/60 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot flex-shrink-0" />
          <span className="text-[9px] font-mono text-slate-500">DINAS ESDM LAMPUNG</span>
        </div>
        <p className="text-[9px] font-mono text-slate-400 mt-0.5">Pengawasan Provinsi</p>
      </div>
      <RoleSwitcher />
    </aside>
  );
}
