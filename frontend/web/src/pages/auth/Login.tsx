import { useState, type FormEvent } from 'react';
import { useLogin } from '@/hooks/useAuth';
import { useAppStore, useAuthStore } from '@/store';
import type { Role } from '@/types';

interface LoginPageProps {
  onBackToMap?: () => void;
  onGoRegister?: () => void;
  onSuccess?: () => void;
}

const ALLOWED_LOGIN_ROLES: Role[] = ['superadmin', 'kadis', 'surveyor', 'admin'];

export default function LoginPage({ onBackToMap, onGoRegister, onSuccess }: LoginPageProps) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  const { mutate: login, isPending } = useLogin();
  const { setRole } = useAppStore();
  const { clearAuth } = useAuthStore();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    login(
      { email, password },
      {
        onSuccess: (data) => {
          if (!ALLOWED_LOGIN_ROLES.includes(data.user.role)) {
            clearAuth();
            setError('Role akun tidak diizinkan untuk login ke sistem.');
            return;
          }

          setRole(data.user.role);
          onSuccess?.();
        },
        onError: () => {
          setError('Email atau password salah.');
        },
      },
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex animate-fade-in">
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 bg-[var(--accent)] px-10 py-12">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <span className="text-white font-bold text-lg tracking-wide">SIGAT</span>
        </div>

        {/* Hero text */}
        <div>
          <h1 className="text-white font-bold text-3xl leading-snug">
            Sistem Pemantauan<br />Air Subsidence<br />Terpadu Industri
          </h1>
          <p className="text-cyan-100 text-sm mt-4 leading-relaxed">
            Platform pemantauan real-time sensor air tanah dan subsidence<br />
            untuk perusahaan di Provinsi Lampung.
          </p>
        </div>

        {/* Footer */}
        <p className="text-cyan-200 text-xs">
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
              onClick={onGoRegister}
              type="button"
              className="text-xs font-semibold text-cyan-700 hover:text-cyan-800 transition"
            >
              Register Admin
            </button>
          </div>

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <span className="font-bold text-slate-800 text-base">SIGAT</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-800">Selamat datang</h2>
          <p className="text-sm text-slate-500 mt-1 mb-7">Masuk untuk akses dashboard sesuai role</p>

          {/* Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="nama@instansi.go.id"
                  className="w-full bg-[var(--bg-input)] border border-[var(--bdr)] rounded-lg px-3 py-2.5 text-sm
                             text-slate-800 placeholder:text-slate-400
                             focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-bdr)]
                             transition-colors"
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
                  placeholder="••••••••"
                  className="w-full bg-[var(--bg-input)] border border-[var(--bdr)] rounded-lg px-3 py-2.5 text-sm
                             text-slate-800 placeholder:text-slate-400
                             focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-bdr)]
                             transition-colors"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                  <p className="text-xs text-red-600">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-[var(--accent)] hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed
                           text-white font-semibold text-sm rounded-lg py-2.5 transition-all mt-1"
              >
                {isPending ? 'Memproses…' : 'Masuk'}
              </button>
            </form>
          </div>

          <div className="mt-4 rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3">
            <p className="text-[10px] font-bold tracking-wide uppercase text-cyan-700">Role login</p>
            <p className="mt-1 text-[11px] text-cyan-900">Super Admin, Kadis, Surveyor, dan Admin Perusahaan</p>
            <p className="mt-1 text-[11px] text-cyan-700">Register tetap digunakan untuk pembuatan akun Admin Perusahaan baru.</p>
          </div>

          {/* Dev hint */}
          {import.meta.env.DEV && (
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wide mb-2">
                Akun dev (mock)
              </p>
              <div className="space-y-1 text-[11px] text-amber-800 font-mono">
                <p>admin@sigat.go.id — superadmin</p>
                <p>kadis@dinas.go.id — kepala dinas</p>
                <p>surveyor@lapangan.go.id — surveyor</p>
                <p>admin@majujaya.co.id — admin perusahaan</p>
                <p className="text-amber-600 mt-1">password: sigat123</p>
              </div>
            </div>
          )}

          <p className="text-center text-xs text-slate-400 mt-6 lg:hidden">
            Dinas ESDM Provinsi Lampung © 2026
          </p>
        </div>
      </div>
    </div>
  );
}
