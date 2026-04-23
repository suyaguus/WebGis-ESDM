import { useState, type FormEvent } from "react";
import { useRegisterAdmin } from "@/hooks/useAuth";

interface RegisterPageProps {
  onBackToMap?: () => void;
  onGoLogin?: () => void;
  onSuccess?: () => void;
}

export default function RegisterPage({
  onBackToMap,
  onGoLogin,
  onSuccess,
}: RegisterPageProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyType, setCompanyType] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const { mutate: registerAdmin, isPending } = useRegisterAdmin();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }

    if (!companyName.trim()) {
      setError("Nama perusahaan wajib diisi.");
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
          setSuccessMsg(
            "Pendaftaran berhasil! Silakan login dengan akun Anda.",
          );
        },
        onError: (err: any) => {
          const msg = err?.response?.data?.message;
          setError(
            msg ?? "Pendaftaran gagal. Periksa data Anda dan coba lagi.",
          );
        },
      },
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex animate-fade-in">
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 bg-amber-500 px-10 py-12 text-white">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M12 11c0-1.7 1.3-3 3-3h1V7a4 4 0 10-8 0v1h1c1.7 0 3 1.3 3 3zm0 0v3m-7 4h14a1 1 0 001-1v-5a3 3 0 00-3-3H7a3 3 0 00-3 3v5a1 1 0 001 1z"
              />
            </svg>
          </div>
          <span className="font-bold text-lg tracking-wide">SIGAT</span>
        </div>

        <div>
          <h1 className="text-white font-bold text-3xl leading-snug">
            Registrasi
            <br />
            Admin Perusahaan
          </h1>
          <p className="text-amber-100 text-sm mt-4 leading-relaxed">
            Buat akun Admin Perusahaan baru untuk akses dashboard operasional.
            Jika akun sudah ada, lanjutkan lewat halaman login.
          </p>
        </div>

        <p className="text-amber-100 text-xs">
          Dinas ESDM Provinsi Lampung © 2026
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onBackToMap}
              type="button"
              className="text-xs font-semibold text-slate-600 hover:text-slate-800 transition"
            >
              ← Kembali ke peta publik
            </button>
            <button
              onClick={onGoLogin}
              type="button"
              className="text-xs font-semibold text-amber-700 hover:text-amber-800 transition"
            >
              Sudah punya akun? Login
            </button>
          </div>

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 11c0-1.7 1.3-3 3-3h1V7a4 4 0 10-8 0v1h1c1.7 0 3 1.3 3 3zm0 0v3m-7 4h14a1 1 0 001-1v-5a3 3 0 00-3-3H7a3 3 0 00-3 3v5a1 1 0 001 1z"
                />
              </svg>
            </div>
            <span className="font-bold text-slate-800 text-base">SIGAT</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-800">Buat akun baru</h2>
          <p className="text-sm text-slate-500 mt-1 mb-6">
            Registrasi hanya untuk Admin Perusahaan
          </p>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                  Nama Lengkap
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-[var(--bg-input)] border border-[var(--bdr)] rounded-lg px-3 py-2.5 text-sm text-slate-800
                             focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200
                             transition-colors"
                  placeholder="Nama penanggung jawab"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[var(--bg-input)] border border-[var(--bdr)] rounded-lg px-3 py-2.5 text-sm text-slate-800
                             focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200
                             transition-colors"
                  placeholder="admin@perusahaan.co.id"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-[var(--bg-input)] border border-[var(--bdr)] rounded-lg px-3 py-2.5 text-sm text-slate-800
                             focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200
                             transition-colors"
                  placeholder="Minimal 8 karakter"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                  Nomor HP (opsional)
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[var(--bg-input)] border border-[var(--bdr)] rounded-lg px-3 py-2.5 text-sm text-slate-800
                             focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200
                             transition-colors"
                  placeholder="08xxxxxxxxxx"
                />
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
                    className="w-full bg-[var(--bg-input)] border border-[var(--bdr)] rounded-lg px-3 py-2.5 text-sm text-slate-800
                               focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200
                               transition-colors"
                    placeholder="PT Sumber Air Lestari"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                    Alamat Perusahaan (opsional)
                  </label>
                  <input
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    className="w-full bg-[var(--bg-input)] border border-[var(--bdr)] rounded-lg px-3 py-2.5 text-sm text-slate-800
                               focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200
                               transition-colors"
                    placeholder="Jl. Contoh No. 1, Kota"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                      Email Perusahaan (opsional)
                    </label>
                    <input
                      type="email"
                      value={companyEmail}
                      onChange={(e) => setCompanyEmail(e.target.value)}
                      className="w-full bg-[var(--bg-input)] border border-[var(--bdr)] rounded-lg px-3 py-2.5 text-sm text-slate-800
                                 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200
                                 transition-colors"
                      placeholder="info@perusahaan.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                      Telepon (opsional)
                    </label>
                    <input
                      value={companyPhone}
                      onChange={(e) => setCompanyPhone(e.target.value)}
                      className="w-full bg-[var(--bg-input)] border border-[var(--bdr)] rounded-lg px-3 py-2.5 text-sm text-slate-800
                                 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200
                                 transition-colors"
                      placeholder="021xxxxxxx"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                    Jenis Usaha (opsional)
                  </label>
                  <input
                    value={companyType}
                    onChange={(e) => setCompanyType(e.target.value)}
                    className="w-full bg-[var(--bg-input)] border border-[var(--bdr)] rounded-lg px-3 py-2.5 text-sm text-slate-800
                               focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200
                               transition-colors"
                    placeholder="Industri, Perhotelan, Komersial, dll."
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
                  {error}
                </div>
              )}

              {successMsg && (
                <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700">
                  {successMsg}{" "}
                  <button
                    type="button"
                    onClick={onGoLogin}
                    className="font-semibold underline"
                  >
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

          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <p className="text-[10px] font-bold tracking-wide uppercase text-amber-700">
              Info register
            </p>
            <p className="mt-1 text-[11px] text-amber-900">
              Form ini khusus pendaftaran Admin Perusahaan.
            </p>
            <p className="mt-1 text-[11px] text-amber-700">
              Role lain menggunakan akun yang sudah disediakan di halaman Login.
            </p>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6 lg:hidden">
            Dinas ESDM Provinsi Lampung © 2026
          </p>
        </div>
      </div>
    </div>
  );
}
