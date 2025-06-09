<script setup lang="ts">
import { ref, onMounted, watch, computed, onBeforeUnmount } from 'vue'
import { usePosts } from '@/composables/usePosts'
import { useMetadata } from '@/composables/useMetadata'
import { fetchLocationSuggestions } from '@/composables/useLocationAutocomplete'
import TagSelector from '@/components/posts/TagSelector.vue'

const props = defineProps<{
  form: {
    files: File[]
    description: string
    location: string
    collaborators: string[]
    tags: string[]
    resource_type_id: string | null
  }
}>()

const emit = defineEmits(['submit', 'back'])

const currentIndex = ref(0)
const previewUrls = ref<string[]>([])

// Generar URLs de vista previa cuando cambian los archivos
const generatePreviewUrls = (files: File[]) => {
  // Limpiar URLs anteriores
  previewUrls.value.forEach(url => URL.revokeObjectURL(url))
  previewUrls.value = files.map(file => URL.createObjectURL(file))
}

// Observar cambios en los archivos
watch(() => props.form.files, (newFiles) => {
  generatePreviewUrls(newFiles)
}, { immediate: true })

// Limpiar URLs al desmontar el componente
onBeforeUnmount(() => {
  previewUrls.value.forEach(url => URL.revokeObjectURL(url))
})

const file = computed(() => props.form.files?.[currentIndex.value] ?? null)
const previewUrl = computed(() => {
  return previewUrls.value[currentIndex.value] ?? null
})

const fileType = computed(() => {
  if (!file.value) return null
  if (file.value.type.startsWith('image/')) return 'image'
  if (file.value.type.startsWith('video/')) return 'video'
  if (file.value.type === 'application/pdf') return 'pdf'
  return 'other'
})

const { createPost } = usePosts()
const { fetchTags, fetchResourceTypes } = useMetadata()
const isLoading = ref(false)
const tagsList = ref<Record<string, any[]>>({})
const resourceTypes = ref<any[]>([])
const locationSuggestions = ref<string[]>([])

onMounted(async () => {
  tagsList.value = await fetchTags()
  resourceTypes.value = await fetchResourceTypes()

  if (props.editMode && props.existingPost) {
    form.value.description = props.existingPost.description
    form.value.location = props.existingPost.location
    form.value.tags = props.existingPost.tags?.map(t => t.id) || []
    form.value.resource_type_id = props.existingPost.resource_type?.id || null

    // Simulación visual de archivos (no se pueden editar directamente)
    previewUrls.value = props.existingPost.attached_files.map((f: any) => getFileUrl(f.file_url))
  }
})


watch(() => props.form.location, async (val) => {
  if (!val || val.length < 2) return
  locationSuggestions.value = await fetchLocationSuggestions(val)
})

function selectLocation(suggestion: string) {
  props.form.location = suggestion
  locationSuggestions.value = []
}

