import React from "react";
import {
  cn,
  getSeverityBadge,
  getSeverityLabel,
  getStatusColor,
  getStatusLabel,
} from "../../lib/utils";

/* ── Badge ─────────────────────────────────────────────── */
interface BadgeProps {
  variant?: "critical" | "warning" | "info" | "success" | "neutral";
  children: React.ReactNode;
  className?: string;
}
export function Badge({
  variant = "neutral",
  children,
  className,
}: BadgeProps) {
  const styles: Record<string, string> = {
    critical: "bg-red-50 text-red-700 border border-red-200",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    info: "bg-blue-50 text-blue-700 border border-blue-200",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    neutral: "bg-slate-100 text-slate-600 border border-slate-200",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium font-mono",
        styles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ── Severity Badge ─────────────────────────────────────── */
export function SeverityBadge({ severity }: { severity: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium font-mono",
        getSeverityBadge(severity),
      )}
    >
      {getSeverityLabel(severity)}
    </span>
  );
}

/* ── Status Pill ───────────────────────────────────────── */
export function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border font-mono",
        getStatusColor(status),
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
      {getStatusLabel(status)}
    </span>
  );
}

/* ── Card ───────────────────────────────────────────────── */
interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}
export function Card({ children, className, padding = true }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-slate-100 shadow-sm",
        padding && "p-4",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ── Section Header ─────────────────────────────────────── */
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  accent?: string;
}
export function SectionHeader({
  title,
  subtitle,
  icon,
  action,
  accent = "#0891B2",
}: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-100 flex-shrink-0">
      {icon && (
        <span style={{ color: accent }} className="flex-shrink-0">
          {icon}
        </span>
      )}
      <span className="text-[13px] font-semibold text-slate-800 truncate">
        {title}
      </span>
      {subtitle && (
        <span className="ml-auto text-[10px] text-slate-400 font-mono whitespace-nowrap flex-shrink-0">
          {subtitle}
        </span>
      )}
      {action && <span className="ml-auto flex-shrink-0">{action}</span>}
    </div>
  );
}

/* ── Stat Card ──────────────────────────────────────────── */
const ACCENT_COLORS: Record<string, string> = {
  cyan: "#0891B2",
  amber: "#F59E0B",
  red: "#EF4444",
  green: "#22C55E",
  purple: "#8B5CF6",
  blue: "#3B82F6",
};

interface StatCardProps {
  label: string;
  value: string | number;
  sub: string;
  color?: string;
  trendUp?: boolean;
  trendDown?: boolean;
}
export function StatCard({
  label,
  value,
  sub,
  color = "cyan",
  trendUp,
  trendDown,
}: StatCardProps) {
  const accentColor = ACCENT_COLORS[color] ?? ACCENT_COLORS.cyan;
  const subColor = trendUp ? "#22C55E" : trendDown ? "#EF4444" : "#94A3B8";

  return (
    <div className="relative bg-white rounded-xl border border-slate-100 shadow-sm px-3 pt-3.5 pb-3 overflow-hidden min-w-0">
      <div
        className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl"
        style={{ background: accentColor }}
      />
      <p className="text-[9px] font-mono font-medium text-slate-400 tracking-wide uppercase mb-1.5 truncate">
        {label}
      </p>
      <p className="text-[20px] font-semibold font-mono leading-none text-slate-800 truncate">
        {value}
      </p>
      <p
        className="text-[10px] mt-1.5 font-mono truncate"
        style={{ color: subColor }}
      >
        {sub}
      </p>
    </div>
  );
}

/* ── Divider ─────────────────────────────────────────────── */
export function Divider({ label }: { label?: string }) {
  if (!label) return <hr className="border-slate-100 my-2" />;
  return (
    <div className="flex items-center gap-2 my-2">
      <div className="flex-1 h-px bg-slate-100" />
      <span className="text-[9px] text-slate-400 font-mono tracking-wider">
        {label}
      </span>
      <div className="flex-1 h-px bg-slate-100" />
    </div>
  );
}

/* ── Quota Bar ───────────────────────────────────────────── */
interface QuotaBarProps {
  percent: number;
  used: string;
  total: string;
}
export function QuotaBar({ percent, used, total }: QuotaBarProps) {
  const color =
    percent >= 100 ? "#EF4444" : percent >= 85 ? "#F59E0B" : "#22C55E";
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-[11px] text-slate-500 font-mono">
          Kuota Air Tanah
        </span>
        <span className="text-[11px] font-semibold font-mono" style={{ color }}>
          {percent}%
        </span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(percent, 100)}%`, background: color }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[9px] text-slate-400 font-mono">{used}</span>
        <span className="text-[9px] text-slate-400 font-mono">{total}</span>
      </div>
    </div>
  );
}

/* ── Pagination (imported from Pagination.tsx) ─────────── */
export { Pagination as Pagination } from "./Pagination";
