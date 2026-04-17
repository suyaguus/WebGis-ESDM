import { useState, useMemo } from 'react';
import { Search, Plus, ArrowUpDown, X } from 'lucide-react';
import { Card, SectionHeader, StatusPill, Badge } from '../../../components/ui';
import { COMPANY_SENSORS } from '../../../constants/mockData';
import { cn, getSubsidenceColor } from '../../../lib/utils';
import type { Sensor, SensorStatus, SensorType } from '../../../types';

type SortKey = 'code' | 'location' | 'subsidence' | 'status' | 'lastUpdate';

function SensorDetailModal({ sensor, onClose }: { sensor: Sensor; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <p className="text-[15px] font-bold font-mono text-slate-800">{sensor.code}</p>
            <p className="text-[11px] text-slate-500">{sensor.location}</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusPill status={sensor.status} />
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200">
              <X size={14} className="text-slate-500" />
            </button>
          </div>
        </div>
        <div className="px-6 py-5 grid grid-cols-2 gap-3">
          {[
            ['Tipe Sensor',     sensor.type === 'water' ? 'Air Tanah (Groundwater)' : 'GNSS'],
            ['Koordinat',       `${sensor.lat.toFixed(4)}, ${sensor.lng.toFixed(4)}`],
            ['Subsidence',      `${sensor.subsidence.toFixed(2)} cm/tahun`],
            ['Muka Air Tanah',  sensor.waterLevel ? `${sensor.waterLevel} m` : '-'],
            ['Nilai Vertikal',  sensor.verticalValue ? `${sensor.verticalValue} mm` : '-'],
            ['Update Terakhir', sensor.lastUpdate],
          ].map(([k, v]) => (
            <div key={k} className="bg-slate-50 rounded-xl px-3 py-2.5">
              <p className="text-[9px] text-slate-400 font-mono uppercase tracking-wider mb-1">{k}</p>
              <p className={cn('text-[12px] font-semibold', k === 'Subsidence' ? getSubsidenceColor(sensor.subsidence) : 'text-slate-800')}>{v}</p>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex gap-2">
          <button className="flex-1 px-4 py-2 bg-amber-500 text-white text-[12px] font-semibold rounded-xl hover:bg-amber-600 transition-colors">Lihat Histori</button>
          <button className="px-4 py-2 bg-slate-100 text-slate-600 text-[12px] font-semibold rounded-xl hover:bg-slate-200">Edit</button>
          <button className="px-4 py-2 bg-red-50 text-red-600 text-[12px] font-semibold rounded-xl hover:bg-red-100 border border-red-200">Nonaktifkan</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminSumurPage() {
  const [search, setSearch]   = useState('');
  const [statusF, setStatusF] = useState<SensorStatus | 'all'>('all');
  const [typeF, setTypeF]     = useState<SensorType | 'all'>('all');
  const [sortKey, setSortKey] = useState<SortKey>('code');
  const [sortAsc, setSortAsc] = useState(true);
  const [detail, setDetail]   = useState<Sensor | null>(null);

  const data = useMemo(() => {
    let d = [...COMPANY_SENSORS];
    if (statusF !== 'all') d = d.filter(s => s.status === statusF);
    if (typeF   !== 'all') d = d.filter(s => s.type   === typeF);
    if (search) d = d.filter(s => s.code.toLowerCase().includes(search.toLowerCase()) || s.location.toLowerCase().includes(search.toLowerCase()));
    d.sort((a, b) => {
      const av = a[sortKey] as string|number, bv = b[sortKey] as string|number;
      if (typeof av === 'string') return sortAsc ? av.localeCompare(bv as string) : (bv as string).localeCompare(av);
      return sortAsc ? (av as number)-(bv as number) : (bv as number)-(av as number);
    });
    return d;
  }, [search, statusF, typeF, sortKey, sortAsc]);

  const Th = ({ label, k }: { label: string; k: SortKey }) => (
    <th onClick={() => { setSortKey(k); if (sortKey===k) setSortAsc(p=>!p); else setSortAsc(true); }}
      className="text-[9px] font-mono text-slate-400 uppercase tracking-wider px-4 py-3 text-left cursor-pointer hover:text-slate-600 whitespace-nowrap select-none">
      <span className="flex items-center gap-1">{label}<ArrowUpDown size={9} className={sortKey===k?'text-amber-500':'text-slate-300'} /></span>
    </th>
  );

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[18px] font-semibold text-slate-800">Daftar Sumur</h1>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">Semua sensor PT Maju Jaya Tbk</p>
        </div>
        <button className="px-4 py-2 bg-amber-500 text-white text-[12px] font-semibold rounded-xl hover:bg-amber-600 transition-colors flex items-center gap-2">
          <Plus size={13} /> Tambah Sensor
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Sensor',   value: COMPANY_SENSORS.length,                                         color: '#F59E0B', bg: 'bg-amber-50  border-amber-200'   },
          { label: 'Online',         value: COMPANY_SENSORS.filter(s=>s.status==='online').length,          color: '#22C55E', bg: 'bg-emerald-50 border-emerald-200' },
          { label: 'Alert / Kritis', value: COMPANY_SENSORS.filter(s=>s.status==='alert').length,           color: '#EF4444', bg: 'bg-red-50     border-red-200'     },
          { label: 'Maintenance',    value: COMPANY_SENSORS.filter(s=>s.status==='maintenance').length,     color: '#8B5CF6', bg: 'bg-purple-50  border-purple-200'  },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={cn('rounded-xl border px-4 py-3', bg)}>
            <p className="text-[9px] font-mono text-slate-400 uppercase mb-1">{label}</p>
            <p className="text-[22px] font-bold font-mono" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <Card padding={false}>
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 flex-wrap">
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari kode / lokasi..."
              className="pl-8 pr-3 py-1.5 text-[11px] font-mono border border-slate-200 rounded-lg bg-slate-50 text-slate-700 w-48 focus:outline-none focus:border-amber-400" />
          </div>
          <div className="flex gap-1">
            {(['all','online','alert','maintenance','offline'] as const).map(s => (
              <button key={s} onClick={() => setStatusF(s)}
                className={cn('text-[9px] font-mono px-2.5 py-1 rounded-full border transition-all',
                  statusF===s ? 'bg-amber-50 text-amber-700 border-amber-200' : 'text-slate-400 border-transparent hover:bg-slate-50')}>
                {s==='all'?'Semua':s.charAt(0).toUpperCase()+s.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex gap-1">
            {(['all','water','gnss'] as const).map(t => (
              <button key={t} onClick={() => setTypeF(t)}
                className={cn('text-[9px] font-mono px-2.5 py-1 rounded-full border transition-all',
                  typeF===t ? 'bg-blue-50 text-blue-700 border-blue-200' : 'text-slate-400 border-transparent hover:bg-slate-50')}>
                {t==='all'?'Semua Tipe':t==='water'?'Air Tanah':'GNSS'}
              </button>
            ))}
          </div>
          <span className="ml-auto text-[10px] text-slate-400 font-mono">{data.length} sensor</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full" style={{ minWidth: '620px' }}>
            <thead className="bg-slate-50/60 border-b border-slate-100">
              <tr>
                <Th label="Kode"       k="code"       />
                <Th label="Lokasi"     k="location"   />
                <th className="text-[9px] font-mono text-slate-400 uppercase tracking-wider px-4 py-3 text-left">Tipe</th>
                <Th label="Subsidence" k="subsidence" />
                <th className="text-[9px] font-mono text-slate-400 uppercase tracking-wider px-4 py-3 text-left">Muka Air</th>
                <Th label="Status"     k="status"     />
                <Th label="Update"     k="lastUpdate" />
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.map(s => (
                <tr key={s.id} className={cn('hover:bg-slate-50/60 transition-colors', s.status==='alert' && 'bg-red-50/20')}>
                  <td className="px-4 py-3 font-mono text-[12px] font-bold text-slate-800">{s.code}</td>
                  <td className="px-4 py-3 text-[11px] text-slate-600">{s.location}</td>
                  <td className="px-4 py-3"><Badge variant={s.type==='water'?'info':'neutral'}>{s.type==='water'?'Air Tanah':'GNSS'}</Badge></td>
                  <td className="px-4 py-3">
                    <span className={cn('text-[12px] font-semibold font-mono', getSubsidenceColor(s.subsidence))}>{s.subsidence.toFixed(2)}</span>
                    <span className="text-[9px] text-slate-400 font-mono ml-0.5">cm/thn</span>
                  </td>
                  <td className="px-4 py-3 text-[11px] font-mono text-slate-600">{s.waterLevel ? `${s.waterLevel} m` : '-'}</td>
                  <td className="px-4 py-3"><StatusPill status={s.status} /></td>
                  <td className="px-4 py-3 text-[10px] text-slate-400 font-mono">{s.lastUpdate}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => setDetail(s)} className="text-[10px] font-mono text-amber-600 hover:text-amber-800 font-medium">Detail →</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {detail && <SensorDetailModal sensor={detail} onClose={() => setDetail(null)} />}
    </div>
  );
}
