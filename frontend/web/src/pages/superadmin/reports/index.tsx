import { useState, useMemo } from "react";
import { FileText, Download, Calendar, CheckCircle, Clock } from "lucide-react";
import { Card, SectionHeader } from "../../../components/ui";
import {
  faChartSimple,
  faGear,
  faSatelliteDish,
  faCheck,
  faWater,
  faFile,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCompanies } from "../../../hooks";
import { useVerificationReports } from "../../../hooks/useReports";
import { cn } from "../../../lib/utils";

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(
      new Date(iso),
    );
  } catch {
    return iso;
  }
}

const REPORT_TYPES = [
  {
    key: "subsidence",
    label: "Laporan Subsidence",
    desc: "Tren penurunan tanah per sensor & wilayah",
    icon: <FontAwesomeIcon icon={faFile} />,
    color: "bg-red-50 border-red-200 text-red-700",
  },
  {
    key: "water",
    label: "Laporan Muka Air",
    desc: "Fluktuasi level muka air tanah",
    icon: <FontAwesomeIcon icon={faWater} />,
    color: "bg-blue-50 border-blue-200 text-blue-700",
  },
  {
    key: "quota",
    label: "Laporan Kuota",
    desc: "Penggunaan izin pengambilan air tanah",
    icon: <FontAwesomeIcon icon={faChartSimple} />,
    color: "bg-amber-50 border-amber-200 text-amber-700",
  },
  {
    key: "compliance",
    label: "Laporan Kepatuhan",
    desc: "Status kepatuhan per perusahaan",
    icon: <FontAwesomeIcon icon={faCheck} />,
    color: "bg-emerald-50 border-emerald-200 text-emerald-700",
  },
  {
    key: "sensor",
    label: "Laporan Sensor",
    desc: "Status operasional dan histori sensor",
    icon: <FontAwesomeIcon icon={faSatelliteDish} />,
    color: "bg-purple-50 border-purple-200 text-purple-700",
  },
  {
    key: "custom",
    label: "Laporan Kustom",
    desc: "Pilih parameter dan rentang sendiri",
    icon: <FontAwesomeIcon icon={faGear} />,
    color: "bg-slate-50 border-slate-200 text-slate-700",
  },
];

export default function ReportsPage() {
  const { data: companies = [] } = useCompanies();
  const { data: allReports = [], isLoading: loadingReports } =
    useVerificationReports();

  const recentReports = useMemo(
    () =>
      [...allReports]
        .filter((r) => r.status === "APPROVED")
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 10),
    [allReports],
  );

  const [selectedType, setSelectedType] = useState("");
  const [company, setCompany] = useState("all");
  const [period, setPeriod] = useState("Q1 2026");
  const [format, setFormat] = useState("PDF");
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);

  const handleGenerate = () => {
    if (!selectedType) return;
    setGenerating(true);
    setDone(false);
    setTimeout(() => {
      setGenerating(false);
      setDone(true);
    }, 2200);
  };

  return (
    <div className="p-3 sm:p-5 space-y-4">
      <div>
        <h1 className="text-[18px] font-semibold text-slate-800">Laporan</h1>
        <p className="text-[11px] text-slate-400 font-mono mt-0.5">
          Generate dan unduh laporan sistem pemantauan
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        <div className="space-y-4">
          {/* Report type selector */}
          <Card padding={false}>
            <SectionHeader
              title="Pilih Jenis Laporan"
              icon={<FileText size={13} />}
            />
            <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {REPORT_TYPES.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setSelectedType(t.key)}
                  className={cn(
                    "text-left p-3 rounded-xl border transition-all",
                    selectedType === t.key
                      ? "border-cyan-300 ring-1 ring-cyan-200 bg-cyan-50/30"
                      : `hover:shadow-sm bg-white border-slate-100`,
                  )}
                >
                  <span className="text-xl mb-2 block">{t.icon}</span>
                  <p className="text-[11px] font-semibold text-slate-800 mb-0.5">
                    {t.label}
                  </p>
                  <p className="text-[9px] text-slate-400 font-mono leading-relaxed">
                    {t.desc}
                  </p>
                </button>
              ))}
            </div>
          </Card>

          {/* Parameters */}
          <Card>
            <h3 className="text-[13px] font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Calendar size={13} className="text-cyan-600" /> Parameter Laporan
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                  Periode
                </label>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full text-[11px] font-mono border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-slate-700 focus:outline-none focus:border-cyan-400"
                >
                  {[
                    "Q1 2026",
                    "Q4 2025",
                    "Q3 2025",
                    "Q2 2025",
                    "Q1 2025",
                    "Kustom",
                  ].map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                  Perusahaan
                </label>
                <select
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full text-[11px] font-mono border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-slate-700 focus:outline-none focus:border-cyan-400"
                >
                  <option value="all">Semua Perusahaan</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                  Format Output
                </label>
                <div className="flex gap-2">
                  {["PDF", "XLSX", "CSV"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFormat(f)}
                      className={cn(
                        "flex-1 py-2 text-[10px] font-mono font-semibold rounded-lg border transition-all",
                        format === f
                          ? "bg-cyan-600 text-white border-cyan-600"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100",
                      )}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                  Opsi Tambahan
                </label>
                <div className="space-y-1.5">
                  {["Sertakan grafik", "Sertakan peta", "Kirim ke email"].map(
                    (o) => (
                      <label
                        key={o}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          className="w-3 h-3 accent-cyan-600"
                        />
                        <span className="text-[10px] text-slate-600">{o}</span>
                      </label>
                    ),
                  )}
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <button
                onClick={handleGenerate}
                disabled={!selectedType || generating}
                className={cn(
                  "w-full py-2.5 text-[12px] font-semibold rounded-xl transition-all",
                  selectedType && !generating
                    ? "bg-cyan-600 text-white hover:bg-cyan-700"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed",
                )}
              >
                {generating
                  ? "⏳ Membuat laporan..."
                  : done
                    ? "✅ Laporan siap diunduh"
                    : "Generate Laporan"}
              </button>
            </div>
          </Card>
        </div>

        {/* Recent reports */}
        <Card padding={false} className="flex flex-col">
          <SectionHeader
            title="Laporan Terverifikasi"
            icon={<Download size={13} />}
            subtitle={
              loadingReports ? "Memuat..." : `${recentReports.length} laporan`
            }
          />
          <div className="flex-1 divide-y divide-slate-50 overflow-y-auto">
            {loadingReports ? (
              <div className="px-4 py-8 text-center text-[10px] text-slate-400 font-mono">
                Memuat...
              </div>
            ) : recentReports.length === 0 ? (
              <div className="px-4 py-8 text-center text-[10px] text-slate-400 font-mono">
                Belum ada laporan terverifikasi
              </div>
            ) : (
              recentReports.map((r) => (
                <div
                  key={r.id}
                  className="px-4 py-3 hover:bg-slate-50/60 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-[11px] font-semibold text-slate-700 leading-tight">
                      {r.wellName}
                    </p>
                    <CheckCircle
                      size={12}
                      className="text-emerald-500 flex-shrink-0 mt-0.5"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 truncate mb-1">
                    {r.companyName}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono text-slate-400">
                      {formatDate(r.createdAt)}
                    </span>
                    <span className="text-[9px] font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                      {r.surveyorName}
                    </span>
                    {r.waterQuality && (
                      <span
                        className={cn(
                          "text-[8px] font-mono px-1.5 py-0.5 rounded-full border",
                          r.waterQuality === "BAIK"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : r.waterQuality === "SEDANG"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-red-50 text-red-700 border-red-200",
                        )}
                      >
                        {r.waterQuality}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
