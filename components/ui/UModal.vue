<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
    @click.self="$emit('update:modelValue', false)"
  >
    <!-- Cambiar el tamaño máximo del modal -->
    <div class="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl w-full max-w-6xl min-h-[600px]">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
})

defineEmits(['update:modelValue'])
</script>
