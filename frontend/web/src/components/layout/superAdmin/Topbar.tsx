import { useState, useEffect } from "react";
import {
  Bell,
  ChevronRight,
  RefreshCw,
  Menu,
  LogOut,
  X,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAppStore, useAuthStore } from "../../../store";
import { getCurrentDate, getCurrentTime } from "../../../lib/utils";
import { MOCK_ALERTS } from "../../../constants/mockData";
import { cn } from "../../../lib/utils";
import { useUpdateMe } from "../../../hooks/useUsers";
import type { UpdateMeRequest } from "../../../services/user.service";

const PAGE_META: Record<string, { label: string; section: string }> = {
  dashboard: { label: "Dashboard", section: "Overview" },
  peta: { label: "Peta Interaktif", section: "Overview" },
  sensor: { label: "Semua Sensor", section: "Overview" },
  analytics: { label: "Analytics", section: "Overview" },
  users: { label: "Pengguna", section: "Manajemen" },
  companies: { label: "Perusahaan", section: "Manajemen" },
  roles: { label: "Role & Akses", section: "Manajemen" },
  reports: { label: "Laporan", section: "Manajemen" },
  config: { label: "Konfigurasi", section: "Sistem" },
  server: { label: "Server & API", section: "Sistem" },
  audit: { label: "Audit Log", section: "Sistem" },
};

/* ── Shared field wrapper ── */
function F({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">
        {label}
      </label>
      {children}
      {error && <p className="text-[10px] text-red-500 mt-1">{error}</p>}
    </div>
  );
}

const inputCls = (err?: string) =>
  cn(
    "w-full px-3 py-2 text-[12px] font-mono border rounded-lg bg-slate-50 text-slate-800 focus:outline-none focus:ring-1",
    err
      ? "border-red-300 focus:ring-red-300"
      : "border-slate-200 focus:ring-purple-400 focus:border-purple-400",
  );

/* ── Edit Profil Modal ── */
interface EditProfileModalProps {
  initial: { name: string; phone: string };
  onClose: () => void;
}

