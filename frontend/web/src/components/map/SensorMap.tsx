import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Sensor } from "../../types";

interface SensorMapProps {
  sensors: Sensor[];
  height?: number | string;
  className?: string;
  onMarkerClick?: (sensor: Sensor) => void;
}

/* ─────────────────────────────────────────────
   Color map per type + status
   ──────────────────────────────────────────── */
const MARKER_COLORS: Record<string, string> = {
  water_online: "#3B82F6",
  water_alert: "#EF4444",
  water_maintenance: "#F59E0B",
  water_offline: "#94A3B8",
  gnss_online: "#F59E0B",
  gnss_alert: "#EF4444",
  gnss_maintenance: "#CBD5E1",
  gnss_offline: "#94A3B8",
};

const KEYFRAMES = `
  @keyframes sa-pulse {
    0%   { transform: scale(1);   opacity: 0.8; }
    70%  { transform: scale(2.2); opacity: 0;   }
    100% { transform: scale(2.2); opacity: 0;   }
  }
  @keyframes sa-blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.45; }
  }
`;

function buildDropletIcon(color: string, opacity = "1"): string {
  return `
    <svg width="20" height="20" viewBox="0 0 20 20" style="opacity:${opacity};filter:drop-shadow(0 1px 3px rgba(0,0,0,0.3));">
      <path d="M10 2 C14 5, 16 8, 16 11 C16 15.4, 13.3 18, 10 18 C6.7 18, 4 15.4, 4 11 C4 8, 6 5, 10 2 Z" fill="${color}" stroke="white" stroke-width="1.3" stroke-linejoin="round"/>
    </svg>`;
}

function buildIconHTML(color: string, status: Sensor["status"]): string {
  const isAlert = status === "alert";
  const isMaintenance = status === "maintenance";

  if (isAlert) {
    return `
      <style>${KEYFRAMES}</style>
      <div style="position:relative;width:30px;height:30px;display:flex;align-items:center;justify-content:center;">
        <div style="position:absolute;width:16px;height:16px;border-radius:50%;background:${color};opacity:0;animation:sa-pulse 1.6s ease-out infinite;"></div>
        <div style="position:absolute;width:16px;height:16px;border-radius:50%;background:${color};opacity:0;animation:sa-pulse 1.6s ease-out 0.5s infinite;"></div>
        <div style="position:relative;z-index:2;display:flex;align-items:center;justify-content:center;">
          ${buildDropletIcon(color)}
        </div>
      </div>`;
  }

  if (isMaintenance) {
    return `
      <style>${KEYFRAMES}</style>
      <div style="position:relative;width:30px;height:30px;display:flex;align-items:center;justify-content:center;animation:sa-blink 2s ease-in-out infinite;">
        ${buildDropletIcon(color)}
      </div>`;
  }

  const opacity = status === "offline" ? "0.6" : "1";
  return `
    <div style="position:relative;width:30px;height:30px;display:flex;align-items:center;justify-content:center;">
      ${buildDropletIcon(color, opacity)}
    </div>`;
}

function makeIcon(color: string, status: Sensor["status"]): L.DivIcon {
  return L.divIcon({
    className: "",
    html: buildIconHTML(color, status),
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -35],
  });
}

/* ─────────────────────────────────────────────
   Popup HTML
   ──────────────────────────────────────────── */
function buildPopup(sensor: Sensor, color: string): string {
  const subColor =
    sensor.subsidence <= -4.0
      ? "#EF4444"
      : sensor.subsidence <= -2.5
        ? "#F59E0B"
        : "#22C55E";

  const rows: [string, string][] = [
    ["Tipe", sensor.type === "water" ? "Air Tanah" : "GNSS"],
    ["Status", sensor.status.charAt(0).toUpperCase() + sensor.status.slice(1)],
    ["Subsidence", `${sensor.subsidence.toFixed(2)} cm/thn`],
    ...(sensor.waterLevel !== undefined
      ? [["Muka Air", `${sensor.waterLevel} m`] as [string, string]]
      : []),
    ...(sensor.verticalValue !== undefined
      ? [["Nilai Vertikal", `${sensor.verticalValue} mm`] as [string, string]]
      : []),
    ["Update", sensor.lastUpdate],
  ];

  return `
    <div style="font-family:'IBM Plex Mono',monospace;min-width:190px;max-width:220px">
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid #F1F5F9">
        <div style="width:8px;height:8px;border-radius:50%;background:${color};flex-shrink:0"></div>
        <span style="font-size:13px;font-weight:700;color:#0F172A">${sensor.code}</span>
        <span style="font-size:10px;color:#64748B;margin-left:2px">${sensor.location}</span>
      </div>
      <table style="width:100%;font-size:10px;border-collapse:collapse;line-height:1.6">
        ${rows
          .map(
            ([k, v]) => `
          <tr>
            <td style="color:#94A3B8;padding:1px 0;white-space:nowrap">${k}</td>
            <td style="text-align:right;color:${k === "Subsidence" ? subColor : k === "Status" ? color : "#475569"};font-weight:${k === "Subsidence" ? "600" : "400"}">${v}</td>
          </tr>`,
          )
          .join("")}
      </table>
    </div>`;
}

