<template>
  <div class="p-6">
    <!-- Tabs -->
    <div class="flex justify-around border-b border-gray-600 pb-4 mb-4">
      <button
        v-for="tab in tabs"
        :key="tab"
        @click="activeTab = tab"
        :class="[ 'transition', activeTab === tab ? 'font-semibold text-red-500' : 'text-gray-400 hover:text-white' ]"
      >
        {{ tab }}
      </button>
    </div>

    <!-- Contenido según pestaña -->
    <div v-if="loading" class="text-center py-8">Cargando publicaciones...</div>
    <div v-else-if="error" class="text-center py-8 text-red-500">Error: {{ error }}</div>
    <template v-else>
      <div v-if="activeTab === 'Publicaciones'">
        <PostGrid :posts="filteredPosts" @open="handleOpenPost" />
      </div>
      <div v-else-if="activeTab === 'Guardado'" class="text-center text-gray-500">
        Aún no hay publicaciones guardadas.
      </div>
      <div v-else-if="activeTab === 'Etiquetas'" class="text-center text-gray-500">
        Aún no estás etiquetado en publicaciones.
      </div>
      <div v-else-if="activeTab === 'Videos'">
        <PostGrid :posts="filteredPosts.filter(p => p.cover_type === 'video')" @open="handleOpenPost" />
      </div>
    </template>

    <!-- Modal detalle -->
    <UModal v-model="selectedPost" :overlay="true" prevent-close>
      <PostDetailModal
        :post="selectedPost"
        :posts="filteredPosts"
        :currentIndex="selectedPostIndex"
        @close="() => selectedPost = null"
        @navigate="handleNavigatePost"
      />
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import PostGrid from '@/components/posts/PostGrid.vue'
import UModal from '@/components/ui/UModal.vue'
import PostDetailModal from '@/components/posts/PostDetailModal.vue'

const props = defineProps<{ 
  posts: any[],
  loading?: boolean,
  error?: string | null
}>()

const tabs = ['Publicaciones', 'Guardado', 'Etiquetas', 'Videos']
const activeTab = ref('Publicaciones')
const selectedPost = ref(null)
const selectedPostIndex = ref(0)

function handleOpenPost(post: any, index: number) {
  selectedPost.value = post
  selectedPostIndex.value = index
}

function handleNavigatePost(direction: 'next' | 'prev') {
  if (direction === 'next' && selectedPostIndex.value < filteredPosts.value.length - 1) {
    selectedPostIndex.value++
    selectedPost.value = filteredPosts.value[selectedPostIndex.value]
  } else if (direction === 'prev' && selectedPostIndex.value > 0) {
    selectedPostIndex.value--
    selectedPost.value = filteredPosts.value[selectedPostIndex.value]
  }
}

const getCoverUrl = (post: any) => {
  const file = post.attached_files?.[0]
  if (!file || !file.file_url) return ''
  if (file.file_url.startsWith('http')) return file.file_url
  const normalized = file.file_url.startsWith('storage/') ? file.file_url : `storage/${file.file_url}`
  return `http://localhost:8001/${normalized}`
}

const getCoverType = (post: any) => {
  return post.attached_files?.[0]?.type ?? 'image'
}

const filteredPosts = computed(() => {
  return props.posts.map((p, index) => ({
    id: p.id,
    cover_url: getCoverUrl(p),
    cover_type: getCoverType(p),
    index,
    ...p
  }))
})
</script>
