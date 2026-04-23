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

<<<<<<< HEAD
const MOCK_USERS: User[] = [
  { id: '1', name: 'Ahmad Fauzi', email: 'a.fauzi@webgis.id', role: 'super_admin', company: 'PT Makmur Abadi', status: 'active', lastLogin: '10 Apr 2026', createdAt: '01 Jan 2024' },
  { id: '2', name: 'Budi Raharjo', email: 'admin@majujaya.co.id', role: 'admin_company', company: 'PT Maju Jaya', status: 'active', lastLogin: '10 Apr 2026', createdAt: '15 Mar 2024' },
  { id: '3', name: 'Siti Aminah', email: 's.aminah@desdm.go.id', role: 'kepala_instansi', company: 'Dinas ESDM DKI', status: 'active', lastLogin: '09 Apr 2026', createdAt: '01 Feb 2024' },
  { id: '4', name: 'Rudi Santoso', email: 'rudi.s@majujaya.co.id', role: 'supervisor', company: 'PT Maju Jaya', status: 'active', lastLogin: '10 Apr 2026', createdAt: '20 Mar 2024' },
  { id: '5', name: 'Dewi Kartika', email: 'dewi.k@bumiraya.co.id', role: 'supervisor', company: 'PT Bumi Raya', status: 'pending', lastLogin: '—', createdAt: '08 Apr 2026' },
  { id: '6', name: 'Agus Wijaya', email: 'a.wijaya@desdm.go.id', role: 'kepala_instansi', company: 'Dinas ESDM DKI', status: 'active', lastLogin: '07 Apr 2026', createdAt: '01 Feb 2024' },
  { id: '7', name: 'Sari Wulandari', email: 'admin@tirta.co.id', role: 'admin_company', company: 'PT Tirta Mandiri', status: 'active', lastLogin: '08 Apr 2026', createdAt: '10 Mar 2024' },
  { id: '8', name: 'Dedi Haryanto', email: 'admin@karya.co.id', role: 'admin_company', company: 'PT Karya Makmur', status: 'active', lastLogin: '05 Apr 2026', createdAt: '20 Feb 2024' },
  { id: '9', name: 'Fitri Handayani', email: 'fitri@sumberair.co.id', role: 'supervisor', company: 'PT Sumber Air', status: 'inactive', lastLogin: '01 Mar 2026', createdAt: '15 Jan 2024' },
  { id: '10', name: 'Hendra Saputra', email: 'hendra@indo.co.id', role: 'supervisor', company: 'PT Indo Nusantara', status: 'pending', lastLogin: '—', createdAt: '09 Apr 2026' },
  { id: '11', name: 'Rina Kusuma', email: 'rina@bumiraya.co.id', role: 'admin_company', company: 'PT Bumi Raya', status: 'active', lastLogin: '06 Apr 2026', createdAt: '05 Mar 2024' },
  { id: '12', name: 'Tono Sudarsono', email: 'tono@webgis.id', role: 'super_admin', company: 'PT Nusantara Jaya', status: 'active', lastLogin: '08 Apr 2026', createdAt: '01 Jan 2024' },
]

const ROLE_CONFIG: Record<UserRole, { label: string; color: string; bg: string; Icon: React.ElementType }> = {
  super_admin: { label: 'Super Admin', color: 'text-accent-purple', bg: 'bg-fill-purple', Icon: Shield },
  admin_company: { label: 'Admin Perusahaan', color: 'text-accent-blue', bg: 'bg-fill-blue', Icon: Building2 },
  kepala_instansi: { label: 'Kepala Instansi', color: 'text-accent-cyan', bg: 'bg-fill-cyan', Icon: ShieldCheck },
  supervisor: { label: 'Supervisor', color: 'text-accent-amber', bg: 'bg-fill-amber', Icon: Cpu },
}