function EditProfileModal({ initial, onClose }: EditProfileModalProps) {
  const { user, setAuth } = useAuthStore();
  const updateMe = useUpdateMe();

  const [form, setForm] = useState({
    name: initial.name,
    phone: initial.phone,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurr, setShowCurr] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const set = (k: string, v: string) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => {
      const n = { ...p };
      delete n[k];
      return n;
    });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Nama wajib diisi";
    if (form.newPassword || form.currentPassword || form.confirmPassword) {
      if (!form.currentPassword)
        e.currentPassword = "Password lama wajib diisi";
      if (!form.newPassword) e.newPassword = "Password baru wajib diisi";
      else if (form.newPassword.length < 8)
        e.newPassword = "Minimal 8 karakter";
      if (form.newPassword !== form.confirmPassword)
        e.confirmPassword = "Password tidak cocok";
    }
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const payload: UpdateMeRequest = {
      name: form.name,
      phone: form.phone || undefined,
    };
    if (form.newPassword) {
      payload.currentPassword = form.currentPassword;
      payload.newPassword = form.newPassword;
    }

    updateMe.mutate(payload, {
      onSuccess: (updatedUser) => {
        if (user) {
          setAuth(useAuthStore.getState().token!, {
            ...user,
            name: updatedUser.name,
            phone: updatedUser.phone,
          });
        }
        setSuccess(true);
        setTimeout(onClose, 1200);
      },
      onError: (err: any) => {
        const msg = err?.response?.data?.message ?? "Gagal memperbarui profil";
        setErrors({ _global: msg });
      },
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <p className="text-[15px] font-bold text-slate-800">
              Edit Profil Saya
            </p>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
              Perbarui nama, telepon, dan password
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
          >
            <X size={14} className="text-slate-500" />
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="px-6 py-5 space-y-4 max-h-[80vh] overflow-y-auto"
        >
          {errors._global && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[11px] text-red-600">
              {errors._global}
            </div>
          )}
          {success && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-[11px] text-emerald-700 font-semibold">
              Profil berhasil diperbarui!
            </div>
          )}
          <F label="Nama Lengkap" error={errors.name}>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Nama lengkap"
              className={inputCls(errors.name)}
            />
          </F>
          <F label="Nomor HP (opsional)">
            <input
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="08xxxxxxxxxx"
              className={inputCls()}
            />
          </F>
          <div className="border-t border-slate-100 pt-4 space-y-3">
            <p className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
              Ganti Password (opsional)
            </p>
            <F label="Password Lama" error={errors.currentPassword}>
              <div className="relative">
                <input
                  type={showCurr ? "text" : "password"}
                  value={form.currentPassword}
                  onChange={(e) => set("currentPassword", e.target.value)}
                  placeholder="Password saat ini"
                  className={cn(inputCls(errors.currentPassword), "pr-9")}
                />
                <button
                  type="button"
                  onClick={() => setShowCurr((p) => !p)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showCurr ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
            </F>
            <F label="Password Baru" error={errors.newPassword}>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={form.newPassword}
                  onChange={(e) => set("newPassword", e.target.value)}
                  placeholder="Min. 8 karakter"
                  className={cn(inputCls(errors.newPassword), "pr-9")}
                />
                <button
                  type="button"
                  onClick={() => setShowNew((p) => !p)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showNew ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
            </F>
            <F label="Konfirmasi Password Baru" error={errors.confirmPassword}>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => set("confirmPassword", e.target.value)}
                placeholder="Ulangi password baru"
                className={inputCls(errors.confirmPassword)}
              />
            </F>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-100 text-slate-600 text-[12px] font-semibold rounded-xl hover:bg-slate-200 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={updateMe.isPending}
              className="flex-1 px-4 py-2 bg-purple-600 text-white text-[12px] font-semibold rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save size={13} />
              {updateMe.isPending ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Topbar() {
  const { activePage, setMobileSidebarOpen } = useAppStore();
  const { user, clearAuth } = useAuthStore();
  const [time, setTime] = useState(getCurrentTime());
  const [showAlerts, setAlerts] = useState(false);
  const [refreshing, setRefresh] = useState(false);
  const [showProfile, setProfile] = useState(false);
  const unread = MOCK_ALERTS.filter((a) => !a.isRead).length;
  const meta = PAGE_META[activePage] ?? { label: activePage, section: "SIGAT" };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w: string) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  useEffect(() => {
    const t = setInterval(() => setTime(getCurrentTime()), 30_000);
    return () => clearInterval(t);
  }, []);

  const handleRefresh = () => {
    setRefresh(true);
    setTimeout(() => setRefresh(false), 800);
  };

  return (
    <>
      <header className="h-[60px] bg-white border-b border-slate-100 flex items-center px-4 gap-3 flex-shrink-0 shadow-sm relative z-20 min-w-0">
        {/* Hamburger — mobile only */}
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="md:hidden w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center hover:bg-slate-100 transition-colors flex-shrink-0"
        >
          <Menu size={16} className="text-slate-500" />
        </button>

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[12px] min-w-0 flex-1">
          <span className="hidden sm:inline text-slate-400 flex-shrink-0 text-[11px]">
            SIGAT
          </span>
          <ChevronRight
            size={11}
            className="hidden sm:inline text-slate-300 flex-shrink-0"
          />
          <span className="hidden sm:inline text-slate-400 flex-shrink-0 text-[11px]">
            {meta.section}
          </span>
          <ChevronRight
            size={11}
            className="hidden sm:inline text-slate-300 flex-shrink-0"
          />
          <span className="font-semibold text-slate-700 truncate text-[12px]">
            {meta.label}
          </span>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Refresh */}
          <button
            onClick={handleRefresh}
            className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center hover:bg-slate-100 transition-colors"
          >
            <RefreshCw
              size={13}
              className={cn(
                "text-slate-500 transition-transform",
                refreshing && "animate-spin",
              )}
            />
          </button>

          {/* Date + time — hidden on mobile */}
          <div className="hidden md:flex text-[10px] font-mono text-slate-400 bg-slate-50 border border-slate-100 px-2.5 py-1.5 rounded-lg whitespace-nowrap items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot flex-shrink-0" />
            {getCurrentDate()} · {time}
          </div>

          {/* Alert bell */}
          <div className="relative">
            <button
              onClick={() => setAlerts((p) => !p)}
              className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center hover:bg-slate-100 transition-colors relative"
            >
              <Bell size={14} className="text-slate-500" />
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                  {unread}
                </span>
              )}
            </button>

            {showAlerts && (
              <div className="absolute right-0 top-10 w-72 max-w-[calc(100vw-1rem)] bg-white border border-slate-100 rounded-xl shadow-xl z-50 overflow-hidden animate-slide-up">
                <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-slate-700">
                    Notifikasi
                  </span>
                  <span className="text-[9px] font-mono text-red-500 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                    {unread} BARU
                  </span>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                  {MOCK_ALERTS.slice(0, 5).map((a) => (
                    <div
                      key={a.id}
                      className={cn("px-4 py-3", !a.isRead && "bg-slate-50/60")}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={cn(
                            "text-[9px] font-mono font-medium px-1.5 py-0.5 rounded border",
                            a.severity === "critical"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : a.severity === "warning"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-blue-50 text-blue-700 border-blue-200",
                          )}
                        >
                          {a.severity.toUpperCase()}
                        </span>
                        {!a.isRead && (
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] font-medium text-slate-700 leading-snug">
                        {a.title}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
                        {a.timestamp}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50">
                  <button
                    onClick={() => setAlerts(false)}
                    className="text-[11px] text-cyan-600 hover:text-cyan-700 font-medium w-full text-center"
                  >
                    Lihat semua notifikasi →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Avatar - Click to edit profile */}
          <button
            onClick={() => setProfile(true)}
            className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-[10px] font-bold text-purple-700 cursor-pointer hover:ring-2 hover:ring-purple-300 transition-all flex-shrink-0 border border-purple-200 hover:bg-purple-200"
            title="Edit Profil"
          >
            {initials}
          </button>

          {/* Logout button */}
          <button
            onClick={clearAuth}
            className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center hover:bg-red-100 transition-colors text-red-600 flex-shrink-0"
            title="Keluar"
          >
            <LogOut size={13} />
          </button>
        </div>
      </header>

      {showProfile && (
        <EditProfileModal
          initial={{ name: user?.name ?? "", phone: user?.phone ?? "" }}
          onClose={() => setProfile(false)}
        />
      )}
    </>
  );
}
