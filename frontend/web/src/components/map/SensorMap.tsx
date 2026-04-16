import React, { useEffect, useRef } from 'react';
import type { Sensor } from '../../../../web/src/types';

// Leaflet is loaded via CDN in index.html; declare global L
declare global {
  interface Window { L: typeof import('leaflet'); }
}

interface SensorMapProps {
  sensors: Sensor[];
  height?: number;
  onMarkerClick?: (sensor: Sensor) => void;
}

const MARKER_COLORS: Record<string, string> = {
  water_online:      '#3B82F6',
  water_alert:       '#EF4444',
  water_maintenance: '#F59E0B',
  water_offline:     '#94A3B8',
  gnss_online:       '#F59E0B',
  gnss_alert:        '#EF4444',
  gnss_maintenance:  '#F59E0B',
  gnss_offline:      '#94A3B8',
};

function makeIcon(color: string): L.DivIcon {
  return window.L.divIcon({
    className: 'blink-alert',
    html: `
      <div style="
        width:12px;height:12px;border-radius:50%;
        background:${color};
        border:2.5px solid white;
        box-shadow:0 1px 4px rgba(0,0,0,0.25);
      "></div>`,
    iconSize:   [12, 12],
    iconAnchor: [6, 6],
  });
}

export default function SensorMap({ sensors, height = 300, onMarkerClick }: SensorMapProps) {
  const mapRef      = useRef<HTMLDivElement>(null);
  const leafletRef  = useRef<L.Map | null>(null);
  const markersRef  = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current || !window.L) return;

    // Init map
    leafletRef.current = window.L.map(mapRef.current, {
      center: [-6.2, 106.816],
      zoom: 11,
      zoomControl: false,
    });

    window.L.control.zoom({ position: 'topright' }).addTo(leafletRef.current);

    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 18,
    }).addTo(leafletRef.current);

    return () => { leafletRef.current?.remove(); };
  }, []);

  // Add / refresh markers
  useEffect(() => {
    if (!leafletRef.current || !window.L) return;

    // Clear old
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    sensors.forEach((sensor) => {
      const colorKey = `${sensor.type}_${sensor.status}`;
      const color    = MARKER_COLORS[colorKey] ?? '#94A3B8';
      const icon     = makeIcon(color);

      const marker = window.L.marker([sensor.lat, sensor.lng], { icon })
        .addTo(leafletRef.current!)
        .bindPopup(`
          <div style="font-family:'IBM Plex Mono',monospace;min-width:180px">
            <div style="font-size:12px;font-weight:600;color:#0F172A;margin-bottom:6px">${sensor.code} · ${sensor.location}</div>
            <table style="width:100%;font-size:10px;border-collapse:collapse">
              <tr><td style="color:#94A3B8;padding:2px 0">Tipe</td><td style="text-align:right;color:#475569">${sensor.type.toUpperCase()}</td></tr>
              <tr><td style="color:#94A3B8;padding:2px 0">Status</td><td style="text-align:right;color:${color}">${sensor.status.toUpperCase()}</td></tr>
              <tr><td style="color:#94A3B8;padding:2px 0">Subsidence</td><td style="text-align:right;color:${sensor.subsidence <= -4 ? '#EF4444' : '#475569'}">${sensor.subsidence.toFixed(2)} cm/thn</td></tr>
              ${sensor.waterLevel !== undefined ? `<tr><td style="color:#94A3B8;padding:2px 0">Muka Air</td><td style="text-align:right;color:#475569">${sensor.waterLevel} m</td></tr>` : ''}
              <tr><td style="color:#94A3B8;padding:2px 0">Update</td><td style="text-align:right;color:#475569">${sensor.lastUpdate}</td></tr>
            </table>
          </div>
        `, { maxWidth: 220 });

      if (onMarkerClick) marker.on('click', () => onMarkerClick(sensor));
      markersRef.current.push(marker);
    });
  }, [sensors, onMarkerClick]);

  return <div ref={mapRef} style={{ height, width: '100%' }} />;
}
