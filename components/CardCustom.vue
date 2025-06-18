<template>
  <div class="card">
    <div class="metric-title">{{ title }}</div>
    <div v-if="loading" class="metric-value">...</div>
    <div v-else class="metric-value">{{ value ?? '-' }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  value?: number
  loading: boolean
}>()
</script>
