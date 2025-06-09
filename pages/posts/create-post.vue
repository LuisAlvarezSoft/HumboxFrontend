<script setup lang="ts">
import PostCreationModal from '~/components/posts/PostCreationModal.vue'
</script>

<template>
  <div class="min-h-screen bg-secondary flex items-center justify-center px-4">
    <!-- Modal siempre visible (puedes controlar desde rutas o eventos si deseas) -->
    <PostCreationModal :isOpen="true" />
  </div>
</template>
