interface HomePageProps {
  onNavigate: (page: 'landing' | 'info' | 'contact') => void;
  onLogin: () => void;
  onRegister: () => void;
}

export default function HomePage({ onNavigate, onLogin, onRegister }: HomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 ring-1 ring-cyan-200/80">
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-cyan-700" stroke="currentColor" strokeWidth="1.7">
                  <path d="M9 20l-5.45-2.72A1 1 0 013 16.38V5.62a1 1 0 011.45-.9L9 7m0 13l6-3m-6 3V7m6 10l4.55 2.28A1 1 0 0021 18.38V7.62a1 1 0 00-.55-.9L15 4m0 13V4m0 0L9 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="font-semibold text-slate-800">SIGAT ESDM</p>
            </button>

            <nav className="hidden sm:flex items-center gap-8 text-sm text-slate-600">
              <button onClick={() => onNavigate('landing')} className="font-medium hover:text-cyan-700 transition-colors">
                Peta
              </button>
              <button onClick={() => onNavigate('info')} className="hover:text-cyan-700 transition-colors">
                Informasi
              </button>
              <button onClick={() => onNavigate('contact')} className="hover:text-cyan-700 transition-colors">
                Kontak
              </button>
            </nav>

            <div className="flex items-center gap-2">
              <button
                onClick={onLogin}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:border-cyan-300 hover:text-cyan-700 transition"
              >
                Login
              </button>
              <button
                onClick={onRegister}
                className="rounded-lg border border-cyan-500 bg-cyan-500 px-3 py-2 text-xs font-semibold text-white hover:bg-cyan-600 transition"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Sistem Informasi Geologi dan Air Tanah
            </h1>
            <p className="text-lg text-slate-600 mb-6">
              Platform monitoring terpadu untuk data sensor air tanah dan subsidence (penurunan tanah) di Provinsi Lampung. Akses informasi real-time tentang kondisi geologi dan pergerakan tanah.
            </p>
            <div className="flex gap-4">
              <button
                onClick={onRegister}
                className="px-6 py-3 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-600 transition"
              >
                Mulai Sekarang
              </button>
              <button
                onClick={() => onNavigate('landing')}
                className="px-6 py-3 border-2 border-cyan-500 text-cyan-700 font-semibold rounded-lg hover:bg-cyan-50 transition"
              >
                Lihat Peta
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-100 to-blue-100 rounded-2xl h-80 flex items-center justify-center text-slate-400">
            <svg className="w-32 h-32 opacity-30" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Fitur Utama</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 border border-slate-200 rounded-xl hover:shadow-lg transition">
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-cyan-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8m3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg text-slate-900 mb-2">Monitoring Real-Time</h3>
              <p className="text-slate-600">Pantau status sensor air tanah dan subsidence secara langsung dengan data terkini.</p>
            </div>

            <div className="p-6 border border-slate-200 rounded-xl hover:shadow-lg transition">
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-cyan-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8m.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg text-slate-900 mb-2">Data Historis</h3>
              <p className="text-slate-600">Akses data historis dan analitik tren untuk pengambilan keputusan yang lebih baik.</p>
            </div>

            <div className="p-6 border border-slate-200 rounded-xl hover:shadow-lg transition">
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-cyan-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8m3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg text-slate-900 mb-2">Laporan Komprehensif</h3>
              <p className="text-slate-600">Buat dan unduh laporan detail tentang kondisi geologi dan perkembangan subsidence.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-16 md:py-24">
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Siap Memulai?</h2>
          <p className="text-lg mb-8 opacity-90">Daftar sekarang untuk mengakses dashboard analitik lengkap dan data sensor real-time.</p>
          <button
            onClick={onRegister}
            className="px-8 py-3 bg-white text-cyan-600 font-semibold rounded-lg hover:bg-slate-100 transition"
          >
            Daftar Gratis
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 text-center text-sm">
          <p>&copy; 2024 SIGAT ESDM. Semua hak dilindungi.</p>
        </div>
      </footer>
    </div>
  );
}
