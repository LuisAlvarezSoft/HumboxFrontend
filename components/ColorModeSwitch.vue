<script setup lang="ts">
import { computed } from 'vue'

// Obtiene el objeto reactivo que gestiona el modo de color (dark / light)
const colorMode = useColorMode()

// Propiedad computada bidireccional que determina si el modo de color actual es oscuro o claro
const isDark = computed({
  get: () => colorMode.value === 'dark',
  set: val => colorMode.preference = val ? 'dark' : 'light'
})
</script>

<template>
  <ClientOnly>
    <!-- Botón que alterna el modo de color entre oscuro y claro -->
    <!-- Muestra un ícono de luna si está en modo oscuro, o de sol si está en modo claro -->
    <UButton
      :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
      variant="ghost"
      @click="isDark = !isDark"
    />
  </ClientOnly>
</template>
