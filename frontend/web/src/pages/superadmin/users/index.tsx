import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  MoreHorizontal,
  CheckCircle,
  Clock,
  XCircle,
  ArrowUpDown,
  X,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card } from "../../../components/ui";
import {
  useUsers,
  useActivateUser,
  useDeactivateUser,
  useCreateUser,
  useUpdateUser,
  useCreateAdminPerusahaan,
} from "../../../hooks";
import { useCompanies } from "../../../hooks";
import { cn } from "../../../lib/utils";
import type { User } from "../../../services/user.service";
import type {
  CreateAdminPerusahaanRequest,
  CreateUserRequest,
  UpdateUserRequest,
  BackendRole,
} from "../../../types/api";

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  admin_perusahaan: "Admin Perusahaan",
  kepala_instansi: "Kepala Instansi",
  supervisor: "Surveyor",
};

const ROLE_COLORS: Record<string, string> = {
  super_admin: "bg-purple-50 text-purple-700 border-purple-200",
  admin_perusahaan: "bg-amber-50 text-amber-700 border-amber-200",
  kepala_instansi: "bg-teal-50 text-teal-700 border-teal-200",
  supervisor: "bg-blue-50 text-blue-700 border-blue-200",
};

const STATUS_ICON = {
  active: <CheckCircle size={12} className="text-emerald-500" />,
  inactive: <XCircle size={12} className="text-slate-400" />,
  pending: <Clock size={12} className="text-amber-500" />,
};

interface UserFormProps {
  mode: "create" | "edit";
  initial?: User;
  companies: { id: string; name: string }[];
  onClose: () => void;
  onSubmit: (
    data: CreateUserRequest | UpdateUserRequest | CreateAdminPerusahaanRequest,
  ) => void;
  isPending: boolean;
}

