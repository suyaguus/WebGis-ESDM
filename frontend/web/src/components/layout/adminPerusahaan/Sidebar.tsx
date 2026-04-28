import React from "react";
import {
  LayoutDashboard,
  Map,
  Droplets,
  FileText,
  FileBadge,
  ClipboardCheck,
  Building2,
  Briefcase,
  ChevronRight,
  X,
  SendHorizonal,
  LogOut,
} from "lucide-react";
import { cn } from "../../../lib/utils";
import { useAppStore, useAuthStore } from "../../../store";
import { useLogout } from "../../../hooks";

interface NavItem {
  key: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
  badgeColor?: "red" | "amber";
  section: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    key: "ap-dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    section: "overview",
  },
  { key: "ap-peta", label: "Peta Sensor", icon: Map, section: "overview" },
  {
    key: "ap-perusahaan",
    label: "Data Perusahaan",
    icon: Building2,
    section: "overview",
  },
  {
    key: "ap-business",
    label: "Unit Usaha",
    icon: Briefcase,
    section: "overview",
  },
  { key: "ap-sumur", label: "Data Sumur", icon: Droplets, section: "sumur" },
  {
    key: "ap-dokumen",
    label: "Pengajuan Sumur",
    icon: FileBadge,
    section: "sumur",
  },
  {
    key: "ap-status",
    label: "Status Pengajuan",
    icon: ClipboardCheck,
    section: "sumur",
  },
  {
    key: "ap-laporan",
    label: "Laporan & Ekspor",
    icon: FileText,
    section: "laporan",
  },
  {
    key: "ap-kirim",
    label: "Kirim ke Surveyor",
    icon: SendHorizonal,
    section: "laporan",
  },
];

const SECTIONS = [
  { key: "overview", label: "Overview" },
  { key: "sumur", label: "Manajemen Sumur" },
  { key: "laporan", label: "Laporan" },
];

interface SidebarProps {
  onClose?: () => void;
}

export default function AdminSidebar({ onClose }: SidebarProps) {
  const { activePage, setActivePage } = useAppStore();
  const { user } = useAuthStore();
  const logout = useLogout();

  const userName = user?.name ?? "Pengguna";
  const userInitials = userName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSettled: () => {
        window.history.replaceState(null, "", "/login");
        window.location.reload();
      },
    });
  };

  return (
    <aside className="w-56 flex-shrink-0 bg-white border-r border-slate-100 flex flex-col h-full shadow-sm overflow-hidden">
      {/* Logo */}
      <div className="h-[64px] flex items-center gap-2.5 px-3.5 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-white flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 ring-1 ring-amber-200/80 flex items-center justify-center shadow-sm flex-shrink-0">
          <Building2 size={16} className="text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold text-slate-800 leading-none tracking-[0.04em]">
            SIGAT
          </p>
          <p className="text-[9px] font-mono text-amber-700/90 tracking-wide mt-0.5">
            Sistem Informasi Geologi dan Air Tanah
          </p>
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

      {/* Company + User info */}
      <div className="px-3 py-3 border-b border-slate-100 bg-white flex-shrink-0">
        <div className="rounded-xl border border-slate-100 bg-slate-50/70 px-2.5 py-2">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-full bg-amber-100 ring-1 ring-amber-200 flex items-center justify-center text-[11px] font-semibold text-amber-700 flex-shrink-0">
              {userInitials}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-slate-800 truncate">
                {userName}
              </p>
              <p className="text-[9px] font-mono text-amber-700 tracking-wider">
                ADMIN PERUSAHAAN
              </p>
            </div>
          </div>
          {/* Company badge */}
          {/* <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 rounded-lg px-2 py-1.5">
            <Building2 size={10} className="text-amber-600 flex-shrink-0" />
            <p className="text-[9px] font-mono text-amber-700 font-medium truncate">
              PT Maju Jaya Tbk
            </p>
          </div> */}
        </div>
      </div>

      {/* Nav */}
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
                      "w-full flex items-center gap-2.5 px-4 py-2.5 text-[12px] font-medium transition-all duration-150 group",
                      isActive
                        ? "text-amber-700 bg-amber-50 border-r-2 border-amber-500"
                        : "text-slate-500 hover:text-slate-700 hover:bg-slate-50",
                    )}
                  >
                    <Icon
                      size={14}
                      className={cn(
                        "flex-shrink-0",
                        isActive
                          ? "text-amber-600"
                          : "text-slate-400 group-hover:text-slate-500",
                      )}
                    />
                    <span className="flex-1 text-left truncate">
                      {item.label}
                    </span>
                    {item.badge && (
                      <span
                        className={cn(
                          "text-[9px] font-mono font-medium px-1.5 py-0.5 rounded-full flex-shrink-0",
                          item.badgeColor === "red"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700",
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                    {isActive && (
                      <ChevronRight
                        size={10}
                        className="text-amber-400 flex-shrink-0"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-2 border-t border-slate-100 flex-shrink-0">
        <button
          onClick={handleLogout}
          disabled={logout.isPending}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[12px] font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all duration-150 group"
        >
          <LogOut
            size={14}
            className="text-red-400 group-hover:text-red-500 flex-shrink-0"
          />
          <span>{logout.isPending ? "Keluar..." : "Keluar"}</span>
        </button>
      </div>

      {/* Quota footer */}
      {/* <div className="px-4 py-3 border-t border-slate-100 bg-amber-50/40 flex-shrink-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[9px] font-mono text-slate-500">
            Kuota Air Tanah
          </span>
          <span className="text-[9px] font-mono font-semibold text-amber-700">
            87%
          </span>
        </div>
        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden mb-1">
          <div
            className="h-full bg-amber-500 rounded-full"
            style={{ width: "87%" }}
          />
        </div>
        <p className="text-[8px] font-mono text-slate-400">
          174.000 / 200.000 m³
        </p>
      </div> */}
    </aside>
  );
}
