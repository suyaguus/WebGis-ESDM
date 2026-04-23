import { useState, useEffect, useRef } from "react";
import {
  Bell,
  ChevronRight,
  RefreshCw,
  Download,
  Menu,
  X,
  Save,
  Eye,
  EyeOff,
  User,
  Building2,
  LogOut,
} from "lucide-react";
import { useAppStore, useAuthStore } from "../../../store";
import { getCurrentDate, getCurrentTime, cn } from "../../../lib/utils";
import { MOCK_ALERTS } from "../../../constants/mockData";
import { useUpdateMe } from "../../../hooks/useUsers";
import { useUpdateCompany, useCompanies } from "../../../hooks/useCompanies";
import type { CreateCompanyRequest } from "../../../types/api";
import type { UpdateMeRequest } from "../../../services/user.service";

const PAGE_META: Record<string, { label: string; section: string }> = {
  "ap-dashboard": { label: "Dashboard", section: "Overview" },
  "ap-peta": { label: "Peta Sensor", section: "Overview" },
  "ap-sumur": { label: "Daftar Sumur", section: "Overview" },
  "ap-perusahaan": { label: "Data Perusahaan", section: "Pengaturan" },
  "ap-tim": { label: "Tim Lapangan", section: "Operasional" },
  "ap-verifikasi": { label: "Verifikasi Data", section: "Operasional" },
  "ap-histori": { label: "Histori Pengukuran", section: "Operasional" },
  "ap-laporan": { label: "Laporan & Ekspor", section: "Laporan" },
};

// Filter alerts relevant to PT Maju Jaya
const COMPANY_ALERTS = MOCK_ALERTS.filter(
  (a) => !a.companyName || a.companyName === "PT Maju Jaya",
);
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
      : "border-slate-200 focus:ring-amber-400 focus:border-amber-400",
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
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
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
              className="flex-1 px-4 py-2 bg-amber-600 text-white text-[12px] font-semibold rounded-xl hover:bg-amber-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
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

/* ── Edit Perusahaan Modal ── */
interface EditCompanyModalProps {
  company: {
    id: string;
    name: string;
    region: string;
    email?: string;
    phone?: string;
    type?: string;
  };
  onClose: () => void;
}

