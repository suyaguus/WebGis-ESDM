export type Role = "superadmin" | "admin" | "kadis" | "surveyor";

export type SensorStatus = "online" | "offline" | "alert" | "maintenance";
export type SensorType = "water" | "gnss";
export type CompanyStatus = "online" | "offline" | "maintenance";
export type AlertSeverity = "critical" | "warning" | "info";

export interface Sensor {
  id: string;
  code: string;
  type: SensorType;
  location: string;
  lat: number | null;
  lng: number | null;
  status: SensorStatus;
  subsidence: number;
  waterLevel?: number;
  verticalValue?: number;
  companyId: string;
  lastUpdate: string;
}

export interface Company {
  id: string;
  name: string;
  region: string;
  email?: string;
  phone?: string;
  type?: string;
  sensorCount: number;
  status: CompanyStatus;
  quota: number;
  quotaUsed: number;
  avgSubsidence: number;
}

export interface Alert {
  id: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  sensorCode?: string;
  companyName?: string;
  timestamp: string;
  isRead: boolean;
}

export interface StatCard {
  label: string;
  value: string | number;
  sub: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  color: "cyan" | "amber" | "red" | "green" | "purple" | "blue";
}

export interface TrendDataPoint {
  label: string;
  subsidence: number;
  threshold: number;
}

export interface NavItem {
  key: string;
  label: string;
  icon: string;
  badge?: number | string;
  badgeColor?: "red" | "amber";
  section: string;
}

export interface SystemStatus {
  uptime: string;
  isOnline: boolean;
}