async function handleSubmit() {
  isLoading.value = true
  const formData = new FormData()

  formData.append('title', 'Sin título')
  formData.append('description', props.form.description)
  formData.append('location', props.form.location)
  formData.append('resource_type_id', String(props.form.resource_type_id ?? ''))
  formData.append('tags', JSON.stringify(props.form.tags))

  props.form.collaborators.forEach(colab => {
    formData.append('collaborators[]', colab)
  })

  props.form.files.forEach((file, index) => {
    formData.append(`attached_files[${index}][file]`, file)
    formData.append(`attached_files[${index}][alt_text]`, `Archivo ${index + 1}`)
  })

  try {
    await createPost(formData)
    emit('submit')
  } catch (error) {
    console.error('Error al publicar:', error)
    alert('Error al crear la publicación.')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex items-center justify-center w-full h-[80vh] text-white">
    <div class="w-full h-full max-w-6xl bg-[var(--ui-surface-muted)] rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-[var(--ui-border-muted)]">
      
      <!-- Vista previa (70% del ancho) -->
      <div class="flex-1 bg-black flex flex-col items-center justify-center p-4">
        <div class="relative w-full h-full flex items-center justify-center">
          <template v-if="file && previewUrl">
            <img 
              v-if="fileType === 'image'" 
              :src="previewUrl" 
              class="max-w-full max-h-full object-contain"
            />
            <video 
              v-else-if="fileType === 'video'" 
              :src="previewUrl" 
              controls
              class="max-w-full max-h-full object-contain"
            />
            <embed 
              v-else-if="fileType === 'pdf'" 
              :src="previewUrl" 
              type="application/pdf"
              class="w-full h-full border border-[var(--ui-border-muted)] rounded-xl"
            />
            <p v-else class="text-white">Archivo no soportado</p>
          </template>
          
          <!-- Navegación entre archivos -->
          <template v-if="props.form.files.length > 1">
            <button
              v-if="currentIndex > 0"
              @click="currentIndex--"
              class="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2"
            >
              ‹
            </button>
            <button
              v-if="currentIndex < props.form.files.length - 1"
              @click="currentIndex++"
              class="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2"
            >
              ›
            </button>
          </template>
        </div>

        <!-- Miniaturas (solo si hay múltiples archivos) -->
        <div 
          v-if="props.form.files.length > 1"
          class="flex gap-2 p-2 overflow-x-auto bg-[var(--ui-surface-muted)]"
        >
          <div
            v-for="(f, index) in props.form.files"
            :key="index"
            @click="currentIndex = index"
            class="w-12 h-12 rounded border overflow-hidden cursor-pointer flex-shrink-0"
            :class="index === currentIndex ? 'border-[var(--ui-primary)]' : 'border-transparent'"
          >
            <img 
              v-if="f.type.startsWith('image/')" 
              :src="previewUrls[index]" 
              class="w-full h-full object-cover"
            />
            <video 
              v-else-if="f.type.startsWith('video/')" 
              :src="previewUrls[index]" 
              class="w-full h-full object-cover"
            />
            <div 
              v-else 
              class="w-full h-full bg-gray-700 text-white text-xs flex items-center justify-center"
            >
              PDF
            </div>
          </div>
        </div>
      </div>

      <!-- Formulario lateral (30% del ancho) -->
      <div class="w-full md:w-[380px] bg-[var(--ui-surface)] p-4 space-y-4 overflow-y-auto text-sm text-[var(--ui-text)]">
        <!-- Usuario -->
        <div class="flex items-center gap-3">
          <img src="https://placehold.co/40x40" class="w-8 h-8 rounded-full object-cover" />
          <p class="font-medium">saam.ratt</p>
        </div>

        <!-- Descripción -->
        <textarea 
          v-model="form.description" 
          rows="4" 
          placeholder="Escribe una descripción..." 
          class="w-full bg-transparent border-b border-[var(--ui-border-muted)] focus:border-[var(--ui-primary)] focus:outline-none placeholder-white/40 transition"
        ></textarea>

        <!-- Ubicación -->
        <div class="relative">
          <input 
            v-model="form.location" 
            placeholder="Ubicación" 
            class="w-full bg-transparent border-b border-[var(--ui-border-muted)] focus:border-[var(--ui-primary)] focus:outline-none placeholder-white/40 transition" 
          />
          <ul 
            v-if="locationSuggestions.length" 
            class="absolute z-50 w-full bg-[var(--ui-surface)] text-white rounded-lg mt-1 shadow-xl border border-[var(--ui-border-muted)] max-h-60 overflow-auto"
          >
            <li
              v-for="suggestion in locationSuggestions"
              :key="suggestion"
              @click="selectLocation(suggestion)"
              class="px-3 py-2 rounded-md mx-1 my-1 cursor-pointer transition hover:bg-[var(--ui-muted)]"
            >
              {{ suggestion }}
            </li>
          </ul>
        </div>

        <!-- Colaboradores -->
        <input 
          v-model="form.collaborators" 
          placeholder="IDs de colaboradores separados por coma" 
          class="w-full bg-transparent border-b border-[var(--ui-border-muted)] focus:border-[var(--ui-primary)] focus:outline-none placeholder-white/40 transition" 
        />

        <!-- Tipo de recurso -->
        <div>
          <p class="text-sm mb-2">Tipo de recurso</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="type in resourceTypes"
              :key="type.id"
              @click="form.resource_type_id = type.id"
              :class="[
                'px-3 py-1 rounded-full border text-sm transition',
                form.resource_type_id === type.id ? 'bg-[var(--ui-primary)] text-white' : 'border-[var(--ui-border-muted)] text-white hover:bg-[var(--ui-muted)]'
              ]"
            >
              {{ type.name }}
            </button>
          </div>
        </div>

        <!-- Etiquetas -->
        <details class="group">
          <summary class="cursor-pointer py-2 font-medium transition hover:opacity-80">Etiquetas</summary>
          <TagSelector v-model="form.tags" :tagsByCategory="tagsList" class="mt-2" />
        </details>

        <!-- Configuración avanzada -->
        <details class="border-t border-[var(--ui-border-muted)] pt-3">
          <summary class="cursor-pointer">Configuración avanzada</summary>
          <div class="space-y-2 mt-2">
            <label class="flex items-center gap-2 text-sm">
              <input type="checkbox" class="accent-[var(--ui-primary)]" />
              <span>Ocultar los me gusta</span>
            </label>
            <label class="flex items-center gap-2 text-sm">
              <input type="checkbox" class="accent-[var(--ui-primary)]" />
              <span>Desactivar comentarios</span>
            </label>
          </div>
        </details>

        <!-- Botones -->
        <div class="flex space-x-2 pt-4">
          <button 
            @click="emit('back')" 
            :disabled="isLoading" 
            class="flex-1 bg-[var(--ui-muted)] hover:bg-[var(--ui-muted-hover)] py-2 rounded-lg text-white transition shadow-md"
          >
            Atrás
          </button>
          <button 
            @click="handleSubmit" 
            :disabled="isLoading" 
            class="flex-1 bg-[var(--ui-primary)] hover:bg-[var(--ui-primary-hover)] py-2 rounded-lg text-white transition shadow-md"
          >
            {{ isLoading ? 'Publicando...' : 'Publicar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>