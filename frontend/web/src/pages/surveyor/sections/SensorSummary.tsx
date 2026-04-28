import {
  Radio,
  ClipboardEdit,
  ArrowLeft,
  Droplets,
  MapPin,
  Building2,
  Clock,
} from "lucide-react";
import { Card, SectionHeader } from "../../../components/ui";
import { cn } from "../../../lib/utils";
import { useSupervisorWells } from "../../../hooks";
import { useAppStore } from "../../../store";
import type { Sensor } from "../../../types";

function WellTypeLabel(type: Sensor["wellType"]) {
  if (type === "sumur_pantau") return "Sumur Pantau";
  if (type === "sumur_gali") return "Sumur Gali";
  return "Sumur Bor";
}

function WellTypeIcon(type: Sensor["wellType"]) {
  if (type === "sumur_pantau") return "🔍";
  if (type === "sumur_gali") return "⛏️";
  return "🪛";
}

function TrendLabel(trend: Sensor["waterLevelTrend"]) {
  if (trend === "rising") return "↑ Naik";
  if (trend === "falling") return "↓ Turun";
  if (trend === "stable") return "→ Stabil";
  return "—";
}

function WellDetail({
  sensor,
  onBack,
}: {
  sensor: Sensor;
  onBack: () => void;
}) {
  const { setActivePage } = useAppStore();

  return (
    <div className="p-4 space-y-3">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-[10px] font-mono text-blue-600 hover:text-blue-800 transition-colors"
      >
        <ArrowLeft size={11} /> Kembali ke daftar
      </button>

      {/* Header */}
      <div className="rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-white border border-blue-100 flex items-center justify-center text-lg flex-shrink-0 shadow-sm">
            {WellTypeIcon(sensor.wellType)}
          </div>
          <div className="min-w-0">
            <h3 className="text-[16px] font-bold font-mono text-slate-800 leading-tight">
              {sensor.code}
            </h3>
            <div className="flex items-center gap-1 mt-0.5">
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  sensor.isActive ? "bg-emerald-400" : "bg-slate-300",
                )}
              />
              <span className="text-[9px] font-mono text-slate-500">
                {sensor.isActive ? "Aktif" : "Non-aktif"}
              </span>
            </div>
          </div>
        </div>

        {sensor.wellStatus === "pending_approval" && (
          <span className="inline-flex items-center gap-1 text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 border border-orange-200">
            <Clock size={9} /> Menunggu Persetujuan
          </span>
        )}
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-2">
        {[
          {
            icon: <Building2 size={11} className="text-slate-400" />,
            label: "Tipe Sumur",
            value: WellTypeLabel(sensor.wellType),
          },
          {
            icon: <Radio size={11} className="text-slate-400" />,
            label: "Perusahaan",
            value: sensor.companyName,
          },
          ...(sensor.businessName
            ? [
                {
                  icon: <Building2 size={11} className="text-slate-400" />,
                  label: "Unit Bisnis",
                  value: sensor.businessName,
                },
              ]
            : []),
          ...(sensor.location
            ? [
                {
                  icon: <MapPin size={11} className="text-slate-400" />,
                  label: "Lokasi",
                  value: sensor.location,
                },
              ]
            : []),
        ].map(({ icon, label, value }) => (
          <div
            key={label}
            className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
          >
            <div className="flex items-center gap-1.5 mb-1">
              {icon}
              <span className="text-[8px] font-mono text-slate-400 uppercase tracking-wider">
                {label}
              </span>
            </div>
            <p className="text-[11px] font-semibold text-slate-800 truncate">
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Water level */}
      {sensor.staticWaterLevel !== null && (
        <div className="rounded-xl border border-cyan-100 bg-cyan-50/50 px-4 py-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Droplets size={12} className="text-cyan-600" />
            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">
              Kedalaman Muka Air Tanah
            </span>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-[22px] font-bold font-mono text-cyan-700">
              {sensor.staticWaterLevel?.toFixed(2)}
              <span className="text-[12px] font-normal ml-1">m</span>
            </span>
            <span
              className={cn(
                "text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full",
                sensor.waterLevelTrend === "falling"
                  ? "bg-red-100 text-red-600"
                  : sensor.waterLevelTrend === "rising"
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-slate-100 text-slate-500",
              )}
            >
              {TrendLabel(sensor.waterLevelTrend ?? null)}
            </span>
          </div>
        </div>
      )}

      {/* Coordinates */}
      {sensor.lat !== null && sensor.lng !== null && (
        <div className="rounded-lg border border-slate-100 px-3 py-2.5">
          <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">
            Koordinat
          </p>
          <div className="flex gap-4">
            <div>
              <p className="text-[8px] font-mono text-slate-400">Lat</p>
              <p className="text-[11px] font-mono font-semibold text-slate-700">
                {sensor.lat?.toFixed(6)}
              </p>
            </div>
            <div>
              <p className="text-[8px] font-mono text-slate-400">Lng</p>
              <p className="text-[11px] font-mono font-semibold text-slate-700">
                {sensor.lng?.toFixed(6)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Depth info */}
      {sensor.depthMeter !== null && (
        <div className="grid grid-cols-2 gap-2">
          {sensor.depthMeter !== null && (
            <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
              <p className="text-[8px] font-mono text-slate-400 uppercase mb-1">
                Kedalaman
              </p>
              <p className="text-[12px] font-bold font-mono text-slate-800">
                {sensor.depthMeter} m
              </p>
            </div>
          )}
          {sensor.diameterInch !== null && (
            <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
              <p className="text-[8px] font-mono text-slate-400 uppercase mb-1">
                Diameter
              </p>
              <p className="text-[12px] font-bold font-mono text-slate-800">
                {sensor.diameterInch}"
              </p>
            </div>
          )}
        </div>
      )}

      {/* Last update */}
      <p className="text-[9px] font-mono text-slate-400 text-right">
        Diperbarui: {sensor.lastUpdate}
      </p>

      {/* Action */}
      <button
        onClick={() => setActivePage("sv-input")}
        className="w-full flex items-center justify-center gap-2 py-2.5 text-[12px] font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-sm"
      >
        <ClipboardEdit size={13} /> Input Pengukuran
      </button>
    </div>
  );
}

interface Props {
  selectedWellId?: string | null;
  onDeselect?: () => void;
}

export default function SensorSummary({ selectedWellId, onDeselect }: Props) {
  const { setActivePage } = useAppStore();
  const { data: wellsData, isLoading } = useSupervisorWells(1, 100);
  const sensors = wellsData?.data ?? [];

  const selected = sensors.find((s) => s.id === selectedWellId) ?? null;

  if (selected) {
    return (
      <Card padding={false} className="flex flex-col">
        <SectionHeader
          title="Detail Sumur"
          subtitle={selected.code}
          icon={<Radio size={13} />}
          accent="#3B82F6"
        />
        <WellDetail sensor={selected} onBack={() => onDeselect?.()} />
      </Card>
    );
  }

  return (
    <Card padding={false} className="flex flex-col">
      <SectionHeader
        title="Data Sumur"
        subtitle={`${sensors.length} SUMUR`}
        icon={<Radio size={13} />}
        accent="#3B82F6"
      />
      {isLoading ? (
        <div className="flex items-center justify-center py-8 text-[11px] text-slate-400 font-mono">
          Memuat data...
        </div>
      ) : sensors.length === 0 ? (
        <div className="flex items-center justify-center py-8 text-[11px] text-slate-400 font-mono">
          Tidak ada sumur
        </div>
      ) : (
        <div className="divide-y divide-slate-50">
          {sensors.map((sensor) => (
            <button
              key={sensor.id}
              onClick={() => {
                /* selecting is handled from TaskList; click here goes to detail directly */
                onDeselect?.();
              }}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50/60 transition-colors text-left"
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-lg",
                  sensor.wellStatus === "pending_approval"
                    ? "bg-orange-100"
                    : "bg-blue-100",
                )}
              >
                {WellTypeIcon(sensor.wellType)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[12px] font-bold font-mono text-slate-800 truncate">
                    {sensor.code}
                  </span>
                  {sensor.wellStatus === "pending_approval" && (
                    <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-orange-100 text-orange-600 flex-shrink-0">
                      Pending
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-500 truncate">
                  {sensor.companyName}
                </p>
              </div>

              <div className="text-right flex-shrink-0">
                {sensor.isActive && (
                  <p className="text-[11px] font-mono font-semibold text-green-600">
                    🟢 Aktif
                  </p>
                )}
                {sensor.staticWaterLevel !== null && (
                  <p className="text-[9px] font-mono text-blue-600">
                    {sensor.staticWaterLevel.toFixed(2)} m
                  </p>
                )}
                <p className="text-[8px] font-mono text-slate-400">
                  {sensor.lastUpdate}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
      <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/50 flex-shrink-0">
        <button
          onClick={() => setActivePage("sv-sumur")}
          className="text-[11px] text-blue-600 hover:text-blue-700 font-medium w-full text-center"
        >
          Lihat semua sumur →
        </button>
      </div>
    </Card>
  );
}
