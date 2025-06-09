<template>
  <UModal :model-value="isOpen" @update:model-value="$emit('update:isOpen', $event)" prevent-close>
    <div class="p-6 w-full max-w-2xl">
      <h2 class="text-xl font-semibold text-center mb-4">Editar publicación</h2>

      <!-- Descripción -->
      <label class="block mb-1 text-sm font-medium">Descripción</label>
      <textarea v-model="form.description" rows="3" class="w-full mb-4 px-3 py-2 border rounded-md text-sm"></textarea>

      <!-- Ubicación -->
      <label class="block mb-1 text-sm font-medium">Ubicación</label>
      <input v-model="form.location" type="text" class="w-full mb-4 px-3 py-2 border rounded-md text-sm" />

      <!-- Tipo de recurso -->
      <label class="block mb-1 text-sm font-medium">Tipo de recurso</label>
      <select v-model="form.resource_type_id" class="w-full mb-4 px-3 py-2 border rounded-md text-sm">
        <option v-for="type in resourceTypes" :key="type.id" :value="type.id">{{ type.name }}</option>
      </select>

      <!-- Etiquetas -->
      <label class="block mb-1 text-sm font-medium">Etiquetas</label>
      <div class="flex flex-wrap gap-2 mb-4">
        <label
          v-for="tag in allTags"
          :key="tag.id"
          class="flex items-center gap-2 text-sm cursor-pointer"
        >
          <input
            type="checkbox"
            :value="tag.id"
            v-model="form.tag_ids"
          />
          {{ tag.name }}
        </label>
      </div>

      <!-- Botones -->
      <div class="flex justify-end gap-3">
        <button @click="$emit('update:isOpen', false)" class="text-sm px-4 py-2 bg-gray-300 rounded">Cancelar</button>
        <button @click="handleUpdate" class="text-sm px-4 py-2 bg-[var(--ui-primary)] text-white rounded">Guardar cambios</button>
      </div>
    </div>
  </UModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { usePosts } from '@/composables/usePosts'

const props = defineProps<{
  isOpen: boolean
  post: {
    id: number
    description: string
    location: string
    resource_type: { id: number; name: string }
    tags: { id: number; name: string }[]
  }
  resourceTypes: { id: number; name: string }[]
  allTags: { id: number; name: string }[]
}>()

const emit = defineEmits(['update:isOpen', 'post-updated'])
const { updatePost } = usePosts()

const form = ref({
  description: '',
  location: '',
  resource_type_id: 0,
  tag_ids: [] as number[]
})

watch(() => props.isOpen, (val) => {
  if (val && props.post) {
    form.value = {
      description: props.post.description,
      location: props.post.location,
      resource_type_id: props.post.resource_type.id,
      tag_ids: props.post.tags.map(tag => tag.id)
    }
  }
})

async function handleUpdate() {
  try {
    const formData = new FormData()
    formData.append('description', form.value.description)
    formData.append('location', form.value.location)
    formData.append('resource_type_id', String(form.value.resource_type_id))
    formData.append('tags', JSON.stringify(form.value.tag_ids))

    await updatePost(props.post.id, formData)
    emit('update:isOpen', false)
    emit('post-updated')
    alert('Publicación actualizada con éxito')
  } catch (err) {
    console.error('Error al actualizar publicación:', err)
    alert('Error al actualizar publicación')
  }
}
</script>
