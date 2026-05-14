<script setup lang="ts">
import { computed } from 'vue';
import VChart from 'vue-echarts';
import '../../services/echarts';

interface Props {
  label: string;
  value: string | number;
  unit?: string;
  icon?: any;
  trend?: number[];
  color?: string;
}

const props = withDefaults(defineProps<Props>(), {
  color: '#D35400',
  trend: () => []
});

const sparklineOptions = computed(() => ({
  grid: { left: 0, right: 0, top: 0, bottom: 0 },
  xAxis: { type: 'category', show: false },
  yAxis: { type: 'value', show: false, min: 'dataMin', max: 'dataMax' },
  series: [{
    type: 'line',
    data: props.trend,
    showSymbol: false,
    smooth: true,
    lineStyle: { width: 2, color: props.color },
    areaStyle: { color: props.color + '10' },
    animation: false
  }]
}));
</script>

<template>
  <div class="bg-white border border-warm-grey/20 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div v-if="icon" class="p-2 bg-gray-50 text-warm-grey rounded-lg group-hover:bg-pivot/10 group-hover:text-pivot transition-colors">
          <component :is="icon" :size="20" weight="duotone" />
        </div>
        <div>
          <p class="text-[10px] font-space uppercase tracking-widest text-warm-grey">{{ label }}</p>
          <div class="flex items-baseline gap-1">
            <h2 class="text-2xl font-bold text-deep-charcoal">{{ value }}</h2>
            <span v-if="unit" class="text-[10px] font-space text-warm-grey">{{ unit }}</span>
          </div>
        </div>
      </div>
      
      <div v-if="trend.length > 0" class="w-24 h-12">
        <VChart :option="sparklineOptions" autoresize />
      </div>
    </div>
  </div>
</template>
