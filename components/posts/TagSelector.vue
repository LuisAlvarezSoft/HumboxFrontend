<!-- components/posts/TagSelector.vue -->
<script setup lang="ts">
import { ref, watch, computed } from 'vue'

const props = defineProps<{
  modelValue: number[]
  tagsByCategory: Record<string, { id: number; subcategory: string }[]>
}>()

const emit = defineEmits(['update:modelValue'])

// Haz que selected sea una prop computada bidireccional
const selected = computed({
  get: () => props.modelValue,
  set: (val: number[]) => emit('update:modelValue', val)
})

function toggleTag(tagId: number) {
  if (selected.value.includes(tagId)) {
    selected.value = selected.value.filter((id) => id !== tagId)
  } else {
    selected.value = [...selected.value, tagId]
  }
}
</script>


<template>
  <div class="space-y-4">
    <div
      v-for="(tags, category) in tagsByCategory"
      :key="category"
      class="space-y-2"
    >
      <p class="text-sm font-semibold text-[var(--ui-text-muted)]">{{ category }}</p>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="tag in tags"
          :key="tag.id"
          @click="toggleTag(tag.id)"
          :class="[
            'px-3 py-1 rounded-full border text-sm transition',
            selected.includes(tag.id)
              ? 'bg-[var(--ui-primary)] text-white border-transparent'
              : 'bg-transparent text-[var(--ui-text)] border-[var(--ui-border-muted)] hover:bg-[var(--ui-surface-muted)]'
          ]"
        >
          {{ tag.subcategory }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
button {
  cursor: pointer;
  outline: none;
}
</style>
