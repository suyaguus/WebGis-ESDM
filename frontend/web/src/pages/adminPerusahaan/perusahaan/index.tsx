import { useState } from "react";
import {
  Building2,
  MapPin,
  Mail,
  Phone,
  Tag,
  Pencil,
  X,
  Save,
  CheckCircle,
  XCircle,
  Droplets,
  Briefcase,
} from "lucide-react";
import { useAuthStore } from "../../../store";
import { useCompanies, useUpdateCompany } from "../../../hooks/useCompanies";
import { useBusinesses } from "../../../hooks/useBusinesses";
import { cn } from "../../../lib/utils";
import type { CreateCompanyRequest } from "../../../types/api";

/* ── shared helpers ── */
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

/* ── Edit Company Modal ── */
interface EditCompanyModalProps {
  initial: {
    name: string;
    address: string;
    email: string;
    phone: string;
    type: string;
  };
  onClose: () => void;
  onSubmit: (data: Partial<CreateCompanyRequest>) => void;
  isPending: boolean;
}
function EditCompanyModal({
  initial,
  onClose,
  onSubmit,
  isPending,
}: EditCompanyModalProps) {
  const [form, setForm] = useState({ ...initial });
  const [errors, setErrors] = useState<Record<string, string>>({});
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
    if (form.email && !/\S+@\S+\.\S+/.test(form.email))
      e.email = "Format email tidak valid";
    return e;
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    onSubmit({
      name: form.name,
      address: form.address || undefined,
      email: form.email || undefined,
      phone: form.phone || undefined,
      type: form.type || undefined,
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
              Edit Data Perusahaan
            </p>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
              Perbarui informasi perusahaan
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
          >
            <X size={14} className="text-slate-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
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
                placeholder="info@co.id"
                className={inputCls(errors.email)}
              />
            </F>
            <F label="Telepon">
              <input
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="0721-xxxxxx"
                className={inputCls()}
              />
            </F>
          </div>
          <F label="Jenis Perusahaan">
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
              disabled={isPending}
              className="flex-1 px-4 py-2 bg-amber-600 text-white text-[12px] font-semibold rounded-xl hover:bg-amber-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
            >
              <Save size={13} />
              {isPending ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function AdminPerusahaanCompanyPage() {
  const { user } = useAuthStore();
  const userCompanyId = user?.companyId ?? "";

  const { data: companiesResponse = { data: [] }, isLoading: loadingCompany } =
    useCompanies();
  const allCompanies = companiesResponse.data ?? [];
  const companies = allCompanies.filter((c) => c.id === userCompanyId);

  const { data: businessesResponse = { data: [] }, isLoading: loadingBusiness } =
    useBusinesses();
  const allBusinesses = businessesResponse.data ?? [];
  const businesses = allBusinesses.filter((b) => b.companyId === userCompanyId);

  const updateCompany = useUpdateCompany();

  const [editingCompany, setEditingCompany] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const company = companies[0] ?? null;
  const isLoading = loadingCompany || loadingBusiness;

  const handleUpdateCompany = (payload: Partial<CreateCompanyRequest>) => {
    if (!company) return;
    updateCompany.mutate(
      { id: company.id, payload },
      {
        onSuccess: () => {
          setEditingCompany(false);
          showToast("Data perusahaan berhasil diperbarui");
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="p-3 sm:p-5 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center mx-auto mb-3 animate-pulse">
            <Building2 size={20} className="text-amber-400" />
          </div>
          <p className="text-[11px] text-slate-400 font-mono">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="p-3 sm:p-5 flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-xs">
          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto mb-3">
            <Building2 size={22} className="text-slate-400" />
          </div>
          <p className="text-[14px] font-semibold text-slate-700 mb-1">
            Belum Ada Data Perusahaan
          </p>
          <p className="text-[11px] text-slate-400 font-mono">
            Akun Anda belum terhubung dengan data perusahaan. Hubungi Super
            Admin.
          </p>
        </div>
      </div>
    );
  }

  const infoItems = [
    { icon: Building2, label: "Nama Perusahaan", value: company.name },
    {
      icon: MapPin,
      label: "Alamat",
      value: company.region !== "-" ? company.region : "Belum diisi",
    },
    { icon: Mail, label: "Email", value: company.email || "Belum diisi" },
    { icon: Phone, label: "Telepon", value: company.phone || "Belum diisi" },
    {
      icon: Tag,
      label: "Jenis Perusahaan",
      value: company.type || "Belum diisi",
    },
  ];

  const stats = [
    {
      label: "Total Sumur",
      value: company.sensorCount,
      icon: Droplets,
      color: "text-cyan-700",
      bg: "bg-cyan-50",
      border: "border-cyan-200",
      iconColor: "text-cyan-500",
    },
    {
      label: "Status",
      value: company.status === "online" ? "Aktif" : "Nonaktif",
      icon: company.status === "online" ? CheckCircle : XCircle,
      color:
        company.status === "online" ? "text-emerald-700" : "text-slate-500",
      bg: company.status === "online" ? "bg-emerald-50" : "bg-slate-50",
      border:
        company.status === "online" ? "border-emerald-200" : "border-slate-200",
      iconColor:
        company.status === "online" ? "text-emerald-500" : "text-slate-400",
    },
    {
      label: "Kuota Air Tanah",
      value: `${(company.quotaUsed / 1000).toFixed(0)}k / ${(company.quota / 1000).toFixed(0)}k m³`,
      icon: Droplets,
      color:
        company.quotaUsed > company.quota ? "text-red-700" : "text-amber-700",
      bg: company.quotaUsed > company.quota ? "bg-red-50" : "bg-amber-50",
      border:
        company.quotaUsed > company.quota
          ? "border-red-200"
          : "border-amber-200",
      iconColor:
        company.quotaUsed > company.quota ? "text-red-500" : "text-amber-500",
    },
    {
      label: "Unit Usaha",
      value: businesses.length,
      icon: Briefcase,
      color: "text-violet-700",
      bg: "bg-violet-50",
      border: "border-violet-200",
      iconColor: "text-violet-500",
    },
  ];

  return (
    <div className="p-3 sm:p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[18px] font-semibold text-slate-800">
            Data Perusahaan
          </h1>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
            Profil perusahaan
          </p>
        </div>
        <button
          onClick={() => setEditingCompany(true)}
          className="px-3 sm:px-4 py-2 bg-amber-600 text-white text-[12px] font-semibold rounded-xl hover:bg-amber-700 transition-colors flex items-center gap-2 whitespace-nowrap flex-shrink-0"
        >
          <Pencil size={13} />
          <span className="hidden sm:inline">Edit Perusahaan</span>
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 flex items-center gap-3">
          <CheckCircle size={16} className="text-emerald-600 flex-shrink-0" />
          <p className="text-[12px] font-semibold text-emerald-800">{toast}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className={cn("rounded-xl border px-4 py-3", s.bg, s.border)}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon size={14} className={s.iconColor} />
                <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">
                  {s.label}
                </p>
              </div>
              <p className={cn("text-[18px] font-bold font-mono", s.color)}>
                {s.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Quota bar */}
      {company.quota > 0 && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-semibold text-slate-700">
              Penggunaan Kuota Air Tanah
            </p>
            <p className="text-[11px] font-mono font-semibold text-amber-700">
              {Math.round((company.quotaUsed / company.quota) * 100)}%
            </p>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                company.quotaUsed > company.quota
                  ? "bg-red-500"
                  : company.quotaUsed / company.quota >= 0.85
                    ? "bg-amber-500"
                    : "bg-emerald-500",
              )}
              style={{
                width: `${Math.min((company.quotaUsed / company.quota) * 100, 100)}%`,
              }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[9px] font-mono text-slate-400">
              Terpakai: {(company.quotaUsed / 1000).toFixed(1)}k m³
            </span>
            <span className="text-[9px] font-mono text-slate-400">
              Total: {(company.quota / 1000).toFixed(1)}k m³
            </span>
          </div>
        </div>
      )}

      {/* Company info card */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-sm">
            <Building2 size={18} className="text-white" />
          </div>
          <div>
            <p className="text-[14px] font-bold text-slate-800">
              {company.name}
            </p>
            <p className="text-[10px] text-slate-400 font-mono">
              Profil perusahaan
            </p>
          </div>
        </div>
        <div className="divide-y divide-slate-50">
          {infoItems.map((item) => {
            const Icon = item.icon;
            const isEmpty = item.value === "Belum diisi";
            return (
              <div
                key={item.label}
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50/40 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0">
                  <Icon size={14} className="text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-0.5">
                    {item.label}
                  </p>
                  <p
                    className={cn(
                      "text-[12px] font-medium truncate",
                      isEmpty ? "text-slate-300 italic" : "text-slate-800",
                    )}
                  >
                    {item.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      {editingCompany && (
        <EditCompanyModal
          initial={{
            name: company.name,
            address: company.region !== "-" ? company.region : "",
            email: company.email || "",
            phone: company.phone || "",
            type: company.type || "",
          }}
          onClose={() => setEditingCompany(false)}
          onSubmit={handleUpdateCompany}
          isPending={updateCompany.isPending}
        />
      )}
    </div>
  );
}
