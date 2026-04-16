import { Construction } from 'lucide-react';

const PAGE_LABELS: Record<string, string> = {
  peta:      'Peta Interaktif',
  sensor:    'Semua Sensor',
  analytics: 'Analytics',
  users:     'Pengguna',
  companies: 'Perusahaan',
  roles:     'Role & Akses',
  reports:   'Laporan',
  config:    'Konfigurasi',
  server:    'Server & API',
  audit:     'Audit Log',
};

export default function PlaceholderPage({ page }: { page: string }) {
  const label = PAGE_LABELS[page] ?? page;
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-center p-10">
      <div className="w-14 h-14 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center">
        <Construction size={24} className="text-cyan-500" />
      </div>
      <div>
        <h2 className="text-[16px] font-semibold text-slate-700">{label}</h2>
        <p className="text-[12px] text-slate-400 mt-1 font-mono">
          Halaman ini sedang dalam pengembangan
        </p>
      </div>
      <span className="text-[10px] font-mono bg-slate-100 text-slate-500 px-3 py-1 rounded-full">
        COMING SOON
      </span>
    </div>
  );
}
