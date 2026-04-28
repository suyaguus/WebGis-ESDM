import { useState, type FormEvent } from "react";
import { useRegisterAdmin } from "@/hooks/useAuth";

interface RegisterPageProps {
  onBackToMap?: () => void;
  onGoLogin?: () => void;
  onSuccess?: () => void;
}

const inputCls =
  "w-full bg-[var(--bg-input)] border border-[var(--bdr)] rounded-lg px-3 py-2.5 text-sm text-slate-800 " +
  "focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-colors";

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ) : (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );
}

export default function RegisterPage({ onBackToMap, onGoLogin }: RegisterPageProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyType, setCompanyType] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const { mutate: registerAdmin, isPending } = useRegisterAdmin();

  /* ── Input handlers with filtering ─────────────────────────── */
  function handleNameChange(val: string) {
    // Strip digits
    setName(val.replace(/[0-9]/g, ""));
  }

  function handlePhoneChange(val: string) {
    // Digits only, max 14
    setPhone(val.replace(/\D/g, "").slice(0, 14));
  }

  function handleCompanyPhoneChange(val: string) {
    setCompanyPhone(val.replace(/\D/g, "").slice(0, 14));
  }

  /* ── Submit validation ──────────────────────────────────────── */
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (/[0-9]/.test(name)) {
      setError("Nama lengkap tidak boleh mengandung angka.");
      return;
    }
    if (password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }
    if (phone && (phone.length < 9 || phone.length > 14)) {
      setError("Nomor HP harus antara 9–14 digit.");
      return;
    }
    if (!companyName.trim()) {
      setError("Nama perusahaan wajib diisi.");
      return;
    }
    if (companyEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(companyEmail)) {
      setError("Format email perusahaan tidak valid.");
      return;
    }

    registerAdmin(
      {
        name,
        email,
        password,
        phone: phone || undefined,
        companyName,
        companyAddress: companyAddress || undefined,
        companyEmail: companyEmail || undefined,
        companyPhone: companyPhone || undefined,
        companyType: companyType || undefined,
      },
      {
        onSuccess: () => {
          setSuccessMsg("Pendaftaran berhasil! Silakan login dengan akun Anda.");
        },
        onError: (err: any) => {
          const msg = err?.response?.data?.message;
          setError(msg ?? "Pendaftaran gagal. Periksa data Anda dan coba lagi.");
        },
      },
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex animate-fade-in">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 bg-amber-500 px-10 py-12 text-white">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M12 11c0-1.7 1.3-3 3-3h1V7a4 4 0 10-8 0v1h1c1.7 0 3 1.3 3 3zm0 0v3m-7 4h14a1 1 0 001-1v-5a3 3 0 00-3-3H7a3 3 0 00-3 3v5a1 1 0 001 1z" />
            </svg>
          </div>
          <span className="font-bold text-lg tracking-wide">SIGAT</span>
        </div>
        <div>
          <h1 className="text-white font-bold text-3xl leading-snug">
            Registrasi<br />Admin Perusahaan
          </h1>
          <p className="text-amber-100 text-sm mt-4 leading-relaxed">
            Buat akun Admin Perusahaan baru untuk akses dashboard operasional.
            Jika akun sudah ada, lanjutkan lewat halaman login.
          </p>
        </div>
        <p className="text-amber-100 text-xs">Dinas ESDM Provinsi Lampung © 2026</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="flex items-center justify-between mb-6">
            <button onClick={onBackToMap} type="button"
              className="text-xs font-semibold text-slate-600 hover:text-slate-800 transition">
              ← Kembali ke peta publik
            </button>
            <button onClick={onGoLogin} type="button"
              className="text-xs font-semibold text-amber-700 hover:text-amber-800 transition">
              Sudah punya akun? Login
            </button>
          </div>

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 11c0-1.7 1.3-3 3-3h1V7a4 4 0 10-8 0v1h1c1.7 0 3 1.3 3 3zm0 0v3m-7 4h14a1 1 0 001-1v-5a3 3 0 00-3-3H7a3 3 0 00-3 3v5a1 1 0 001 1z" />
              </svg>
            </div>
            <span className="font-bold text-slate-800 text-base">SIGAT</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-800">Buat akun baru</h2>
          <p className="text-sm text-slate-500 mt-1 mb-6">Registrasi hanya untuk Admin Perusahaan</p>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Nama Lengkap */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                  Nama Lengkap
                </label>
                <input
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                  placeholder="Nama penanggung jawab"
                  className={inputCls}
                />
                {name && /[0-9]/.test(name) && (
                  <p className="mt-1 text-[10px] text-red-500">Nama tidak boleh mengandung angka.</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@perusahaan.co.id"
                  className={inputCls}
                />
              </div>

              {/* Password + eye icon */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Minimal 8 karakter"
                    className={inputCls + " pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    tabIndex={-1}
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
                {password && password.length < 8 && (
                  <p className="mt-1 text-[10px] text-red-500">Password minimal 8 karakter.</p>
                )}
              </div>

              {/* Nomor HP */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                  Nomor HP <span className="normal-case font-normal text-slate-400">(opsional)</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  inputMode="numeric"
                  maxLength={14}
                  className={inputCls}
                />
                {phone && (
                  <p className={`mt-1 text-[10px] ${phone.length < 9 ? "text-red-500" : "text-slate-400"}`}>
                    {phone.length}/14 digit
                  </p>
                )}
              </div>

              {/* Data Perusahaan */}
              <div className="border-t border-slate-100 pt-4 space-y-4">
                <p className="text-[10px] font-bold tracking-wider uppercase text-amber-700">
                  Data Perusahaan
                </p>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                    Nama Perusahaan *
                  </label>
                  <input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                    placeholder="PT Sumber Air Lestari"
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                    Alamat Perusahaan <span className="normal-case font-normal text-slate-400">(opsional)</span>
                  </label>
                  <input
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    placeholder="Jl. Contoh No. 1, Kota"
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                    Email Perusahaan <span className="normal-case font-normal text-slate-400">(opsional)</span>
                  </label>
                  <input
                    type="text"
                    value={companyEmail}
                    onChange={(e) => setCompanyEmail(e.target.value)}
                    placeholder="info@perusahaan.com"
                    className={inputCls}
                  />
                  {companyEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(companyEmail) && (
                    <p className="mt-1 text-[10px] text-red-500">Format email tidak valid.</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                    Telepon Perusahaan <span className="normal-case font-normal text-slate-400">(opsional)</span>
                  </label>
                  <input
                    type="tel"
                    value={companyPhone}
                    onChange={(e) => handleCompanyPhoneChange(e.target.value)}
                    placeholder="021xxxxxxx"
                    inputMode="numeric"
                    maxLength={14}
                    className={inputCls}
                  />
                  {companyPhone && (
                    <p className="mt-1 text-[10px] text-slate-400">{companyPhone.length}/14 digit</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                    Jenis Usaha <span className="normal-case font-normal text-slate-400">(opsional)</span>
                  </label>
                  <input
                    value={companyType}
                    onChange={(e) => setCompanyType(e.target.value)}
                    placeholder="Industri, Perhotelan, Komersial, dll."
                    className={inputCls}
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
                  <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                  <p className="text-xs text-red-600">{error}</p>
                </div>
              )}

              {successMsg && (
                <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700">
                  {successMsg}{" "}
                  <button type="button" onClick={onGoLogin} className="font-semibold underline">
                    Klik di sini untuk login
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-lg bg-amber-500 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isPending ? "Memproses..." : "Daftar Admin Perusahaan"}
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6 lg:hidden">
            Dinas ESDM Provinsi Lampung © 2026
          </p>
        </div>
      </div>
    </div>
  );
}
