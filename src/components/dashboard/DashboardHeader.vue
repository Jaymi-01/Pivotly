<script setup lang="ts">
import { PhPlay, PhPause, PhTrash, PhMonitor } from '@phosphor-icons/vue';
import { useDashboardStore } from '../../stores/useDashboardStore';

const store = useDashboardStore();
</script>

<template>
  <header class="bg-deep-charcoal text-cream-white px-6 py-4 flex items-center justify-between shadow-xl flex-shrink-0">
    <div class="flex items-center gap-3">
      <div class="bg-pivot p-2 rounded-lg">
        <PhMonitor :size="24" weight="bold" />
      </div>
      <div>
        <h1 class="text-xl font-bold tracking-tight">PIVOTLY <span class="text-pivot">ENGINE</span></h1>
        <p class="text-[9px] font-space text-warm-grey uppercase tracking-widest">Production Control Console</p>
      </div>
    </div>

    <div class="flex items-center gap-4">
      <div class="hidden md:flex items-center bg-white/5 p-1 rounded-lg border border-white/10">
        <button 
          v-for="range in ['1m', '5m', '1h', 'all']" 
          :key="range"
          @click="store.setTimeRange(range as any)"
          :class="[
            'px-3 py-1 rounded-md text-[10px] font-space transition-all',
            store.timeRange === range ? 'bg-pivot text-white shadow-lg' : 'text-warm-grey hover:text-cream-white'
          ]"
        >
          {{ range.toUpperCase() }}
        </button>
      </div>

      <button 
        @click="store.toggleLive"
        :class="[
          'flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all border min-w-[100px] justify-center',
          store.isLive 
            ? 'bg-green-500/10 border-green-500/50 text-green-500' 
            : 'bg-pivot/10 border-pivot/50 text-pivot'
        ]"
      >
        <component :is="store.isLive ? PhPause : PhPlay" :size="14" weight="bold" />
        {{ store.isLive ? 'LIVE' : 'PAUSED' }}
      </button>

      <button 
        @click="store.clearData"
        class="p-2 rounded-lg border border-white/10 text-warm-grey hover:bg-white/5 transition-all group"
        title="Clear Dashboard Data"
      >
        <PhTrash :size="16" class="group-hover:text-pivot transition-colors" />
      </button>
    </div>
  </header>
</template>
