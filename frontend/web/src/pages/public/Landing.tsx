import { useState, useEffect } from 'react';
import PublicSensorMap from '@/components/map/PublicSensorMap';
import { MOCK_SENSORS } from '@/constants/mockData';

interface LandingPageProps {
  onNavigate: (page: 'home' | 'info' | 'contact') => void;
  onLogin: () => void;
  onRegister: () => void;
}

export default function LandingPage({ onNavigate, onLogin, onRegister }: LandingPageProps) {
  const totalSensors = MOCK_SENSORS.length;
  const waterSensors = MOCK_SENSORS.filter((sensor) => sensor.type === 'water').length;
  const gnssSensors = MOCK_SENSORS.filter((sensor) => sensor.type === 'gnss').length;
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-slate-100 animate-fade-in">
      <PublicSensorMap sensors={MOCK_SENSORS} className="h-full w-full" />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-900/30 via-transparent to-slate-900/20" />

      <header className="absolute inset-x-0 top-0 z-[1100] px-4 pt-4 md:px-8 md:pt-6">
        <div className="pointer-events-auto mx-auto flex w-full max-w-7xl items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 text-slate-800 backdrop-blur-md shadow-[0_14px_34px_rgba(15,23,42,0.14)] md:px-6 md:py-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 ring-1 ring-cyan-200/80">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-cyan-700" stroke="currentColor" strokeWidth="1.7">
                <path d="M9 20l-5.45-2.72A1 1 0 013 16.38V5.62a1 1 0 011.45-.9L9 7m0 13l6-3m-6 3V7m6 10l4.55 2.28A1 1 0 0021 18.38V7.62a1 1 0 00-.55-.9L15 4m0 13V4m0 0L9 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-[0.16em] md:text-base">SIGAT ESDM</p>
              <p className="hidden text-[10px] text-slate-500 md:block">Pemetaan publik sensor air tanah dan subsidence</p>
            </div>
          </div>

          <nav className="ml-4 hidden items-center gap-5 text-xs text-slate-500 lg:flex">
            <button onClick={() => onNavigate('home')} className="transition-colors hover:text-cyan-700">Beranda</button>
            <button onClick={() => onNavigate('info')} className="transition-colors hover:text-cyan-700">Informasi</button>
            <button onClick={() => onNavigate('contact')} className="transition-colors hover:text-cyan-700">Kontak</button>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={onLogin}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700 md:px-4"
            >
              Login
            </button>
            <button
              onClick={onRegister}
              className="rounded-xl border border-cyan-500 bg-cyan-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-cyan-600 md:px-4"
            >
              Register
            </button>
          </div>
        </div>
      </header>

      <section
        className="pointer-events-none absolute left-3 bottom-3 z-[1000] sm:left-4 sm:bottom-4 md:left-8 md:bottom-8 right-auto"
        style={{
          transformOrigin: 'bottom left',
          transform: isMobile ? 'scale(0.95)' : 'scale(1)',
          transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div className="flex flex-col gap-2 sm:gap-2.5 w-fit" style={{ transition: 'gap 300ms ease-out' }}>
          {/* Left Box - Peta Publik */}
          <div
            className="rounded-lg sm:rounded-xl border border-slate-200/80 bg-white/82 p-3 sm:p-4 text-slate-800 backdrop-blur-md shadow-[0_14px_30px_rgba(15,23,42,0.14)] w-full sm:w-auto sm:max-w-xs"
            style={{ transition: 'padding 300ms ease-out, border-radius 300ms ease-out' }}
          >
            <p className="text-[9px] sm:text-[10px] font-mono tracking-[0.2em] text-cyan-700 font-semibold">PETA PUBLIK</p>
            <h1 className="mt-1.5 sm:mt-2 text-sm sm:text-base font-semibold leading-tight">
              Pantau sensor langsung
            </h1>
            <p className="mt-1 text-[10px] sm:text-xs text-slate-600 leading-relaxed">
              Lihat status tanpa login
            </p>
          </div>

          {/* Right Box - Legend */}
          <div
            className="rounded-lg sm:rounded-xl border border-slate-200/80 bg-white/82 p-3 sm:p-4 text-slate-800 backdrop-blur-md shadow-[0_14px_30px_rgba(15,23,42,0.14)] w-full sm:w-auto sm:max-w-xs"
            style={{ transition: 'padding 300ms ease-out, border-radius 300ms ease-out' }}
          >
            <p className="text-[9px] sm:text-[10px] font-mono tracking-widest text-slate-500 font-semibold mb-2">LEGENDA</p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs font-semibold text-slate-700">Total:</span>
                <span className="text-sm sm:text-base font-bold text-slate-800">{totalSensors}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0"></div>
                <span className="text-[10px] sm:text-xs font-semibold text-slate-700">Air Tanah:</span>
                <span className="text-sm sm:text-base font-bold text-slate-800">{waterSensors}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0"></div>
                <span className="text-[10px] sm:text-xs font-semibold text-slate-700">Subsidence:</span>
                <span className="text-sm sm:text-base font-bold text-slate-800">{gnssSensors}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
