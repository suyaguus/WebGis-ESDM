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
  staticWaterLevel: number | null;
  waterLevelTrend?: "rising" | "falling" | "stable" | "unknown";
  lastWaterLevelMeasurement?: string | null;
  isActive: boolean;
  isVerified: boolean;
  wellStatus: "draft" | "pending_approval" | "reviewed" | "approved" | "rejected";
  supervisorNote: string | null;
  companyId: string;
  companyName: string;
  businessId: string | null;
  businessName: string | null;
  wellType: "sumur_pantau" | "sumur_gali" | "sumur_bor";
  depthMeter: number | null;
  diameterInch: number | null;
  casingDiameter: number | null;
  pumpCapacity: number | null;
  pumpDepth: number | null;
  pipeDiameter: number | null;
  createdBy: string | null;
  createdAt: string;
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
  businesses?: { id: string; name: string; address: string | null }[];
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