/* ─────────────────────────────────────────────
   Main Component
   ──────────────────────────────────────────── */
export default function SensorMap({
  sensors,
  height = 300,
  className,
  onMarkerClick,
}: SensorMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  const resolvedHeight = typeof height === "number" ? `${height}px` : height;

  /* Init map once */
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapRef.current = L.map(containerRef.current, {
      center: [-5.45, 105.27],
      zoom: 10,
      zoomControl: false,
      zoomAnimation: false,
    });

    L.control.zoom({ position: "topright" }).addTo(mapRef.current);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
      maxZoom: 19,
    }).addTo(mapRef.current);

    const handleResize = () => {
      mapRef.current?.invalidateSize();
    };

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => handleResize())
        : null;

    resizeObserver?.observe(containerRef.current);
    window.addEventListener("resize", handleResize);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", handleResize);
      markersRef.current.forEach((marker) => {
        marker.off();
        marker.remove();
      });
      markersRef.current = [];
      mapRef.current?.stop();
      mapRef.current?.off();
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  /* Refresh markers whenever sensors change */
  useEffect(() => {
    if (!mapRef.current) return;

    markersRef.current.forEach((marker) => {
      marker.off();
      marker.remove();
    });
    markersRef.current = [];

    const validSensors = sensors.filter(
      (s) => s.lat != null && s.lng != null && !(s.lat === 0 && s.lng === 0),
    );

    validSensors.forEach((sensor) => {
      const color =
        MARKER_COLORS[`${sensor.type}_${sensor.status}`] ?? "#94A3B8";
      const marker = L.marker([sensor.lat!, sensor.lng!] as [number, number], {
        icon: makeIcon(color, sensor.status),
      })
        .addTo(mapRef.current!)
        .bindPopup(buildPopup(sensor, color), {
          maxWidth: 240,
          className: "leaflet-popup-light",
        });

      if (onMarkerClick) marker.on("click", () => onMarkerClick(sensor));
      markersRef.current.push(marker);
    });

    if (validSensors.length > 0) {
      const bounds = L.latLngBounds(
        validSensors.map((s) => [s.lat!, s.lng!] as [number, number]),
      );
      mapRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
    }
  }, [sensors, onMarkerClick]);

  return (
    <>
      <style>{`
        .sensor-map-root .leaflet-top.leaflet-right {
          top: 10px;
          right: 10px;
        }
        .sensor-map-root .leaflet-control-zoom {
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
        }
        .sensor-map-root .leaflet-control-zoom a {
          width: 30px;
          height: 30px;
          line-height: 30px;
          color: #334155;
          font-size: 16px;
          background: #FFFFFF;
        }
        .leaflet-popup-light .leaflet-popup-content-wrapper {
          border-radius: 12px;
          border: 1px solid #E2E8F0;
          box-shadow: 0 4px 16px rgba(0,0,0,0.10);
          padding: 0;
        }
        .leaflet-popup-light .leaflet-popup-content { margin: 12px 14px; }
        .leaflet-popup-light .leaflet-popup-tip { background: white; }
        .leaflet-popup-light .leaflet-popup-close-button {
          color: #94A3B8 !important;
          font-size: 16px !important;
          top: 6px !important;
          right: 8px !important;
        }
        @media (max-width: 640px) {
          .sensor-map-root .leaflet-top.leaflet-right {
            top: auto;
            bottom: 12px;
            right: 10px;
          }
          .sensor-map-root .leaflet-control-zoom a {
            width: 34px;
            height: 34px;
            line-height: 34px;
            font-size: 18px;
          }
          .leaflet-popup-light .leaflet-popup-content {
            margin: 10px 12px;
          }
          .leaflet-popup-light .leaflet-popup-content-wrapper {
            border-radius: 10px;
          }
        }
      `}</style>
      <div
        ref={containerRef}
        className={`sensor-map-root ${className ?? ""}`}
        style={{ height: resolvedHeight, width: "100%" }}
      />
    </>
  );
}
