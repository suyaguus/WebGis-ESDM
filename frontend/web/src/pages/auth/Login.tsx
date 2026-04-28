import { useState, useEffect, useRef, type FormEvent } from "react";
import { useLogin } from "@/hooks/useAuth";
import { useAppStore, useAuthStore } from "@/store";
import { toFrontendRole } from "@/types/api";
import api from "@/lib/api";
import axios from "axios";

interface LoginPageProps {
  onBackToMap?: () => void;
  onGoRegister?: () => void;
  onSuccess?: () => void;
}

const ALLOWED_LOGIN_ROLES = ["superadmin", "admin", "kadis", "surveyor"] as const;

type Step = "login" | "forgot" | "otp" | "done";

/* ── Shared input className ─────────────────────────────────── */
const inputCls =
  "w-full bg-[var(--bg-input)] border border-[var(--bdr)] rounded-lg px-3 py-2.5 text-sm " +
  "text-slate-800 placeholder:text-slate-400 " +
  "focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-bdr)] transition-colors";

/* ── Left branding panel (shared across all steps) ─────────── */
function LeftPanel() {
  return (
    <div className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 bg-[var(--accent)] px-10 py-12">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </div>
        <span className="text-white font-bold text-lg tracking-wide">SIGAT</span>
      </div>
      <div>
        <h1 className="text-white font-bold text-3xl leading-snug">
          Sistem Pemantauan<br />Air Subsidence<br />Terpadu Industri
        </h1>
        <p className="text-cyan-100 text-sm mt-4 leading-relaxed">
          Platform pemantauan real-time sensor air tanah dan subsidence<br />
          untuk perusahaan di Provinsi Lampung.
        </p>
      </div>
      <p className="text-cyan-200 text-xs">Dinas ESDM Provinsi Lampung © 2026</p>
    </div>
  );
}

/* ── Mobile logo ────────────────────────────────────────────── */
function MobileLogo() {
  return (
    <div className="lg:hidden flex items-center gap-2 mb-8">
      <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center">
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      </div>
      <span className="font-bold text-slate-800 text-base">SIGAT</span>
    </div>
  );
}

/* ── Eye icon ───────────────────────────────────────────────── */
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

