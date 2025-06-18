<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
    <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
      <svg class="h-5 w-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
      </svg>
      Engagement
    </h3>
    <div class="space-y-4">
      <div>
        <div class="flex justify-between mb-1">
          <span class="text-sm text-gray-600 dark:text-gray-400">Comentarios por Post</span>
          <span class="font-semibold text-gray-800 dark:text-gray-200">{{ avgCommentsPerPost }}</span>
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            class="h-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-500" 
            :style="{ width: `${Math.min((avgCommentsPerPost / 10) * 100, 100)}%` }"
          ></div>
        </div>
      </div>
      <div>
        <div class="flex justify-between mb-1">
          <span class="text-sm text-gray-600 dark:text-gray-400">Likes por Post</span>
          <span class="font-semibold text-gray-800 dark:text-gray-200">{{ avgLikesPerPost }}</span>
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            class="h-2 bg-gradient-to-r from-pink-500 to-red-500 rounded-full transition-all duration-500" 
            :style="{ width: `${Math.min((avgLikesPerPost / 50) * 100, 100)}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  avgCommentsPerPost: number
  avgLikesPerPost: number
}

defineProps<Props>()
</script>