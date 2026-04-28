import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Radio,
  AlertTriangle,
  CheckCircle2,
  Droplets,
  ClipboardEdit,
  Clock,
  AlertCircle,
  X,
  Plus,
  Send,
} from "lucide-react";
import { Card, SectionHeader } from "../../../components/ui";
import { cn } from "../../../lib/utils";
import { sensorService } from "../../../services/sensor.service";
import { useAppStore, useAuthStore } from "../../../store";
import { useBusinesses } from "../../../hooks";
import type { Sensor } from "../../../types";
import type { CreateSensorRequest } from "../../../types/api";

/* ── Helper Styles ── */
const getInputCls = (err?: string) =>
  cn(
    "w-full px-3 py-2 text-[12px] font-mono border rounded-lg bg-slate-50 text-slate-800 focus:outline-none focus:ring-1",
    err
      ? "border-red-300 focus:ring-red-300"
      : "border-slate-200 focus:ring-blue-400 focus:border-blue-400",
  );

const FieldWrapper = ({
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

interface CreateWellModalProps {
  onClose: () => void;
}

function CreateWellModal({ onClose }: CreateWellModalProps) {
  const queryClient = useQueryClient();
  const { data: businessesData } = useBusinesses();
  const businesses = businessesData || [];

  const [form, setForm] = useState<Partial<CreateSensorRequest>>({
    name: "",
    businessId: "",
    wellType: "sumur_pantau",
    latitude: undefined,
    longitude: undefined,
    locationDescription: undefined,
    depthMeter: undefined,
    diameterInch: undefined,
    staticWaterLevelCm: undefined,
    waterLevelTrend: "stable",
    isActive: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    if (!form.name?.trim()) e.name = "Nama sumur wajib diisi";
    if (!form.businessId) e.businessId = "Unit bisnis wajib dipilih";
    if (!form.latitude) e.latitude = "Latitude wajib diisi";
    if (!form.longitude) e.longitude = "Longitude wajib diisi";
    return e;
  };

  const createMutation = useMutation({
    mutationFn: (payload: Partial<CreateSensorRequest>) =>
      sensorService.create(payload as CreateSensorRequest),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supervisorWells"] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    createMutation.mutate(form);
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
              Data akan dikirim untuk persetujuan Super Admin
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
          <FieldWrapper label="Nama Sumur" error={errors.name}>
            <input
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              onBlur={() => clearError("name")}
              placeholder="Sumur A-01"
              className={getInputCls(errors.name)}
            />
          </FieldWrapper>

          <FieldWrapper label="Unit Bisnis" error={errors.businessId}>
            <select
              value={form.businessId || ""}
              onChange={(e) => setField("businessId", e.target.value)}
              onBlur={() => clearError("businessId")}
              className={getInputCls(errors.businessId)}
            >
              <option value="">Pilih unit bisnis</option>
              {businesses.map((b: any) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.company?.name || "N/A"})
                </option>
              ))}
            </select>
          </FieldWrapper>

          <div className="grid grid-cols-2 gap-3">
            <FieldWrapper label="Latitude" error={errors.latitude}>
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
                className={getInputCls(errors.latitude)}
              />
            </FieldWrapper>
            <FieldWrapper label="Longitude" error={errors.longitude}>
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
                className={getInputCls(errors.longitude)}
              />
            </FieldWrapper>
          </div>

          <FieldWrapper label="Deskripsi Lokasi">
            <input
              value={form.locationDescription ?? ""}
              onChange={(e) => setField("locationDescription", e.target.value)}
              onBlur={() => clearError("locationDescription")}
              placeholder="Jl. Sudirman No. 1, Bandung"
              className={getInputCls()}
            />
          </FieldWrapper>

          <FieldWrapper label="Tipe Sumur">
            <select
              value={form.wellType}
              onChange={(e) => setField("wellType", e.target.value)}
              className={getInputCls()}
            >
              <option value="sumur_pantau">Sumur Pantau</option>
              <option value="sumur_gali">Sumur Gali</option>
              <option value="sumur_bor">Sumur Bor</option>
            </select>
          </FieldWrapper>

          <div className="grid grid-cols-2 gap-3">
            <FieldWrapper label="Kedalaman (m)">
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
                placeholder="50"
                className={getInputCls()}
              />
            </FieldWrapper>
            <FieldWrapper label="Diameter (inch)">
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
                placeholder="6"
                className={getInputCls()}
              />
            </FieldWrapper>
          </div>

          <FieldWrapper label="Kedalaman Muka Air Tanah (cm)">
            <input
              type="number"
              step="any"
              value={form.staticWaterLevelCm ?? ""}
              onChange={(e) =>
                setField(
                  "staticWaterLevelCm",
                  e.target.value ? parseFloat(e.target.value) : undefined,
                )
              }
              placeholder="250"
              className={getInputCls()}
            />
          </FieldWrapper>

          <FieldWrapper label="Tren Muka Air">
            <select
              value={form.waterLevelTrend ?? "stable"}
              onChange={(e) => setField("waterLevelTrend", e.target.value)}
              className={getInputCls()}
            >
              <option value="stable">Stabil</option>
              <option value="rising">Naik</option>
              <option value="falling">Turun</option>
              <option value="unknown">Tidak Diketahui</option>
            </select>
          </FieldWrapper>
        </form>

        <div className="px-6 py-4 border-t border-slate-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-600 text-[12px] font-semibold rounded-lg hover:bg-slate-200 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={createMutation.isPending}
            className="flex-1 px-4 py-2.5 bg-blue-600 text-white text-[12px] font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {createMutation.isPending ? "Mengirim..." : "Buat Sumur"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SensorDetailPanel({
  sensor,
  onInput,
  onReviewed,
  onFlagged,
  isFlagging,
}: {
  sensor: Sensor;
  onInput: () => void;
  onReviewed: (id: string) => void;
  onFlagged: (id: string, note: string) => void;
  isFlagging: boolean;
}) {
  const [showFlagForm, setShowFlagForm] = useState(false);
  const [flagNote, setFlagNote] = useState("");

  const wellTypeLabel =
    sensor.wellType === "sumur_pantau"
      ? "Sumur Pantau"
      : sensor.wellType === "sumur_gali"
        ? "Sumur Gali"
        : "Sumur Bor";

  const handleSubmitFlag = () => {
    if (!flagNote.trim()) return;
    onFlagged(sensor.id, flagNote.trim());
    setShowFlagForm(false);
    setFlagNote("");
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
        <div className="mb-3">
          <h3 className="text-[18px] font-bold font-mono text-slate-800">
            {sensor.code}
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">{sensor.location}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          {[
            ["Tipe Sumur", wellTypeLabel],
            ["Perusahaan", sensor.companyName],
            ["Unit Bisnis", sensor.businessName || "-"],
            ["Update Terakhir", sensor.lastUpdate],
          ].map(([k, v]) => (
            <div key={k}>
              <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">
                {k}
              </p>
              <p className="text-[12px] font-semibold text-slate-800 truncate">
                {v}
              </p>
            </div>
          ))}
        </div>

        <span className="inline-flex items-center gap-1 text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
          <Clock size={9} /> Sedang Ditinjau
        </span>
      </div>

      {/* Lokasi */}
      {(sensor.lat || sensor.lng) && (
        <Card>
          <p className="text-[11px] font-semibold text-slate-700 mb-2">
            Koordinat
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[9px] font-mono text-slate-400">Latitude</p>
              <p className="text-[12px] font-semibold text-slate-800">
                {sensor.lat?.toFixed(6) || "-"}
              </p>
            </div>
            <div>
              <p className="text-[9px] font-mono text-slate-400">Longitude</p>
              <p className="text-[12px] font-semibold text-slate-800">
                {sensor.lng?.toFixed(6) || "-"}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Muka Air Tanah */}
      {sensor.staticWaterLevel !== null && (
        <Card>
          <p className="text-[11px] font-semibold text-slate-700 mb-2">
            Kedalaman Muka Air Tanah
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[9px] font-mono text-slate-400">
                Kedalaman (m)
              </p>
              <p className="text-[14px] font-bold font-mono text-blue-700">
                {sensor.staticWaterLevel?.toFixed(2)} m
              </p>
            </div>
            <div>
              <p className="text-[9px] font-mono text-slate-400">Tren</p>
              <p className="text-[12px] font-semibold text-slate-800">
                {sensor.waterLevelTrend || "-"}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Flag form */}
      {showFlagForm && (
        <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle size={14} className="text-orange-500" />
            <p className="text-[12px] font-semibold text-orange-700">
              Laporkan Ketidaksesuaian Data
            </p>
          </div>
          <textarea
            value={flagNote}
            onChange={(e) => setFlagNote(e.target.value)}
            placeholder="Jelaskan ketidaksesuaian data yang ditemukan..."
            rows={3}
            className="w-full px-3 py-2 text-[12px] font-mono border border-orange-200 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-400 resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={() => { setShowFlagForm(false); setFlagNote(""); }}
              className="flex-1 py-2 text-[12px] font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleSubmitFlag}
              disabled={!flagNote.trim() || isFlagging}
              className="flex-1 flex items-center justify-center gap-2 py-2 text-[12px] font-semibold text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-50 rounded-lg transition-colors"
            >
              <Send size={12} /> {isFlagging ? "Mengirim..." : "Kirim Laporan"}
            </button>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onReviewed(sensor.id)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 text-[12px] font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-all shadow-sm"
        >
          <CheckCircle2 size={14} /> Sudah Ditinjau
        </button>
        <button
          onClick={() => setShowFlagForm((v) => !v)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 text-[12px] font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-xl transition-all border border-orange-200"
        >
          <AlertTriangle size={14} /> Laporkan
        </button>
        <button
          onClick={onInput}
          className="flex items-center justify-center gap-2 px-4 py-2.5 text-[12px] font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all border border-blue-200"
        >
          <ClipboardEdit size={14} />
        </button>
      </div>
    </div>
  );
}

export default function SensorSayaPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const { setActivePage } = useAppStore();
  const { user } = useAuthStore();
  const qc = useQueryClient();

  // Fetch wells assigned for review (pending_approval only)
  const {
    data: wellsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["supervisorWells", page],
    queryFn: () => sensorService.getSupervisorWells(page, 10),
  });

  const reviewMutation = useMutation({
    mutationFn: (id: string) => sensorService.review(id),
    onSuccess: () => {
      setSelectedId(null);
      qc.invalidateQueries({ queryKey: ["supervisorWells"] });
    },
  });

  const flagMutation = useMutation({
    mutationFn: ({ id, note }: { id: string; note: string }) =>
      sensorService.flag(id, note),
    onSuccess: () => {
      setSelectedId(null);
      qc.invalidateQueries({ queryKey: ["supervisorWells"] });
    },
  });

  const wells = wellsData?.data ?? [];
  const pagination = wellsData?.pagination;
  const selected = wells.find((s) => s.id === selectedId);

  const totalWells = pagination?.totalRecords ?? 0;

  return (
    <div className="p-3 md:p-5 space-y-3 md:space-y-4 w-full">
      {/* Header */}
      <div>
        <h1 className="text-[18px] font-semibold text-slate-800">
          Tinjauan Data Sumur
        </h1>
        <p className="text-[11px] text-slate-400 font-mono mt-0.5">
          {totalWells} sumur menunggu tinjauan · {user?.name || "Supervisor"}
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="inline-block animate-spin">
            <Radio className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-gray-600 mt-4">Memuat data sumur...</p>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="bg-white rounded-lg shadow-md p-8 border-l-4 border-red-500">
          <div className="flex gap-4">
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900">Terjadi Kesalahan</h3>
              <p className="text-gray-600 text-sm mt-1">
                {error instanceof Error ? error.message : "Gagal memuat data"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats row */}
      {!isLoading && (
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Menunggu Tinjauan", value: totalWells, color: "#3B82F6" },
            { label: "Halaman Ini", value: wells.length, color: "#8B5CF6" },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="bg-white rounded-xl border border-slate-100 shadow-sm px-4 py-3 relative overflow-hidden"
            >
              <div
                className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl"
                style={{ background: color }}
              />
              <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                {label}
              </p>
              <p className="text-[22px] font-bold font-mono" style={{ color }}>
                {value}
              </p>
            </div>
          ))}
        </div>
      )}

      {!isLoading && wells.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
          {/* Well list */}
          <Card padding={false} className="flex flex-col">
            <SectionHeader
              title="Daftar Sumur"
              icon={<Radio size={13} />}
              accent="#3B82F6"
              subtitle={`${wells.length} dari ${totalWells}`}
            />
            <div className="divide-y divide-slate-50 overflow-y-auto max-h-[600px]">
              {wells.map((sensor) => {
                const isSelected = selectedId === sensor.id;
                const wellTypeIcon =
                  sensor.wellType === "sumur_pantau"
                    ? "🔍"
                    : sensor.wellType === "sumur_gali"
                      ? "⛏️"
                      : "🪛";

                return (
                  <button
                    key={sensor.id}
                    onClick={() => setSelectedId(isSelected ? null : sensor.id)}
                    className={cn(
                      "w-full text-left px-4 py-3 transition-all",
                      isSelected
                        ? "bg-blue-50 border-r-2 border-blue-500"
                        : "hover:bg-slate-50/60",
                      sensor.wellStatus === "pending_approval" &&
                        !isSelected &&
                        "border-l-2 border-l-orange-400",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-lg",
                          sensor.wellStatus === "pending_approval"
                            ? "bg-orange-100"
                            : isSelected
                              ? "bg-blue-100"
                              : "bg-slate-100",
                        )}
                      >
                        {wellTypeIcon}
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
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] font-mono text-slate-500">
                        {sensor.isActive ? "🟢 Aktif" : "⚫ Non-aktif"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Detail panel */}
          <div>
            {selected ? (
              <SensorDetailPanel
                sensor={selected}
                onInput={() => setActivePage("sv-input")}
                onReviewed={(id) => reviewMutation.mutate(id)}
                onFlagged={(id, note) => flagMutation.mutate({ id, note })}
                isFlagging={flagMutation.isPending}
              />
            ) : (
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center py-16 px-6 text-center h-full min-h-[300px]">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center mb-4 text-2xl">
                  📋
                </div>
                <p className="text-[13px] font-semibold text-slate-700 mb-2">
                  Pilih Sumur
                </p>
                <p className="text-[11px] text-slate-400 font-mono max-w-xs leading-relaxed">
                  Klik salah satu sumur di kiri untuk melihat detail dan
                  informasi lengkap
                </p>
                <button
                  onClick={() => setActivePage("sv-input")}
                  className="mt-4 flex items-center gap-2 text-[11px] font-mono text-blue-600 bg-blue-50 border border-blue-200 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <ClipboardEdit size={13} /> Input Pengukuran Baru
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && wells.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={28} className="text-blue-400" />
          </div>
          <p className="text-[14px] font-semibold text-slate-700 mb-1">
            Tidak Ada Sumur yang Perlu Ditinjau
          </p>
          <p className="text-[11px] text-slate-400 font-mono">
            Semua data sumur sudah selesai ditinjau
          </p>
        </div>
      )}

      {/* Pagination */}
      {pagination && !isLoading && wells.length > 0 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={!pagination.hasPrevPage}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Sebelumnya
          </button>
          <span className="px-4 py-2 text-gray-600">
            Halaman {pagination.currentPage} dari {pagination.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!pagination.hasNextPage}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Selanjutnya
          </button>
        </div>
      )}

    </div>
  );
}
