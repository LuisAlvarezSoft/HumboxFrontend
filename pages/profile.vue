<template>
    <div class="flex min-h-screen transition-colors bg-[#fdfdf6] dark:bg-tertiary">
      <!-- Mobile menu button -->
      <button 
        @click="isMobileMenuOpen = !isMobileMenuOpen"
        class="md:hidden fixed top-4 left-4 z-40 p-2 rounded-md bg-tertiary dark:bg-gray-900 text-gray-100"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <!-- Sidebar -->
      <aside
        class="group fixed md:static z-30 h-full md:h-auto bg-tertiary dark:bg-gray-900 text-gray-100 border-r border-gray-200 dark:border-gray-700 flex flex-col items-center md:items-start md:w-16 hover:md:w-48 transition-all duration-200 overflow-hidden"
        :class="{'translate-x-0': isMobileMenuOpen, '-translate-x-full': !isMobileMenuOpen, 'md:translate-x-0': true}"
      >
        <!-- Humbox Logo -->
        <div class="w-full p-4 border-b border-gray-700">
          <div class="md:dark:block">
            <img 
              src="/logo_oscuro-removebg-preview.png"
              alt="Humbox"
              class="w-full h-auto transition-all duration-200 group-hover:md:opacity-100 md:opacity-0"
            />
          </div>
          <div class="md:hidden">
            <img 
              src="/logo_claro-removebg-preview.png"
              alt="Humbox"
              class="w-full h-auto dark:hidden"
            />
            <img 
              src="/logo_oscuro-removebg-preview.png"
              alt="Humbox"
              class="w-full h-auto hidden dark:block"
            />
          </div>
        </div>

        <div class="flex flex-col w-full">
          <div v-for="item in sidebarMenu" :key="item.label">
            <button class="w-full flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              <span class="hidden md:group-hover:block">{{ item.label }}</span>
            </button>
          </div>
        </div>
      </aside>
  
      <!-- Main Content -->
      <div class="flex-1 md:ml-16 p-4 w-full">
        <div class="max-w-4xl mx-auto bg-white dark:bg-[#1f2937] rounded shadow-lg text-gray-700 dark:text-gray-100 overflow-hidden">
            <ColorModeSwitch class="absolute top-4 right-4" />
  
          <!-- Header del perfil -->
          <div class="p-6 border-b border-gray-200 dark:border-gray-600 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div class="flex items-center gap-4">
              <div class="w-24 h-24 rounded-full border bg-gray-200 dark:bg-gray-700"></div>
              <div>
                <h1 class="text-2xl font-bold">Samuel Buitrago Osorio</h1>
                <p class="text-gray-500 dark:text-gray-400">Estudiante de Ingeniería de Software</p>
                <a href="https://instagram.com/saam.ratt" class="text-blue-600 dark:text-blue-400 hover:underline text-sm">instagram.com/saam.ratt</a>
              </div>
            </div>
            <button class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition text-sm">
              Editar perfil
            </button>
          </div>
  
          <!-- Estadísticas -->
          <div class="px-6 py-4 flex space-x-6 text-sm border-b border-gray-200 dark:border-gray-600">
            <div><span class="font-semibold">0</span> publicaciones</div>
            <div><span class="font-semibold">384</span> seguidores</div>
            <div><span class="font-semibold">379</span> seguidos</div>
          </div>
  
          <!-- Contenido de publicaciones (Galería) -->
          <div class="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div v-for="image in images" :key="image" class="aspect-square overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700"></div>
          </div>
  
          <!-- Tabs -->
          <div class="border-t border-gray-200 dark:border-gray-600 px-6 py-4 flex justify-around text-sm">
            <button v-for="tab in tabs" :key="tab" class="hover:font-semibold hover:text-red-600 dark:hover:text-red-400 transition">{{ tab }}</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  // Sidebar menu items (sin iconos)
  const sidebarMenu = [
    { label: 'Inicio' },
    { label: 'Explorar' },
    { label: 'Notificaciones' },
    { label: 'Mensajes' },
    { label: 'Perfil' },
    { label: 'Crear publicación' },
    { label: 'Videos' },
    { label: 'Configuración' }
  ]
  
  // Galería de imágenes (sin logos)
  const images = ref([
    // Se deja vacío o puedes poner imágenes reales si quieres
  ])
  
  const tabs = ['Publicaciones', 'Guardado', 'Etiquetas', 'Videos']
  const isMobileMenuOpen = ref(false)
  </script>
  
  <style scoped>
  /* Personalización para scrollbar lateral colapsable (opcional) */
  aside::-webkit-scrollbar {
    width: 4px;
  }
  aside::-webkit-scrollbar-thumb {
    background-color: rgba(100, 100, 100, 0.3);
    border-radius: 10px;
  }

  /* Transición para el menú móvil */
  aside {
    transition: transform 0.3s ease-in-out;
  }
  </style>