import { useState, useMemo } from "react";
import { Building2, Plus, Search, MoreHorizontal, X, Eye, EyeOff, Trash2 } from "lucide-react";
import { StatusPill } from "../../../components/ui";
import {
  useCompanies,
  useCreateCompany,
  useUpdateCompany,
  useDeleteCompany,
  useSensors,
} from "../../../hooks";
import { cn, getSubsidenceColor, getQuotaPercent } from "../../../lib/utils";
import type { Company } from "../../../services/company.service";
import type { CreateCompanyRequest } from "../../../types/api";

/* ── Form Modal ── */
interface CompanyFormProps {
  mode: "create" | "edit";
  initial?: Company & { address?: string; email?: string; phone?: string; type?: string };
  onClose: () => void;
  onSubmit: (data: CreateCompanyRequest) => void;
  isPending: boolean;
}

function CompanyFormModal({ mode, initial, onClose, onSubmit, isPending }: CompanyFormProps) {
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    address: initial?.region !== "-" ? (initial?.region ?? "") : "",
    email: initial?.email ?? "",
    phone: initial?.phone ?? "",
    type: initial?.type ?? "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: string, v: string) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => { const n = { ...p }; delete n[k]; return n; });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Nama perusahaan wajib diisi";
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = "Format email tidak valid";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const payload: CreateCompanyRequest = {
      name: form.name,
      address: form.address || undefined,
      email: form.email || undefined,
      phone: form.phone || undefined,
      type: form.type || undefined,
    };
    onSubmit(payload);
  };

  const F = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
    <div>
      <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">{label}</label>
      {children}
      {error && <p className="text-[10px] text-red-500 mt-1">{error}</p>}
    </div>
  );

  const inputCls = (err?: string) =>
    cn(
      "w-full px-3 py-2 text-[12px] font-mono border rounded-lg bg-slate-50 text-slate-800 focus:outline-none focus:ring-1",
      err ? "border-red-300 focus:ring-red-300" : "border-slate-200 focus:ring-cyan-400 focus:border-cyan-400",
    );

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <p className="text-[15px] font-bold text-slate-800">
              {mode === "create" ? "Tambah Perusahaan" : "Edit Perusahaan"}
            </p>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
              {mode === "create" ? "Daftarkan perusahaan baru" : `Edit data ${initial?.name}`}
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
          <F label="Nama Perusahaan" error={errors.name}>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="PT Maju Jaya Tbk"
              className={inputCls(errors.name)}
            />
          </F>

          <F label="Alamat (opsional)">
            <input
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              placeholder="Jl. Raya No. 123, Bandar Lampung"
              className={inputCls()}
            />
          </F>

          <F label="Email (opsional)" error={errors.email}>
            <input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="info@perusahaan.co.id"
              className={inputCls(errors.email)}
            />
          </F>

          <F label="Nomor Telepon (opsional)">
            <input
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="0721-xxxxxxx"
              className={inputCls()}
            />
          </F>

          <F label="Jenis Perusahaan (opsional)">
            <input
              value={form.type}
              onChange={(e) => set("type", e.target.value)}
              placeholder="Pertambangan / Industri / Lainnya"
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
              className="flex-1 px-4 py-2 bg-cyan-600 text-white text-[12px] font-semibold rounded-xl hover:bg-cyan-700 transition-colors disabled:opacity-50"
            >
              {isPending ? "Menyimpan..." : mode === "create" ? "Tambah" : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Delete Confirmation Modal ── */
function DeleteConfirmModal({
  companyName,
  onClose,
  onConfirm,
  isPending,
}: {
  companyName: string;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}) {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-3">
            <Trash2 size={20} className="text-red-500" />
          </div>
          <p className="text-[15px] font-bold text-slate-800 mb-1">Hapus Perusahaan?</p>
          <p className="text-[12px] text-slate-500">
            Perusahaan <span className="font-semibold text-slate-700">{companyName}</span> akan dihapus permanen.
            Data ini tidak bisa dikembalikan.
          </p>
        </div>
        <div className="flex gap-2 px-6 pb-5">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-slate-100 text-slate-600 text-[12px] font-semibold rounded-xl hover:bg-slate-200 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 px-4 py-2 bg-red-600 text-white text-[12px] font-semibold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isPending ? "Menghapus..." : "Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function CompaniesPage() {
  const { data: companies = [], isLoading } = useCompanies();
  const { data: sensors = [] } = useSensors();
  const createCompany = useCreateCompany();
  const updateCompany = useUpdateCompany();
  const deleteCompany = useDeleteCompany();

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Company | null>(null);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [formMode, setFormMode] = useState<"create" | "edit" | null>(null);
  const [editTarget, setEditTarget] = useState<Company | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Company | null>(null);

  const data = useMemo(() => {
    if (!search) return companies;
    return companies.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        (c.region ?? "").toLowerCase().includes(search.toLowerCase()),
    );
  }, [companies, search]);

  const companySensors = (id: string) => sensors.filter((s) => s.companyId === id);
  const alertSensors = (id: string) =>
    companySensors(id).filter((s) => s.status === "alert").length;

  const handleFormSubmit = (payload: CreateCompanyRequest) => {
    if (formMode === "create") {
      createCompany.mutate(payload, {
        onSuccess: () => setFormMode(null),
      });
    } else if (formMode === "edit" && editTarget) {
      updateCompany.mutate(
        { id: editTarget.id, payload },
        { onSuccess: () => { setFormMode(null); setEditTarget(null); } },
      );
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteCompany.mutate(deleteTarget.id, {
      onSuccess: () => {
        setDeleteTarget(null);
        setSelected(null);
      },
    });
  };

  const openEdit = (c: Company) => {
    setEditTarget(c);
    setFormMode("edit");
    setMenuId(null);
  };

  const openDelete = (c: Company) => {
    setDeleteTarget(c);
    setMenuId(null);
  };

  return (
    <div className="p-3 sm:p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[18px] font-semibold text-slate-800">Perusahaan</h1>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
            Kelola data perusahaan pengguna air tanah
          </p>
        </div>
        <button
          onClick={() => setFormMode("create")}
          className="px-3 sm:px-4 py-2 bg-cyan-600 text-white text-[12px] font-semibold rounded-xl hover:bg-cyan-700 transition-colors flex items-center gap-2 whitespace-nowrap flex-shrink-0"
        >
          <Plus size={13} />
          <span className="hidden sm:inline">Tambah Perusahaan</span>
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Perusahaan", value: companies.length, color: "#0891B2" },
          { label: "Online", value: companies.filter((c) => c.status === "online").length, color: "#22C55E" },
          { label: "Kuota Melebihi", value: companies.filter((c) => c.quotaUsed > c.quota).length, color: "#EF4444" },
          { label: "Total Sensor", value: companies.reduce((a, c) => a + c.sensorCount, 0), color: "#8B5CF6" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-100 shadow-sm px-4 py-3 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl" style={{ background: color }} />
            <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-1">{label}</p>
            <p className="text-[22px] font-bold font-mono" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Company cards */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
          <div className="relative flex-1 sm:flex-none">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari perusahaan / wilayah..."
              className="pl-8 pr-3 py-1.5 text-[11px] font-mono border border-slate-200 rounded-lg bg-white text-slate-700 w-full sm:w-52 focus:outline-none focus:border-cyan-400"
            />
          </div>
          <span className="text-[10px] text-slate-400 font-mono">{data.length} perusahaan</span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-[11px] text-slate-400 font-mono">
            Memuat data perusahaan...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((c) => {
              const pct = getQuotaPercent(c.quotaUsed, c.quota);
              const pctColor = pct >= 100 ? "#EF4444" : pct >= 85 ? "#F59E0B" : "#22C55E";
              const alerts = alertSensors(c.id);
              return (
                <div
                  key={c.id}
                  className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 cursor-pointer hover:border-cyan-200 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center flex-shrink-0">
                      <Building2 size={18} className="text-cyan-600" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      {alerts > 0 && (
                        <span className="text-[9px] font-mono bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-full">
                          {alerts} alert
                        </span>
                      )}
                      <StatusPill status={c.status} />
                    </div>
                  </div>
                  <h3 className="text-[13px] font-bold text-slate-800 leading-tight mb-0.5">{c.name}</h3>
                  <p className="text-[10px] text-slate-400 font-mono mb-3">{c.region}</p>

                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {[
                      { label: "Sensor", value: String(c.sensorCount), valueClass: "" },
                      { label: "Subsidence", value: `${c.avgSubsidence.toFixed(1)}`, unit: "cm/thn", valueClass: getSubsidenceColor(c.avgSubsidence) },
                      { label: "Kuota", value: `${pct}%`, valueClass: pct >= 100 ? "text-red-600" : pct >= 85 ? "text-amber-600" : "text-emerald-600" },
                    ].map(({ label, value, unit, valueClass }) => (
                      <div key={label} className="bg-slate-50 rounded-lg px-2 py-2 text-center">
                        <p className={cn("text-[13px] font-bold font-mono", valueClass || "text-slate-800")}>
                          {value}
                          <span className="text-[8px] text-slate-400 font-mono ml-0.5">{unit}</span>
                        </p>
                        <p className="text-[8px] text-slate-400 font-mono">{label}</p>
                      </div>
                    ))}
                  </div>

                  <div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${Math.min(pct, 100)}%`, background: pctColor }}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-[8px] font-mono text-slate-400">
                        {(c.quotaUsed / 1000).toFixed(0)}k m³
                      </span>
                      <span className="text-[8px] font-mono text-slate-400">
                        {(c.quota / 1000).toFixed(0)}k m³
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => setSelected(c)}
                      className="flex-1 px-3 py-1.5 bg-slate-100 text-slate-600 text-[11px] font-semibold rounded-lg hover:bg-slate-200 transition-colors"
                    >
                      Detail
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setMenuId(menuId === c.id ? null : c.id)}
                        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                      >
                        <MoreHorizontal size={14} className="text-slate-400" />
                      </button>
                      {menuId === c.id && (
                        <div className="absolute right-0 top-8 bg-white border border-slate-100 rounded-xl shadow-lg z-10 overflow-hidden min-w-[140px]">
                          <button
                            onClick={() => openEdit(c)}
                            className="w-full text-left px-3 py-2 text-[11px] hover:bg-slate-50 transition-colors text-slate-700"
                          >
                            Edit Perusahaan
                          </button>
                          <button
                            onClick={() => openDelete(c)}
                            className="w-full text-left px-3 py-2 text-[11px] hover:bg-red-50 transition-colors text-red-600"
                          >
                            Hapus
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {data.length === 0 && !isLoading && (
              <div className="col-span-full py-12 text-center text-[11px] text-slate-400 font-mono">
                Tidak ada perusahaan ditemukan
              </div>
            )}
          </div>
        )}
      </div>

      {/* Detail slide-in */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/20 z-50 flex justify-end"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full sm:w-96 bg-white h-full overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[14px] font-bold text-slate-800">{selected.name}</p>
                <p className="text-[10px] text-slate-400 font-mono">{selected.region}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200"
              >
                <X size={14} className="text-slate-500" />
              </button>
            </div>
            <div className="p-3 sm:p-5 space-y-4">
              <StatusPill status={selected.status} />
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Total Sensor", selected.sensorCount],
                  ["Avg Subsidence", `${selected.avgSubsidence.toFixed(2)} cm/thn`],
                  ["Kuota Total", `${(selected.quota / 1000).toFixed(0)}k m³`],
                  ["Kuota Terpakai", `${getQuotaPercent(selected.quotaUsed, selected.quota)}%`],
                ].map(([k, v]) => (
                  <div key={String(k)} className="bg-slate-50 rounded-xl p-3">
                    <p className="text-[9px] font-mono text-slate-400 mb-1">{k}</p>
                    <p className="text-[13px] font-bold text-slate-800">{v}</p>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-700 mb-2">Sensor Perusahaan</p>
                <div className="space-y-2">
                  {companySensors(selected.id).map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg"
                    >
                      <span className="text-[11px] font-mono font-semibold text-slate-700">{s.code}</span>
                      <span className="text-[10px] text-slate-400">{s.location}</span>
                      <StatusPill status={s.status} />
                    </div>
                  ))}
                  {companySensors(selected.id).length === 0 && (
                    <p className="text-[10px] text-slate-400 font-mono">Belum ada sensor terdaftar</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { openEdit(selected); setSelected(null); }}
                  className="flex-1 px-4 py-2 bg-cyan-600 text-white text-[12px] font-semibold rounded-xl hover:bg-cyan-700 transition-colors"
                >
                  Edit Perusahaan
                </button>
                <button
                  onClick={() => { openDelete(selected); setSelected(null); }}
                  className="px-4 py-2 bg-red-50 text-red-600 text-[12px] font-semibold rounded-xl hover:bg-red-100 transition-colors border border-red-200"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {formMode && (
        <CompanyFormModal
          mode={formMode}
          initial={editTarget ?? undefined}
          onClose={() => { setFormMode(null); setEditTarget(null); }}
          onSubmit={handleFormSubmit}
          isPending={createCompany.isPending || updateCompany.isPending}
        />
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <DeleteConfirmModal
          companyName={deleteTarget.name}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          isPending={deleteCompany.isPending}
        />
      )}
    </div>
  );
}