function EditCompanyModal({ company, onClose }: EditCompanyModalProps) {
  const updateCompany = useUpdateCompany();
  const [form, setForm] = useState({
    name: company.name,
    address: company.region !== "-" ? company.region : "",
    email: company.email ?? "",
    phone: company.phone ?? "",
    type: company.type ?? "",
  });
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
    if (!form.name.trim()) e.name = "Nama perusahaan wajib diisi";
    if (form.email && !/\S+@\S+\.\S+/.test(form.email))
      e.email = "Format email tidak valid";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const payload: Partial<CreateCompanyRequest> = {
      name: form.name,
      address: form.address || undefined,
      email: form.email || undefined,
      phone: form.phone || undefined,
      type: form.type || undefined,
    };

    updateCompany.mutate(
      { id: company.id, payload },
      {
        onSuccess: () => {
          setSuccess(true);
          setTimeout(onClose, 1200);
        },
        onError: (err: any) => {
          setErrors({
            _global:
              err?.response?.data?.message ??
              "Gagal memperbarui data perusahaan",
          });
        },
      },
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <p className="text-[15px] font-bold text-slate-800">
              Edit Data Perusahaan
            </p>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
              Perbarui informasi perusahaan Anda
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
              Data perusahaan berhasil diperbarui!
            </div>
          )}
          <F label="Nama Perusahaan *" error={errors.name}>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="PT Maju Jaya Tbk"
              className={inputCls(errors.name)}
            />
          </F>
          <F label="Alamat">
            <input
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              placeholder="Jl. Raya No. 123"
              className={inputCls()}
            />
          </F>
          <div className="grid grid-cols-2 gap-3">
            <F label="Email" error={errors.email}>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="info@perusahaan.co.id"
                className={inputCls(errors.email)}
              />
            </F>
            <F label="Telepon">
              <input
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="0721-xxxxxxx"
                className={inputCls()}
              />
            </F>
          </div>
          <F label="Jenis Usaha">
            <input
              value={form.type}
              onChange={(e) => set("type", e.target.value)}
              placeholder="Industri / Komersial / dll"
              className={inputCls()}
            />
          </F>
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
              disabled={updateCompany.isPending}
              className="flex-1 px-4 py-2 bg-amber-600 text-white text-[12px] font-semibold rounded-xl hover:bg-amber-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save size={13} />
              {updateCompany.isPending ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default function AdminTopbar() {
  const { activePage, setMobileSidebarOpen } = useAppStore();
  const { user, clearAuth } = useAuthStore();
  const { data: companies = [] } = useCompanies();
  const company = companies[0] ?? null;

  const [time, setTime] = useState(getCurrentTime());
  const [showAlerts, setAlerts] = useState(false);
  const [refreshing, setRefresh] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showProfile, setProfile] = useState(false);
  const [showCompany, setCompany] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const unread = COMPANY_ALERTS.filter((a) => !a.isRead).length;
  const meta = PAGE_META[activePage] ?? {
    label: activePage,
    section: "Pengaturan",
  };

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

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <header className="h-[60px] bg-white border-b border-slate-100 flex items-center px-4 gap-3 flex-shrink-0 shadow-sm relative z-20 min-w-0">
        {/* Hamburger */}
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="md:hidden w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center hover:bg-slate-100 transition-colors flex-shrink-0"
        >
          <Menu size={16} className="text-slate-500" />
        </button>

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <span className="hidden sm:inline text-[11px] text-slate-400 flex-shrink-0">
            {company?.name ?? user?.name ?? "Admin Perusahaan"}
          </span>
          <ChevronRight
            size={11}
            className="hidden sm:inline text-slate-300 flex-shrink-0"
          />
          <span className="hidden sm:inline text-[11px] text-slate-400 flex-shrink-0">
            {meta.section}
          </span>
          <ChevronRight
            size={11}
            className="hidden sm:inline text-slate-300 flex-shrink-0"
          />
          <span className="text-[12px] font-semibold text-slate-700 truncate">
            {meta.label}
          </span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button className="hidden md:flex items-center gap-1.5 text-[10px] font-mono text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1.5 rounded-lg hover:bg-amber-100 transition-colors">
            <Download size={11} /> Ekspor Laporan
          </button>

          <button
            onClick={() => {
              setRefresh(true);
              setTimeout(() => setRefresh(false), 800);
            }}
            className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center hover:bg-slate-100 transition-colors"
          >
            <RefreshCw
              size={13}
              className={cn("text-slate-500", refreshing && "animate-spin")}
            />
          </button>

          <div className="hidden md:flex text-[10px] font-mono text-slate-400 bg-slate-50 border border-slate-100 px-2.5 py-1.5 rounded-lg whitespace-nowrap items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
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
                    Notifikasi Perusahaan
                  </span>
                  <span className="text-[9px] font-mono text-red-500 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                    {unread} BARU
                  </span>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-50">
                  {COMPANY_ALERTS.slice(0, 4).map((a) => (
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
                          {a.severity === "critical"
                            ? "KRITIS"
                            : a.severity === "warning"
                              ? "WASPADA"
                              : "INFO"}
                        </span>
                        {!a.isRead && (
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        )}
                      </div>
                      <p className="text-[11px] font-medium text-slate-700 leading-snug">
                        {a.title}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {a.timestamp}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50">
                  <button
                    onClick={() => setAlerts(false)}
                    className="text-[11px] text-amber-600 hover:text-amber-700 font-medium w-full text-center"
                  >
                    Lihat semua notifikasi →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Avatar + dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu((p) => !p)}
              className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-[10px] font-bold text-amber-700 cursor-pointer hover:ring-2 hover:ring-amber-300 transition-all flex-shrink-0 border border-amber-200"
            >
              {initials}
            </button>

            {showMenu && (
              <div className="absolute right-0 top-10 w-60 bg-white border border-slate-100 rounded-xl shadow-xl z-50 overflow-hidden animate-slide-up">
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                  <p className="text-[12px] font-bold text-slate-800 truncate">
                    {user?.name ?? "-"}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono truncate">
                    {user?.email ?? "-"}
                  </p>
                  <span className="inline-block mt-1 text-[9px] font-mono font-semibold bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Admin Perusahaan
                  </span>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      setProfile(true);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-[12px] font-medium text-slate-700 hover:bg-slate-50 transition-colors text-left"
                  >
                    <User size={14} className="text-slate-400 flex-shrink-0" />
                    Edit Profil &amp; Password
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      setCompany(true);
                    }}
                    disabled={!company}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-[12px] font-medium text-slate-700 hover:bg-slate-50 transition-colors text-left disabled:opacity-40"
                  >
                    <Building2
                      size={14}
                      className="text-slate-400 flex-shrink-0"
                    />
                    Edit Data Perusahaan
                  </button>
                </div>
                <div className="border-t border-slate-100 py-1">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      clearAuth();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-[12px] font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
                  >
                    <LogOut size={14} className="flex-shrink-0" />
                    Keluar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {showProfile && (
        <EditProfileModal
          initial={{ name: user?.name ?? "", phone: user?.phone ?? "" }}
          onClose={() => setProfile(false)}
        />
      )}
      {showCompany && company && (
        <EditCompanyModal company={company} onClose={() => setCompany(false)} />
      )}
    </>
  );
}
