<template>
  <div class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
    <h2 class="text-lg font-semibold mb-4">Configuración de perfil</h2>

    <div class="mb-4">
      <h3 class="font-medium mb-2">Selecciona tus preferencias (mín. 1):</h3>
      <div class="flex flex-wrap gap-2">
        <label v-for="opt in options" :key="opt" class="inline-flex items-center">
          <input type="checkbox" :value="opt" v-model="selected" class="mr-2">
          {{ opt }}
        </label>
      </div>
      <p v-if="submitted && selected.length === 0" class="text-red-500 text-sm mt-1">
        Debes seleccionar al menos una preferencia.
      </p>
    </div>

    <div class="mb-4">
      <button @click="openModal"
              class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
        {{ bio ? 'Editar descripción' : 'Añadir descripción' }}
      </button>
      <p v-if="bio" class="mt-2 italic text-gray-600 dark:text-gray-400">
        «{{ bio }}»
      </p>
    </div>

    <div class="flex justify-end space-x-2">
      <button @click="cancel" class="px-4 py-2 border rounded">Cancelar</button>
      <button @click="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Guardar perfil
      </button>
    </div>

    <ModalBio
      :isOpen="showModal"
      :initialBio="bio"
      @close="showModal = false"
      @save="onSaveBio"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ModalBio from './ModalBio.vue'

const options = ['Deportes', 'Tecnología', 'Arte', 'Ciencia']
const selected = ref<string[]>([])
const bio = ref('')
const showModal = ref(false)
const submitted = ref(false)

function openModal() {
  showModal.value = true
}

function onSaveBio(newBio: string) {
  bio.value = newBio
  showModal.value = false
}

function submit() {
  submitted.value = true
  if (selected.value.length === 0) return

  // Aquí emitirías evento o llamas API – p. ej. $emit('complete', { bio, preferences })
  alert(`Perfil guardado:
- Bio: ${bio.value}
- Preferencias: ${selected.value.join(', ')}`)
}

function cancel() {
  // Opcionalmente limpiar o emitir cancelación
  selected.value = []
  bio.value = ''
  submitted.value = false
}
</script>
