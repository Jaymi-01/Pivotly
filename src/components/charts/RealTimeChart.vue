<script setup lang="ts">
import { computed } from 'vue';
import VChart from 'vue-echarts';
import '../../services/echarts';

interface Props {
  title?: string;
  options: any;
  height?: string;
}

const props = withDefaults(defineProps<Props>(), {
  height: '100%',
});

const containerStyle = computed(() => ({
  height: props.height === '100%' ? '100%' : props.height,
  width: '100%',
}));
</script>

<template>
  <div class="bg-white border border-warm-grey/20 rounded-lg p-4 shadow-sm flex flex-col min-h-0 flex-grow">
    <h3 v-if="title" class="text-[10px] font-space uppercase tracking-widest text-warm-grey mb-4 flex-shrink-0">
      {{ title }}
    </h3>
    <div :style="containerStyle" class="flex-grow min-h-0">
      <VChart :option="options" autoresize class="chart" />
    </div>
  </div>
</template>

<style scoped>
.chart {
  height: 100%;
  width: 100%;
}
</style>
