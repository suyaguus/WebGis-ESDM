export type SensorType   = 'air_tanah' | 'gnss'
export type SensorStatus = 'online' | 'offline' | 'warning' | 'critical'
export type CompanyStatus = 'active' | 'inactive' | 'evaluation'
export type AlertType    = 'critical' | 'warning' | 'info'

export interface Sensor {
  id: string
  code: string
  type: SensorType
  location: string
  lat: number
  lng: number
  status: SensorStatus
  value: number
  unit: string
  trend?: number
  lastUpdate: string
  companyId: string
  companyName: string
}

export interface Company {
  id: string
  name: string
  region: string
  sensorCount: number
  activeSensors: number
  status: CompanyStatus
  avgSubsidence: number
}

export interface Alert {
  id: string
  type: AlertType
  title: string
  subtitle: string
  detail?: string
  time: string
}

export interface TrendPoint {
  month: string
  value: number
  threshold: number
}
