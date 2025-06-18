<template>
  <div class="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
    <!-- Sidebar -->
    <aside
      class="group fixed md:static z-30 h-full md:h-auto bg-tertiary dark:bg-gray-900 text-gray-100 border-r border-gray-200 dark:border-gray-700 flex flex-col items-center md:items-start md:w-16 hover:md:w-48 transition-all duration-200 overflow-hidden"
      :class="{'translate-x-0': isMobileMenuOpen, '-translate-x-full': !isMobileMenuOpen, 'md:translate-x-0': true}"
    >
      <div class="w-full p-4 border-b border-gray-700">
        <div class="md:dark:block">
          <img src="/logo_oscuro-removebg-preview.png" alt="Humbox" class="w-full h-auto transition-all duration-200 group-hover:md:opacity-100 md:opacity-0" />
        </div>
        <div class="md:hidden">
          <img src="/logo_claro-removebg-preview.png" alt="Humbox" class="w-full h-auto dark:hidden" />
          <img src="/logo_oscuro-removebg-preview.png" alt="Humbox" class="w-full h-auto hidden dark:block" />
        </div>
      </div>

      <div class="flex flex-col w-full">
        <div v-for="item in sidebarMenu" :key="item.label">
          <button
            @click="handleSidebarClick(item.label)"
            class="w-full flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <span class="hidden md:group-hover:block">{{ item.label }}</span>
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 md:ml-16 p-6 w-full">
      <div class="max-w-7xl mx-auto">
        <!-- Header mejorado -->
        <div class="mb-8">
          <div class="flex items-center mb-2">
            <div class="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mr-3">
              <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <h1 class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard de Métricas
            </h1>
          </div>
          <p class="text-gray-600 dark:text-gray-400 text-lg">Resumen completo de HUMBOX</p>
        </div>

        <!-- Loading State mejorado -->
        <div v-if="loading" class="flex items-center justify-center py-20">
          <div class="text-center">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p class="text-gray-600 dark:text-gray-400 text-lg">Cargando métricas...</p>
          </div>
        </div>

        <!-- Error State mejorado -->
        <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
          <div class="flex items-center justify-center mb-4">
            <div class="p-3 bg-red-100 dark:bg-red-900/50 rounded-full">
              <svg class="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
          <h3 class="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">Error cargando métricas</h3>
          <p class="text-red-600 dark:text-red-300">{{ error }}</p>
          <button @click="showDebug = true" class="mt-4 text-sm text-red-600 underline">Mostrar debug info</button>
        </div>

        <!-- Dashboard Content -->
        <div v-else class="space-y-8">
          <!-- Métricas principales -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Usuarios"
              :value="getUsersTotal"
              :today-value="getUsersToday"
              icon="users"
              color="from-blue-500 to-blue-600"
              :trend="12.5"
            />
            
            <MetricCard
              title="Posts"
              :value="getPostsTotal"
              :today-value="getPostsToday"
              icon="file-text"
              color="from-green-500 to-green-600"
              :trend="8.3"
            />
            
            <MetricCard
              title="Comentarios"
              :value="getCommentsTotal"
              :today-value="getCommentsToday"
              icon="message-circle"
              color="from-purple-500 to-purple-600"
              :trend="15.7"
            />
            
            <MetricCard
              title="Likes"
              :value="getLikesTotal"
              :today-value="getLikesToday"
              icon="heart"
              color="from-pink-500 to-red-500"
              :trend="22.1"
            />
          </div>

          <!-- Sección de análisis detallado -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EngagementCard
              :avg-comments-per-post="getAvgComments"
              :avg-likes-per-post="getAvgLikes"
            />

            <GrowthCard
              :new-users="getUsersToday"
              :new-posts="getPostsToday"
            />
          </div>

          <!-- Sección adicional: Resumen rápido -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
              <svg class="h-5 w-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              Resumen Rápido
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
                <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {{ Math.round((getUsersToday / Math.max(getUsersTotal, 1)) * 100) }}%
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Crecimiento de usuarios</div>
              </div>
              <div class="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                <div class="text-2xl font-bold text-green-600 dark:text-green-400">
                  {{ (getCommentsTotal + getLikesTotal).toLocaleString() }}
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Total interacciones</div>
              </div>
              <div class="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {{ Math.round((getAvgComments + getAvgLikes) * 100) / 100 }}
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Engagement promedio</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useMetrics } from '~/composables/useMetrics'
import EngagementCard from '~/components/EngagementCard.vue'
import GrowthCard from '~/components/GrowthCard.vue'

const loading = ref(true)
const error = ref(null)
const isMobileMenuOpen = ref(false)
const showDebug = ref(false)

// Inicializar datos
let metricsData = null

onMounted(async () => {
  try {
    metricsData = await useMetrics()
    loading.value = false
  } catch (e) {
    error.value = e?.message || 'Error desconocido'
    loading.value = false
  }
})

// Computadas para acceder a los datos de forma segura
const getUsersTotal = computed(() => {
  try {
    return metricsData?.users?.value?.total_users || metricsData?.users?.total_users || 0
  } catch {
    return 0
  }
})

const getUsersToday = computed(() => {
  try {
    return metricsData?.users?.value?.new_users_today || metricsData?.users?.new_users_today || 0
  } catch {
    return 0
  }
})

const getPostsTotal = computed(() => {
  try {
    return metricsData?.posts?.value?.totalPosts || metricsData?.posts?.totalPosts || 0
  } catch {
    return 0
  }
})

const getPostsToday = computed(() => {
  try {
    return metricsData?.posts?.value?.postsToday || metricsData?.posts?.postsToday || 0
  } catch {
    return 0
  }
})

const getCommentsTotal = computed(() => {
  try {
    return metricsData?.comments?.value?.totalComments || metricsData?.comments?.totalComments || 0
  } catch {
    return 0
  }
})

const getAvgComments = computed(() => {
  try {
    return metricsData?.comments?.value?.avgCommentsPerPost || metricsData?.comments?.avgCommentsPerPost || 0
  } catch {
    return 0
  }
})

const getCommentsToday = computed(() => {
  try {
    return Math.round(getAvgComments.value * getPostsToday.value)
  } catch {
    return 0
  }
})

const getLikesTotal = computed(() => {
  try {
    return metricsData?.likes?.value?.totalLikes || metricsData?.likes?.totalLikes || 0
  } catch {
    return 0
  }
})

const getAvgLikes = computed(() => {
  try {
    return metricsData?.likes?.value?.avgLikesPerPost || metricsData?.likes?.avgLikesPerPost || 0
  } catch {
    return 0
  }
})

const getLikesToday = computed(() => {
  try {
    return Math.round(getAvgLikes.value * getPostsToday.value)
  } catch {
    return 0
  }
})

// Debug info
const debugInfo = computed(() => {
  return JSON.stringify({
    metricsData: metricsData,
    rawUsers: metricsData?.users,
    rawPosts: metricsData?.posts,
    rawComments: metricsData?.comments,
    rawLikes: metricsData?.likes,
    computedValues: {
      usersTotal: getUsersTotal.value,
      usersToday: getUsersToday.value,
      postsTotal: getPostsTotal.value,
      postsToday: getPostsToday.value,
      commentsTotal: getCommentsTotal.value,
      likesTotal: getLikesTotal.value
    }
  }, null, 2)
})
</script>

<style scoped>
/* Animaciones adicionales */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}
</style>