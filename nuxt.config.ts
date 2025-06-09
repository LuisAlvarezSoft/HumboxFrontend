// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ], 
  },
  ui: {
    theme: {
      // declara los colores dinámicos que usarás en los componentes
      colors: [
        'primary',
        'secondary',
        'tertiary',
        'success',
        'info',
        'warning',
        'error',
        'neutral'
      ]
    }
  },
  runtimeConfig:{
    public:{
      apiBase: process.env.API_BASE_URL || 'http://localhost:8000/api',
      postsApi: process.env.POSTS_API_URL || 'http://localhost:8001/api',
      geoapifyKey: process.env.NUXT_PUBLIC_GEOAPIFY_KEY,
      appName: process.env.APP_NAME || 'HumBox',
    }
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/ui',
    'nuxt-lucide-icons'
  ],
  lucide: {
    namePrefix: 'Icon' // Cambia el prefijo según tu preferencia
  },
})