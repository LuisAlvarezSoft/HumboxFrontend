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
        <div class="flex items-center gap-3">
          <button @click="$emit('close')" class="text-gray-500 hover:text-[var(--ui-primary)] text-xl">
            <UIcon name="i-heroicons-x-mark" class="w-6 h-6" />
          </button>
          <button @click="handleDelete" class="text-gray-400 hover:text-red-600 transition" title="Eliminar publicación">
            <UIcon name="i-heroicons-trash" class="w-5 h-5" />
          </button>
          <button @click="openEditModal" class="text-gray-400 hover:text-yellow-500 transition" title="Editar publicación">
            <UIcon name="i-heroicons-pencil-square" class="w-5 h-5" />
          </button>
        </div>
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

      <!-- Acciones -->
      <div class="flex flex-col gap-4 mt-2">
        <div class="flex items-center gap-8 text-gray-500 dark:text-gray-300 text-lg">
          <button @click="handleToggleLike" class="hover:text-red-500 transition transform hover:scale-110" title="Me gusta">
            <UIcon :name="isLiked ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'" class="w-7 h-7" />
          </button>
          <button @click="handleToggleSaved" class="hover:text-blue-500 transition transform hover:scale-110" title="Guardar">
            <UIcon :name="isSaved ? 'i-heroicons-bookmark-solid' : 'i-heroicons-bookmark'" class="w-7 h-7" />
          </button>
        </div>
      </div>

      <!-- Comentarios -->
      <div>
        <label for="comment" class="text-sm font-medium">Comenta</label>
        <textarea id="comment" rows="3" v-model="newComment" placeholder="Escribe algo..." class="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"></textarea>
        <button @click="handleCreateComment" class="mt-2 w-full bg-[var(--ui-primary)] hover:bg-[var(--ui-primary-hover)] text-white py-2 rounded-md text-sm font-medium">
          Publicar comentario
        </button>

        <div class="mt-4 space-y-3 text-sm">
          <div v-for="comment in comments" :key="comment.id" class="border-b border-gray-200 dark:border-gray-700 pb-2">
            <p class="font-medium text-[var(--ui-primary)]">Usuario #{{ comment.user_id }}</p>
            <p class="text-gray-700 dark:text-gray-300">{{ comment.content }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL DE EDICIÓN (PostEditModal.vue) -->
    <PostEditModal
      v-if="showEditModal"
      :post="post"
      @close="showEditModal = false"
      @updated="emit('close')"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useLikes } from '@/composables/useLikes'
import { useSavedPosts } from '@/composables/useSavedPosts'
import { useComments } from '@/composables/useComments'
import { usePosts } from '@/composables/usePosts'
import PostEditModal from '@/components/posts/PostEditModal.vue'

const showEditModal = ref(false)
function openEditModal() {
  showEditModal.value = true
}

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

const emit = defineEmits(['close', 'navigate'])

const currentFileIndex = ref(0)
const newComment = ref('')
const isLiked = ref(false)
const isSaved = ref(false)
const comments = ref<any[]>([])

watch(() => props.post?.id, async () => {
  currentFileIndex.value = 0
  isLiked.value = false
  isSaved.value = false
  if (props.post) {
    comments.value = await fetchComments(props.post.id)
  }
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

const { toggleLike } = useLikes()
const { toggleSaved } = useSavedPosts()
const { createComment, fetchComments } = useComments()
const { deletePost } = usePosts()

async function handleDelete() {
  if (!props.post) return
  const confirmacion = confirm('¿Estás seguro de que deseas eliminar esta publicación?')
  if (!confirmacion) return

  try {
    await deletePost(props.post.id)
    alert('Publicación eliminada correctamente')
    emit('close')
  } catch (err) {
    console.error('Error al eliminar la publicación:', err)
    alert('Hubo un error al eliminar la publicación')
  }
}

async function handleToggleLike() {
  if (!props.post) return
  try {
    const res = await toggleLike(props.post.id)
    isLiked.value = !isLiked.value
    console.log(res.message)
  } catch (err) {
    console.error('Error al dar like:', err)
  }
}

async function handleToggleSaved() {
  if (!props.post) return
  try {
    const res = await toggleSaved(props.post.id)
    isSaved.value = !isSaved.value
    console.log(res.message)
  } catch (err) {
    console.error('Error al guardar publicación:', err)
  }
}

async function handleCreateComment() {
  if (!props.post || !newComment.value.trim()) return
  try {
    const res = await createComment(props.post.id, newComment.value)
    console.log(res.message)
    newComment.value = ''
    comments.value = await fetchComments(props.post.id)
  } catch (err) {
    console.error('Error al comentar:', err)
  }
}
</script>
