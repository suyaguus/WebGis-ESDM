import { useState, useMemo, useCallback, useEffect } from "react";
import {
  Search,
  Radio,
  ArrowUpDown,
  X,
  Plus,
  Trash2,
  Edit2,
  TrendingUp,
  TrendingDown,
  Minus,
  FileEdit,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Card, Badge, Pagination } from "../../../components/ui";
import { useSensors, useCompanies, useBusinesses } from "../../../hooks";
import {
  useUpdateSensor,
  useCreateSensor,
  useDeleteSensor,
  useProcessWell,
  useApproveWell,
  useRejectWell,
} from "../../../hooks/useSensors";
import { cn } from "../../../lib/utils";
import { getWaterLevelTrendLabel } from "../../../lib/groundwater";
import type { Sensor } from "../../../types";
import type { CreateSensorRequest } from "../../../types/api";

type WellStatus = Sensor["wellStatus"];
type SortKey = "code" | "location" | "staticWaterLevel" | "lastUpdate";

const WELL_STATUS_CONFIG: Record<WellStatus, { label: string; cls: string; icon: React.ReactNode }> = {
  draft:            { label: "Pengajuan",       cls: "bg-amber-50 text-amber-700 border-amber-200",        icon: <FileEdit size={10} /> },
  pending_approval: { label: "Ditinjau Supervisor", cls: "bg-blue-50 text-blue-700 border-blue-200",      icon: <Clock size={10} /> },
  reviewed:         { label: "Sudah Ditinjau",  cls: "bg-teal-50 text-teal-700 border-teal-200",           icon: <CheckCircle2 size={10} /> },
  approved:         { label: "Disetujui",       cls: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: <CheckCircle2 size={10} /> },
  rejected:         { label: "Ditolak",         cls: "bg-red-50 text-red-700 border-red-200",              icon: <XCircle size={10} /> },
};