function UserFormModal({
  mode,
  initial,
  companies,
  onClose,
  onSubmit,
  isPending,
}: UserFormProps) {
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    email: initial?.email ?? "",
    phone: initial?.phone ?? "",
    role: (initial?.role ?? "admin_perusahaan") as BackendRole,
    companyId: initial?.companyId ?? "",
    password: "",
    // Data perusahaan baru
    companyName: "",
    companyAddress: "",
    companyEmail: "",
    companyPhone: "",
    companyType: "",
  });
  const [showPwd, setShowPwd] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: string, v: string) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => {
      const n = { ...p };
      delete n[k];
      return n;
    });
  };

  const isAdminPerusahaan = form.role === "admin_perusahaan";

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Nama wajib diisi";
    if (!form.email.trim()) e.email = "Email wajib diisi";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      e.email = "Format email tidak valid";
    if (mode === "create" && !form.password)
      e.password = "Password wajib diisi";
    if (mode === "create" && form.password.length < 8)
      e.password = "Password minimal 8 karakter";
    if (mode === "create" && isAdminPerusahaan && !form.companyName.trim())
      e.companyName = "Nama perusahaan wajib diisi";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    if (mode === "create" && isAdminPerusahaan) {
      const payload: CreateAdminPerusahaanRequest = {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone || undefined,
        companyName: form.companyName,
        companyAddress: form.companyAddress || undefined,
        companyEmail: form.companyEmail || undefined,
        companyPhone: form.companyPhone || undefined,
        companyType: form.companyType || undefined,
      };
      onSubmit(payload);
    } else if (mode === "create") {
      const payload: CreateUserRequest = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        phone: form.phone || undefined,
        companyId: form.companyId || undefined,
      };
      onSubmit(payload);
    } else {
      const payload: UpdateUserRequest = {
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        role: form.role,
        companyId: isAdminPerusahaan ? undefined : form.companyId || undefined,
      };
      onSubmit(payload);
    }
  };

  const F = ({
    label,
    error,
    children,
  }: {
    label: string;
    error?: string;
    children: React.ReactNode;
  }) => (
    <div>
      <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">
        {label}
      </label>
      {children}
      {error && <p className="text-[10px] text-red-500 mt-1">{error}</p>}
    </div>
  );

  const inputCls = (err?: string) =>
    cn(
      "w-full px-3 py-2 text-[12px] font-mono border rounded-lg bg-slate-50 text-slate-800 focus:outline-none focus:ring-1",
      err
        ? "border-red-300 focus:ring-red-300"
        : "border-slate-200 focus:ring-cyan-400 focus:border-cyan-400",
    );

  const needsCompany = ["admin_perusahaan", "supervisor"].includes(form.role);

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
              {mode === "create" ? "Tambah Pengguna" : "Edit Pengguna"}
            </p>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
              {mode === "create"
                ? "Buat akun pengguna baru"
                : `Edit data ${initial?.name}`}
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
          <F label="Nama Lengkap" error={errors.name}>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Ahmad Fauzi"
              className={inputCls(errors.name)}
            />
          </F>

          <F label="Email" error={errors.email}>
            <input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="user@sigat.go.id"
              className={inputCls(errors.email)}
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

          {mode === "create" && (
            <F label="Password" error={errors.password}>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  placeholder="Min. 8 karakter"
                  className={cn(inputCls(errors.password), "pr-9")}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((p) => !p)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </F>
          )}

          <F label="Role">
            <select
              value={form.role}
              onChange={(e) => set("role", e.target.value)}
              className={inputCls()}
            >
              <option value="super_admin">Super Admin</option>
              <option value="admin_perusahaan">Admin Perusahaan</option>
              <option value="kepala_instansi">Kepala Instansi</option>
              <option value="supervisor">Surveyor</option>
            </select>
          </F>

          {/* Saat create admin_perusahaan → input data perusahaan baru */}
          {mode === "create" && isAdminPerusahaan && (
            <div className="border border-amber-200 bg-amber-50 rounded-xl px-4 py-3 space-y-3">
              <p className="text-[10px] font-mono font-semibold text-amber-700 uppercase tracking-wider">
                Data Perusahaan
              </p>
              <F label="Nama Perusahaan *" error={errors.companyName}>
                <input
                  value={form.companyName}
                  onChange={(e) => set("companyName", e.target.value)}
                  placeholder="PT Sumber Air Lestari"
                  className={inputCls(errors.companyName)}
                />
              </F>
              <F label="Alamat Perusahaan (opsional)">
                <input
                  value={form.companyAddress}
                  onChange={(e) => set("companyAddress", e.target.value)}
                  placeholder="Jl. Contoh No. 1, Kota"
                  className={inputCls()}
                />
              </F>
              <div className="grid grid-cols-2 gap-2">
                <F label="Email Perusahaan (opsional)">
                  <input
                    type="email"
                    value={form.companyEmail}
                    onChange={(e) => set("companyEmail", e.target.value)}
                    placeholder="info@perusahaan.com"
                    className={inputCls()}
                  />
                </F>
                <F label="Telepon Perusahaan (opsional)">
                  <input
                    value={form.companyPhone}
                    onChange={(e) => set("companyPhone", e.target.value)}
                    placeholder="021xxxxxxx"
                    className={inputCls()}
                  />
                </F>
              </div>
              <F label="Jenis Usaha (opsional)">
                <input
                  value={form.companyType}
                  onChange={(e) => set("companyType", e.target.value)}
                  placeholder="Industri, Perhotelan, dll."
                  className={inputCls()}
                />
              </F>
            </div>
          )}

          {/* Saat role lain (supervisor, kepala_instansi) → dropdown pilih perusahaan */}
          {!isAdminPerusahaan &&
            ["supervisor", "kepala_instansi"].includes(form.role) && (
              <F label="Perusahaan">
                <select
                  value={form.companyId}
                  onChange={(e) => set("companyId", e.target.value)}
                  className={inputCls()}
                >
                  <option value="">— Pilih Perusahaan —</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </F>
            )}

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
              {isPending
                ? "Menyimpan..."
                : mode === "create"
                  ? "Buat Pengguna"
                  : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const LIMIT = 5;

  const { data: paginatedData, isLoading } = useUsers(page, LIMIT);
  const allUsers = paginatedData?.users ?? [];
  const totalPages = paginatedData?.totalPages ?? 1;
  const totalUsers = paginatedData?.total ?? 0;

  const { data: companiesResponse = { data: [] } } = useCompanies();
  const companies = companiesResponse.data ?? [];
  const activate = useActivateUser();
  const deactivate = useDeactivateUser();
  const createUser = useCreateUser();
  const createAdminPerusahaan = useCreateAdminPerusahaan();
  const updateUser = useUpdateUser();

  const [search, setSearch] = useState("");
  const [roleF, setRoleF] = useState<string>("all");
  const [statusF, setStatusF] = useState<User["status"] | "all">("all");
  const [sortKey, setSortKey] = useState<keyof User>("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [formMode, setFormMode] = useState<"create" | "edit" | null>(null);
  const [editTarget, setEditTarget] = useState<User | null>(null);

  const data = useMemo(() => {
    let d = [...allUsers];
    if (roleF !== "all") d = d.filter((u) => u.role === roleF);
    if (statusF !== "all") d = d.filter((u) => u.status === statusF);
    if (search)
      d = d.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase()) ||
          u.company.toLowerCase().includes(search.toLowerCase()),
      );
    d.sort((a, b) => {
      const av = String(a[sortKey]),
        bv = String(b[sortKey]);
      return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
    });
    return d;
  }, [allUsers, search, roleF, statusF, sortKey, sortAsc]);

  const sort = (k: keyof User) => {
    setSortKey(k);
    if (sortKey === k) setSortAsc((p) => !p);
    else setSortAsc(true);
  };
  const Th = ({ label, k }: { label: string; k: keyof User }) => (
    <th
      onClick={() => sort(k)}
      className="text-[9px] font-mono text-slate-400 uppercase tracking-wider px-4 py-3 text-left cursor-pointer hover:text-slate-600 whitespace-nowrap select-none"
    >
      <span className="flex items-center gap-1">
        {label}
        <ArrowUpDown
          size={9}
          className={sortKey === k ? "text-cyan-500" : "text-slate-300"}
        />
      </span>
    </th>
  );

  const summary = {
    total: totalUsers,
    active: allUsers.filter((u) => u.status === "active").length,
    pending: allUsers.filter((u) => u.status === "pending").length,
    inactive: allUsers.filter((u) => u.status === "inactive").length,
  };

  const companyOptions = companies.map((c) => ({ id: c.id, name: c.name }));

  const handleFormSubmit = (
    payload:
      | CreateUserRequest
      | UpdateUserRequest
      | CreateAdminPerusahaanRequest,
  ) => {
    if (formMode === "create") {
      // Cek apakah ini admin_perusahaan (payload punya companyName)
      if ("companyName" in payload) {
        createAdminPerusahaan.mutate(payload as CreateAdminPerusahaanRequest, {
          onSuccess: () => setFormMode(null),
        });
      } else {
        createUser.mutate(payload as CreateUserRequest, {
          onSuccess: () => setFormMode(null),
        });
      }
    } else if (formMode === "edit" && editTarget) {
      updateUser.mutate(
        { id: editTarget.id, payload: payload as UpdateUserRequest },
        {
          onSuccess: () => {
            setFormMode(null);
            setEditTarget(null);
          },
        },
      );
    }
  };

  const openEdit = (u: User) => {
    setEditTarget(u);
    setFormMode("edit");
    setMenuId(null);
  };

  return (
    <div className="p-3 sm:p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[18px] font-semibold text-slate-800">Pengguna</h1>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
            Kelola akses pengguna dan role
          </p>
        </div>
        <button
          onClick={() => setFormMode("create")}
          className="px-3 sm:px-4 py-2 bg-cyan-600 text-white text-[12px] font-semibold rounded-xl hover:bg-cyan-700 transition-colors flex items-center gap-2 whitespace-nowrap flex-shrink-0"
        >
          <Plus size={13} />
          <span className="hidden sm:inline">Tambah Pengguna</span>
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Total Pengguna",
            value: summary.total,
            color: "#0891B2",
            bg: "bg-cyan-50",
            border: "border-cyan-200",
          },
          {
            label: "Aktif",
            value: summary.active,
            color: "#22C55E",
            bg: "bg-emerald-50",
            border: "border-emerald-200",
          },
          {
            label: "Menunggu Verifikasi",
            value: summary.pending,
            color: "#F59E0B",
            bg: "bg-amber-50",
            border: "border-amber-200",
          },
          {
            label: "Nonaktif",
            value: summary.inactive,
            color: "#94A3B8",
            bg: "bg-slate-50",
            border: "border-slate-200",
          },
        ].map(({ label, value, color, bg, border }) => (
          <div
            key={label}
            className={cn("rounded-xl border px-4 py-3", bg, border)}
          >
            <p className="text-[9px] font-mono text-slate-400 uppercase mb-1">
              {label}
            </p>
            <p className="text-[22px] font-bold font-mono" style={{ color }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Pending verifikasi banner */}
      {summary.pending > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-3">
          <Clock size={16} className="text-amber-600 flex-shrink-0" />
          <div>
            <p className="text-[12px] font-semibold text-amber-800">
              {summary.pending} pengguna menunggu verifikasi
            </p>
            <p className="text-[11px] text-amber-600">
              Gunakan menu ··· di baris pengguna untuk mengaktifkan akun
            </p>
          </div>
        </div>
      )}

      {/* Table */}
      <Card padding={false}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 px-4 py-3 border-b border-slate-100">
          <div className="relative flex-1 sm:flex-none">
            <Search
              size={12}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Nama / email / perusahaan..."
              className="w-full sm:w-48 pl-8 pr-3 py-1.5 text-[11px] font-mono border border-slate-200 rounded-lg bg-slate-50 text-slate-700 focus:outline-none focus:border-cyan-400"
            />
          </div>
          <div className="flex flex-wrap gap-1">
            {(["all", "active", "pending", "inactive"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusF(s)}
                className={cn(
                  "text-[9px] font-mono px-2.5 py-1 rounded-full border transition-all whitespace-nowrap",
                  statusF === s
                    ? "bg-cyan-50 text-cyan-700 border-cyan-200"
                    : "text-slate-400 border-transparent hover:bg-slate-50",
                )}
              >
                {s === "all"
                  ? "Semua"
                  : s === "active"
                    ? "Active"
                    : s === "pending"
                      ? "Pending"
                      : "Inactive"}
              </button>
            ))}
          </div>
          <select
            value={roleF}
            onChange={(e) => setRoleF(e.target.value)}
            className="text-[10px] font-mono border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 text-slate-600 focus:outline-none focus:border-cyan-400"
          >
            <option value="all">Semua Role</option>
            <option value="super_admin">Super Admin</option>
            <option value="admin_perusahaan">Admin Perusahaan</option>
            <option value="kepala_instansi">Kepala Instansi</option>
            <option value="supervisor">Surveyor</option>
          </select>
          <span className="sm:ml-auto text-[10px] text-slate-400 font-mono">
            {data.length} pengguna
          </span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-[11px] text-slate-400 font-mono">
            Memuat data pengguna...
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full" style={{ minWidth: "680px" }}>
                <thead className="bg-slate-50/60 border-b border-slate-100">
                  <tr>
                    <Th label="Nama" k="name" />
                    <Th label="Email" k="email" />
                    <Th label="Role" k="role" />
                    <Th label="Perusahaan" k="company" />
                    <Th label="Status" k="status" />
                    <Th label="Dibuat" k="createdAt" />
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {data.map((u) => (
                    <tr
                      key={u.id}
                      className="hover:bg-slate-50/40 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                            {u.avatar}
                          </div>
                          <span className="text-[12px] font-semibold text-slate-800">
                            {u.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[11px] text-slate-500 font-mono">
                        {u.email}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "text-[9px] font-mono font-medium px-2 py-0.5 rounded-full border",
                            ROLE_COLORS[u.role] ??
                              "bg-slate-50 text-slate-600 border-slate-200",
                          )}
                        >
                          {ROLE_LABELS[u.role] ?? u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[11px] text-slate-600">
                        {u.company}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {STATUS_ICON[u.status]}
                          <span
                            className={cn(
                              "text-[10px] font-mono",
                              u.status === "active"
                                ? "text-emerald-600"
                                : u.status === "pending"
                                  ? "text-amber-600"
                                  : "text-slate-400",
                            )}
                          >
                            {u.status === "active"
                              ? "Aktif"
                              : u.status === "pending"
                                ? "Menunggu"
                                : "Nonaktif"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[10px] text-slate-400 font-mono">
                        {u.createdAt}
                      </td>
                      <td className="px-4 py-3 relative">
                        <button
                          onClick={() =>
                            setMenuId(menuId === u.id ? null : u.id)
                          }
                          className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
                        >
                          <MoreHorizontal
                            size={14}
                            className="text-slate-400"
                          />
                        </button>
                        {menuId === u.id && (
                          <div className="absolute right-4 top-10 bg-white border border-slate-100 rounded-xl shadow-lg z-10 overflow-hidden min-w-[150px]">
                            <button
                              onClick={() => openEdit(u)}
                              className="w-full text-left px-3 py-2 text-[11px] hover:bg-slate-50 transition-colors text-slate-700"
                            >
                              Edit Pengguna
                            </button>
                            {u.status === "active" ? (
                              <button
                                onClick={() => {
                                  deactivate.mutate(u.id);
                                  setMenuId(null);
                                }}
                                className="w-full text-left px-3 py-2 text-[11px] hover:bg-red-50 transition-colors text-red-600"
                              >
                                Nonaktifkan
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  activate.mutate(u.id);
                                  setMenuId(null);
                                }}
                                className="w-full text-left px-3 py-2 text-[11px] hover:bg-emerald-50 transition-colors text-emerald-600"
                              >
                                Aktifkan
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {data.length === 0 && !isLoading && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-12 text-center text-[11px] text-slate-400 font-mono"
                      >
                        Tidak ada pengguna ditemukan
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
                <p className="text-[10px] text-slate-400 font-mono">
                  Halaman {page} dari {totalPages} · {totalUsers} pengguna total
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center transition-colors text-[11px]",
                      page <= 1
                        ? "text-slate-300 cursor-not-allowed"
                        : "text-slate-600 hover:bg-slate-100",
                    )}
                  >
                    <ChevronLeft size={14} />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center transition-colors text-[11px] font-mono font-semibold",
                          p === page
                            ? "bg-cyan-600 text-white shadow-sm"
                            : "text-slate-500 hover:bg-slate-100",
                        )}
                      >
                        {p}
                      </button>
                    ),
                  )}

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center transition-colors text-[11px]",
                      page >= totalPages
                        ? "text-slate-300 cursor-not-allowed"
                        : "text-slate-600 hover:bg-slate-100",
                    )}
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Create / Edit Modal */}
      {formMode && (
        <UserFormModal
          mode={formMode}
          initial={editTarget ?? undefined}
          companies={companyOptions}
          onClose={() => {
            setFormMode(null);
            setEditTarget(null);
          }}
          onSubmit={handleFormSubmit}
          isPending={
            createUser.isPending ||
            createAdminPerusahaan.isPending ||
            updateUser.isPending
          }
        />
      )}
    </div>
  );
}
