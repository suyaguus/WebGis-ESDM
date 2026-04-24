import { useState, useMemo, useCallback, useEffect } from "react";
import {
  Search,
  Plus,
  ArrowUpDown,
  X,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { Card, SectionHeader, StatusPill, Badge } from "../../../components/ui";
import { useSensors, useBusinesses, useCreateSensor } from "../../../hooks";
import { useUpdateSensor, useDeleteSensor } from "../../../hooks/useSensors";
import { useAuthStore } from "../../../store";
import { cn } from "../../../lib/utils";
import {
  formatGroundwaterLevel,
  getWaterLevelTrendLabel,
  getWaterLevelTrendColor,
} from "../../../lib/groundwater";
import type { Sensor, SensorStatus, SensorType } from "@/types";
import type { CreateSensorRequest } from "@/types/api";

type SortKey =
  | "code"
  | "location"
  | "staticWaterLevel"
  | "status"
  | "lastUpdate";

/* ── Helper Functions for CreateSensorModal ── */
const getAdminSensorInputCls = (err?: string) =>
  cn(
    "w-full px-3 py-2 text-[12px] font-mono border rounded-lg bg-slate-50 text-slate-800 focus:outline-none focus:ring-1",
    err
      ? "border-red-300 focus:ring-red-300"
      : "border-slate-200 focus:ring-amber-400 focus:border-amber-400",
  );

const AdminSensorFieldWrapper = ({
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

function SensorDetailModal({
  sensor,
  onClose,
  businesses,
}: {
  sensor: Sensor;
  onClose: () => void;
  businesses: any[];
}) {
  const updateSensor = useUpdateSensor();
  const deleteSensor = useDeleteSensor();
  const [showEdit, setShowEdit] = useState(false);

  const handleToggleActive = async () => {
    updateSensor.mutate(
      {
        id: sensor.id,
        payload: { name: sensor.code, isActive: !sensor.isActive },
      },
      { onSuccess: onClose },
    );
  };

  const handleDelete = async () => {
    if (confirm("Apakah Anda yakin ingin menghapus sensor ini?")) {
      deleteSensor.mutate(sensor.id, { onSuccess: onClose });
    }
  };
  return (
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <p className="text-[15px] font-bold font-mono text-slate-800">
              {sensor.code}
            </p>
            <p className="text-[11px] text-slate-500">{sensor.location}</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusPill status={sensor.status} />
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200"
            >
              <X size={14} className="text-slate-500" />
            </button>
          </div>
        </div>
        <div className="px-6 py-5 grid grid-cols-2 gap-3">
          {[
            [
              "Tipe Sensor",
              sensor.type === "water" ? "Air Tanah (Groundwater)" : "GNSS",
            ],
            ["Koordinat", `${sensor.lat.toFixed(4)}, ${sensor.lng.toFixed(4)}`],
            [
              "Tren Muka Air",
              sensor.waterLevelTrend
                ? getWaterLevelTrendLabel(sensor.waterLevelTrend)
                : "-",
            ],
            [
              "Muka Air Tanah",
              sensor.staticWaterLevel !== null &&
              sensor.staticWaterLevel !== undefined
                ? `${(sensor.staticWaterLevel * 100).toFixed(2)} cm`
                : "-",
            ],
            [
              "Update Terakhir",
              sensor.lastWaterLevelMeasurement
                ? new Date(sensor.lastWaterLevelMeasurement).toLocaleString(
                    "id-ID",
                    {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  )
                : sensor.lastUpdate,
            ],
          ].map(([k, v]) => (
            <div key={k} className="bg-slate-50 rounded-xl px-3 py-2.5">
              <p className="text-[9px] text-slate-400 font-mono uppercase tracking-wider mb-1">
                {k}
              </p>
              <p
                className={cn(
                  "text-[12px] font-semibold",
                  k === "Subsidence"
                    ? getSubsidenceColor(sensor.subsidence)
                    : "text-slate-800",
                )}
              >
                {v}
              </p>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex gap-2">
          <button
            onClick={() => setShowEdit(true)}
            className="flex-1 px-4 py-2 bg-amber-500 text-white text-[12px] font-semibold rounded-xl hover:bg-amber-600 transition-colors"
          >
            Edit Data
          </button>
          <button
            onClick={handleToggleActive}
            disabled={updateSensor.isPending}
            className={cn(
              "px-4 py-2 text-[12px] font-semibold rounded-xl transition-colors",
              sensor.isActive
                ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                : "bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100",
            )}
          >
            {updateSensor.isPending
              ? "..."
              : sensor.isActive
                ? "Nonaktifkan"
                : "Aktifkan"}
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteSensor.isPending}
            className="px-4 py-2 bg-slate-100 text-slate-600 text-[12px] font-semibold rounded-xl hover:bg-slate-200 disabled:opacity-50"
          >
            {deleteSensor.isPending ? "..." : "Hapus"}
          </button>
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

interface CreateSensorModalProps {
  onClose: () => void;
  businesses: any[];
  createSensor: any;
}

function CreateSensorModal({
  onClose,
  businesses,
  createSensor,
}: CreateSensorModalProps) {
  const [form, setForm] = useState<CreateSensorRequest>({
    name: "",
    businessId: "",
    latitude: undefined,
    longitude: undefined,
    locationDescription: "",
    wellType: "perusahaan",
    depthMeter: undefined,
    diameterInch: undefined,
    pumpCapacity: undefined,
    staticWaterLevelCm: undefined,
    waterLevelTrend: "stable",
    lastWaterLevelMeasurement: undefined,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form ketika modal dibuka
  useEffect(() => {
    setForm({
      name: "",
      businessId: "",
      latitude: undefined,
      longitude: undefined,
      locationDescription: "",
      wellType: "perusahaan",
      depthMeter: undefined,
      diameterInch: undefined,
      pumpCapacity: undefined,
      staticWaterLevelCm: undefined,
      waterLevelTrend: "stable",
      lastWaterLevelMeasurement: undefined,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    createSensor.mutate(form, { onSuccess: onClose });
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
          <AdminSensorFieldWrapper label="Nama Sumur" error={errors.name}>
            <input
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              onBlur={() => clearError("name")}
              placeholder="Sumur A-01"
              className={getAdminSensorInputCls(errors.name)}
            />
          </AdminSensorFieldWrapper>

          <AdminSensorFieldWrapper
            label="Unit Bisnis"
            error={errors.businessId}
          >
            <select
              value={form.businessId}
              onChange={(e) => setField("businessId", e.target.value)}
              onBlur={() => clearError("businessId")}
              className={getAdminSensorInputCls(errors.businessId)}
            >
              <option value="">Pilih unit bisnis</option>
              {businesses.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </AdminSensorFieldWrapper>

          <div className="grid grid-cols-2 gap-3">
            <AdminSensorFieldWrapper label="Latitude" error={errors.latitude}>
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
                className={getAdminSensorInputCls(errors.latitude)}
              />
            </AdminSensorFieldWrapper>
            <AdminSensorFieldWrapper label="Longitude" error={errors.longitude}>
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
                className={getAdminSensorInputCls(errors.longitude)}
              />
            </AdminSensorFieldWrapper>
          </div>

          <AdminSensorFieldWrapper label="Deskripsi Lokasi">
            <input
              value={form.locationDescription ?? ""}
              onChange={(e) => setField("locationDescription", e.target.value)}
              onBlur={() => clearError("locationDescription")}
              placeholder="Jl. Sudirman No. 1, Bandung"
              className={getAdminSensorInputCls()}
            />
          </AdminSensorFieldWrapper>

          <AdminSensorFieldWrapper label="Tipe Sumur">
            <select
              value={form.wellType}
              onChange={(e) => setField("wellType", e.target.value)}
              onBlur={() => clearError("wellType")}
              className={getAdminSensorInputCls()}
            >
              <option value="perusahaan">Perusahaan</option>
              <option value="non_perusahaan">Non Perusahaan</option>
              <option value="rumah_tangga">Rumah Tangga</option>
            </select>
          </AdminSensorFieldWrapper>

          <div className="grid grid-cols-2 gap-3">
            <AdminSensorFieldWrapper label="Kedalaman (m)">
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
                className={getAdminSensorInputCls()}
              />
            </AdminSensorFieldWrapper>
            <AdminSensorFieldWrapper label="Diameter (inch)">
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
                className={getAdminSensorInputCls()}
              />
            </AdminSensorFieldWrapper>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <AdminSensorFieldWrapper label="Kapasitas Pompa">
              <input
                type="number"
                step="any"
                value={form.pumpCapacity ?? ""}
                onChange={(e) =>
                  setField(
                    "pumpCapacity",
                    e.target.value ? parseFloat(e.target.value) : undefined,
                  )
                }
                onBlur={() => clearError("pumpCapacity")}
                placeholder="100"
                className={getAdminSensorInputCls()}
              />
            </AdminSensorFieldWrapper>
            <AdminSensorFieldWrapper label="Muka Air Tanah (cm)">
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
                className={getAdminSensorInputCls()}
              />
            </AdminSensorFieldWrapper>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <AdminSensorFieldWrapper label="Tren Muka Air">
              <select
                value={form.waterLevelTrend ?? "stable"}
                onChange={(e) => setField("waterLevelTrend", e.target.value)}
                onBlur={() => clearError("waterLevelTrend")}
                className={getAdminSensorInputCls()}
              >
                <option value="rising">Naik</option>
                <option value="falling">Turun</option>
                <option value="stable">Stabil</option>
                <option value="unknown">Tidak Diketahui</option>
              </select>
            </AdminSensorFieldWrapper>
            <AdminSensorFieldWrapper label="Tanggal Pengukuran (Opsional)">
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
                    e.target.value || undefined,
                  )
                }
                onBlur={() => clearError("lastWaterLevelMeasurement")}
                className={getAdminSensorInputCls()}
              />
            </AdminSensorFieldWrapper>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              disabled={createSensor.isPending}
              className="flex-1 px-4 py-2 bg-amber-600 text-white text-[12px] font-semibold rounded-xl hover:bg-amber-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
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

interface SensorEditModalProps {
  sensor: Sensor;
  onClose: () => void;
  businesses: any[];
}

function SensorEditModal({
  sensor,
  onClose,
  businesses,
}: SensorEditModalProps) {
  const updateSensor = useUpdateSensor();
  const [form, setForm] = useState({
    name: sensor.code,
    latitude: sensor.lat?.toString() ?? "",
    longitude: sensor.lng?.toString() ?? "",
    locationDescription: sensor.location || "",
    wellType: "perusahaan" as const,
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
      latitude: sensor.lat?.toString() ?? "",
      longitude: sensor.lng?.toString() ?? "",
      locationDescription: sensor.location || "",
      wellType: "perusahaan" as const,
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
      lastWaterLevelMeasurement: form.lastWaterLevelMeasurement || undefined,
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
              Edit Data Sumur
            </p>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
              Perbarui informasi sumur
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
          <AdminSensorFieldWrapper label="Nama Sumur" error={errors.name}>
            <input
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              onBlur={() => clearError("name")}
              placeholder="Sumur A-01"
              className={getAdminSensorInputCls(errors.name)}
            />
          </AdminSensorFieldWrapper>

          <div className="grid grid-cols-2 gap-3">
            <AdminSensorFieldWrapper label="Latitude" error={errors.latitude}>
              <input
                type="number"
                step="any"
                value={form.latitude}
                onChange={(e) => setField("latitude", e.target.value)}
                onBlur={() => clearError("latitude")}
                placeholder="-6.2088"
                className={getAdminSensorInputCls(errors.latitude)}
              />
            </AdminSensorFieldWrapper>
            <AdminSensorFieldWrapper label="Longitude" error={errors.longitude}>
              <input
                type="number"
                step="any"
                value={form.longitude}
                onChange={(e) => setField("longitude", e.target.value)}
                onBlur={() => clearError("longitude")}
                placeholder="106.8456"
                className={getAdminSensorInputCls(errors.longitude)}
              />
            </AdminSensorFieldWrapper>
          </div>

          <AdminSensorFieldWrapper label="Deskripsi Lokasi">
            <input
              value={form.locationDescription}
              onChange={(e) => setField("locationDescription", e.target.value)}
              onBlur={() => clearError("locationDescription")}
              placeholder="Jl. Sudirman No. 1, Bandung"
              className={getAdminSensorInputCls()}
            />
          </AdminSensorFieldWrapper>

          <AdminSensorFieldWrapper label="Tipe Sumur">
            <select
              value={form.wellType}
              onChange={(e) => setField("wellType", e.target.value)}
              onBlur={() => clearError("wellType")}
              className={getAdminSensorInputCls()}
            >
              <option value="perusahaan">Perusahaan</option>
              <option value="non_perusahaan">Non Perusahaan</option>
              <option value="rumah_tangga">Rumah Tangga</option>
            </select>
          </AdminSensorFieldWrapper>

          <div className="grid grid-cols-2 gap-3">
            <AdminSensorFieldWrapper label="Kedalaman (m)">
              <input
                type="number"
                step="any"
                value={form.depthMeter}
                onChange={(e) => setField("depthMeter", e.target.value)}
                onBlur={() => clearError("depthMeter")}
                placeholder="50"
                className={getAdminSensorInputCls()}
              />
            </AdminSensorFieldWrapper>
            <AdminSensorFieldWrapper label="Diameter (inch)">
              <input
                type="number"
                step="any"
                value={form.diameterInch}
                onChange={(e) => setField("diameterInch", e.target.value)}
                onBlur={() => clearError("diameterInch")}
                placeholder="6"
                className={getAdminSensorInputCls()}
              />
            </AdminSensorFieldWrapper>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <AdminSensorFieldWrapper label="Kapasitas Pompa">
              <input
                type="number"
                step="any"
                value={form.pumpCapacity}
                onChange={(e) => setField("pumpCapacity", e.target.value)}
                onBlur={() => clearError("pumpCapacity")}
                placeholder="100"
                className={getAdminSensorInputCls()}
              />
            </AdminSensorFieldWrapper>
            <AdminSensorFieldWrapper label="Muka Air Tanah (cm)">
              <input
                type="number"
                step="0.01"
                value={form.staticWaterLevelCm}
                onChange={(e) => setField("staticWaterLevelCm", e.target.value)}
                onBlur={() => clearError("staticWaterLevelCm")}
                placeholder="250.50"
                className={getAdminSensorInputCls()}
              />
            </AdminSensorFieldWrapper>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <AdminSensorFieldWrapper label="Tren Muka Air">
              <select
                value={form.waterLevelTrend || "stable"}
                onChange={(e) => setField("waterLevelTrend", e.target.value)}
                onBlur={() => clearError("waterLevelTrend")}
                className={getAdminSensorInputCls()}
              >
                <option value="rising">Naik</option>
                <option value="falling">Turun</option>
                <option value="stable">Stabil</option>
                <option value="unknown">Tidak Diketahui</option>
              </select>
            </AdminSensorFieldWrapper>
            <AdminSensorFieldWrapper label="Tanggal Pengukuran (Opsional)">
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
                    e.target.value || undefined,
                  )
                }
                onBlur={() => clearError("lastWaterLevelMeasurement")}
                className={getAdminSensorInputCls()}
              />
            </AdminSensorFieldWrapper>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={updateSensor.isPending}
              className="flex-1 py-2 bg-amber-600 text-white text-[12px] font-semibold rounded-xl hover:bg-amber-700 disabled:opacity-50 transition-colors"
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
              Gagal memperbarui sumur. Coba lagi.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default function AdminSumurPage() {
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState<SensorStatus | "all">("all");
  const [typeF, setTypeF] = useState<SensorType | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("code");
  const [sortAsc, setSortAsc] = useState(true);
  const [detail, setDetail] = useState<Sensor | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  // Get current user and their company
  const { user } = useAuthStore();
  const userCompanyId = user?.companyId ?? "";

  // Fetch sensors and businesses for current user's company
  const { data: sensorsResponse = { data: [] }, isLoading } = useSensors({
    companyId: userCompanyId || undefined,
  });
  const COMPANY_SENSORS = sensorsResponse.data ?? [];

  const { data: businessesResponse = { data: [] } } = useBusinesses();
  const allBusinesses = businessesResponse.data ?? [];
  const userBusinesses = allBusinesses.filter(
    (b) => b.companyId === userCompanyId,
  );

  const createSensor = useCreateSensor();
  const data = useMemo(() => {
    let d = [...COMPANY_SENSORS];
    // Filter out inactive sensors (disabled sensors not shown by default)
    d = d.filter((s) => s.isActive !== false);
    if (statusF !== "all") d = d.filter((s) => s.status === statusF);
    if (typeF !== "all") d = d.filter((s) => s.type === typeF);
    if (search)
      d = d.filter(
        (s) =>
          s.code.toLowerCase().includes(search.toLowerCase()) ||
          s.location.toLowerCase().includes(search.toLowerCase()),
      );
    d.sort((a, b) => {
      const av = a[sortKey] as string | number,
        bv = b[sortKey] as string | number;
      if (typeof av === "string")
        return sortAsc
          ? av.localeCompare(bv as string)
          : (bv as string).localeCompare(av);
      return sortAsc
        ? (av as number) - (bv as number)
        : (bv as number) - (av as number);
    });
    return d;
  }, [search, statusF, typeF, sortKey, sortAsc]);

  const Th = ({ label, k }: { label: string; k: SortKey }) => (
    <th
      onClick={() => {
        setSortKey(k);
        if (sortKey === k) setSortAsc((p) => !p);
        else setSortAsc(true);
      }}
      className="text-[9px] font-mono text-slate-400 uppercase tracking-wider px-4 py-3 text-left cursor-pointer hover:text-slate-600 whitespace-nowrap select-none"
    >
      <span className="flex items-center gap-1">
        {label}
        <ArrowUpDown
          size={9}
          className={sortKey === k ? "text-amber-500" : "text-slate-300"}
        />
      </span>
    </th>
  );

  return (
    <div className="p-3 md:p-5 space-y-3 md:space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[18px] font-semibold text-slate-800">
            Daftar Sumur
          </h1>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
            Kelola semua sumur dan sensor perusahaan Anda
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="px-3 md:px-4 py-2 bg-amber-500 text-white text-[12px] font-semibold rounded-xl hover:bg-amber-600 transition-colors flex items-center gap-2 whitespace-nowrap"
        >
          <Plus size={13} />
          <span className="hidden sm:block">Tambah Sensor</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-[11px] text-slate-400 font-mono">
          Memuat data sumur...
        </div>
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                label: "Total Sensor",
                value: COMPANY_SENSORS.length,
                color: "#F59E0B",
                bg: "bg-amber-50  border-amber-200",
              },
              {
                label: "Online",
                value: COMPANY_SENSORS.filter((s) => s.status === "online")
                  .length,
                color: "#22C55E",
                bg: "bg-emerald-50 border-emerald-200",
              },
              {
                label: "Alert / Kritis",
                value: COMPANY_SENSORS.filter((s) => s.status === "alert")
                  .length,
                color: "#EF4444",
                bg: "bg-red-50     border-red-200",
              },
              {
                label: "Maintenance",
                value: COMPANY_SENSORS.filter((s) => s.status === "maintenance")
                  .length,
                color: "#8B5CF6",
                bg: "bg-purple-50  border-purple-200",
              },
            ].map(({ label, value, color, bg }) => (
              <div
                key={label}
                className={cn("rounded-xl border px-4 py-3", bg)}
              >
                <p className="text-[9px] font-mono text-slate-400 uppercase mb-1">
                  {label}
                </p>
                <p
                  className="text-[18px] md:text-[22px] font-bold font-mono"
                  style={{ color }}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Table */}
          <Card padding={false}>
            <div className="flex flex-wrap items-center gap-2 px-3 md:px-4 py-3 border-b border-slate-100">
              <div className="relative">
                <Search
                  size={12}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari kode / lokasi..."
                  className="pl-8 pr-3 py-1.5 text-[11px] font-mono border border-slate-200 rounded-lg bg-slate-50 text-slate-700 w-full sm:w-48 focus:outline-none focus:border-amber-400"
                />
              </div>
              <div className="flex gap-1">
                {(
                  ["all", "online", "alert", "maintenance", "offline"] as const
                ).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusF(s)}
                    className={cn(
                      "text-[9px] font-mono px-2.5 py-1 rounded-full border transition-all",
                      statusF === s
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "text-slate-400 border-transparent hover:bg-slate-50",
                    )}
                  >
                    {s === "all"
                      ? "Semua"
                      : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
              <div className="flex gap-1">
                {(["all", "water", "gnss"] as const).map((t) => (
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
                    {t === "all"
                      ? "Semua Tipe"
                      : t === "water"
                        ? "Air Tanah"
                        : "GNSS"}
                  </button>
                ))}
              </div>
              <span className="ml-auto text-[10px] text-slate-400 font-mono">
                {data.length} sensor
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full" style={{ minWidth: "620px" }}>
                <thead className="bg-slate-50/60 border-b border-slate-100">
                  <tr>
                    <Th label="Kode" k="code" />
                    <Th label="Lokasi" k="location" />
                    <th className="text-[9px] font-mono text-slate-400 uppercase tracking-wider px-4 py-3 text-left">
                      Tipe
                    </th>
                    <Th label="Tren Muka Air" k="staticWaterLevel" />
                    <th className="text-[9px] font-mono text-slate-400 uppercase tracking-wider px-4 py-3 text-left">
                      Muka Air Tanah (cm)
                    </th>
                    <Th label="Status" k="status" />
                    <Th label="Update" k="lastUpdate" />
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {data.map((s) => (
                    <tr
                      key={s.id}
                      className={cn(
                        "hover:bg-slate-50/60 transition-colors",
                        s.status === "alert" && "bg-red-50/20",
                      )}
                    >
                      <td className="px-4 py-3 font-mono text-[12px] font-bold text-slate-800">
                        {s.code}
                      </td>
                      <td className="px-4 py-3 text-[11px] text-slate-600">
                        {s.location}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={s.type === "water" ? "info" : "neutral"}
                        >
                          {s.type === "water" ? "Air Tanah" : "GNSS"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {s.waterLevelTrend === "rising" && (
                            <TrendingUp
                              size={14}
                              className="text-emerald-600"
                            />
                          )}
                          {s.waterLevelTrend === "falling" && (
                            <TrendingDown
                              size={14}
                              className="text-amber-600"
                            />
                          )}
                          {s.waterLevelTrend === "stable" && (
                            <Minus size={14} className="text-blue-600" />
                          )}
                          {(!s.waterLevelTrend ||
                            s.waterLevelTrend === "unknown") && (
                            <span className="text-slate-400 text-[12px]">
                              -
                            </span>
                          )}
                          <span className="text-[11px] font-mono text-slate-600">
                            {getWaterLevelTrendLabel(s.waterLevelTrend)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[11px] font-mono text-slate-600">
                        {s.staticWaterLevel !== null &&
                        s.staticWaterLevel !== undefined
                          ? `${(s.staticWaterLevel * 100).toFixed(2)} cm`
                          : "-"}
                      </td>
                      <td className="px-4 py-3">
                        <StatusPill status={s.status} />
                      </td>
                      <td className="px-4 py-3 text-[10px] text-slate-400 font-mono">
                        {s.lastWaterLevelMeasurement
                          ? new Date(
                              s.lastWaterLevelMeasurement,
                            ).toLocaleString("id-ID", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : s.lastUpdate}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setDetail(s)}
                          className="text-[10px] font-mono text-amber-600 hover:text-amber-800 font-medium"
                        >
                          Detail →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {detail && (
            <SensorDetailModal
              sensor={detail}
              onClose={() => setDetail(null)}
              businesses={userBusinesses}
            />
          )}

          {showAdd && (
            <CreateSensorModal
              onClose={() => setShowAdd(false)}
              businesses={userBusinesses}
              createSensor={createSensor}
            />
          )}
        </>
      )}
    </div>
  );
}