/* ── Error box ──────────────────────────────────────────────── */
function ErrorBox({ msg }: { msg: string }) {
  return (
    <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
      <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      </svg>
      <p className="text-xs text-red-600">{msg}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function LoginPage({ onBackToMap, onGoRegister, onSuccess }: LoginPageProps) {
  const [step, setStep] = useState<Step>("login");

  /* login state */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  /* forgot state */
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");

  /* otp state */
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { mutate: login, isPending } = useLogin();
  const { setRole } = useAppStore();
  const { clearAuth } = useAuthStore();

  /* Cleanup interval on unmount */
  useEffect(() => () => { if (countdownRef.current) clearInterval(countdownRef.current); }, []);

  function startCountdown(seconds = 60) {
    setResendCountdown(seconds);
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setResendCountdown((s) => {
        if (s <= 1) { clearInterval(countdownRef.current!); return 0; }
        return s - 1;
      });
    }, 1000);
  }

  /* ── Login ─────────────────────────────────────────────────── */
  function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoginError("");
    login(
      { email, password },
      {
        onSuccess: (data) => {
          const frontendRole = toFrontendRole(data.user.role);
          if (!ALLOWED_LOGIN_ROLES.includes(frontendRole)) {
            clearAuth();
            setLoginError("Role akun tidak diizinkan untuk login ke sistem.");
            return;
          }
          setRole(frontendRole);
          onSuccess?.();
        },
        onError: (err) => {
          const message = axios.isAxiosError(err) ? err.response?.data?.message : null;
          setLoginError(message ?? "Email atau password salah.");
        },
      },
    );
  }

  /* ── Forgot Password ────────────────────────────────────────── */
  async function handleForgot(e: FormEvent) {
    e.preventDefault();
    setForgotError("");
    setForgotLoading(true);
    try {
      await api.post("/auth/forgot-password", { email: forgotEmail });
      startCountdown(60);
      setStep("otp");
    } catch (err) {
      const msg = axios.isAxiosError(err) ? err.response?.data?.message : null;
      setForgotError(msg ?? "Gagal mengirim OTP. Coba lagi.");
    } finally {
      setForgotLoading(false);
    }
  }

  async function handleResendOtp() {
    if (resendCountdown > 0) return;
    setOtpError("");
    try {
      await api.post("/auth/forgot-password", { email: forgotEmail });
      startCountdown(60);
    } catch (err) {
      const msg = axios.isAxiosError(err) ? err.response?.data?.message : null;
      setOtpError(msg ?? "Gagal mengirim ulang OTP.");
    }
  }

  /* ── OTP input helpers ─────────────────────────────────────── */
  function handleOtpChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < 5) otpRefs.current[index + 1]?.focus();
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }

  function handleOtpPaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6).split("");
    const next = [...otp];
    digits.forEach((d, i) => { if (i < 6) next[i] = d; });
    setOtp(next);
    const focusIdx = Math.min(digits.length, 5);
    otpRefs.current[focusIdx]?.focus();
  }

  /* ── Reset Password ─────────────────────────────────────────── */
  async function handleReset(e: FormEvent) {
    e.preventDefault();
    setOtpError("");
    const otpStr = otp.join("");
    if (otpStr.length < 6) { setOtpError("Masukkan 6 digit kode OTP."); return; }
    if (newPassword.length < 8) { setOtpError("Password minimal 8 karakter."); return; }
    if (newPassword !== confirmPassword) { setOtpError("Konfirmasi password tidak cocok."); return; }

    setOtpLoading(true);
    try {
      await api.post("/auth/reset-password", {
        email: forgotEmail,
        otp: otpStr,
        newPassword,
      });
      setStep("done");
    } catch (err) {
      const msg = axios.isAxiosError(err) ? err.response?.data?.message : null;
      setOtpError(msg ?? "Gagal mereset password. Periksa kode OTP.");
    } finally {
      setOtpLoading(false);
    }
  }

  /* ══════════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-[#F0F4F8] flex animate-fade-in">
      <LeftPanel />

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">

          {/* ── STEP: LOGIN ───────────────────────────────────── */}
          {step === "login" && (
            <>
              <div className="flex items-center justify-between mb-6">
                <button onClick={onBackToMap} type="button"
                  className="text-xs font-semibold text-slate-600 hover:text-slate-800 transition">
                  ← Kembali ke peta publik
                </button>
                <button onClick={onGoRegister} type="button"
                  className="text-xs font-semibold text-cyan-700 hover:text-cyan-800 transition">
                  Register Admin
                </button>
              </div>

              <MobileLogo />

              <h2 className="text-2xl font-bold text-slate-800">Selamat datang</h2>
              <p className="text-sm text-slate-500 mt-1 mb-7">Silahkan Login</p>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      required placeholder="nama@instansi.go.id" className={inputCls} />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">Password</label>
                      {/* <button type="button" onClick={() => { setForgotEmail(email); setStep("forgot"); setForgotError(""); }}
                        className="text-[11px] font-medium text-cyan-700 hover:text-cyan-800 transition">
                        Lupa password?
                      </button> */}
                    </div>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                        required placeholder="••••••••" className={inputCls + " pr-10"} />
                      <button type="button" tabIndex={-1} onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                        <EyeIcon open={showPassword} />
                      </button>
                    </div>
                  </div>

                  {loginError && <ErrorBox msg={loginError} />}

                  <button type="submit" disabled={isPending}
                    className="w-full bg-[var(--accent)] hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed
                               text-white font-semibold text-sm rounded-lg py-2.5 transition-all mt-1">
                    {isPending ? "Memproses…" : "Masuk"}
                  </button>
                </form>
              </div>

              <p className="text-center text-xs text-slate-400 mt-6 lg:hidden">
                Dinas ESDM Provinsi Lampung © 2026
              </p>
            </>
          )}

          {/* ── STEP: FORGOT PASSWORD ─────────────────────────── */}
          {step === "forgot" && (
            <>
              <button onClick={() => setStep("login")} type="button"
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 transition mb-6">
                ← Kembali ke login
              </button>

              <MobileLogo />

              <h2 className="text-2xl font-bold text-slate-800">Lupa Password</h2>
              <p className="text-sm text-slate-500 mt-1 mb-7">
                Masukkan email akun Anda. Kami akan mengirimkan kode OTP.
              </p>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <form onSubmit={handleForgot} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Email</label>
                    <input type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)}
                      required placeholder="nama@instansi.go.id" className={inputCls} />
                  </div>

                  {forgotError && <ErrorBox msg={forgotError} />}

                  <button type="submit" disabled={forgotLoading}
                    className="w-full bg-[var(--accent)] hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed
                               text-white font-semibold text-sm rounded-lg py-2.5 transition-all">
                    {forgotLoading ? "Mengirim OTP…" : "Kirim Kode OTP"}
                  </button>
                </form>
              </div>
            </>
          )}

          {/* ── STEP: OTP + NEW PASSWORD ──────────────────────── */}
          {step === "otp" && (
            <>
              <button onClick={() => setStep("forgot")} type="button"
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 transition mb-6">
                ← Kembali
              </button>

              <MobileLogo />

              <h2 className="text-2xl font-bold text-slate-800">Verifikasi OTP</h2>
              <p className="text-sm text-slate-500 mt-1 mb-7">
                Kode dikirim ke{" "}
                <span className="font-semibold text-slate-700">
                  {forgotEmail.replace(/(.{2})(.*)(?=@)/, (_, a, b) => a + "*".repeat(b.length))}
                </span>
              </p>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <form onSubmit={handleReset} className="space-y-5">

                  {/* OTP 6-box input */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-3 uppercase tracking-wide">
                      Kode OTP (6 digit)
                    </label>
                    <div className="flex gap-2 justify-between">
                      {otp.map((digit, i) => (
                        <input
                          key={i}
                          ref={(el) => { otpRefs.current[i] = el; }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(i, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(i, e)}
                          onPaste={i === 0 ? handleOtpPaste : undefined}
                          className="w-11 h-12 text-center text-lg font-bold font-mono border border-slate-200 rounded-lg
                                     bg-slate-50 text-slate-800 focus:outline-none focus:border-[var(--accent)]
                                     focus:ring-2 focus:ring-[var(--accent-bdr)] transition-colors"
                        />
                      ))}
                    </div>

                    {/* Resend */}
                    <div className="mt-3 flex items-center justify-end">
                      {resendCountdown > 0 ? (
                        <p className="text-[11px] text-slate-400 font-mono">
                          Kirim ulang dalam {resendCountdown}s
                        </p>
                      ) : (
                        <button type="button" onClick={handleResendOtp}
                          className="text-[11px] font-medium text-cyan-700 hover:text-cyan-800 transition">
                          Kirim ulang OTP
                        </button>
                      )}
                    </div>
                  </div>

                  {/* New password */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                      Password Baru
                    </label>
                    <div className="relative">
                      <input type={showNewPassword ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                        required placeholder="Minimal 8 karakter" className={inputCls + " pr-10"} />
                      <button type="button" tabIndex={-1} onClick={() => setShowNewPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                        <EyeIcon open={showNewPassword} />
                      </button>
                    </div>
                  </div>

                  {/* Confirm password */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                      Konfirmasi Password
                    </label>
                    <div className="relative">
                      <input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                        required placeholder="Ulangi password baru" className={inputCls + " pr-10"} />
                      <button type="button" tabIndex={-1} onClick={() => setShowConfirmPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                        <EyeIcon open={showConfirmPassword} />
                      </button>
                    </div>
                  </div>

                  {otpError && <ErrorBox msg={otpError} />}

                  <button type="submit" disabled={otpLoading || otp.join("").length < 6}
                    className="w-full bg-[var(--accent)] hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed
                               text-white font-semibold text-sm rounded-lg py-2.5 transition-all">
                    {otpLoading ? "Memproses…" : "Reset Password"}
                  </button>
                </form>
              </div>
            </>
          )}

          {/* ── STEP: DONE ────────────────────────────────────── */}
          {step === "done" && (
            <>
              <MobileLogo />

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
                {/* Checkmark */}
                <div className="mx-auto mb-5 w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
                  <svg className="w-7 h-7 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <h2 className="text-xl font-bold text-slate-800 mb-2">Password Berhasil Direset</h2>
                <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                  Password akun Anda sudah diperbarui.<br />Silakan login menggunakan password baru.
                </p>

                <button
                  onClick={() => {
                    setStep("login");
                    setEmail(forgotEmail);
                    setPassword("");
                    setOtp(["", "", "", "", "", ""]);
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                  className="w-full bg-[var(--accent)] hover:brightness-110 text-white font-semibold text-sm rounded-lg py-2.5 transition-all">
                  Kembali ke Login
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
