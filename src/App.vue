<script setup lang="ts">
import { onMounted, onUnmounted, computed, ref } from 'vue';
import { useDashboardStore } from './stores/useDashboardStore';
import { dataGenerator } from './services/dataGenerator';
import { format } from 'date-fns';
import DashboardHeader from './components/dashboard/DashboardHeader.vue';
import MetricCard from './components/dashboard/MetricCard.vue';
import ActivityFeed from './components/dashboard/ActivityFeed.vue';
import RealTimeChart from './components/charts/RealTimeChart.vue';
import { 
  PhCurrencyBtc,
  PhThermometerHot,
  PhCpu,
  PhShieldWarning
} from '@phosphor-icons/vue';

const store = useDashboardStore();
const chartsRef = ref<HTMLDivElement | null>(null);
const feedHeight = ref('auto');

onMounted(() => {
  dataGenerator.start();
  if (chartsRef.value) {
    feedHeight.value = chartsRef.value.offsetHeight + 'px';
  }
});

onUnmounted(() => {
  dataGenerator.stop();
});

const latest = computed(() => store.metrics[store.metrics.length - 1] || { 
  cpu: 0, memory: 0, stockPrice: 0, sensorValue: 0, activeThreats: 0 
});

const getBaseChartOptions = () => ({
  backgroundColor: 'transparent',
  animation: false,
  tooltip: {
    trigger: 'axis',
    backgroundColor: '#2B2B2B',
    borderColor: '#D3540030',
    borderWidth: 1,
    textStyle: { color: '#F9F7F2', fontFamily: 'Space Mono', fontSize: 10 },
  },
  grid: { top: 30, left: 50, right: 20, bottom: 30 },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: store.filteredMetrics.map(m => format(m.timestamp, 'HH:mm:ss')),
    axisLabel: { color: '#8E8E8E', fontSize: 9, fontFamily: 'Space Mono' },
    axisLine: { lineStyle: { color: '#8E8E8E30' } },
  },
  yAxis: {
    type: 'value',
    axisLabel: { color: '#8E8E8E', fontSize: 9, fontFamily: 'Space Mono' },
    splitLine: { lineStyle: { color: '#8E8E8E15' } },
    axisLine: { show: false },
  },
});

// Line Chart: Stock Prices (BTC)
const stockOptions = computed(() => ({
  ...getBaseChartOptions(),
  series: [{
    name: 'BTC/USD',
    type: 'line',
    showSymbol: false,
    smooth: true,
    data: store.filteredMetrics.map(m => m.stockPrice),
    lineStyle: { width: 3, color: '#D35400' },
    areaStyle: {
      color: {
        type: 'linear',
        x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [{ offset: 0, color: '#D3540030' }, { offset: 1, color: '#D3540000' }]
      }
    }
  }]
}));

// Area Chart: Sensor Metrics (Temperature)
const sensorOptions = computed(() => ({
  ...getBaseChartOptions(),
  series: [{
    name: 'Server Temp',
    type: 'line',
    smooth: true,
    showSymbol: false,
    data: store.filteredMetrics.map(m => m.sensorValue),
    lineStyle: { width: 3, color: '#2B2B2B' },
    areaStyle: {
      color: {
        type: 'linear',
        x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [{ offset: 0, color: '#2B2B2B20' }, { offset: 1, color: '#2B2B2B00' }]
      }
    }
  }]
}));

// Bar Chart: Resource Usage (History)
const usageOptions = computed(() => {
  const recentMetrics = store.filteredMetrics.slice(-20);
  return {
    ...getBaseChartOptions(),
    xAxis: {
      ...getBaseChartOptions().xAxis,
      data: recentMetrics.map(m => format(m.timestamp, 'HH:mm:ss')),
      boundaryGap: true,
    },
    series: [
      {
        name: 'CPU Load',
        type: 'bar',
        data: recentMetrics.map(m => m.cpu),
        itemStyle: { color: '#D35400' },
        barWidth: '35%'
      },
      {
        name: 'Memory',
        type: 'bar',
        data: recentMetrics.map(m => m.memory),
        itemStyle: { color: '#2B2B2B' },
        barWidth: '35%'
      }
    ]
  };
});

