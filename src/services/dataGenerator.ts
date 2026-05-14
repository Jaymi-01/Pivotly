import type { MetricUpdate, DashboardEvent } from '../types';

type MetricCallback = (metric: MetricUpdate) => void;
type EventCallback = (event: DashboardEvent) => void;

class DataGenerator {
  private metricInterval: ReturnType<typeof setInterval> | null = null;
  private eventTimeout: ReturnType<typeof setTimeout> | null = null;
  private metricCallbacks: MetricCallback[] = [];
  private eventCallbacks: EventCallback[] = [];

  // Initial values for smooth simulation
  private btcPrice = 64250.50;
  private currentTemp = 22.4;
  private threatLevel = 2;

  private securitySources = ['firewall-primary', 'ips-node-4', 'waf-global', 'ddos-shield'];
  private attackTypes = [
    'SQL Injection attempt blocked',
    'Brute force attack detected',
    'Port scan detected',
    'Anomalous traffic spike',
    'Cross-site scripting attempt',
    'Unauthorized login attempt',
  ];

  public start() {
    this.stop();
    this.metricInterval = setInterval(() => {
      // Simulate BTC price movement
      this.btcPrice += (Math.random() - 0.5) * 15;
      
      // Simulate Sensor (Temperature) fluctuations
      this.currentTemp += (Math.random() - 0.5) * 0.2;
      
      // Simulate Threat level shifts
      if (Math.random() > 0.95) this.threatLevel = Math.floor(Math.random() * 15);

      const metric: MetricUpdate = {
        timestamp: Date.now(),
        cpu: 10 + Math.random() * 60,
        memory: 40 + Math.random() * 40,
        stockPrice: this.btcPrice,
        sensorValue: this.currentTemp,
        activeThreats: this.threatLevel,
      };
      this.metricCallbacks.forEach(cb => cb(metric));
    }, 500);

    this.scheduleEvent();
  }

  public stop() {
    if (this.metricInterval) clearInterval(this.metricInterval);
    if (this.eventTimeout) clearTimeout(this.eventTimeout);
  }

  private scheduleEvent() {
    this.eventTimeout = setTimeout(() => {
      const isSecurity = Math.random() > 0.4;
      
      let event: DashboardEvent;
      
      if (isSecurity) {
        event = {
          id: Math.random().toString(36).substring(2, 11),
          timestamp: Date.now(),
          message: this.attackTypes[Math.floor(Math.random() * this.attackTypes.length)],
          severity: Math.random() > 0.7 ? 'error' : 'warning',
          source: this.securitySources[Math.floor(Math.random() * this.securitySources.length)],
          type: 'security',
        };
      } else {
        event = {
          id: Math.random().toString(36).substring(2, 11),
          timestamp: Date.now(),
          message: 'Market data feed synchronized',
          severity: 'info',
          source: 'nasdaq-api',
          type: 'market',
        };
      }
      
      this.eventCallbacks.forEach(cb => cb(event));
      this.scheduleEvent();
    }, 1000 + Math.random() * 5000);
  }

  public onMetric(cb: MetricCallback) { this.metricCallbacks.push(cb); }
  public onEvent(cb: EventCallback) { this.eventCallbacks.push(cb); }
}

export const dataGenerator = new DataGenerator();
