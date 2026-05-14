<script setup lang="ts">
import { format } from 'date-fns';
import { PhCircle, PhWarning, PhProhibit, PhInfo } from '@phosphor-icons/vue';
import type { DashboardEvent, EventSeverity } from '../../types';

interface Props {
  events: DashboardEvent[];
}

defineProps<Props>();

const getSeverityStyles = (severity: EventSeverity) => {
  switch (severity) {
    case 'info': return { icon: PhInfo, color: 'text-blue-500', bg: 'bg-blue-500/5', border: 'border-blue-500/10' };
    case 'warning': return { icon: PhWarning, color: 'text-amber-500', bg: 'bg-amber-500/5', border: 'border-amber-500/10' };
    case 'error': return { icon: PhProhibit, color: 'text-red-500', bg: 'bg-red-500/5', border: 'border-red-500/10' };
    case 'critical': return { icon: PhCircle, color: 'text-rose-600', bg: 'bg-rose-600/5', border: 'border-rose-600/10' };
    default: return { icon: PhInfo, color: 'text-warm-grey', bg: 'bg-gray-50', border: 'border-gray-100' };
  }
};
</script>

<template>
  <div class="bg-white border border-warm-grey/20 rounded-lg overflow-hidden flex flex-col h-full shadow-sm">
    <div class="px-4 py-3 border-b border-warm-grey/10 flex justify-between items-center bg-gray-50/50">
      <div class="flex items-center gap-2">
        <h3 class="text-xs font-space uppercase tracking-widest text-warm-grey">Live Activity Feed</h3>
        <span class="text-[9px] px-1.5 py-0.5 rounded border border-warm-grey/20 text-warm-grey font-space">
          {{ events.length }} EVENTS
        </span>
      </div>
      <div class="flex items-center gap-2">
        <span class="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
        <span class="text-[10px] font-space text-warm-grey">STREAM ACTIVE</span>
      </div>
    </div>
    
    <div class="flex-grow overflow-y-auto custom-scrollbar">
      <div v-if="events.length === 0" class="h-full flex flex-col items-center justify-center p-8 text-center">
        <PhInfo :size="32" class="text-warm-grey/20 mb-2" />
        <p class="text-xs font-space text-warm-grey uppercase tracking-widest">Waiting for stream data...</p>
      </div>
      
      <div v-else class="divide-y divide-warm-grey/5">
        <div 
          v-for="event in events" 
          :key="event.id" 
          :class="['px-5 py-4 transition-all hover:bg-cream-white group flex flex-col gap-1', getSeverityStyles(event.severity).bg]"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex items-start gap-3">
              <div :class="['p-2 rounded-md border mt-0.5', getSeverityStyles(event.severity).color, getSeverityStyles(event.severity).border]">
                <component :is="getSeverityStyles(event.severity).icon" :size="14" weight="bold" />
              </div>
              <div>
                <p :class="['text-xs font-bold leading-snug', getSeverityStyles(event.severity).color]">
                  {{ event.message }}
                </p>
                <div class="flex items-center gap-2 text-[10px] font-space text-warm-grey mt-1">
                  <span class="uppercase font-bold tracking-tight text-[9px]">{{ event.source }}</span>
                  <span>•</span>
                  <span>{{ format(event.timestamp, 'HH:mm:ss.SSS') }}</span>
                </div>
              </div>
            </div>
            <div class="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
              <button class="text-[9px] font-space text-pivot hover:underline font-bold">DETAILS</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(142, 142, 142, 0.2); border-radius: 10px; }
</style>
