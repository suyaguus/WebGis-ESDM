import { useState } from "react";
import {
  Briefcase,
  MapPin,
  Phone,
  Mail,
  Plus,
  Trash2,
  Edit2,
  X,
  AlertTriangle,
  CheckCircle,
  Building2,
} from "lucide-react";
import { Card, StatusPill } from "../../../components/ui";
import {
  useBusinesses,
  useCreateBusiness,
  useUpdateBusiness,
  useDeleteBusiness,
} from "../../../hooks/useBusinesses";
import { useCompanies } from "../../../hooks/useCompanies";
import { useAuthStore } from "../../../store";
import { cn } from "../../../lib/utils";
import type {
  CreateBusinessRequest,
  UpdateBusinessRequest,
} from "../../../types/api";
import type { Business } from "../../../services/business.service";

interface BusinessModalProps {
  title: string;
  initial?: {
    name: string;
    address?: string;
    phone?: string;
  };
  onClose: () => void;
  onSubmit: (data: { name: string; address?: string; phone?: string }) => void;
  isPending: boolean;
}

function BusinessModal({
  title,
  initial,
  onClose,
  onSubmit,
  isPending,
}: BusinessModalProps) {
  const [form, setForm] = useState({
    name: initial?.name || "",
    address: initial?.address || "",
    phone: initial?.phone || "",
  });
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
    if (!form.name.trim()) e.name = "Nama unit usaha wajib diisi";
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
      phone: form.phone || undefined,
    });
  };

  const inputCls = (err?: string) =>
    cn(
      "w-full px-3 py-2 text-[12px] font-mono border rounded-lg bg-slate-50 text-slate-800 focus:outline-none focus:ring-1",
      err
        ? "border-red-300 focus:ring-red-300"
        : "border-slate-200 focus:ring-violet-400 focus:border-violet-400",
    );

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
            <p className="text-[15px] font-bold text-slate-800">{title}</p>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
              Kelola unit usaha perusahaan
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
          <div>
            <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">
              Nama Unit Usaha *
            </label>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Cabang Jakarta Pusat"
              className={inputCls(errors.name)}
            />
            {errors.name && (
              <p className="text-[10px] text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">
              Alamat
            </label>
            <input
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              placeholder="Jl. Sudirman No. 123, Jakarta"
              className={inputCls()}
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">
              Telepon
            </label>
            <input
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="(021) 1234-5678"
              className={inputCls()}
            />
          </div>

          <div className="flex gap-2 pt-3">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-2 bg-violet-600 text-white text-[12px] font-semibold rounded-xl hover:bg-violet-700 disabled:opacity-50 transition-colors"
            >
              {isPending ? "Menyimpan..." : "Simpan"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 text-slate-600 text-[12px] font-semibold rounded-xl hover:bg-slate-200 transition-colors"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface DeleteConfirmModalProps {
  business: Business;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}

function DeleteConfirmModal({
  business,
  onClose,
  onConfirm,
  isPending,
}: DeleteConfirmModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-100 bg-red-50/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={18} className="text-red-600" />
            </div>
            <h3 className="text-[15px] font-bold text-red-900">
              Hapus Unit Usaha
            </h3>
          </div>
          <p className="text-[12px] text-red-800 font-mono">
            Tindakan ini tidak dapat dibatalkan
          </p>
        </div>

        <div className="px-6 py-4">
          <p className="text-[13px] text-slate-700 mb-2">
            Apakah Anda yakin ingin menghapus unit usaha:
          </p>
          <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 mb-4">
            <p className="text-[13px] font-semibold text-red-900 truncate">
              {business.name}
            </p>
            {business.address && (
              <p className="text-[11px] text-red-700 font-mono mt-0.5 truncate">
                {business.address}
              </p>
            )}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-slate-100 text-slate-600 text-[12px] font-semibold rounded-xl hover:bg-slate-200 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 px-4 py-2 bg-red-600 text-white text-[12px] font-semibold rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {isPending ? "Menghapus..." : "Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BusinessPage() {
  const { data: businessesResponse = { data: [] }, isLoading } =
    useBusinesses();
  const allBusinesses = businessesResponse.data ?? [];

  const { data: companiesResponse = { data: [] } } = useCompanies();
  const allCompanies = companiesResponse.data ?? [];

  const { user } = useAuthStore();
  const userCompanyId = user?.companyId ?? "";

  // Filter untuk hanya menampilkan bisnis milik perusahaan user
  const businesses = allBusinesses.filter((b) => b.companyId === userCompanyId);

  const userCompany = allCompanies.find((c) => c.id === userCompanyId);

  const createBusiness = useCreateBusiness();
  const updateBusiness = useUpdateBusiness();
  const deleteBusiness = useDeleteBusiness();

  const [showAdd, setShowAdd] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [deletingBusiness, setDeletingBusiness] = useState<Business | null>(
    null,
  );
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreateBusiness = (data: {
    name: string;
    address?: string;
    phone?: string;
  }) => {
    createBusiness.mutate(data as CreateBusinessRequest, {
      onSuccess: () => {
        setShowAdd(false);
        showToast("Unit usaha berhasil ditambahkan");
      },
    });
  };

  const handleUpdateBusiness = (data: {
    name: string;
    address?: string;
    phone?: string;
  }) => {
    if (!editingBusiness) return;
    updateBusiness.mutate(
      { id: editingBusiness.id, payload: data as UpdateBusinessRequest },
      {
        onSuccess: () => {
          setEditingBusiness(null);
          showToast("Unit usaha berhasil diperbarui");
        },
      },
    );
  };

  const handleDeleteBusiness = () => {
    if (!deletingBusiness) return;
    deleteBusiness.mutate(deletingBusiness.id, {
      onSuccess: () => {
        setDeletingBusiness(null);
        showToast("Unit usaha berhasil dihapus");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="p-3 sm:p-5 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center mx-auto mb-3 animate-pulse">
            <Briefcase size={20} className="text-violet-400" />
          </div>
          <p className="text-[11px] text-slate-400 font-mono">Memuat data...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Unit Usaha",
      value: businesses.length,
      icon: Briefcase,
      color: "text-violet-700",
      bg: "bg-violet-50",
      border: "border-violet-200",
      iconColor: "text-violet-500",
    },
    {
      label: "Perusahaan",
      value: userCompany?.name || "Tidak Diketahui",
      icon: Building2,
      color: "text-amber-700",
      bg: "bg-amber-50",
      border: "border-amber-200",
      iconColor: "text-amber-500",
      isText: true,
    },
  ];

  return (
    <div className="p-3 sm:p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[18px] font-semibold text-slate-800">
            Unit Usaha (Cabang)
          </h1>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
            Kelola semua unit usaha perusahaan Anda
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="px-4 py-2 bg-violet-600 text-white text-[12px] font-semibold rounded-xl hover:bg-violet-700 transition-colors flex items-center gap-2"
        >
          <Plus size={13} /> Tambah Unit
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
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        {stats.map((s: any) => {
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
              {s.isText ? (
                <p
                  className={cn(
                    "text-[13px] font-bold font-mono truncate",
                    s.color,
                  )}
                >
                  {s.value}
                </p>
              ) : (
                <p className={cn("text-[24px] font-bold font-mono", s.color)}>
                  {s.value}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Business List */}
      <Card padding={false}>
        {businesses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-5 text-center">
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-3">
              <Briefcase size={24} className="text-slate-400" />
            </div>
            <p className="text-[14px] font-semibold text-slate-600 mb-1">
              Belum ada unit usaha
            </p>
            <p className="text-[11px] text-slate-400 font-mono mb-4 max-w-xs">
              Tambahkan cabang atau unit usaha yang dimiliki perusahaan Anda
            </p>
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white text-[12px] font-semibold rounded-xl hover:bg-violet-700 transition-colors"
            >
              <Plus size={13} /> Tambah Unit Usaha
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {businesses.map((business) => (
              <div
                key={business.id}
                className="px-5 py-4 hover:bg-slate-50/60 transition-colors group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-violet-50 border border-violet-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Briefcase size={16} className="text-violet-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-bold text-slate-800 truncate">
                        {business.name}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap mt-1.5">
                        {business.address && (
                          <span className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono bg-slate-50 px-2 py-1 rounded-lg">
                            <MapPin
                              size={11}
                              className="text-slate-400 flex-shrink-0"
                            />
                            <span className="truncate max-w-[200px]">
                              {business.address}
                            </span>
                          </span>
                        )}
                        {business.phone && (
                          <span className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono bg-slate-50 px-2 py-1 rounded-lg">
                            <Phone
                              size={11}
                              className="text-slate-400 flex-shrink-0"
                            />
                            {business.phone}
                          </span>
                        )}
                        {!business.address && !business.phone && (
                          <span className="text-[10px] text-slate-300 italic font-mono bg-slate-50 px-2 py-1 rounded-lg">
                            Belum ada detail
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button
                      onClick={() => setEditingBusiness(business)}
                      className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-violet-100 hover:text-violet-600 text-slate-500 transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => setDeletingBusiness(business)}
                      className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-red-100 hover:text-red-600 text-slate-500 transition-colors"
                      title="Hapus"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Modals */}
      {showAdd && (
        <BusinessModal
          title="Tambah Unit Usaha"
          onClose={() => setShowAdd(false)}
          onSubmit={handleCreateBusiness}
          isPending={createBusiness.isPending}
        />
      )}

      {editingBusiness && (
        <BusinessModal
          title="Edit Unit Usaha"
          initial={{
            name: editingBusiness.name,
            address: editingBusiness.address ?? "",
            phone: editingBusiness.phone ?? "",
          }}
          onClose={() => setEditingBusiness(null)}
          onSubmit={handleUpdateBusiness}
          isPending={updateBusiness.isPending}
        />
      )}

      {deletingBusiness && (
        <DeleteConfirmModal
          business={deletingBusiness}
          onClose={() => setDeletingBusiness(null)}
          onConfirm={handleDeleteBusiness}
          isPending={deleteBusiness.isPending}
        />
      )}
    </div>
  );
}
