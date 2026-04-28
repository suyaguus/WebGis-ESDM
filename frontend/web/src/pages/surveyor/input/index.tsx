import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ClipboardEdit,
  Radio,
  CheckCircle2,
  Camera,
  Upload,
  AlertTriangle,
  Droplets,
  Gauge,
  Waves,
  ChevronDown,
  X,
} from "lucide-react";
import { Card, SectionHeader } from "../../../components/ui";
import { cn } from "../../../lib/utils";
import { sensorService } from "../../../services/sensor.service";
import { useSubmitMeasurement } from "../../../hooks";
import type { Sensor } from "../../../types";

type KondisiFisik = "baik" | "rusak_ringan" | "rusak_berat";
type SubmitState = "idle" | "submitting" | "success" | "error";

const KONDISI_OPTIONS: { value: KondisiFisik; label: string; color: string }[] =
  [
    {
      value: "baik",
      label: "Baik",
      color: "border-emerald-300 bg-emerald-50 text-emerald-700",
    },
    {
      value: "rusak_ringan",
      label: "Rusak Ringan",
      color: "border-amber-300 bg-amber-50 text-amber-700",
    },
    {
      value: "rusak_berat",
      label: "Rusak Berat",
      color: "border-red-300 bg-red-50 text-red-700",
    },
  ];

const KUALITAS_AIR_LABELS: Record<string, string> = {
  baik: "Baik (Layak minum)",
  sedang: "Sedang (Perlu filtrasi)",
  buruk: "Buruk (Tidak layak)",
};

