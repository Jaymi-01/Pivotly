export interface StockData {
  symbol: string;
  price: number;
  change: number;
}

export interface SensorData {
  id: string;
  value: number;
  type: string;
}

export interface MetricUpdate {
  timestamp: number;
  cpu: number;
  memory: number;
  stockPrice: number; // Primary stock (e.g. BTC)
  sensorValue: number; // Primary sensor (e.g. Temp)
  activeThreats: number;
}

export type EventSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface DashboardEvent {
  id: string;
  timestamp: number;
  message: string;
  severity: EventSeverity;
  source: string;
  type: 'system' | 'security' | 'market';
}

export interface DashboardState {
  metrics: MetricUpdate[];
  events: DashboardEvent[];
  isLive: boolean;
  timeRange: '1m' | '5m' | '1h' | 'all';
  lastUpdate: number;
}
