<script setup lang="ts">
import { ref } from 'vue'
import SelectMediaStep from './SelectMediaStep.vue'
import ConfigurePostStep from './ConfigurePostStep.vue'

const props = defineProps<{ isOpen: boolean }>()
const emit = defineEmits(['update:isOpen'])

const step = ref(1)

const form = ref({
  files: [] as File[],
  description: '',
  location: '',
  collaborators: [] as string[],
  tags: [] as string[],
  resource_type_id: null as string | null
})

const isLoading = ref(false)

function goToStep2(files: File[]) {
  form.value.files = files
  step.value = 2
}

function submitPost() {
  isLoading.value = true
  setTimeout(() => {
    console.log('Publicando post:', form.value)
    isLoading.value = false
    emit('update:isOpen', false)
    step.value = 1
  }, 1500)
}
</script>

<template>
  <UModal
    :model-value="props.isOpen"
    @update:model-value="emit('update:isOpen', $event)"
    :overlay="false" 
    prevent-close
    class="rounded-2xl"
  >

    <!-- 🎯 Fondo modal diferenciado -->
    <div class="w-full max-w-5xl mx-auto rounded-2xl shadow-2xl overflow-hidden border border-[var(--ui-border-muted)] bg-[var(--ui-surface-elevated)]">
      
      <!-- 🧠 Encabezado -->
      <div class="p-4 border-b border-[var(--ui-border-muted)] text-center text-lg font-semibold text-[var(--ui-text)]">
        Crear nueva publicación
      </div>

      <!-- ⚙️ Contenido dinámico por pasos -->
      <div class="p-4 text-[var(--ui-text)]">
        <transition name="fade" mode="out-in">
          <component
            :is="step === 1 ? SelectMediaStep : ConfigurePostStep"
            :key="step"
            v-bind="step === 1 ? {} : { form }"
            @next="goToStep2"
            @submit="submitPost"
            @back="step = 1"
          />
        </transition>
      </div>
    </div>
  </UModal>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