export default function InputPengukuranPage() {
  const [selectedSensorId, setSelectedSensorId] = useState("");
  const [waterLevel, setWaterLevel] = useState("");
  const [debit, setDebit] = useState("");
  const [pH, setPH] = useState("");
  const [tds, setTDS] = useState("");
  const [kekeruhan, setKekeruhan] = useState("");
  const [kualitasAir, setKualitasAir] = useState("");
  const [kondisi, setKondisi] = useState<KondisiFisik>("baik");
  const [catatan, setCatatan] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const submitMeasurement = useSubmitMeasurement();

  // Fetch wells from API instead of using mock data
  const { data: wellsData = {} } = useQuery({
    queryKey: ["supervisorWells"],
    queryFn: () => sensorService.getAll(undefined, { page: "1", limit: "100" }),
  });
  const wells = wellsData.data || [];

  const selectedSensor = wells.find((s) => s.id === selectedSensorId);
  const isGNSS = selectedSensor?.type === "gnss";

  const fotoCount = files.length;

  const isFormValid =
    selectedSensorId !== "" &&
    kondisi !== undefined &&
    (isGNSS || waterLevel !== "");

  const handleFotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    setFiles((prev) => [...prev, ...picked].slice(0, 8));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFotoRemove = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = () => {
    if (!isFormValid || submitState !== "idle") return;
    setSubmitState("submitting");
    setErrorMsg("");

    const kualitas = kualitasAir
      ? (kualitasAir.toUpperCase() as "BAIK" | "SEDANG" | "BURUK")
      : undefined;

    const kondisiNote = kondisi !== "baik" ? `[${kondisi.toUpperCase()}] ` : "";
    const descParts = [kondisiNote + catatan].filter(Boolean);

    submitMeasurement.mutate(
      {
        wellId: selectedSensorId,
        waterDepth: parseFloat(waterLevel) || 0,
        waterUsage: debit ? parseFloat(debit) : undefined,
        waterQuality: kualitas,
        description: descParts.join(" ") || undefined,
        photos: files.length > 0 ? files : undefined,
      },
      {
        onSuccess: () => setSubmitState("success"),
        onError: (err) => {
          setSubmitState("error");
          setErrorMsg(err instanceof Error ? err.message : "Gagal mengirim pengukuran");
        },
      },
    );
  };

  const handleReset = () => {
    setSelectedSensorId("");
    setWaterLevel("");
    setDebit("");
    setPH("");
    setTDS("");
    setKekeruhan("");
    setKualitasAir("");
    setKondisi("baik");
    setCatatan("");
    setFiles([]);
    setSubmitState("idle");
    setErrorMsg("");
  };

  return (
    <div className="p-3 md:p-5 space-y-3 md:space-y-4 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[18px] font-semibold text-slate-800">
            Input Pengukuran
          </h1>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
            Input data lapangan harian ·{" "}
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        {submitState === "success" && (
          <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
            <CheckCircle2 size={14} />
            <span className="text-[11px] font-mono font-semibold">
              Data terkirim!
            </span>
          </div>
        )}
      </div>

      {/* Success overlay */}
      {submitState === "success" && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 size={20} className="text-emerald-600" />
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-semibold text-emerald-800">
              Pengukuran berhasil dikirim!
            </p>
            <p className="text-[11px] text-emerald-600 font-mono mt-0.5">
              Sensor {selectedSensor?.code} · {fotoCount > 0 ? `${fotoCount} foto · ` : ""}Menunggu
              verifikasi Admin
            </p>
          </div>
          <button
            onClick={handleReset}
            className="text-[11px] font-mono font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-lg border border-emerald-300 transition-colors"
          >
            Input Baru
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
        {/* ── LEFT: Form ── */}
        <div className="space-y-4">
          {/* Step 1: Pilih Sensor */}
          <Card padding={false}>
            <SectionHeader
              title="1 · Pilih Sensor"
              icon={<Radio size={13} />}
              accent="#3B82F6"
              subtitle={selectedSensor ? selectedSensor.code : "BELUM DIPILIH"}
            />
            <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {wells.length === 0 ? (
                <div className="col-span-3 text-center py-8">
                  <p className="text-[12px] text-slate-400 font-mono">
                    Tidak ada sumur terdaftar
                  </p>
                </div>
              ) : (
                wells.map((sensor) => (
                  <button
                    key={sensor.id}
                    onClick={() => setSelectedSensorId(sensor.id)}
                    className={cn(
                      "text-left p-3 rounded-xl border transition-all",
                      selectedSensorId === sensor.id
                        ? "border-blue-300 ring-2 ring-blue-100 bg-blue-50"
                        : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50/60",
                      sensor.wellStatus === "pending_approval" &&
                        selectedSensorId !== sensor.id &&
                        "border-orange-200",
                    )}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[13px] font-bold font-mono text-slate-800">
                        {sensor.code}
                      </span>
                      {sensor.wellStatus === "pending_approval" && (
                        <AlertTriangle size={12} className="text-orange-500" />
                      )}
                      {selectedSensorId === sensor.id && (
                        <CheckCircle2 size={12} className="text-blue-600" />
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 mb-1">
                      {sensor.location}
                    </p>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={cn(
                          "text-[9px] font-mono px-1.5 py-0.5 rounded border",
                          sensor.type === "gnss"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-blue-50 text-blue-700 border-blue-200",
                        )}
                      >
                        {sensor.type === "gnss" ? "GNSS" : "AIR TANAH"}
                      </span>
                      <span
                        className={cn(
                          "text-[9px] font-mono px-1.5 py-0.5 rounded border",
                          sensor.status === "online"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-50 text-slate-500 border-slate-200",
                        )}
                      >
                        {sensor.status === "online" ? "AKTIF" : "NON-AKTIF"}
                      </span>
                    </div>
                    {sensor.staticWaterLevel !== null && (
                      <p className="text-[10px] font-mono font-semibold mt-1.5 text-blue-600">
                        MAT: {sensor.staticWaterLevel.toFixed(2)} m
                      </p>
                    )}
                  </button>
                ))
              )}
            </div>
          </Card>

          {/* Step 2: Data Pengukuran */}
          <Card padding={false}>
            <SectionHeader
              title="2 · Data Pengukuran"
              icon={<Droplets size={13} />}
              accent="#3B82F6"
            />
            <div className="p-4 space-y-4">
              {/* Water level fields — hidden for GNSS */}
              {!isGNSS && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Droplets size={10} className="text-blue-500" />
                      Kedalaman Muka Air Tanah (m)
                      <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={waterLevel}
                        onChange={(e) => setWaterLevel(e.target.value)}
                        placeholder="-38.2"
                        disabled={
                          !selectedSensorId || submitState === "success"
                        }
                        className={cn(
                          "w-full pl-3 pr-8 py-2 text-[12px] font-mono border rounded-lg bg-slate-50 text-slate-700 placeholder-slate-400 focus:outline-none transition-colors",
                          selectedSensorId
                            ? "border-slate-200 focus:border-blue-400"
                            : "border-slate-100 cursor-not-allowed opacity-60",
                        )}
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-slate-400 font-mono">
                        m
                      </span>
                    </div>
                    <p className="text-[9px] text-slate-400 font-mono mt-1">
                      Negatif = di bawah permukaan (contoh: -38.2)
                    </p>
                  </div>

                  <div>
                    <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Gauge size={10} className="text-blue-500" />
                      Debit Pengambilan (m³/hari)
                      <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={debit}
                        onChange={(e) => setDebit(e.target.value)}
                        placeholder="124.5"
                        disabled={
                          !selectedSensorId || submitState === "success"
                        }
                        className={cn(
                          "w-full pl-3 pr-14 py-2 text-[12px] font-mono border rounded-lg bg-slate-50 text-slate-700 placeholder-slate-400 focus:outline-none transition-colors",
                          selectedSensorId
                            ? "border-slate-200 focus:border-blue-400"
                            : "border-slate-100 cursor-not-allowed opacity-60",
                        )}
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-slate-400 font-mono">
                        m³/hr
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {isGNSS && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-3">
                  <Radio size={16} className="text-amber-600 flex-shrink-0" />
                  <div>
                    <p className="text-[11px] font-semibold text-amber-800">
                      Sensor GNSS — tanpa data air tanah
                    </p>
                    <p className="text-[10px] text-amber-600 font-mono mt-0.5">
                      Untuk sensor GNSS, catat kondisi fisik alat dan upload
                      foto dokumentasi.
                    </p>
                  </div>
                </div>
              )}

              {/* Kualitas Air — only for water sensors */}
              {!isGNSS && (
                <>
                  <div className="border-t border-slate-50 pt-4">
                    <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                      <Waves size={10} className="text-blue-500" /> Kualitas Air
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[9px] font-mono text-slate-400 block mb-1.5">
                          pH Air
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="14"
                          value={pH}
                          onChange={(e) => setPH(e.target.value)}
                          placeholder="7.1"
                          disabled={
                            !selectedSensorId || submitState === "success"
                          }
                          className={cn(
                            "w-full px-3 py-2 text-[12px] font-mono border rounded-lg bg-slate-50 text-slate-700 placeholder-slate-400 focus:outline-none transition-colors",
                            selectedSensorId
                              ? "border-slate-200 focus:border-blue-400"
                              : "border-slate-100 cursor-not-allowed opacity-60",
                          )}
                        />
                        <p className="text-[9px] text-slate-400 font-mono mt-0.5">
                          Normal: 6.5 – 8.5
                        </p>
                      </div>
                      <div>
                        <label className="text-[9px] font-mono text-slate-400 block mb-1.5">
                          TDS (mg/L)
                        </label>
                        <input
                          type="number"
                          value={tds}
                          onChange={(e) => setTDS(e.target.value)}
                          placeholder="320"
                          disabled={
                            !selectedSensorId || submitState === "success"
                          }
                          className={cn(
                            "w-full px-3 py-2 text-[12px] font-mono border rounded-lg bg-slate-50 text-slate-700 placeholder-slate-400 focus:outline-none transition-colors",
                            selectedSensorId
                              ? "border-slate-200 focus:border-blue-400"
                              : "border-slate-100 cursor-not-allowed opacity-60",
                          )}
                        />
                        <p className="text-[9px] text-slate-400 font-mono mt-0.5">
                          Batas: &lt; 500 mg/L
                        </p>
                      </div>
                      <div>
                        <label className="text-[9px] font-mono text-slate-400 block mb-1.5">
                          Kekeruhan (NTU)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={kekeruhan}
                          onChange={(e) => setKekeruhan(e.target.value)}
                          placeholder="2.4"
                          disabled={
                            !selectedSensorId || submitState === "success"
                          }
                          className={cn(
                            "w-full px-3 py-2 text-[12px] font-mono border rounded-lg bg-slate-50 text-slate-700 placeholder-slate-400 focus:outline-none transition-colors",
                            selectedSensorId
                              ? "border-slate-200 focus:border-blue-400"
                              : "border-slate-100 cursor-not-allowed opacity-60",
                          )}
                        />
                        <p className="text-[9px] text-slate-400 font-mono mt-0.5">
                          Batas: &lt; 5 NTU
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Kualitas air keseluruhan */}
                  <div>
                    <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                      Penilaian Kualitas Air
                    </label>
                    <div className="relative">
                      <select
                        value={kualitasAir}
                        onChange={(e) => setKualitasAir(e.target.value)}
                        disabled={
                          !selectedSensorId || submitState === "success"
                        }
                        className={cn(
                          "w-full appearance-none pl-3 pr-8 py-2 text-[12px] font-mono border rounded-lg bg-slate-50 text-slate-700 focus:outline-none transition-colors",
                          selectedSensorId
                            ? "border-slate-200 focus:border-blue-400"
                            : "border-slate-100 cursor-not-allowed opacity-60",
                        )}
                      >
                        <option value="">— Pilih penilaian —</option>
                        {Object.entries(KUALITAS_AIR_LABELS).map(([v, l]) => (
                          <option key={v} value={v}>
                            {l}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={12}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </Card>

          {/* Step 3: Kondisi Fisik */}
          <Card padding={false}>
            <SectionHeader
              title="3 · Kondisi Fisik Alat"
              icon={<AlertTriangle size={13} />}
              accent="#3B82F6"
            />
            <div className="p-4">
              <div className="grid grid-cols-3 gap-3">
                {KONDISI_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setKondisi(opt.value)}
                    disabled={submitState === "success"}
                    className={cn(
                      "py-3 px-2 rounded-xl border-2 text-[11px] font-semibold transition-all",
                      kondisi === opt.value
                        ? opt.color +
                            " ring-2 ring-offset-1 " +
                            (opt.value === "baik"
                              ? "ring-emerald-200"
                              : opt.value === "rusak_ringan"
                                ? "ring-amber-200"
                                : "ring-red-200")
                        : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50",
                    )}
                  >
                    {opt.value === "baik"
                      ? "✓ "
                      : opt.value === "rusak_ringan"
                        ? "⚠ "
                        : "✕ "}
                    {opt.label}
                  </button>
                ))}
              </div>
              {kondisi !== "baik" && (
                <div
                  className={cn(
                    "mt-3 flex items-start gap-2 rounded-lg px-3 py-2 border",
                    kondisi === "rusak_ringan"
                      ? "bg-amber-50 border-amber-200"
                      : "bg-red-50 border-red-200",
                  )}
                >
                  <AlertTriangle
                    size={12}
                    className={cn(
                      "flex-shrink-0 mt-0.5",
                      kondisi === "rusak_ringan"
                        ? "text-amber-500"
                        : "text-red-500",
                    )}
                  />
                  <p
                    className={cn(
                      "text-[10px] font-mono",
                      kondisi === "rusak_ringan"
                        ? "text-amber-700"
                        : "text-red-700",
                    )}
                  >
                    {kondisi === "rusak_ringan"
                      ? "Catat detail kerusakan di kolom catatan dan pastikan upload foto dokumentasi."
                      : "Kerusakan berat wajib dilaporkan ke Admin segera. Sertakan foto lengkap."}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Step 4: Upload Foto */}
          <Card padding={false}>
            <SectionHeader
              title="4 · Foto Lapangan"
              icon={<Camera size={13} />}
              accent="#3B82F6"
              subtitle={`${fotoCount}/8 FOTO`}
            />
            <div className="p-4">
              <p className="text-[10px] text-slate-400 font-mono mb-3">
                Opsional · Maksimal 8 foto (sensor, kondisi fisik, sekitar lokasi)
              </p>
              {/* hidden real file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFotoSelect}
              />
              <div className="grid grid-cols-4 gap-2 mb-3">
                {Array.from({ length: 8 }).map((_, i) => {
                  const hasFile = i < files.length;
                  const file = files[i];
                  return (
                    <div
                      key={i}
                      className={cn(
                        "aspect-square rounded-lg border-2 border-dashed flex items-center justify-center transition-colors relative overflow-hidden",
                        hasFile
                          ? "border-blue-300 bg-blue-50"
                          : "border-slate-200 bg-slate-50",
                      )}
                    >
                      {hasFile && file ? (
                        <>
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`foto ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => handleFotoRemove(i)}
                            className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
                          >
                            <X size={9} className="text-white" />
                          </button>
                        </>
                      ) : (
                        <span className="text-slate-300 text-lg">+</span>
                      )}
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={fotoCount >= 8 || !selectedSensorId || submitState === "success"}
                className={cn(
                  "w-full flex items-center justify-center gap-2 py-2.5 text-[11px] font-mono font-semibold rounded-xl border-2 border-dashed transition-all",
                  fotoCount < 8 && selectedSensorId && submitState !== "success"
                    ? "border-blue-300 text-blue-600 hover:bg-blue-50 cursor-pointer"
                    : "border-slate-200 text-slate-400 cursor-not-allowed",
                )}
              >
                <Upload size={13} />
                {fotoCount >= 8 ? "Foto penuh (maks 8)" : "Pilih Foto"}
              </button>
            </div>
          </Card>

          {/* Step 5: Catatan */}
          <Card>
            <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
              5 · Catatan Lapangan (opsional)
            </label>
            <textarea
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              rows={3}
              placeholder="Contoh: Ditemukan kebocoran kecil di pipa inlet, kondisi sumur bor masih stabil..."
              disabled={!selectedSensorId || submitState === "success"}
              className={cn(
                "w-full px-3 py-2 text-[11px] font-mono border rounded-lg bg-slate-50 text-slate-700 placeholder-slate-400 focus:outline-none resize-none transition-colors",
                selectedSensorId
                  ? "border-slate-200 focus:border-blue-400"
                  : "border-slate-100 cursor-not-allowed opacity-60",
              )}
            />
            <p className="text-[9px] text-slate-400 font-mono mt-1">
              {catatan.length}/500 karakter
            </p>
          </Card>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!isFormValid || submitState === "submitting" || submitState === "success"}
            className={cn(
              "w-full py-3.5 text-[13px] font-semibold rounded-xl transition-all flex items-center justify-center gap-2",
              isFormValid && (submitState === "idle" || submitState === "error")
                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
                : submitState === "submitting"
                  ? "bg-blue-400 text-white cursor-not-allowed"
                  : submitState === "success"
                    ? "bg-emerald-500 text-white cursor-default"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed",
            )}
          >
            {(submitState === "idle" || submitState === "error") && (
              <>
                <ClipboardEdit size={15} /> Submit Pengukuran
              </>
            )}
            {submitState === "submitting" && (
              <>
                <span className="animate-spin">⏳</span> Mengirim...
              </>
            )}
            {submitState === "success" && (
              <>
                <CheckCircle2 size={15} /> Berhasil Dikirim!
              </>
            )}
          </button>

          {!isFormValid && submitState === "idle" && (
            <p className="text-[10px] text-slate-400 font-mono text-center -mt-2">
              Lengkapi: sensor {selectedSensorId ? "✓" : "✗"} · data pengukuran{" "}
              {isGNSS || waterLevel ? "✓" : "✗"}
            </p>
          )}
          {submitState === "error" && errorMsg && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 -mt-2">
              <AlertTriangle size={14} className="text-red-500 flex-shrink-0" />
              <p className="text-[11px] text-red-700 font-mono">{errorMsg}</p>
              <button onClick={() => { setSubmitState("idle"); setErrorMsg(""); }} className="ml-auto text-[10px] text-red-600 hover:text-red-800">✕</button>
            </div>
          )}
        </div>

        {/* ── RIGHT: Preview + History ── */}
        <div className="space-y-4">
          {/* Summary card */}
          <Card padding={false} className="flex flex-col">
            <SectionHeader
              title="Ringkasan Input"
              icon={<ClipboardEdit size={13} />}
              accent="#3B82F6"
            />
            <div className="p-4 space-y-3">
              {[
                { label: "Sensor", value: selectedSensor?.code ?? "—" },
                { label: "Lokasi", value: selectedSensor?.location ?? "—" },
                {
                  label: "Tipe",
                  value: selectedSensor
                    ? selectedSensor.type === "gnss"
                      ? "GNSS"
                      : "Air Tanah"
                    : "—",
                },
                {
                  label: "Muka Air",
                  value: waterLevel ? `${waterLevel} m` : "—",
                  hidden: isGNSS,
                },
                {
                  label: "Debit",
                  value: debit ? `${debit} m³/hr` : "—",
                  hidden: isGNSS,
                },
                { label: "pH", value: pH ? pH : "—", hidden: isGNSS },
                {
                  label: "TDS",
                  value: tds ? `${tds} mg/L` : "—",
                  hidden: isGNSS,
                },
                {
                  label: "Kekeruhan",
                  value: kekeruhan ? `${kekeruhan} NTU` : "—",
                  hidden: isGNSS,
                },
                {
                  label: "Kondisi Fisik",
                  value:
                    KONDISI_OPTIONS.find((o) => o.value === kondisi)?.label ??
                    "—",
                },
                { label: "Foto", value: `${fotoCount} file` },
              ]
                .filter((item) => !item.hidden)
                .map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between"
                  >
                    <span className="text-[10px] text-slate-400 font-mono">
                      {label}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-700 font-mono">
                      {value}
                    </span>
                  </div>
                ))}

              {/* Validation checklist */}
              <div className="border-t border-slate-100 pt-3 space-y-1.5">
                {[
                  { label: "Sensor dipilih", ok: !!selectedSensorId },
                  {
                    label: "Data pengukuran",
                    ok: isGNSS || waterLevel !== "",
                  },
                  { label: "Foto (opsional)", ok: fotoCount >= 1 },
                ].map(({ label, ok }) => (
                  <div key={label} className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-[10px]",
                        ok ? "text-emerald-500" : "text-slate-300",
                      )}
                    >
                      {ok ? "✓" : "○"}
                    </span>
                    <span
                      className={cn(
                        "text-[10px] font-mono",
                        ok ? "text-emerald-700" : "text-slate-400",
                      )}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* History for selected sensor */}
          {selectedSensorId && selectedSensor && (
            <Card padding={false} className="flex flex-col">
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-semibold text-slate-700">
                    Informasi Sumur
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-slate-400 font-mono">
                      PERUSAHAAN
                    </span>
                    <span className="text-[10px] font-semibold text-slate-700">
                      {selectedSensor.companyName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-slate-400 font-mono">
                      UNIT BISNIS
                    </span>
                    <span className="text-[10px] font-semibold text-slate-700">
                      {selectedSensor.businessName || "-"}
                    </span>
                  </div>
                  {selectedSensor.staticWaterLevel !== null && (
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-slate-400 font-mono">
                        KEDALAMAN MAT
                      </span>
                      <span className="text-[10px] font-semibold text-blue-600">
                        {selectedSensor.staticWaterLevel.toFixed(2)} m
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-slate-400 font-mono">
                      STATUS PERSETUJUAN
                    </span>
                    <span
                      className={cn(
                        "text-[9px] font-mono px-1.5 py-0.5 rounded border",
                        selectedSensor.wellStatus === "approved"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : selectedSensor.wellStatus === "pending_approval"
                            ? "bg-orange-50 text-orange-700 border-orange-200"
                            : "bg-red-50 text-red-700 border-red-200",
                      )}
                    >
                      {selectedSensor.wellStatus === "approved"
                        ? "DISETUJUI"
                        : selectedSensor.wellStatus === "pending_approval"
                          ? "MENUNGGU"
                          : "DITOLAK"}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p className="text-[11px] font-semibold text-blue-800 mb-2">
              💡 Tips Pengukuran
            </p>
            <ul className="space-y-1.5">
              {[
                "Ukur di waktu yang konsisten setiap harinya",
                "Foto dari minimal 2 sudut berbeda",
                "Catat anomali meski tampak kecil",
                "Pastikan sinyal GPS stabil untuk GNSS",
              ].map((tip, i) => (
                <li
                  key={i}
                  className="text-[10px] text-blue-700 font-mono flex items-start gap-1.5"
                >
                  <span className="flex-shrink-0 mt-0.5">·</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
