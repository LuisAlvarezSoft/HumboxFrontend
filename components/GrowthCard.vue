<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
    <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
      <svg class="h-5 w-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
      </svg>
      Crecimiento Diario
    </h3>
    <div class="space-y-4">
      <div class="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg transition-all duration-300 hover:bg-blue-100 dark:hover:bg-blue-900/30">
        <div class="flex items-center">
          <div class="p-2 bg-blue-500 rounded-lg mr-3">
            <svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
            </svg>
          </div>
          <span class="text-sm font-medium text-blue-800 dark:text-blue-200">Nuevos Usuarios</span>
        </div>
        <span class="font-bold text-blue-600 text-lg">{{ newUsers }}</span>
      </div>
      <div class="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg transition-all duration-300 hover:bg-green-100 dark:hover:bg-green-900/30">
        <div class="flex items-center">
          <div class="p-2 bg-green-500 rounded-lg mr-3">
            <svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <span class="text-sm font-medium text-green-800 dark:text-green-200">Posts Publicados</span>
        </div>
        <span class="font-bold text-green-600 text-lg">{{ newPosts }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  newUsers: number
  newPosts: number
}

defineProps<Props>()
</script>