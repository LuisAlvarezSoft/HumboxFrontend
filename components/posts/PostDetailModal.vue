<template>
  <div class="relative w-full h-full flex md:flex-row">
    <!-- FLECHAS DE PUBLICACION -->
    <button
      @click="$emit('navigate', 'prev')"
      class="fixed left-6 top-1/2 -translate-y-1/2 z-40 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full"
    >
      <UIcon name="i-heroicons-chevron-left" class="w-6 h-6" />
    </button>
    <button
      @click="$emit('navigate', 'next')"
      class="fixed right-6 top-1/2 -translate-y-1/2 z-40 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full"
    >
      <UIcon name="i-heroicons-chevron-right" class="w-6 h-6" />
    </button>

    <!-- CONTENIDO PRINCIPAL -->
    <div class="flex-1 bg-black flex items-center justify-center relative overflow-hidden">
      <template v-if="currentFile">
        <img v-if="currentFile.type === 'image'" :src="getFileUrl(currentFile.file_url)" class="max-w-full max-h-full object-contain" />
        <video v-else-if="currentFile.type === 'video'" :src="getFileUrl(currentFile.file_url)" controls class="max-w-full max-h-full object-contain" />
        <iframe v-else-if="currentFile.type === 'pdf'" :src="getFileUrl(currentFile.file_url)" class="w-full h-[80vh] border-0 bg-white rounded" />
        <p v-else class="text-white">Tipo no soportado</p>

        <!-- Flechas de archivos -->
        <button v-if="post?.attached_files.length > 1 && currentFileIndex > 0" @click="prevFile" class="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full z-30">
          <UIcon name="i-heroicons-chevron-left" class="w-5 h-5" />
        </button>
        <button v-if="post?.attached_files.length > 1 && currentFileIndex < post.attached_files.length - 1" @click="nextFile" class="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full z-30">
          <UIcon name="i-heroicons-chevron-right" class="w-5 h-5" />
        </button>

        <div v-if="post?.attached_files.length > 1" class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
          {{ currentFileIndex + 1 }} / {{ post.attached_files.length }}
        </div>
      </template>
    </div>

    <!-- INFO DERECHA -->
    <div class="w-full md:w-[400px] p-6 bg-white dark:bg-gray-900 text-black dark:text-white flex flex-col space-y-5">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-3">
          <img src="https://placehold.co/40x40" class="w-10 h-10 rounded-full" />
          <span class="font-semibold">saam.ratt</span>
        </div>
        <button @click="$emit('close')" class="text-gray-500 hover:text-[var(--ui-primary)] text-xl">
          <UIcon name="i-heroicons-x-mark" class="w-6 h-6" />
        </button>
      </div>

      <!-- Descripción -->
      <p class="text-sm leading-snug">{{ post?.description || 'Sin descripción' }}</p>

      <!-- Ubicación -->
      <div v-if="post?.location" class="text-xs text-gray-500 flex items-center gap-1">
        <UIcon name="i-heroicons-map-pin" class="w-4 h-4" />
        <span>{{ post.location }}</span>
      </div>

      <!-- Tipo de recurso -->
      <div v-if="post?.resource_type">
        <div class="text-xs text-gray-400 font-semibold mb-1">Tipo de recurso:</div>
        <span class="inline-block px-3 py-1 bg-[var(--ui-primary)] text-white text-xs rounded-full">
          {{ post.resource_type.name }}
        </span>
      </div>

      <!-- Etiquetas -->
      <div v-if="post?.tags?.length">
        <div class="text-xs text-gray-400 font-semibold mb-1">Etiquetas:</div>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="tag in post.tags"
            :key="tag.id"
            class="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-xs rounded-full text-gray-700 dark:text-gray-100"
          >
            {{ tag.name }} <span class="text-gray-400">({{ tag.subcategory }})</span>
          </span>
        </div>
      </div>

      <!-- Comentarios -->
      <div>
        <label for="comment" class="text-sm font-medium">Comenta</label>
        <textarea id="comment" rows="3" placeholder="Escribe algo..." class="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"></textarea>
        <button class="mt-2 w-full bg-[var(--ui-primary)] hover:bg-[var(--ui-primary-hover)] text-white py-2 rounded-md text-sm font-medium">
          Publicar comentario
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  post: {
    id: number
    attached_files: { file_url: string; type: string }[]
    description?: string
    location?: string
    tags?: { id: number; name: string; subcategory: string }[]
    resource_type?: { name: string }
  } | null
  posts: any[]
  currentIndex: number
}>()

defineEmits(['close', 'navigate'])

const currentFileIndex = ref(0)

watch(() => props.post?.id, () => {
  currentFileIndex.value = 0
})

const currentFile = computed(() => {
  return props.post?.attached_files[currentFileIndex.value] || null
})

function nextFile() {
  if (props.post && currentFileIndex.value < props.post.attached_files.length - 1) {
    currentFileIndex.value++
  }
}

function prevFile() {
  if (props.post && currentFileIndex.value > 0) {
    currentFileIndex.value--
  }
}

function getFileUrl(fileUrl: string) {
  return fileUrl.startsWith('http')
    ? fileUrl
    : `http://localhost:8001/${fileUrl.startsWith('storage/') ? fileUrl : 'storage/' + fileUrl}`
}
</script>
