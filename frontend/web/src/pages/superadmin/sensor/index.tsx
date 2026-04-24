import { useState, useMemo } from "react";
import {
  Search,
  Radio,
  ArrowUpDown,
  AlertTriangle,
  Wifi,
  WifiOff,
  Settings2,
  X,
  MapPin,
  Plus,
  Trash2,
  Edit2,
} from "lucide-react";
import { StatusPill, Card, Badge, Pagination } from "../../../components/ui";
import { useSensors, useCompanies, useBusinesses } from "../../../hooks";
import {
  useUpdateSensor,
  useCreateSensor,
  useDeleteSensor,
} from "../../../hooks/useSensors";
import { cn, getSubsidenceColor } from "../../../lib/utils";
import type { Sensor, SensorStatus, SensorType } from "../../../types";
import type { CreateSensorRequest } from "../../../types/api";

type SortKey =
  | "code"
  | "location"
  | "subsidence"
  | "status"
  | "type"
  | "lastUpdate";

const STATUS_ICON: Record<string, JSX.Element> = {
  online: <Wifi size={12} className="text-emerald-500" />,
  offline: <WifiOff size={12} className="text-slate-400" />,
  alert: <AlertTriangle size={12} className="text-red-500" />,
  maintenance: <Settings2 size={12} className="text-amber-500" />,
};

interface CreateSensorModalProps {
  onClose: () => void;
  businesses: any[];
}

