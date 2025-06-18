<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 border border-gray-100 dark:border-gray-700">
    <div class="flex items-center justify-between mb-4">
      <div :class="`p-3 rounded-lg bg-gradient-to-r ${color}`">
        <component :is="icon" class="h-6 w-6 text-white" />
      </div>
      <div class="flex items-center text-green-500">
        <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
        </svg>
        <span class="text-sm font-medium">{{ trend }}%</span>
      </div>
    </div>
    
    <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">{{ title }}</h3>
    
    <div class="space-y-3">
      <div>
        <div class="flex justify-between items-center mb-1">
          <span class="text-sm text-gray-500 dark:text-gray-400">Total</span>
          <span class="font-bold text-2xl text-gray-800 dark:text-gray-100">{{ formatNumber(value) }}</span>
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            :class="`h-2 rounded-full bg-gradient-to-r ${color}`"
            :style="{ width: `${Math.min((value / (value * 1.2)) * 100, 100)}%` }"
          ></div>
        </div>
      </div>
      
      <div>
        <div class="flex justify-between items-center mb-1">
          <span class="text-sm text-gray-500 dark:text-gray-400 flex items-center">
            <svg class="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            {{ timeLabel }}
          </span>
          <span class="font-semibold text-lg text-gray-700 dark:text-gray-200">{{ formatNumber(todayValue) }}</span>
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            :class="`h-2 rounded-full bg-gradient-to-r ${color} opacity-70`"
            :style="{ width: `${Math.min((todayValue / (value || 1)) * 100, 100)}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  value: number
  todayValue: number
  icon: string
  color: string
  trend: number
  timeLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  timeLabel: 'Hoy'
})

const formatNumber = (num: number | null | undefined): string => {
  if (!num) return '0'
  return num.toLocaleString()
}
</script>