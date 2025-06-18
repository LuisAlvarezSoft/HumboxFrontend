<template>
  <div>
    <h2 class="text-lg font-semibold mb-2">Selecciona tus preferencias</h2>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="pref in allPreferences"
        :key="pref"
        @click="togglePreference(pref)"
        :class="[
          'px-3 py-1 rounded-full text-sm border',
          selected.includes(pref)
            ? 'bg-blue-500 text-white border-blue-500'
            : 'bg-white text-gray-700 border-gray-300'
        ]"
      >
        {{ pref }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  selected: Array<string>,
  allPreferences: Array<string>
})
const emit = defineEmits(['update:selected'])

function togglePreference(pref: string) {
  const newPrefs = [...props.selected]
  const index = newPrefs.indexOf(pref)
  if (index > -1) {
    newPrefs.splice(index, 1)
  } else {
    newPrefs.push(pref)
  }
  emit('update:selected', newPrefs)
}
</script>