function CreateSensorModal({ onClose, businesses }: CreateSensorModalProps) {
  const createSensor = useCreateSensor();
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
    subsidenceRate: undefined,
    verticalValue: undefined,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: string, v: any) => {
    setForm((p) => ({ ...p, [k]: v }));
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

  const F = ({
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

  const inputCls = (err?: string) =>
    cn(
      "w-full px-3 py-2 text-[12px] font-mono border rounded-lg bg-slate-50 text-slate-800 focus:outline-none focus:ring-1",
      err
        ? "border-red-300 focus:ring-red-300"
        : "border-slate-200 focus:ring-cyan-400 focus:border-cyan-400",
    );

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
          <F label="Nama Sumur" error={errors.name}>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Sumur A-01"
              className={inputCls(errors.name)}
            />
          </F>

          <F label="Unit Bisnis" error={errors.businessId}>
            <select
              value={form.businessId}
              onChange={(e) => set("businessId", e.target.value)}
              className={inputCls(errors.businessId)}
            >
              <option value="">Pilih unit bisnis</option>
              {businesses.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </F>

          <div className="grid grid-cols-2 gap-3">
            <F label="Latitude" error={errors.latitude}>
              <input
                type="number"
                step="any"
                value={form.latitude ?? ""}
                onChange={(e) =>
                  set(
                    "latitude",
                    e.target.value ? parseFloat(e.target.value) : undefined,
                  )
                }
                placeholder="-6.2088"
                className={inputCls(errors.latitude)}
              />
            </F>
            <F label="Longitude" error={errors.longitude}>
              <input
                type="number"
                step="any"
                value={form.longitude ?? ""}
                onChange={(e) =>
                  set(
                    "longitude",
                    e.target.value ? parseFloat(e.target.value) : undefined,
                  )
                }
                placeholder="106.8456"
                className={inputCls(errors.longitude)}
              />
            </F>
          </div>

          <F label="Deskripsi Lokasi">
            <input
              value={form.locationDescription ?? ""}
              onChange={(e) => set("locationDescription", e.target.value)}
              placeholder="Jl. Sudirman No. 1, Bandung"
              className={inputCls()}
            />
          </F>

          <F label="Tipe Sumur">
            <select
              value={form.wellType}
              onChange={(e) => set("wellType", e.target.value)}
              className={inputCls()}
            >
              <option value="perusahaan">Perusahaan</option>
              <option value="non_perusahaan">Non Perusahaan</option>
              <option value="rumah_tangga">Rumah Tangga</option>
            </select>
          </F>

          <div className="grid grid-cols-2 gap-3">
            <F label="Kedalaman (m)">
              <input
                type="number"
                step="any"
                value={form.depthMeter ?? ""}
                onChange={(e) =>
                  set(
                    "depthMeter",
                    e.target.value ? parseFloat(e.target.value) : undefined,
                  )
                }
                placeholder="50"
                className={inputCls()}
              />
            </F>
            <F label="Diameter (inch)">
              <input
                type="number"
                step="any"
                value={form.diameterInch ?? ""}
                onChange={(e) =>
                  set(
                    "diameterInch",
                    e.target.value ? parseFloat(e.target.value) : undefined,
                  )
                }
                placeholder="6"
                className={inputCls()}
              />
            </F>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <F label="Kapasitas Pompa">
              <input
                type="number"
                step="any"
                value={form.pumpCapacity ?? ""}
                onChange={(e) =>
                  set(
                    "pumpCapacity",
                    e.target.value ? parseFloat(e.target.value) : undefined,
                  )
                }
                placeholder="100"
                className={inputCls()}
              />
            </F>
            <F label="Subsidence (cm/tahun)">
              <input
                type="number"
                step="any"
                value={form.subsidenceRate ?? ""}
                onChange={(e) =>
                  set(
                    "subsidenceRate",
                    e.target.value ? parseFloat(e.target.value) : undefined,
                  )
                }
                placeholder="0.5"
                className={inputCls()}
              />
            </F>
          </div>

          <F label="Nilai Vertikal (mm)">
            <input
              type="number"
              step="any"
              value={form.verticalValue ?? ""}
              onChange={(e) =>
                set(
                  "verticalValue",
                  e.target.value ? parseFloat(e.target.value) : undefined,
                )
              }
              placeholder="12.34"
              className={inputCls()}
            />
          </F>

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
    businessId: sensor.id, // Note: We don't have businessId in sensor, but we'll keep this for consistency
    latitude: sensor.lat?.toString() ?? "",
    longitude: sensor.lng?.toString() ?? "",
    locationDescription: sensor.location || "",
    wellType: "perusahaan" as const,
    depthMeter: sensor.waterLevel?.toString() ?? "",
    diameterInch: "",
    pumpCapacity: "",
    subsidenceRate: sensor.subsidence?.toString() ?? "",
    verticalValue: sensor.verticalValue?.toString() ?? "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: string, v: any) => {
    setForm((p) => ({ ...p, [k]: v }));
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
      subsidenceRate: form.subsidenceRate
        ? parseFloat(form.subsidenceRate)
        : undefined,
      verticalValue: form.verticalValue
        ? parseFloat(form.verticalValue)
        : undefined,
    };

    updateSensor.mutate(
      {
        id: sensor.id,
        payload,
      },
      { onSuccess: onClose },
    );
  };

  const F = ({
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

  const inputCls = (err?: string) =>
    cn(
      "w-full px-3 py-2 text-[12px] font-mono border rounded-lg bg-slate-50 text-slate-800 focus:outline-none focus:ring-1",
      err
        ? "border-red-300 focus:ring-red-300"
        : "border-slate-200 focus:ring-cyan-400 focus:border-cyan-400",
    );

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
          <F label="Nama Sumur" error={errors.name}>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Sumur A-01"
              className={inputCls(errors.name)}
            />
          </F>

          <div className="grid grid-cols-2 gap-3">
            <F label="Latitude" error={errors.latitude}>
              <input
                type="number"
                step="any"
                value={form.latitude}
                onChange={(e) => set("latitude", e.target.value)}
                placeholder="-6.2088"
                className={inputCls(errors.latitude)}
              />
            </F>
            <F label="Longitude" error={errors.longitude}>
              <input
                type="number"
                step="any"
                value={form.longitude}
                onChange={(e) => set("longitude", e.target.value)}
                placeholder="106.8456"
                className={inputCls(errors.longitude)}
              />
            </F>
          </div>

          <F label="Deskripsi Lokasi">
            <input
              value={form.locationDescription}
              onChange={(e) => set("locationDescription", e.target.value)}
              placeholder="Jl. Sudirman No. 1, Bandung"
              className={inputCls()}
            />
          </F>

          <F label="Tipe Sumur">
            <select
              value={form.wellType}
              onChange={(e) => set("wellType", e.target.value)}
              className={inputCls()}
            >
              <option value="perusahaan">Perusahaan</option>
              <option value="non_perusahaan">Non Perusahaan</option>
              <option value="rumah_tangga">Rumah Tangga</option>
            </select>
          </F>

          <div className="grid grid-cols-2 gap-3">
            <F label="Kedalaman (m)">
              <input
                type="number"
                step="any"
                value={form.depthMeter}
                onChange={(e) => set("depthMeter", e.target.value)}
                placeholder="50"
                className={inputCls()}
              />
            </F>
            <F label="Diameter (inch)">
              <input
                type="number"
                step="any"
                value={form.diameterInch}
                onChange={(e) => set("diameterInch", e.target.value)}
                placeholder="6"
                className={inputCls()}
              />
            </F>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <F label="Kapasitas Pompa">
              <input
                type="number"
                step="any"
                value={form.pumpCapacity}
                onChange={(e) => set("pumpCapacity", e.target.value)}
                placeholder="100"
                className={inputCls()}
              />
            </F>
            <F label="Subsidence (cm/tahun)">
              <input
                type="number"
                step="any"
                value={form.subsidenceRate}
                onChange={(e) => set("subsidenceRate", e.target.value)}
                placeholder="0.5"
                className={inputCls()}
              />
            </F>
          </div>

          <F label="Nilai Vertikal (mm)">
            <input
              type="number"
              step="any"
              value={form.verticalValue}
              onChange={(e) => set("verticalValue", e.target.value)}
              placeholder="12.34"
              className={inputCls()}
            />
          </F>

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
  onEdit,
  onDelete,
  businesses,
}: {
  sensor: Sensor;
  companyName: string;
  onClose: () => void;
  onEdit: (s: Sensor) => void;
  onDelete: (s: Sensor) => void;
  businesses: any[];
}) {
  const [showEdit, setShowEdit] = useState(false);
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
            <StatusPill status={sensor.status} />
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
            [
              "Tipe Sensor",
              sensor.type === "water" ? "Air Tanah (Groundwater)" : "GNSS",
            ],
            ["Perusahaan", companyName],
            [
              "Koordinat",
              sensor.lat != null && sensor.lng != null
                ? `${sensor.lat.toFixed(4)}, ${sensor.lng.toFixed(4)}`
                : "Belum diatur",
            ],
            ["Subsidence", `${sensor.subsidence.toFixed(2)} cm/tahun`],
            [
              "Muka Air Tanah",
              sensor.waterLevel ? `${sensor.waterLevel} m` : "-",
            ],
            [
              "Nilai Vertikal",
              sensor.verticalValue ? `${sensor.verticalValue} mm` : "-",
            ],
            ["Terakhir Update", sensor.lastUpdate],
            [
              "Status",
              sensor.status.charAt(0).toUpperCase() + sensor.status.slice(1),
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
            onClick={() => {
              onEdit(sensor);
              setShowEdit(true);
            }}
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
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-50 text-slate-500 text-[12px] rounded-xl hover:bg-slate-100 transition-colors ml-auto"
          >
            Tutup
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

export default function SensorPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { data: response, isLoading } = useSensors(undefined, { page, limit });
  const { data: companiesResponse = { data: [] } } = useCompanies();
  const { data: businessesResponse = { data: [] } } = useBusinesses();

  const sensors = response?.data ?? [];
  const pagination = response?.pagination;
  const companies = companiesResponse.data ?? [];
  const businesses = businessesResponse.data ?? [];

  const deleteSensor = useDeleteSensor();

  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState<SensorStatus | "all">("all");
  const [typeF, setTypeF] = useState<SensorType | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("code");
  const [sortAsc, setSortAsc] = useState(true);
  const [detail, setDetail] = useState<Sensor | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Sensor | null>(null);

  const data = useMemo(() => {
    let d = [...sensors];
    if (statusF !== "all") d = d.filter((s) => s.status === statusF);
    if (typeF !== "all") d = d.filter((s) => s.type === typeF);
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
  }, [sensors, search, statusF, typeF, sortKey, sortAsc]);

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
    online: sensors.filter((s) => s.status === "online").length,
    alert: sensors.filter((s) => s.status === "alert").length,
    maintenance: sensors.filter((s) => s.status === "maintenance").length,
    offline: sensors.filter((s) => s.status === "offline").length,
  };

  const getCompanyName = (companyId: string) =>
    companies.find((c) => c.id === companyId)?.name ?? "-";

  return (
    <div className="p-3 sm:p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[18px] font-semibold text-slate-800">
            Semua Sensor
          </h1>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
            Kelola dan pantau seluruh sensor terdaftar
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="px-4 py-2 bg-cyan-600 text-white text-[12px] font-semibold rounded-xl hover:bg-cyan-700 transition-colors flex items-center gap-2"
        >
          <Plus size={13} /> Tambah Sensor
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Online",
            count: summary.online,
            color: "#22C55E",
            bg: "bg-emerald-50",
            border: "border-emerald-200",
          },
          {
            label: "Alert",
            count: summary.alert,
            color: "#EF4444",
            bg: "bg-red-50",
            border: "border-red-200",
          },
          {
            label: "Maintenance",
            count: summary.maintenance,
            color: "#F59E0B",
            bg: "bg-amber-50",
            border: "border-amber-200",
          },
          {
            label: "Offline",
            count: summary.offline,
            color: "#94A3B8",
            bg: "bg-slate-50",
            border: "border-slate-200",
          },
        ].map(({ label, count, color, bg, border }) => (
          <div
            key={label}
            className={cn(
              "rounded-xl border px-4 py-3 flex items-center gap-3",
              bg,
              border,
            )}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: color + "20" }}
            >
              <span
                className="text-[14px] font-bold font-mono"
                style={{ color }}
              >
                {count}
              </span>
            </div>
            <span className="text-[11px] font-medium text-slate-600">
              {label}
            </span>
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
            {(
              ["all", "online", "alert", "maintenance", "offline"] as const
            ).map((s) => (
              <button
                key={s}
                onClick={() => setStatusF(s)}
                className={cn(
                  "text-[9px] font-mono px-2.5 py-1 rounded-full border transition-all",
                  statusF === s
                    ? "bg-cyan-50 text-cyan-700 border-cyan-200"
                    : "text-slate-400 border-transparent hover:bg-slate-50",
                )}
              >
                {s === "all" ? "Semua" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex gap-1 ml-1">
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

        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-[11px] text-slate-400 font-mono">
            Memuat data sensor...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" style={{ minWidth: "640px" }}>
              <thead className="bg-slate-50/60 border-b border-slate-100">
                <tr>
                  <Th label="Kode" k="code" />
                  <Th label="Lokasi" k="location" />
                  <Th label="Tipe" k="type" />
                  <Th label="Subsidence" k="subsidence" />
                  <th className="text-[9px] font-mono text-slate-400 uppercase tracking-wider px-4 py-3 text-left">
                    Muka Air
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
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-[12px] font-bold text-slate-800">
                      {s.code}
                    </td>
                    <td className="px-4 py-3 text-[11px] text-slate-600">
                      {s.location}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={s.type === "water" ? "info" : "neutral"}>
                        {s.type === "water" ? "Air Tanah" : "GNSS"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "text-[12px] font-semibold font-mono",
                          getSubsidenceColor(s.subsidence),
                        )}
                      >
                        {s.subsidence.toFixed(2)}
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono ml-0.5">
                        cm/thn
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[11px] font-mono text-slate-600">
                      {s.waterLevel ?? "-"}
                      {s.waterLevel ? " m" : ""}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {STATUS_ICON[s.status] ?? STATUS_ICON.offline}
                        <StatusPill status={s.status} />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[10px] text-slate-400 font-mono">
                      {s.lastUpdate}
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
          onEdit={() => {}}
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
