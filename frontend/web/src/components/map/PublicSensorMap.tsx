import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Sensor } from '@/types';

interface PublicSensorMapProps {
  sensors: Sensor[];
  className?: string;
}

const MARKER_COLORS: Record<string, string> = {
  water_online: '#3B82F6',
  water_alert: '#EF4444',
  water_maintenance: '#F59E0B',
  water_offline: '#94A3B8',
  gnss_online: '#F59E0B',
  gnss_alert: '#EF4444',
  gnss_maintenance: '#CBD5E1',
  gnss_offline: '#94A3B8',
};

const KEYFRAMES = `
  @keyframes sa-pulse {
    0% { transform: scale(1); opacity: 0.8; }
    70% { transform: scale(2.2); opacity: 0; }
    100% { transform: scale(2.2); opacity: 0; }
  }
  @keyframes sa-blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.45; }
  }
`;

function buildDropletIcon(color: string, opacity = '1'): string {
  return `
    <svg width="20" height="20" viewBox="0 0 20 20" style="opacity:${opacity};filter:drop-shadow(0 1px 3px rgba(0,0,0,0.3));">
      <path d="M10 2 C14 5, 16 8, 16 11 C16 15.4, 13.3 18, 10 18 C6.7 18, 4 15.4, 4 11 C4 8, 6 5, 10 2 Z" fill="${color}" stroke="white" stroke-width="1.3" stroke-linejoin="round"/>
    </svg>`;
}

function buildIconHTML(color: string, status: Sensor['status']): string {
  const isAlert = status === 'alert';
  const isMaintenance = status === 'maintenance';

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

  const opacity = status === 'offline' ? '0.6' : '1';
  return `
    <div style="position:relative;width:30px;height:30px;display:flex;align-items:center;justify-content:center;">
      ${buildDropletIcon(color, opacity)}
    </div>`;
}

function makeIcon(color: string, status: Sensor['status']): L.DivIcon {
  return L.divIcon({
    className: '',
    html: buildIconHTML(color, status),
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -35],
  });
}

function buildPopup(sensor: Sensor): string {
  const typeLabel = sensor.type === 'water' ? 'Air Tanah' : 'GNSS';
  const statusLabel = sensor.status.charAt(0).toUpperCase() + sensor.status.slice(1);
  const subColor = sensor.subsidence <= -4.0
    ? '#EF4444'
    : sensor.subsidence <= -2.5
      ? '#F59E0B'
      : '#22C55E';

  return `
    <div style="font-family:'IBM Plex Mono',monospace;min-width:190px;max-width:220px;color:#0f172a;">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid #e2e8f0;">
        <strong style="font-size:13px;">${sensor.code}</strong>
        <span style="font-size:10px;color:#64748b;">${typeLabel}</span>
      </div>
      <table style="width:100%;font-size:10px;border-collapse:collapse;line-height:1.55;">
        <tr>
          <td style="color:#94a3b8;padding:1px 0;">Lokasi</td>
          <td style="text-align:right;color:#475569;padding:1px 0;">${sensor.location}</td>
        </tr>
        <tr>
          <td style="color:#94a3b8;padding:1px 0;">Status</td>
          <td style="text-align:right;color:#475569;padding:1px 0;">${statusLabel}</td>
        </tr>
        <tr>
          <td style="color:#94a3b8;padding:1px 0;">Subsidence</td>
          <td style="text-align:right;color:${subColor};font-weight:600;padding:1px 0;">${sensor.subsidence.toFixed(2)} cm/thn</td>
        </tr>
        <tr>
          <td style="color:#94a3b8;padding:1px 0;">Update</td>
          <td style="text-align:right;color:#475569;padding:1px 0;">${sensor.lastUpdate}</td>
        </tr>
      </table>
    </div>`;
}

export default function PublicSensorMap({ sensors, className }: PublicSensorMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [-5.45, 105.27],
      zoom: 9,
      zoomControl: false,
      zoomAnimation: false,
    });

    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    L.control.zoom({ position: 'topright' }).addTo(map);

    const onResize = () => map.invalidateSize();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      markersRef.current.forEach((marker) => {
        marker.off();
        marker.remove();
      });
      markersRef.current = [];
      map.stop();
      map.off();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((marker) => {
      marker.off();
      marker.remove();
    });
    markersRef.current = [];

    sensors.forEach((sensor) => {
      const color = MARKER_COLORS[`${sensor.type}_${sensor.status}`] ?? '#94A3B8';
      const markerIcon = makeIcon(color, sensor.status);

      const marker = L.marker([sensor.lat, sensor.lng], { icon: markerIcon })
        .addTo(map)
        .bindPopup(buildPopup(sensor), { maxWidth: 240, className: 'leaflet-popup-light' });

      markersRef.current.push(marker);
    });

    if (sensors.length > 0) {
      const bounds = L.latLngBounds(sensors.map((sensor) => [sensor.lat, sensor.lng] as [number, number]));
      map.fitBounds(bounds, { padding: [44, 44], maxZoom: 12 });
    }
  }, [sensors]);

  return (
    <>
      <style>{`
        .public-map .leaflet-top.leaflet-right {
          top: 10px;
          right: 10px;
        }
        .public-map .leaflet-control-zoom {
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
        }
        .public-map .leaflet-control-zoom a {
          width: 30px;
          height: 30px;
          line-height: 30px;
          color: #334155;
          font-size: 16px;
          background: #FFFFFF;
        }
        .public-map .leaflet-control-zoom a:hover {
          background: #F8FAFC;
          color: #0F172A;
        }
        .public-map .leaflet-popup-content-wrapper {
          border-radius: 12px;
          border: 1px solid #E2E8F0;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.10);
          padding: 0;
        }
        .public-map .leaflet-popup-content {
          margin: 12px 14px;
        }
        .public-map .leaflet-popup-tip {
          background: #FFFFFF;
        }
        .public-map .leaflet-popup-close-button {
          color: #94A3B8 !important;
          font-size: 16px !important;
          top: 6px !important;
          right: 8px !important;
        }
      `}</style>
      <div ref={mapContainerRef} className={`public-map ${className ?? ''}`} />
    </>
  );
}