// Radar Chart: Security Threat Vector
const threatRadarOptions = computed(() => ({
  backgroundColor: 'transparent',
  radar: {
    indicator: [
      { name: 'Brute Force', max: 100 },
      { name: 'SQL Injection', max: 100 },
      { name: 'DDoS', max: 100 },
      { name: 'XSS', max: 100 },
      { name: 'Anomalous', max: 100 }
    ],
    axisName: { color: '#8E8E8E', fontFamily: 'Space Mono', fontSize: 10 },
    splitArea: { show: false },
    splitLine: { lineStyle: { color: '#8E8E8E20' } },
    shape: 'circle'
  },
  series: [{
    type: 'radar',
    data: [{
      value: [
        latest.value.activeThreats * 5 + 20,
        latest.value.activeThreats * 3 + 10,
        latest.value.activeThreats * 7 + 5,
        latest.value.activeThreats * 2 + 15,
        latest.value.activeThreats * 4 + 25
      ],
      name: 'Threat Vectors',
      itemStyle: { color: '#D35400' },
      areaStyle: { color: '#D3540030' }
    }]
  }]
}));
</script>

<template>
  <div class="min-h-screen flex flex-col bg-cream-white selection:bg-pivot/20">
    <DashboardHeader class="flex-shrink-0 sticky top-0 z-50" />

    <main class="flex-grow p-4 md:p-8 flex flex-col gap-8 max-w-[1800px] mx-auto w-full">
      <!-- Diverse Domain Metrics -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          label="BTC / USD" 
          :value="latest.stockPrice.toFixed(2)" 
          unit="$" 
          :icon="PhCurrencyBtc"
          :trend="store.filteredMetrics.slice(-20).map(m => m.stockPrice)"
          color="#D35400"
        />
        <MetricCard 
          label="Node Temp" 
          :value="latest.sensorValue.toFixed(1)" 
          unit="°C" 
          :icon="PhThermometerHot"
          :trend="store.filteredMetrics.slice(-20).map(m => m.sensorValue)"
          color="#2B2B2B"
        />
        <MetricCard 
          label="CPU Load" 
          :value="latest.cpu.toFixed(1)" 
          unit="%" 
          :icon="PhCpu"
          :trend="store.filteredMetrics.slice(-20).map(m => m.cpu)"
          color="#D35400"
        />
        <MetricCard 
          label="Threat Index" 
          :value="latest.activeThreats" 
          unit="lvl" 
          :icon="PhShieldWarning"
          :trend="store.filteredMetrics.slice(-20).map(m => m.activeThreats)"
          color="#8E8E8E"
        />
      </div>

      <!-- Main Analytics Grid -->
      <!-- 
        KEY CHANGE: 
        - `items-start` → `items-stretch` so both columns share the same height
        - Activity feed wrapper uses `h-full` instead of fixed `h-[724px]`
      -->
      <div class="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        <!-- Multi-Domain Charts -->
        <div ref="chartsRef" class="xl:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <RealTimeChart title="Financial: Market Volatility (BTC)" :options="stockOptions" height="350px" />
          <RealTimeChart title="IoT: Environmental Telemetry" :options="sensorOptions" height="350px" />
          <RealTimeChart title="Compute: Resource History" :options="usageOptions" height="350px" />
          <RealTimeChart title="Security: Threat Vector Analysis" :options="threatRadarOptions" height="350px" />
        </div>

        <!-- Unified Activity Feed (Vertical Paged) -->
        <div class="xl:col-span-4 flex flex-col" :style="{ height: feedHeight }">
          <ActivityFeed :events="store.events" class="flex-grow" />
        </div>
      </div>
    </main>

    <footer class="px-8 py-4 border-t border-warm-grey/10 bg-white/50 text-center">
      <p class="text-[10px] font-space text-warm-grey uppercase tracking-widest">
        Pivotly Global Operations Engine | Multi-Domain Stream Active | {{ format(store.lastUpdate, 'HH:mm:ss.SSS') }}
      </p>
    </footer>
  </div>
</template>