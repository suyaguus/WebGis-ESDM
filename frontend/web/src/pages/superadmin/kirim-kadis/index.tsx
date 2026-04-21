import { useMemo, useState } from 'react';
import {
  SendHorizonal,
  FileText,
  Clock3,
  CheckCircle2,
  Search,
  Paperclip,
} from 'lucide-react';
import { Card, SectionHeader, Badge } from '../../../components/ui';
import { cn } from '../../../lib/utils';

type PaketStatus = 'draft' | 'ready' | 'sent' | 'revision';

interface PaketLaporan {
  id: string;
  title: string;
  period: string;
  scope: string;
  itemCount: number;
  updatedAt: string;
  status: PaketStatus;
}

const PAKETS: PaketLaporan[] = [
  {
    id: 'pk1',
    title: 'Ringkasan Subsidence Mingguan',
    period: 'Minggu ke-3 Apr 2026',
    scope: 'Provinsi Lampung',
    itemCount: 12,
    updatedAt: '09:12 WIB',
    status: 'ready',
  },
  {
    id: 'pk2',
    title: 'Perusahaan Dengan Alert Kritis',
    period: 'April 2026',
    scope: '5 Perusahaan',
    itemCount: 5,
    updatedAt: '08:45 WIB',
    status: 'ready',
  },
  {
    id: 'pk3',
    title: 'Rekap Kepatuhan Kuota Air Tanah',
    period: 'Q1 2026',
    scope: 'Seluruh Perusahaan',
    itemCount: 18,
    updatedAt: 'Kemarin',
    status: 'draft',
  },
  {
    id: 'pk4',
    title: 'Validasi Data Lapangan Tertunda',
    period: 'April 2026',
    scope: 'Data Pending',
    itemCount: 7,
    updatedAt: '2 hari lalu',
    status: 'revision',
  },
  {
    id: 'pk5',
    title: 'Laporan Operasional Sensor',
    period: 'Maret 2026',
    scope: '247 Sensor',
    itemCount: 247,
    updatedAt: '14 Apr 2026',
    status: 'sent',
  },
];

const STATUS_LABEL: Record<PaketStatus, string> = {
  draft: 'Draft',
  ready: 'Siap Kirim',
  sent: 'Terkirim',
  revision: 'Perlu Revisi',
};

const STATUS_BADGE: Record<PaketStatus, 'neutral' | 'info' | 'success' | 'warning'> = {
  draft: 'neutral',
  ready: 'info',
  sent: 'success',
  revision: 'warning',
};

