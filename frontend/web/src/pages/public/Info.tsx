interface InfoPageProps {
  onNavigate: (page: 'landing' | 'home' | 'contact') => void;
  onLogin: () => void;
  onRegister: () => void;
}

export default function InfoPage({ onNavigate, onLogin, onRegister }: InfoPageProps) {
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
              <button onClick={() => onNavigate('landing')} className="hover:text-cyan-700 transition-colors">
                Peta
              </button>
              <button onClick={() => onNavigate('home')} className="hover:text-cyan-700 transition-colors">
                Beranda
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

      {/* Hero */}
      <section className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Tentang SIGAT ESDM</h1>
          <p className="text-lg opacity-90">Platform monitoring geologi dan air tanah Provinsi Lampung</p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-16 md:py-24">
        <div className="space-y-12">
          {/* Visi Misi */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Visi & Misi</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg text-slate-800 mb-2">Visi</h3>
                <p className="text-slate-600">
                  Menjadi sistem informasi geologi dan air tanah terdepan yang mendukung pengambilan keputusan berbasis data untuk pengelolaan sumber daya alam berkelanjutan di Provinsi Lampung.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-slate-800 mb-2">Misi</h3>
                <ul className="text-slate-600 space-y-2 list-disc list-inside">
                  <li>Menyediakan data real-time tentang kondisi air tanah dan subsidence</li>
                  <li>Memfasilitasi kolaborasi antar stakeholder dalam pengelolaan geologi</li>
                  <li>Mendukung penelitian dan analisis kondisi geologi terkini</li>
                  <li>Meningkatkan transparansi dan akuntabilitas data geologi</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Tentang Data */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Tentang Data Kami</h2>
            <p className="text-slate-600 mb-6">
              SIGAT ESDM mengumpulkan dan menampilkan data dari lebih dari ratusan sensor air tanah dan GPS (GNSS) yang tersebar di seluruh Provinsi Lampung.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  Sensor Air Tanah
                </h3>
                <p className="text-sm text-slate-600">
                  Mengukur tinggi muka air tanah dan memberikan indikasi ketersediaan sumber daya air untuk pertanian dan industri.
                </p>
              </div>

              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  Sensor Subsidence (GNSS)
                </h3>
                <p className="text-sm text-slate-600">
                  Mengukur pergerakan vertikal tanah secara presisi untuk deteksi penurunan tanah dan potensi bencana alam.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Pertanyaan Umum</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Siapa saja yang bisa mengakses sistem ini?</h3>
                <p className="text-slate-600">
                  Sistem ini tersedia untuk publik (akses terbatas), pemerintah daerah, perusahaan, dan peneliti. Pendaftaran akun memungkinkan akses ke fitur analitik lengkap.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Seberapa sering data diperbarui?</h3>
                <p className="text-slate-600">
                  Data sensor diperbarui secara real-time dari stasiun monitoring. Sistem kami melakukan sinkronisasi setiap beberapa menit untuk memastikan data terkini.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Bagaimana cara mengunduh laporan?</h3>
                <p className="text-slate-600">
                  Pengguna terdaftar dapat mengunduh laporan dalam format PDF dan Excel melalui dashboard. Laporan dapat dikustomisasi berdasarkan rentang waktu dan lokasi tertentu.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Apakah data ini akurat?</h3>
                <p className="text-slate-600">
                  Data dikalibrasi dan divalidasi secara berkala oleh tim teknis. Sensor dirawat dan dikalibrasi mengikuti standar internasional untuk memastikan akurasi tinggi.
                </p>
              </div>
            </div>
          </div>
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
