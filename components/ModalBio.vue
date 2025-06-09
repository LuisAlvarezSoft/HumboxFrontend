<template>
  <teleport to="body" v-if="isOpen">
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <h2 class="text-xl font-semibold mb-4">Editar descripción</h2>
        <textarea v-model="bioLocal"
                  class="w-full border rounded-md p-2 mb-4"
                  rows="4"
                  placeholder="Escribe una breve bio..."></textarea>
        <div class="flex justify-end space-x-2">
          <button @click="$emit('close')"
                  class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600">
            Cancelar
          </button>
          <button @click="save"
                  class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Guardar
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue'

const props = defineProps<{ isOpen: boolean; initialBio: string }>()
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', bio: string): void
}>()

const bioLocal = ref(props.initialBio)

watch(() => props.initialBio, val => bioLocal.value = val)

function save() {
  emit('save', bioLocal.value.trim())
}
</script>
