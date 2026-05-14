import { defineStore } from 'pinia';
import { ref, shallowRef, computed } from 'vue';
import type { MetricUpdate, DashboardEvent, DashboardState } from '../types';
import { dataGenerator } from '../services/dataGenerator';

export const useDashboardStore = defineStore('dashboard', () => {
  const metrics = shallowRef<MetricUpdate[]>([]);
  const events = shallowRef<DashboardEvent[]>([]);
  const isLive = ref(true);
  const timeRange = ref<DashboardState['timeRange']>('5m');
  const lastUpdate = ref(Date.now());

  const MAX_METRICS = 5000; // Increased to support longer time ranges
  const MAX_EVENTS = 500;

  const addMetric = (metric: MetricUpdate) => {
    if (!isLive.value) return;
    metrics.value = [...metrics.value, metric].slice(-MAX_METRICS);
    lastUpdate.value = metric.timestamp;
  };

  const filteredMetrics = computed(() => {
    const now = lastUpdate.value;
    let cutoff = 0;
    
    if (timeRange.value === '1m') cutoff = now - 60 * 1000;
    else if (timeRange.value === '5m') cutoff = now - 5 * 60 * 1000;
    else if (timeRange.value === '1h') cutoff = now - 60 * 60 * 1000;
    else return metrics.value;

    return metrics.value.filter(m => m.timestamp >= cutoff);
  });

  const addEvent = (event: DashboardEvent) => {
    if (!isLive.value) return;
    const newEvents = [event, ...events.value];
    if (newEvents.length > MAX_EVENTS) newEvents.pop();
    events.value = newEvents;
  };

  const toggleLive = () => { isLive.value = !isLive.value; };
  const setTimeRange = (range: DashboardState['timeRange']) => { timeRange.value = range; };
  const clearData = () => {
    metrics.value = [];
    events.value = [];
  };

  dataGenerator.onMetric(addMetric);
  dataGenerator.onEvent(addEvent);

  return {
    metrics,
    filteredMetrics,
    events,
    isLive,
    timeRange,
    lastUpdate,
    toggleLive,
    setTimeRange,
    clearData,
  };
});
