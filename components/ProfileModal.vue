<template>
  <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg w-full">
    <h1 class="text-xl font-bold mb-4">Completa tu perfil</h1>

    <label class="block mb-2 text-sm font-medium">Descripción</label>
    <textarea
      v-model="description"
      rows="4"
      class="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
    ></textarea>

    <div class="my-4">
      <ProfilePreferences
        v-model:selected="preferences"
        :allPreferences="availablePreferences"
      />
    </div>

    <div class="flex justify-end mt-4 gap-2">
      <button @click="$emit('cancel')" class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-sm">
        Cancelar
      </button>
      <button @click="submit" class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm">
        Guardar
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">

const props = defineProps<{
  initialDescription: string
  initialPreferences: string[]
}>()

const emit = defineEmits(['submit', 'cancel'])

const description = ref(props.initialDescription)
const preferences = ref([...props.initialPreferences])
const availablePreferences = [
  'Tecnología', 'Arte', 'Deportes', 'Música', 'Moda', 'Ciencia', 'Viajes', 'Gaming'
]

function submit() {
  emit('submit', {
    description: description.value,
    preferences: preferences.value
  })
}
</script>
