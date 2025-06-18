<template>
  <div>
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { Chart } from 'chart.js'
import type { ChartConfiguration } from 'chart.js'

const props = defineProps({
  labels: Array,
  values: Array,
  label: String
})

const chartRef = ref<HTMLCanvasElement>()
let chart: Chart | null = null

const renderChart = () => {
  if (chartRef.value) {
    const ctx = chartRef.value.getContext('2d')
    if (ctx) {
      chart?.destroy()
      chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: props.labels,
          datasets: [{
            label: props.label,
            data: props.values,
            backgroundColor: 'rgba(99, 102, 241, 0.5)',
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      } as ChartConfiguration)
    }
  }
}

onMounted(renderChart)
watch([() => props.labels, () => props.values], renderChart, { immediate: true })

onBeforeUnmount(() => {
  chart?.destroy()
})
</script>

<style scoped>
div {
  height: 200px;
}
</style>
