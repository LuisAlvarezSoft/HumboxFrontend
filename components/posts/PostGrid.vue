<template>
  <div>
    <div v-if="!posts.length" class="text-center text-gray-500 py-8">
      Aún no hay publicaciones disponibles.
    </div>
    <div v-else class="grid grid-cols-3 gap-1">
      <div
        v-for="(post, index) in posts"
        :key="post.id"
        class="aspect-square overflow-hidden relative cursor-pointer group"
        @click="$emit('open', post, index)"
      >
        <!-- Imagen -->
        <img
          v-if="post.cover_type === 'image' && post.cover_url"
          :src="post.cover_url"
          alt="Post image"
          class="w-full h-full object-cover group-hover:scale-105 hover:brightness-90 transition"
        />

        <!-- Video -->
        <video
          v-else-if="post.cover_type === 'video' && post.cover_url"
          :src="post.cover_url"
          class="w-full h-full object-cover hover:brightness-90 transition"
          muted autoplay loop
        ></video>

        <!-- PDF -->
        <div
          v-else-if="post.cover_type === 'pdf'"
          class="w-full h-full flex items-center justify-center bg-gray-800 text-white relative group-hover:brightness-110 transition"
        >
          <UIcon name="i-heroicons-document-text" class="w-8 h-8 text-red-500" />
          <span
            class="absolute bottom-2 text-xs bg-black/60 px-2 py-1 rounded text-white opacity-0 group-hover:opacity-100 transition"
          >
            Ver PDF
          </span>
        </div>

        <!-- Overlay íconos -->
        <div
          class="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors flex items-center justify-center"
        >
          <UIcon
            v-if="post.cover_type === 'image'"
            name="i-heroicons-photo"
            class="w-5 h-5 text-white"
          />
          <UIcon
            v-else-if="post.cover_type === 'video'"
            name="i-heroicons-video-camera"
            class="w-5 h-5 text-white"
          />
          <UIcon
            v-else-if="post.cover_type === 'pdf'"
            name="i-heroicons-document-text"
            class="w-5 h-5 text-white"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watchEffect } from 'vue'

const props = defineProps<{
  posts: {
    id: number
    cover_url: string
    cover_type: 'image' | 'video' | 'pdf'
  }[]
}>()

defineEmits(['open'])

watchEffect(() => {
  console.log('Posts recibidos en PostGrid:', props.posts)
})
</script>

<style scoped>
.grid {
  max-height: calc(100vh - 350px);
  overflow-y: auto;
}
</style>