export default function SuperAdminKirimKadisPage() {
  const [selectedId, setSelectedId] = useState<string>('pk1');
  const [search, setSearch] = useState('');
  const [note, setNote] = useState('Mohon ditinjau untuk rapat monitoring minggu ini.');
  const [isSending, setIsSending] = useState(false);
  const [done, setDone] = useState(false);

  const selected = useMemo(() => PAKETS.find((p) => p.id === selectedId) ?? PAKETS[0], [selectedId]);

  const filtered = useMemo(() => {
    if (!search) return PAKETS;
    const q = search.toLowerCase();
    return PAKETS.filter((p) => p.title.toLowerCase().includes(q) || p.period.toLowerCase().includes(q));
  }, [search]);

  const summary = {
    total: PAKETS.length,
    ready: PAKETS.filter((p) => p.status === 'ready').length,
    revision: PAKETS.filter((p) => p.status === 'revision').length,
    sent: PAKETS.filter((p) => p.status === 'sent').length,
  };

  const handleSend = () => {
    if (!selected || selected.status === 'draft') return;
    setDone(false);
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setDone(true);
    }, 1600);
  };

  return (
    <div className="p-3 sm:p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[18px] font-semibold text-slate-800">Kirim ke Kadis</h1>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">Paketkan laporan prioritas sebelum dikirim ke Kepala Dinas</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Paket', value: summary.total, color: '#0891B2', bg: 'bg-cyan-50 border-cyan-200' },
          { label: 'Siap Kirim', value: summary.ready, color: '#3B82F6', bg: 'bg-blue-50 border-blue-200' },
          { label: 'Perlu Revisi', value: summary.revision, color: '#F59E0B', bg: 'bg-amber-50 border-amber-200' },
          { label: 'Terkirim', value: summary.sent, color: '#22C55E', bg: 'bg-emerald-50 border-emerald-200' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={cn('rounded-xl border px-4 py-3', bg)}>
            <p className="text-[9px] font-mono text-slate-400 uppercase mb-1">{label}</p>
            <p className="text-[22px] font-bold font-mono" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-4">
        <Card padding={false} className="flex flex-col min-h-[420px]">
          <SectionHeader title="Daftar Paket" icon={<FileText size={13} />} subtitle={`${filtered.length} item`} />
          <div className="px-4 py-3 border-b border-slate-100">
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari judul / periode..."
                className="w-full pl-8 pr-3 py-1.5 text-[11px] font-mono border border-slate-200 rounded-lg bg-slate-50 text-slate-700 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
            {filtered.map((paket) => {
              const active = paket.id === selectedId;
              return (
                <button
                  key={paket.id}
                  onClick={() => setSelectedId(paket.id)}
                  className={cn(
                    'w-full text-left px-4 py-3 transition-colors',
                    active ? 'bg-cyan-50/60' : 'hover:bg-slate-50/60',
                  )}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-[12px] font-semibold text-slate-800 leading-tight">{paket.title}</p>
                    <Badge variant={STATUS_BADGE[paket.status]}>{STATUS_LABEL[paket.status]}</Badge>
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono">{paket.period}</p>
                  <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>{paket.scope}</span>
                    <span>{paket.itemCount} data</span>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        <Card padding={false} className="min-h-[420px]">
          <SectionHeader title="Preview & Pengiriman" icon={<SendHorizonal size={13} />} subtitle={selected.period} />

          <div className="p-4 space-y-4">
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <p className="text-[13px] font-semibold text-slate-800">{selected.title}</p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">{selected.scope}</p>
                </div>
                <Badge variant={STATUS_BADGE[selected.status]}>{STATUS_LABEL[selected.status]}</Badge>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-lg bg-white border border-slate-100 px-2.5 py-2">
                  <p className="text-[9px] font-mono text-slate-400 uppercase">Periode</p>
                  <p className="text-[11px] font-semibold text-slate-700 mt-0.5">{selected.period}</p>
                </div>
                <div className="rounded-lg bg-white border border-slate-100 px-2.5 py-2">
                  <p className="text-[9px] font-mono text-slate-400 uppercase">Isi Data</p>
                  <p className="text-[11px] font-semibold text-slate-700 mt-0.5">{selected.itemCount} baris</p>
                </div>
                <div className="rounded-lg bg-white border border-slate-100 px-2.5 py-2">
                  <p className="text-[9px] font-mono text-slate-400 uppercase">Update</p>
                  <p className="text-[11px] font-semibold text-slate-700 mt-0.5">{selected.updatedAt}</p>
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">Catatan untuk Kadis</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 text-[11px] border border-slate-200 rounded-lg bg-white text-slate-700 resize-none focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="rounded-xl border border-slate-100 bg-white p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Paperclip size={13} className="text-slate-400" />
                <p className="text-[11px] text-slate-600">Lampirkan ringkasan PDF otomatis</p>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-cyan-600" />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSend}
                disabled={selected.status === 'draft' || isSending}
                className={cn(
                  'px-4 py-2 text-[12px] font-semibold rounded-xl transition-colors inline-flex items-center gap-2',
                  selected.status === 'draft' || isSending
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-cyan-600 text-white hover:bg-cyan-700',
                )}
              >
                <SendHorizonal size={13} />
                {isSending ? 'Mengirim...' : 'Kirim ke Kadis'}
              </button>
              {done && (
                <span className="text-[11px] text-emerald-600 font-medium inline-flex items-center gap-1">
                  <CheckCircle2 size={13} /> Terkirim ke inbox Kadis
                </span>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Riwayat Pengiriman Terakhir</p>
              {[
                '17 Apr 2026 · Paket Alert Kritis dikirim',
                '15 Apr 2026 · Ringkasan Q1 2026 dikirim',
                '10 Apr 2026 · Revisi laporan kuota diterima',
              ].map((entry) => (
                <div key={entry} className="text-[11px] text-slate-600 flex items-center gap-2">
                  <Clock3 size={12} className="text-slate-400" />
                  {entry}
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
