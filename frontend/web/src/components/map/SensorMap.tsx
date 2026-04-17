import React, { useEffect, useRef } from 'react';
import type { Sensor } from '../../types';

declare global {
  interface Window { L: typeof import('leaflet'); }
}

interface SensorMapProps {
  sensors: Sensor[];
  height?: number;
  onMarkerClick?: (sensor: Sensor) => void;
}

/* ─────────────────────────────────────────────
   Color map per type + status
   ──────────────────────────────────────────── */
const MARKER_COLORS: Record<string, string> = {
  water_online:       '#3B82F6',   // biru
  water_alert:        '#EF4444',   // merah
  water_maintenance:  '#F59E0B',   // amber
  water_offline:      '#94A3B8',   // abu
  gnss_online:        '#F59E0B',   // amber
  gnss_alert:         '#EF4444',   // merah
  gnss_maintenance:   '#CBD5E1',   // abu muda
  gnss_offline:       '#94A3B8',   // abu
};

/* ─────────────────────────────────────────────
   Build DivIcon HTML — self-contained animation
   Wrapper 28×28 so pulse ring never gets clipped.
   @keyframes injected inline per icon so it works
   even when Leaflet renders outside React DOM scope.
   ──────────────────────────────────────────── */
function buildIconHTML(color: string, isAlert: boolean, isMaintenance: boolean): string {
  const keyframes = `
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

  if (isAlert) {
    /* Red alert: solid dot + expanding pulse ring */
    return `
      <style>${keyframes}</style>
      <div style="
        position:relative;
        width:28px; height:28px;
        display:flex; align-items:center; justify-content:center;
      ">
        <!-- pulse ring -->
        <div style="
          position:absolute;
          width:14px; height:14px;
          border-radius:50%;
          background:${color};
          opacity:0;
          animation: sa-pulse 1.6s ease-out infinite;
        "></div>
        <!-- second ring, offset phase -->
        <div style="
          position:absolute;
          width:14px; height:14px;
          border-radius:50%;
          background:${color};
          opacity:0;
          animation: sa-pulse 1.6s ease-out 0.5s infinite;
        "></div>
        <!-- solid dot -->
        <div style="
          position:relative;
          width:12px; height:12px;
          border-radius:50%;
          background:${color};
          border:2.5px solid white;
          box-shadow:0 1px 5px rgba(0,0,0,0.35);
          z-index:2;
        "></div>
      </div>`;
  }

  if (isMaintenance) {
    /* Amber maintenance: blinking dot */
    return `
      <style>${keyframes}</style>
      <div style="
        position:relative;
        width:28px; height:28px;
        display:flex; align-items:center; justify-content:center;
      ">
        <div style="
          width:12px; height:12px;
          border-radius:50%;
          background:${color};
          border:2px solid white;
          box-shadow:0 1px 4px rgba(0,0,0,0.25);
          animation: sa-blink 2s ease-in-out infinite;
        "></div>
      </div>`;
  }

  /* Normal / offline: simple static dot */
  const opacity = color === '#94A3B8' ? '0.6' : '1';
  return `
    <div style="
      position:relative;
      width:28px; height:28px;
      display:flex; align-items:center; justify-content:center;
    ">
      <div style="
        width:11px; height:11px;
        border-radius:50%;
        background:${color};
        border:2.5px solid white;
        box-shadow:0 1px 4px rgba(0,0,0,0.25);
        opacity:${opacity};
      "></div>
    </div>`;
}

function makeIcon(color: string, status: string): L.DivIcon {
  const isAlert       = status === 'alert';
  const isMaintenance = status === 'maintenance';
  return window.L.divIcon({
    className: '',   // strip leaflet default padding/bg
    html:      buildIconHTML(color, isAlert, isMaintenance),
    iconSize:   [28, 28],
    iconAnchor: [14, 14],   // centered
    popupAnchor:[0, -14],   // popup above marker
  });
}

/* ─────────────────────────────────────────────
   Popup HTML
   ──────────────────────────────────────────── */
function buildPopup(sensor: Sensor, color: string): string {
  const rows = [
    ['Tipe',       sensor.type === 'water' ? 'Air Tanah' : 'GNSS'],
    ['Status',     sensor.status.charAt(0).toUpperCase() + sensor.status.slice(1)],
    ['Subsidence', `${sensor.subsidence.toFixed(2)} cm/thn`],
    ...(sensor.waterLevel !== undefined ? [['Muka Air', `${sensor.waterLevel} m`]] : []),
    ...(sensor.verticalValue !== undefined ? [['Nilai Vertikal', `${sensor.verticalValue} mm`]] : []),
    ['Update',     sensor.lastUpdate],
  ];

  const subColor = sensor.subsidence <= -4.0 ? '#EF4444'
                 : sensor.subsidence <= -2.5  ? '#F59E0B'
                 : '#22C55E';

  return `
    <div style="font-family:'IBM Plex Mono',monospace;min-width:190px;max-width:220px">
      <!-- header -->
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid #F1F5F9">
        <div style="width:8px;height:8px;border-radius:50%;background:${color};flex-shrink:0"></div>
        <span style="font-size:13px;font-weight:700;color:#0F172A">${sensor.code}</span>
        <span style="font-size:10px;color:#64748B;margin-left:2px">${sensor.location}</span>
      </div>
      <!-- rows -->
      <table style="width:100%;font-size:10px;border-collapse:collapse;line-height:1.6">
        ${rows.map(([k, v]) => `
          <tr>
            <td style="color:#94A3B8;padding:1px 0;white-space:nowrap">${k}</td>
            <td style="text-align:right;color:${k === 'Subsidence' ? subColor : k === 'Status' ? color : '#475569'};font-weight:${k === 'Subsidence' ? '600' : '400'}">${v}</td>
          </tr>`).join('')}
      </table>
    </div>`;
}

/* ─────────────────────────────────────────────
   Main Component
   ──────────────────────────────────────────── */
export default function SensorMap({ sensors, height = 300, onMarkerClick }: SensorMapProps) {
  const mapRef     = useRef<HTMLDivElement>(null);
  const leafletRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  /* Init map once */
  useEffect(() => {
    if (!mapRef.current || !window.L) return;

    leafletRef.current = window.L.map(mapRef.current, {
      center:      [-5.45, 105.27],   // Bandar Lampung
      zoom:        10,
      zoomControl: false,
    });

    window.L.control.zoom({ position: 'topright' }).addTo(leafletRef.current);

    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom:     19,
    }).addTo(leafletRef.current);

    return () => { leafletRef.current?.remove(); };
  }, []);

  /* Refresh markers whenever sensors change */
  useEffect(() => {
    if (!leafletRef.current || !window.L) return;

    // Remove previous markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    sensors.forEach(sensor => {
      const colorKey = `${sensor.type}_${sensor.status}`;
      const color    = MARKER_COLORS[colorKey] ?? '#94A3B8';
      const icon     = makeIcon(color, sensor.status);

      const marker = window.L.marker([sensor.lat, sensor.lng], { icon })
        .addTo(leafletRef.current!)
        .bindPopup(buildPopup(sensor, color), {
          maxWidth:    240,
          className:   'leaflet-popup-light',
        });

      if (onMarkerClick) {
        marker.on('click', () => onMarkerClick(sensor));
      }

      markersRef.current.push(marker);
    });

    /* Auto-fit bounds when sensors change */
    if (sensors.length > 0) {
      const bounds = window.L.latLngBounds(sensors.map(s => [s.lat, s.lng]));
      leafletRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
    }
  }, [sensors, onMarkerClick]);

  return (
    <>
      {/* Popup style override — injected once globally */}
      <style>{`
        .leaflet-popup-light .leaflet-popup-content-wrapper {
          border-radius: 12px;
          border: 1px solid #E2E8F0;
          box-shadow: 0 4px 16px rgba(0,0,0,0.10);
          padding: 0;
        }
        .leaflet-popup-light .leaflet-popup-content {
          margin: 12px 14px;
        }
        .leaflet-popup-light .leaflet-popup-tip {
          background: white;
        }
        .leaflet-popup-light .leaflet-popup-close-button {
          color: #94A3B8 !important;
          font-size: 16px !important;
          top: 6px !important;
          right: 8px !important;
        }
      `}</style>
      <div ref={mapRef} style={{ height, width: '100%' }} />
    </>
  );
}