function WellStatusBadge({ status }: { status: WellStatus }) {
  const cfg = WELL_STATUS_CONFIG[status] ?? WELL_STATUS_CONFIG.draft;
  return (
    <span className={`inline-flex items-center gap-1 text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full border ${cfg.cls}`}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

/* ── Helper Functions ── */
const getSensorInputCls = (err?: string) =>
  cn(
    "w-full px-3 py-2 text-[12px] font-mono border rounded-lg bg-slate-50 text-slate-800 focus:outline-none focus:ring-1",
    err
      ? "border-red-300 focus:ring-red-300"
      : "border-slate-200 focus:ring-cyan-400 focus:border-cyan-400",
  );

const SensorFieldWrapper = ({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <div>
    <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">
      {label}
    </label>
    {children}
    {error && <p className="text-[10px] text-red-500 mt-1">{error}</p>}
  </div>
);

interface CreateSensorModalProps {
  onClose: () => void;
  businesses: any[];
}

function CreateSensorModal({ onClose, businesses }: CreateSensorModalProps) {
  const createSensor = useCreateSensor();
  const [form, setForm] = useState<CreateSensorRequest>({
    name: "",
    businessId: "",
    wellType: "sumur_pantau",
    latitude: undefined,
    longitude: undefined,
    locationDescription: undefined,
    depthMeter: undefined,
    diameterInch: undefined,
    casingDiameter: undefined,
    pumpCapacity: undefined,
    pumpDepth: undefined,
    pipeDiameter: undefined,
    staticWaterLevelCm: undefined,
    waterLevelTrend: "stable",
    lastWaterLevelMeasurement: undefined,
    isActive: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form ketika modal dibuka
  useEffect(() => {
    setForm({
      name: "",
      businessId: "",
      wellType: "sumur_pantau",
      latitude: undefined,
      longitude: undefined,
      locationDescription: undefined,
      depthMeter: undefined,
      diameterInch: undefined,
      casingDiameter: undefined,
      pumpCapacity: undefined,
      pumpDepth: undefined,
      pipeDiameter: undefined,
      staticWaterLevelCm: undefined,
      waterLevelTrend: "stable",
      lastWaterLevelMeasurement: undefined,
      isActive: true,
    });
    setErrors({});
  }, []);

  // Stable callback for setting form field
  const setField = useCallback((k: string, v: any) => {
    setForm((p) => ({ ...p, [k]: v }));
  }, []);

  const clearError = (k: string) => {
    setErrors((p) => {
      const n = { ...p };
      delete n[k];
      return n;
    });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Nama sumur wajib diisi";
    if (!form.businessId) e.businessId = "Unit bisnis wajib dipilih";
    if (!form.latitude) e.latitude = "Latitude wajib diisi";
    if (!form.longitude) e.longitude = "Longitude wajib diisi";
    return e;
  };

  /**
   * Convert datetime-local format (HH:mm) to ISO-8601 with timezone (HH:mm:ssZ)
   * datetime-local input returns "2026-04-25T17:09" but Prisma needs "2026-04-25T17:09:00Z"
   */
  const formatDateTimeForBackend = (
    value: string | undefined,
  ): string | undefined => {
    if (!value) return undefined;
    // If value is "2026-04-25T17:09", add :00Z to make it "2026-04-25T17:09:00Z"
    if (value.length === 16) return `${value}:00Z`;
    // If value is "2026-04-25T17:09:00", add Z to make it "2026-04-25T17:09:00Z"
    if (value.length === 19 && !value.includes("Z")) return `${value}Z`;
    return value;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    const payload = {
      ...form,
      lastWaterLevelMeasurement: formatDateTimeForBackend(
        form.lastWaterLevelMeasurement as string | undefined,
      ),
    };
    createSensor.mutate(payload, { onSuccess: onClose });
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <p className="text-[15px] font-bold text-slate-800">
              Tambah Sumur Baru
            </p>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
              Daftarkan sumur/well baru ke sistem
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
          >
            <X size={14} className="text-slate-500" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="px-6 py-5 space-y-4 max-h-96 overflow-y-auto"
        >
          <SensorFieldWrapper label="Nama Sumur" error={errors.name}>
            <input
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              onBlur={() => clearError("name")}
              placeholder="Sumur A-01"
              className={getSensorInputCls(errors.name)}
            />
          </SensorFieldWrapper>

          <SensorFieldWrapper label="Unit Bisnis" error={errors.businessId}>
            <select
              value={form.businessId}
              onChange={(e) => setField("businessId", e.target.value)}
              onBlur={() => clearError("businessId")}
              className={getSensorInputCls(errors.businessId)}
            >
              <option value="">Pilih unit bisnis</option>
              {businesses.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </SensorFieldWrapper>

          <div className="grid grid-cols-2 gap-3">
            <SensorFieldWrapper label="Latitude" error={errors.latitude}>
              <input
                type="number"
                step="any"
                value={form.latitude ?? ""}
                onChange={(e) =>
                  setField(
                    "latitude",
                    e.target.value ? parseFloat(e.target.value) : undefined,
                  )
                }
                onBlur={() => clearError("latitude")}
                placeholder="-6.2088"
                className={getSensorInputCls(errors.latitude)}
              />
            </SensorFieldWrapper>
            <SensorFieldWrapper label="Longitude" error={errors.longitude}>
              <input
                type="number"
                step="any"
                value={form.longitude ?? ""}
                onChange={(e) =>
                  setField(
                    "longitude",
                    e.target.value ? parseFloat(e.target.value) : undefined,
                  )
                }
                onBlur={() => clearError("longitude")}
                placeholder="106.8456"
                className={getSensorInputCls(errors.longitude)}
              />
            </SensorFieldWrapper>
          </div>

          <SensorFieldWrapper label="Deskripsi Lokasi">
            <input
              value={form.locationDescription ?? ""}
              onChange={(e) => setField("locationDescription", e.target.value)}
              onBlur={() => clearError("locationDescription")}
              placeholder="Jl. Sudirman No. 1, Bandung"
              className={getSensorInputCls()}
            />
          </SensorFieldWrapper>

          <SensorFieldWrapper label="Tipe Sumur">
            <select
              value={form.wellType}
              onChange={(e) => setField("wellType", e.target.value)}
              onBlur={() => clearError("wellType")}
              className={getSensorInputCls()}
            >
              <option value="sumur_pantau">Sumur Pantau</option>
              <option value="sumur_gali">Sumur Gali</option>
              <option value="sumur_bor">Sumur Bor</option>
            </select>
          </SensorFieldWrapper>

          <div className="grid grid-cols-2 gap-3">
            <SensorFieldWrapper label="Kedalaman (m)">
              <input
                type="number"
                step="any"
                value={form.depthMeter ?? ""}
                onChange={(e) =>
                  setField(
                    "depthMeter",
                    e.target.value ? parseFloat(e.target.value) : undefined,
                  )
                }
                onBlur={() => clearError("depthMeter")}
                placeholder="50"
                className={getSensorInputCls()}
              />
            </SensorFieldWrapper>
            <SensorFieldWrapper label="Diameter (inch)">
              <input
                type="number"
                step="any"
                value={form.diameterInch ?? ""}
                onChange={(e) =>
                  setField(
                    "diameterInch",
                    e.target.value ? parseFloat(e.target.value) : undefined,
                  )
                }
                onBlur={() => clearError("diameterInch")}
                placeholder="6"
                className={getSensorInputCls()}
              />
            </SensorFieldWrapper>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <SensorFieldWrapper label="Muka Air Tanah (cm)">
              <input
                type="number"
                step="0.01"
                value={form.staticWaterLevelCm ?? ""}
                onChange={(e) =>
                  setField(
                    "staticWaterLevelCm",
                    e.target.value ? parseFloat(e.target.value) : undefined,
                  )
                }
                onBlur={() => clearError("staticWaterLevelCm")}
                placeholder="250.50"
                className={getSensorInputCls()}
              />
            </SensorFieldWrapper>
            <SensorFieldWrapper label="Tren Muka Air">
              <select
                value={form.waterLevelTrend ?? "stable"}
                onChange={(e) => setField("waterLevelTrend", e.target.value)}
                onBlur={() => clearError("waterLevelTrend")}
                className={getSensorInputCls()}
              >
                <option value="rising">Naik</option>
                <option value="falling">Turun</option>
                <option value="stable">Stabil</option>
                <option value="unknown">Tidak Diketahui</option>
              </select>
            </SensorFieldWrapper>
          </div>

          <SensorFieldWrapper label="Tanggal Pengukuran (Opsional)">
            <input
              type="datetime-local"
              value={
                form.lastWaterLevelMeasurement
                  ? form.lastWaterLevelMeasurement.toString().slice(0, 16)
                  : ""
              }
              onChange={(e) =>
                setField(
                  "lastWaterLevelMeasurement",
                  e.target.value
                    ? new Date(e.target.value).toISOString()
                    : undefined,
                )
              }
              onBlur={() => clearError("lastWaterLevelMeasurement")}
              className={getSensorInputCls()}
            />
          </SensorFieldWrapper>

          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              disabled={createSensor.isPending}
              className="flex-1 px-4 py-2 bg-cyan-600 text-white text-[12px] font-semibold rounded-xl hover:bg-cyan-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {createSensor.isPending ? (
                "Menyimpan..."
              ) : (
                <>
                  <Plus size={14} /> Simpan Sumur
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-100 text-slate-600 text-[12px] font-semibold rounded-xl hover:bg-slate-200 transition-colors"
            >
              Batal
            </button>
          </div>
          {createSensor.isError && (
            <p className="text-[10px] text-red-500 font-mono">
              Gagal membuat sumur. Coba lagi.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

function DeleteConfirmModal({
  sensor,
  onClose,
  onConfirm,
  isPending,
}: {
  sensor: Sensor;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}) {
  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center">
              <Trash2 size={18} className="text-red-600" />
            </div>
            <div>
              <p className="text-[14px] font-bold text-slate-800">
                Hapus Sumur?
              </p>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                Tindakan ini tidak dapat dibatalkan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
          >
            <X size={14} className="text-slate-500" />
          </button>
        </div>

        <div className="px-6 py-4 space-y-3">
          <div className="bg-red-50 border border-red-100 rounded-lg px-3 py-2.5">
            <p className="text-[11px] text-slate-500 font-mono uppercase tracking-wider">
              Akan dihapus
            </p>
            <p className="text-[13px] font-bold text-slate-800 mt-1">
              {sensor.code}
            </p>
            <p className="text-[10px] text-slate-600 mt-1">{sensor.location}</p>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex gap-2">
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 px-4 py-2 bg-red-600 text-white text-[12px] font-semibold rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {isPending ? "Menghapus..." : "Hapus Sumur"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-slate-100 text-slate-600 text-[12px] font-semibold rounded-xl hover:bg-slate-200 transition-colors"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}

function SensorEditModal({
  sensor,
  onClose,
  businesses,
}: {
  sensor: Sensor;
  onClose: () => void;
  businesses: any[];
}) {
  const updateSensor = useUpdateSensor();
  const [form, setForm] = useState({
    name: sensor.code,
    businessId: sensor.id,
    latitude: sensor.lat?.toString() ?? "",
    longitude: sensor.lng?.toString() ?? "",
    locationDescription: sensor.location || "",
    wellType: "sumur_pantau" as const,
    depthMeter: "",
    diameterInch: "",
    pumpCapacity: "",
    staticWaterLevelCm: (sensor.staticWaterLevel
      ? sensor.staticWaterLevel * 100
      : ""
    ).toString(),
    waterLevelTrend: sensor.waterLevelTrend || "stable",
    lastWaterLevelMeasurement: sensor.lastWaterLevelMeasurement || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form ketika sensor berubah
  useEffect(() => {
    setForm({
      name: sensor.code,
      businessId: sensor.id,
      latitude: sensor.lat?.toString() ?? "",
      longitude: sensor.lng?.toString() ?? "",
      locationDescription: sensor.location || "",
      wellType: "sumur_pantau" as const,
      depthMeter: "",
      diameterInch: "",
      pumpCapacity: "",
      staticWaterLevelCm: (sensor.staticWaterLevel
        ? sensor.staticWaterLevel * 100
        : ""
      ).toString(),
      waterLevelTrend: sensor.waterLevelTrend || "stable",
      lastWaterLevelMeasurement: sensor.lastWaterLevelMeasurement || "",
    });
    setErrors({});
  }, [sensor]);

  // Stable callback for setting form field
  const setField = useCallback((k: string, v: any) => {
    setForm((p) => ({ ...p, [k]: v }));
  }, []);

  const clearError = (k: string) => {
    setErrors((p) => {
      const n = { ...p };
      delete n[k];
      return n;
    });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Nama sumur wajib diisi";
    if (!form.latitude) e.latitude = "Latitude wajib diisi";
    if (!form.longitude) e.longitude = "Longitude wajib diisi";
    return e;
  };

  /**
   * Convert datetime-local format (HH:mm) to ISO-8601 with timezone (HH:mm:ssZ)
   * datetime-local input returns "2026-04-25T17:09" but Prisma needs "2026-04-25T17:09:00Z"
   */
  const formatDateTimeForBackend = (
    value: string | undefined,
  ): string | undefined => {
    if (!value) return undefined;
    // If value is "2026-04-25T17:09", add :00Z to make it "2026-04-25T17:09:00Z"
    if (value.length === 16) return `${value}:00Z`;
    // If value is "2026-04-25T17:09:00", add Z to make it "2026-04-25T17:09:00Z"
    if (value.length === 19 && !value.includes("Z")) return `${value}Z`;
    return value;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const payload = {
      name: form.name,
      latitude: form.latitude ? parseFloat(form.latitude) : undefined,
      longitude: form.longitude ? parseFloat(form.longitude) : undefined,
      locationDescription: form.locationDescription || undefined,
      wellType: form.wellType,
      depthMeter: form.depthMeter ? parseFloat(form.depthMeter) : undefined,
      diameterInch: form.diameterInch
        ? parseFloat(form.diameterInch)
        : undefined,
      pumpCapacity: form.pumpCapacity
        ? parseFloat(form.pumpCapacity)
        : undefined,
      staticWaterLevelCm: form.staticWaterLevelCm
        ? parseFloat(form.staticWaterLevelCm)
        : undefined,
      waterLevelTrend: form.waterLevelTrend || "stable",
      lastWaterLevelMeasurement: formatDateTimeForBackend(
        form.lastWaterLevelMeasurement,
      ),
    };

    updateSensor.mutate(
      {
        id: sensor.id,
        payload,
      },
      { onSuccess: onClose },
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Edit2 size={16} className="text-cyan-600" />
            <p className="text-[14px] font-bold font-mono text-slate-800">
              Edit Sumur
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200"
          >
            <X size={13} className="text-slate-500" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="px-6 py-5 space-y-4 max-h-96 overflow-y-auto"
        >
          <SensorFieldWrapper label="Nama Sumur" error={errors.name}>
            <input
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              onBlur={() => clearError("name")}
              placeholder="Sumur A-01"
              className={getSensorInputCls(errors.name)}
            />
          </SensorFieldWrapper>

          <div className="grid grid-cols-2 gap-3">
            <SensorFieldWrapper label="Latitude" error={errors.latitude}>
              <input
                type="number"
                step="any"
                value={form.latitude}
                onChange={(e) => setField("latitude", e.target.value)}
                onBlur={() => clearError("latitude")}
                placeholder="-6.2088"
                className={getSensorInputCls(errors.latitude)}
              />
            </SensorFieldWrapper>
            <SensorFieldWrapper label="Longitude" error={errors.longitude}>
              <input
                type="number"
                step="any"
                value={form.longitude}
                onChange={(e) => setField("longitude", e.target.value)}
                onBlur={() => clearError("longitude")}
                placeholder="106.8456"
                className={getSensorInputCls(errors.longitude)}
              />
            </SensorFieldWrapper>
          </div>

          <SensorFieldWrapper label="Deskripsi Lokasi">
            <input
              value={form.locationDescription}
              onChange={(e) => setField("locationDescription", e.target.value)}
              onBlur={() => clearError("locationDescription")}
              placeholder="Jl. Sudirman No. 1, Bandung"
              className={getSensorInputCls()}
            />
          </SensorFieldWrapper>

          <SensorFieldWrapper label="Tipe Sumur">
            <select
              value={form.wellType}
              onChange={(e) => setField("wellType", e.target.value)}
              onBlur={() => clearError("wellType")}
              className={getSensorInputCls()}
            >
              <option value="sumur_pantau">Sumur Pantau</option>
              <option value="sumur_gali">Sumur Gali</option>
              <option value="sumur_bor">Sumur Bor</option>
            </select>
          </SensorFieldWrapper>

          <div className="grid grid-cols-2 gap-3">
            <SensorFieldWrapper label="Kedalaman (m)">
              <input
                type="number"
                step="any"
                value={form.depthMeter}
                onChange={(e) => setField("depthMeter", e.target.value)}
                onBlur={() => clearError("depthMeter")}
                placeholder="50"
                className={getSensorInputCls()}
              />
            </SensorFieldWrapper>
            <SensorFieldWrapper label="Diameter (inch)">
              <input
                type="number"
                step="any"
                value={form.diameterInch}
                onChange={(e) => setField("diameterInch", e.target.value)}
                onBlur={() => clearError("diameterInch")}
                placeholder="6"
                className={getSensorInputCls()}
              />
            </SensorFieldWrapper>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <SensorFieldWrapper label="Muka Air Tanah (cm)">
              <input
                type="number"
                step="0.01"
                value={form.staticWaterLevelCm}
                onChange={(e) => setField("staticWaterLevelCm", e.target.value)}
                onBlur={() => clearError("staticWaterLevelCm")}
                placeholder="250.50"
                className={getSensorInputCls()}
              />
            </SensorFieldWrapper>
            <SensorFieldWrapper label="Tren Muka Air">
              <select
                value={form.waterLevelTrend || "stable"}
                onChange={(e) => setField("waterLevelTrend", e.target.value)}
                onBlur={() => clearError("waterLevelTrend")}
                className={getSensorInputCls()}
              >
                <option value="rising">Naik</option>
                <option value="falling">Turun</option>
                <option value="stable">Stabil</option>
                <option value="unknown">Tidak Diketahui</option>
              </select>
            </SensorFieldWrapper>
          </div>

          <SensorFieldWrapper label="Tanggal Pengukuran (Opsional)">
            <input
              type="datetime-local"
              value={
                form.lastWaterLevelMeasurement
                  ? form.lastWaterLevelMeasurement.toString().slice(0, 16)
                  : ""
              }
              onChange={(e) =>
                setField("lastWaterLevelMeasurement", e.target.value)
              }
              onBlur={() => clearError("lastWaterLevelMeasurement")}
              className={getSensorInputCls()}
            />
          </SensorFieldWrapper>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={updateSensor.isPending}
              className="flex-1 py-2 bg-cyan-600 text-white text-[12px] font-semibold rounded-xl hover:bg-cyan-700 disabled:opacity-50 transition-colors"
            >
              {updateSensor.isPending ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 text-slate-600 text-[12px] rounded-xl hover:bg-slate-200"
            >
              Batal
            </button>
          </div>
          {updateSensor.isError && (
            <p className="text-[10px] text-red-500 font-mono">
              Gagal menyimpan. Coba lagi.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

function DetailModal({
  sensor,
  companyName,
  onClose,
  onDelete,
  businesses,
}: {
  sensor: Sensor;
  companyName: string;
  onClose: () => void;
  onDelete: (s: Sensor) => void;
  businesses: any[];
}) {
  const [showEdit, setShowEdit] = useState(false);
  const updateSensor = useUpdateSensor();
  const processWell = useProcessWell();
  const approveWell = useApproveWell();
  const rejectWell = useRejectWell();

  const handleToggleActive = () => {
    updateSensor.mutate(
      { id: sensor.id, payload: { isActive: !sensor.isActive } },
      { onSuccess: onClose },
    );
  };

  const handleProcess = () =>
    processWell.mutate(sensor.id, { onSuccess: onClose });

  const handleApprove = () =>
    approveWell.mutate(sensor.id, { onSuccess: onClose });

  const handleReject = () =>
    rejectWell.mutate({ id: sensor.id }, { onSuccess: onClose });

  const isPending =
    processWell.isPending || approveWell.isPending || rejectWell.isPending;

  return (
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center">
              <Radio size={18} className="text-cyan-600" />
            </div>
            <div>
              <p className="text-[15px] font-bold font-mono text-slate-800">
                {sensor.code}
              </p>
              <p className="text-[11px] text-slate-500">{sensor.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <WellStatusBadge status={sensor.wellStatus} />
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
            >
              <X size={14} className="text-slate-500" />
            </button>
          </div>
        </div>
        <div className="px-6 py-5 grid grid-cols-2 gap-4">
          {[
            ["Perusahaan", companyName],
            [
              "Koordinat",
              sensor.lat != null && sensor.lng != null
                ? `${sensor.lat.toFixed(4)}, ${sensor.lng.toFixed(4)}`
                : "Belum diatur",
            ],
            [
              "Muka Air Tanah",
              sensor.staticWaterLevel != null
                ? `${(sensor.staticWaterLevel * 100).toFixed(2)} cm`
                : "-",
            ],
            [
              "Tren Muka Air",
              sensor.waterLevelTrend
                ? getWaterLevelTrendLabel(sensor.waterLevelTrend)
                : "-",
            ],
            ["Terakhir Update", sensor.lastUpdate],
            [
              "Status Pengajuan",
              WELL_STATUS_CONFIG[sensor.wellStatus]?.label ?? sensor.wellStatus,
            ],
          ].map(([k, v]) => (
            <div key={k} className="bg-slate-50 rounded-xl px-3 py-2.5">
              <p className="text-[9px] text-slate-400 font-mono uppercase tracking-wider mb-1">
                {k}
              </p>
              <p className="text-[12px] font-semibold text-slate-800">{v}</p>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-slate-100 space-y-3">
          <div className="flex gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-[11px] font-mono rounded-lg border border-emerald-200">
              <CheckCircle2 size={12} /> Terverifikasi
            </span>
            <button
              onClick={() => setShowEdit(true)}
              className="px-4 py-2 bg-cyan-50 text-cyan-600 text-[12px] font-semibold rounded-xl hover:bg-cyan-100 transition-colors flex items-center gap-1.5"
            >
              <Edit2 size={12} /> Edit Data
            </button>
            <button
              onClick={() => onDelete(sensor)}
              className="px-3 py-2 bg-red-50 text-red-600 text-[12px] font-semibold rounded-xl hover:bg-red-100 transition-colors flex items-center gap-1.5"
            >
              <Trash2 size={12} /> Hapus
            </button>
          </div>
          <div className="flex gap-2">
            {sensor.isActive ? (
              <button
                onClick={handleToggleActive}
                className="flex-1 px-4 py-2 bg-red-50 text-red-600 text-[12px] font-semibold rounded-xl hover:bg-red-100 transition-colors"
              >
                Non-aktifkan Sumur
              </button>
            ) : (
              <button
                onClick={handleToggleActive}
                className="flex-1 px-4 py-2 bg-emerald-50 text-emerald-600 text-[12px] font-semibold rounded-xl hover:bg-emerald-100 transition-colors"
              >
                Aktifkan Sumur
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-50 text-slate-500 text-[12px] rounded-xl hover:bg-slate-100 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
        {showEdit && (
          <SensorEditModal
            sensor={sensor}
            onClose={() => setShowEdit(false)}
            businesses={businesses}
          />
        )}
      </div>
    </div>
  );
}

export default function SensorPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  // Only fetch approved wells for Data Sumur
  const { data: response, isLoading } = useSensors({ wellStatus: "approved" }, { page, limit });
  const { data: companiesResponse = { data: [] } } = useCompanies();
  const { data: businessesResponse = { data: [] } } = useBusinesses();

  const sensors = response?.data ?? [];
  const pagination = response?.pagination;
  const companies = companiesResponse.data ?? [];
  const businesses = businessesResponse.data ?? [];

  const deleteSensor = useDeleteSensor();

  const [search, setSearch] = useState("");
  const [typeF, setTypeF] = useState<"all" | "sumur_pantau" | "sumur_gali" | "sumur_bor">("all");
  const [sortKey, setSortKey] = useState<SortKey>("code");
  const [sortAsc, setSortAsc] = useState(true);
  const [detail, setDetail] = useState<Sensor | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Sensor | null>(null);

  const data = useMemo(() => {
    let d = [...sensors];
    if (typeF !== "all") d = d.filter((s) => s.wellType === typeF);
    if (search)
      d = d.filter(
        (s) =>
          s.code.toLowerCase().includes(search.toLowerCase()) ||
          s.location.toLowerCase().includes(search.toLowerCase()),
      );
    d.sort((a, b) => {
      const av: string | number = a[sortKey] as string | number;
      const bv: string | number = b[sortKey] as string | number;
      if (typeof av === "string")
        return sortAsc
          ? av.localeCompare(bv as string)
          : (bv as string).localeCompare(av);
      return sortAsc
        ? (av as number) - (bv as number)
        : (bv as number) - (av as number);
    });
    return d;
  }, [sensors, search, typeF, sortKey, sortAsc]);

  const sort = (k: SortKey) => {
    setSortKey(k);
    if (sortKey === k) setSortAsc((p) => !p);
    else setSortAsc(true);
  };

  const Th = ({ label, k }: { label: string; k: SortKey }) => (
    <th
      onClick={() => sort(k)}
      className="text-[9px] font-mono text-slate-400 uppercase tracking-wider px-4 py-3 text-left cursor-pointer hover:text-slate-600 whitespace-nowrap select-none"
    >
      <span className="flex items-center gap-1">
        {label}
        <ArrowUpDown
          size={9}
          className={sortKey === k ? "text-cyan-500" : "text-slate-300"}
        />
      </span>
    </th>
  );

  const summary = {
    total: pagination?.totalRecords ?? 0,
    pantau: sensors.filter((s) => s.wellType === "sumur_pantau").length,
    gali: sensors.filter((s) => s.wellType === "sumur_gali").length,
    bor: sensors.filter((s) => s.wellType === "sumur_bor").length,
  };

  const getCompanyName = (companyId: string) =>
    companies.find((c) => c.id === companyId)?.name ?? "-";

  return (
    <div className="p-3 sm:p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[18px] font-semibold text-slate-800">
            Kelola Data Sumur
          </h1>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
            Kelola dan pantau seluruh sumur terdaftar
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="px-4 py-2 bg-cyan-600 text-white text-[12px] font-semibold rounded-xl hover:bg-cyan-700 transition-colors flex items-center gap-2"
        >
          <Plus size={13} /> Tambah Sumur
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Sumur",  count: summary.total,  color: "#F59E0B", bg: "bg-amber-50",   border: "border-amber-200" },
          { label: "Sumur Pantau", count: summary.pantau, color: "#3B82F6", bg: "bg-blue-50",    border: "border-blue-200" },
          { label: "Sumur Gali",   count: summary.gali,   color: "#22C55E", bg: "bg-emerald-50", border: "border-emerald-200" },
          { label: "Sumur Bor",    count: summary.bor,    color: "#8B5CF6", bg: "bg-purple-50",  border: "border-purple-200" },
        ].map(({ label, count, color, bg, border }) => (
          <div
            key={label}
            className={cn("rounded-xl border px-4 py-3 flex items-center gap-3", bg, border)}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: color + "20" }}
            >
              <span className="text-[14px] font-bold font-mono" style={{ color }}>
                {count}
              </span>
            </div>
            <span className="text-[11px] font-medium text-slate-600">{label}</span>
          </div>
        ))}
      </div>

      {/* Table card */}
      <Card padding={false}>
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 flex-wrap">
          <div className="relative">
            <Search
              size={12}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari kode / lokasi..."
              className="pl-8 pr-3 py-1.5 text-[11px] font-mono border border-slate-200 rounded-lg bg-slate-50 text-slate-700 w-48 focus:outline-none focus:border-cyan-400"
            />
          </div>
          <div className="flex gap-1">
            {(["all", "sumur_pantau", "sumur_gali", "sumur_bor"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTypeF(t)}
                className={cn(
                  "text-[9px] font-mono px-2.5 py-1 rounded-full border transition-all",
                  typeF === t
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : "text-slate-400 border-transparent hover:bg-slate-50",
                )}
              >
                {t === "all" ? "Semua Tipe" : t === "sumur_pantau" ? "Sumur Pantau" : t === "sumur_gali" ? "Sumur Gali" : "Sumur Bor"}
              </button>
            ))}
          </div>
          <span className="ml-auto text-[10px] text-slate-400 font-mono">
            {data.length} sensor
          </span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-[11px] text-slate-400 font-mono">
            Memuat data sensor...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" style={{ minWidth: "640px" }}>
              <thead className="bg-slate-50/60 border-b border-slate-100">
                <tr>
                  <Th label="Nama Sumur" k="code" />
                  <Th label="Nama Business" k="location" />
                  <Th label="Nama Perusahaan" k="location" />
                  <th className="text-[9px] font-mono text-slate-400 uppercase tracking-wider px-4 py-3 text-left">
                    Tipe Sumur
                  </th>
                  <Th label="Tren Muka Air" k="staticWaterLevel" />
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {data.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-[12px] font-bold text-slate-800">
                      {s.code}
                    </td>
                    <td className="px-4 py-3 text-[11px] text-slate-600">
                      {s.businessName ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-[11px] text-slate-600">
                      {s.companyName}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="info">
                        {s.wellType === "sumur_pantau"
                          ? "Sumur Pantau"
                          : s.wellType === "sumur_gali"
                            ? "Sumur Gali"
                            : "Sumur Bor"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {s.waterLevelTrend === "rising" && (
                          <TrendingUp size={14} className="text-emerald-600" />
                        )}
                        {s.waterLevelTrend === "falling" && (
                          <TrendingDown size={14} className="text-amber-600" />
                        )}
                        {s.waterLevelTrend === "stable" && (
                          <Minus size={14} className="text-blue-600" />
                        )}
                        {(!s.waterLevelTrend ||
                          s.waterLevelTrend === "unknown") && (
                          <span className="text-slate-400 text-[12px]">-</span>
                        )}
                        <span className="text-[11px] font-mono text-slate-600">
                          {getWaterLevelTrendLabel(s.waterLevelTrend)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setDetail(s)}
                          className="text-[10px] font-mono text-cyan-600 hover:text-cyan-800 font-medium whitespace-nowrap"
                        >
                          Detail →
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination && (
          <Pagination
            pagination={pagination}
            onPageChange={setPage}
            onLimitChange={(newLimit) => {
              setLimit(newLimit);
              setPage(1);
            }}
            isLoading={isLoading}
          />
        )}
      </Card>

      {detail && (
        <DetailModal
          sensor={detail}
          companyName={getCompanyName(detail.companyId)}
          onClose={() => setDetail(null)}
          onDelete={setDeleteTarget}
          businesses={businesses}
        />
      )}

      {showCreate && (
        <CreateSensorModal
          onClose={() => setShowCreate(false)}
          businesses={businesses}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          sensor={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => {
            deleteSensor.mutate(deleteTarget.id, {
              onSuccess: () => setDeleteTarget(null),
            });
          }}
          isPending={deleteSensor.isPending}
        />
      )}
    </div>
  );
}