const ROLE_COUNTS = {
  all: MOCK_USERS.length,
  super_admin: MOCK_USERS.filter(u => u.role === 'super_admin').length,
  admin_company: MOCK_USERS.filter(u => u.role === 'admin_company').length,
  kepala_instansi: MOCK_USERS.filter(u => u.role === 'kepala_instansi').length,
  supervisor: MOCK_USERS.filter(u => u.role === 'supervisor').length,
}
=======
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
>>>>>>> d9b06a742bbffbd45837e6ae2f50db30a89a425e

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
<<<<<<< HEAD
          <button onClick={onClose} className="ml-auto text-text-muted hover:text-text-primary transition-colors"><X size={16} /></button>
        </div>
        <div className="p-6 space-y-4">
          {[
            { label: 'Nama Lengkap', key: 'name', type: 'text', ph: 'John Doe' },
            { label: 'Email', key: 'email', type: 'email', ph: 'john@company.co.id' },
          ].map(({ label, key, type, ph }) => (
            <div key={key}>
              <label className="block text-[10px] font-semibold text-text-secondary mb-1.5">{label}</label>
              <input type={type} placeholder={ph}
                value={form[key as 'name' | 'email']}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                className="w-full bg-bg-card3 border border-border-base rounded-lg px-3 h-9 text-[11px] text-text-primary outline-none focus:border-accent-cyan transition-colors placeholder:text-text-muted" />
            </div>
          ))}
          <div>
            <label className="block text-[10px] font-semibold text-text-secondary mb-1.5">Role</label>
            <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as UserRole }))}
              className="w-full bg-bg-card3 border border-border-base rounded-lg px-3 h-9 text-[11px] text-text-secondary outline-none focus:border-accent-cyan cursor-pointer transition-colors">
              {Object.entries(ROLE_CONFIG).filter(([k]) => k !== 'super_admin').map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </div>
          {form.role !== 'super_admin' && (
            <div>
              <label className="block text-[10px] font-semibold text-text-secondary mb-1.5">Perusahaan / Instansi</label>
              <input type="text" placeholder="PT Nama Perusahaan"
                value={form.company}
                onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                className="w-full bg-bg-card3 border border-border-base rounded-lg px-3 h-9 text-[11px] text-text-primary outline-none focus:border-accent-cyan transition-colors placeholder:text-text-muted" />
            </div>
          )}
        </div>
        <div className="flex gap-2 px-6 pb-6">
          <button onClick={onClose} className="flex-1 border border-border-base rounded-xl py-2.5 text-[11px] font-semibold text-text-secondary hover:bg-bg-card3 transition-colors">Batal</button>
          <button className="flex-1 bg-accent-blue text-white rounded-xl py-2.5 text-[11px] font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
            <Mail size={13} /> Kirim Undangan
=======
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
          >
            <X size={14} className="text-slate-500" />
>>>>>>> d9b06a742bbffbd45837e6ae2f50db30a89a425e
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
<<<<<<< HEAD
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all')
  const [showInvite, setShowInvite] = useState(false)
  const [menuOpen, setMenuOpen] = useState<string | null>(null)
=======
  const [page, setPage] = useState(1);
  const LIMIT = 5;
>>>>>>> d9b06a742bbffbd45837e6ae2f50db30a89a425e

  const { data: paginatedData, isLoading } = useUsers(page, LIMIT);
  const allUsers = paginatedData?.users ?? [];
  const totalPages = paginatedData?.totalPages ?? 1;
  const totalUsers = paginatedData?.total ?? 0;

  const { data: companies = [] } = useCompanies();
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
<<<<<<< HEAD
          {/* Filter bar */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border-base bg-bg-card3">
            <div className="flex items-center gap-2 bg-bg-card border border-border-base rounded-lg px-3 h-8 min-w-[220px]">
              <Search size={12} className="text-text-muted flex-shrink-0" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Cari nama, email, perusahaan..."
                className="bg-transparent outline-none text-[11px] text-text-primary placeholder:text-text-muted flex-1" />
              {search && <button onClick={() => setSearch('')}><X size={11} className="text-text-muted hover:text-text-primary" /></button>}
            </div>
            <div className="flex items-center gap-1 bg-bg-card border border-border-base rounded-lg p-1">
              <button onClick={() => setRoleFilter('all')}
                className={cn('px-2.5 py-1 rounded-md text-[10px] font-medium transition-all',
                  roleFilter === 'all' ? 'bg-bg-card3 text-text-primary shadow-sm border border-border-base' : 'text-text-muted hover:text-text-secondary')}>
                Semua
              </button>
              {Object.entries(ROLE_CONFIG).map(([k, v]) => (
                <button key={k} onClick={() => setRoleFilter(k as UserRole)}
                  className={cn('px-2.5 py-1 rounded-md text-[10px] font-medium transition-all',
                    roleFilter === k ? 'bg-bg-card3 text-text-primary shadow-sm border border-border-base' : 'text-text-muted hover:text-text-secondary')}>
                  {v.label.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <table className="data-table">
            <thead>
              <tr>
                <th>Pengguna</th>
                <th>Role</th>
                <th>Perusahaan</th>
                <th>Status</th>
                <th>Terakhir Login</th>
                <th>Bergabung</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => {
                const role = ROLE_CONFIG[user.role]
                const RoleIcon = role.Icon
                return (
                  <tr key={user.id} className="group">
                    <td>
                      <div className="flex items-center gap-2.5">
                        <div className={cn('w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0', role.bg.replace('bg-fill-', 'bg-accent-').replace('bg-accent-', 'bg-'))}>
                          <span className={role.color}>{user.name.split(' ').map(n => n[0]).slice(0, 2).join('')}</span>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold text-text-primary">{user.name}</p>
                          <p className="text-[9px] text-text-muted font-mono">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={cn('inline-flex items-center gap-1.5 text-[9px] font-mono font-semibold px-2 py-1 rounded-lg', role.bg, role.color)}>
                        <RoleIcon size={9} /> {role.label}
                      </span>
                    </td>
                    <td className="text-text-secondary text-[11px]">{user.company}</td>
                    <td>
                      {user.status === 'active' && <StatusPill variant="online" />}
                      {user.status === 'inactive' && <StatusPill variant="offline" />}
                      {user.status === 'pending' && <Badge label="PENDING" variant="warning" />}
                    </td>
                    <td className="td-mono text-text-muted">{user.lastLogin}</td>
                    <td className="td-mono text-text-muted">{user.createdAt}</td>
                    <td>
                      <div className="relative">
                        <button onClick={() => setMenuOpen(menuOpen === user.id ? null : user.id)}
                          className="p-1 rounded-lg hover:bg-bg-card3 transition-colors text-text-muted hover:text-text-secondary">
                          <MoreVertical size={14} />
                        </button>
                        {menuOpen === user.id && (
                          <div className="absolute right-0 top-8 z-10 bg-white border border-border-base rounded-xl shadow-card-hover min-w-[140px] overflow-hidden">
                            {['Lihat Detail', 'Edit Role', 'Reset Password', 'Nonaktifkan'].map((action) => (
                              <button key={action} onClick={() => setMenuOpen(null)}
                                className={cn('w-full text-left px-4 py-2.5 text-[11px] hover:bg-bg-card3 transition-colors',
                                  action === 'Nonaktifkan' ? 'text-accent-red' : 'text-text-secondary')}>
                                {action}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Panel>
=======
          <Plus size={13} />
          <span className="hidden sm:inline">Tambah Pengguna</span>
        </button>
>>>>>>> d9b06a742bbffbd45837e6ae2f50db30a89a425e
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
