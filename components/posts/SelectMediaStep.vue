<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['next'])

const files = ref<File[]>([])
const previewUrls = ref<string[]>([])
const currentIndex = ref(0)

function generatePreviewUrls(fileList: File[]) {
  // Limpia los objetos URL previos para evitar fugas de memoria
  previewUrls.value.forEach(url => URL.revokeObjectURL(url))
  previewUrls.value = fileList.map(file => URL.createObjectURL(file))
}

function handleFileSelection(file: File) {
  if (!file) return
  files.value = [file]
  currentIndex.value = 0
  generatePreviewUrls(files.value)
}

function handleAddMoreFiles(event: Event) {
  const input = event.target as HTMLInputElement
  const newFiles = input.files
  if (!newFiles) return

  const updated = [...files.value, ...Array.from(newFiles)]

  if (updated.length > 10) {
    alert('Solo puedes subir hasta 10 archivos.')
    return
  }

  files.value = updated
  generatePreviewUrls(files.value)

  if (files.value.length === 1) currentIndex.value = 0
}

function detectFileType(file: File): 'image' | 'video' | 'pdf' | 'other' {
  const type = file.type
  if (type.startsWith('image/')) return 'image'
  if (type.startsWith('video/')) return 'video'
  if (type === 'application/pdf') return 'pdf'
  return 'other'
}

function currentFile(): File | null {
  return files.value[currentIndex.value] || null
}

function currentPreviewUrl(): string | null {
  return previewUrls.value[currentIndex.value] || null
}

function nextFile() {
  if (currentIndex.value < files.value.length - 1) currentIndex.value++
}

function prevFile() {
  if (currentIndex.value > 0) currentIndex.value--
}

function onFileInput(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) handleFileSelection(file)
}

function onDrop(event: DragEvent) {
  event.preventDefault()
  const file = event.dataTransfer?.files?.[0]
  if (file) handleFileSelection(file)
}

function continueToNextStep() {
  emit('next', files.value)
}

function getPreviewUrl(file: File): string {
  return URL.createObjectURL(file)
}

</script>


<template>
  <div class="flex items-center justify-center w-full h-[80vh] text-white">
    <div
      class="w-full h-full max-w-5xl bg-[var(--ui-surface-muted)] border-2 border-dashed border-[var(--ui-border-muted)] rounded-2xl p-10 flex flex-col justify-center items-center text-center shadow-2xl"
      @dragover.prevent
      @drop="onDrop"
    >
      <!-- SIN archivos -->
      <div v-if="files.length === 0" class="space-y-6">
        <div class="flex justify-center space-x-6 text-white text-5xl mb-2">
          <UIcon name="i-heroicons-photo" />
          <UIcon name="i-heroicons-video-camera" />
          <UIcon name="i-heroicons-document" />
        </div>
        <p class="text-lg text-[var(--ui-text)]">Arrastra una imagen, video o PDF</p>
        <input
          type="file"
          accept="image/*,video/*,application/pdf"
          class="hidden"
          id="fileInput"
          @change="onFileInput"
        />
        <label
          for="fileInput"
          class="inline-block mt-2 px-6 py-2 bg-[var(--ui-primary)] hover:bg-[var(--ui-primary-hover)] rounded-lg text-white shadow-md transition"
        >
          Seleccionar archivo
        </label>
      </div>

      <!-- CON archivos -->
      <div v-else class="w-full h-full flex flex-col items-center justify-center gap-6">
        <div class="relative w-full h-[70%] flex items-center justify-center rounded-xl overflow-hidden bg-black">
          <template v-if="currentFile()">
            <img
              v-if="detectFileType(currentFile()) === 'image'"
              :src="currentPreviewUrl()"
              class="object-contain w-full h-full"
            />
            <video
              v-else-if="detectFileType(currentFile()) === 'video'"
              :src="currentPreviewUrl()"
              controls
              class="w-full h-full object-contain"
            />
            <embed
              v-else-if="detectFileType(currentFile()) === 'pdf'"
              :src="currentPreviewUrl()"
              type="application/pdf"
              class="w-full h-full"
            />
            <p v-else class="text-white text-sm">Archivo no soportado</p>
          </template>

          <!-- Botón ‹ -->
          <button
            v-if="files.length > 1 && currentIndex > 0"
            @click="prevFile"
            class="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 text-2xl"
          >
            ‹
          </button>

          <!-- Botón › -->
          <button
            v-if="files.length > 1 && currentIndex < files.length - 1"
            @click="nextFile"
            class="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 text-2xl"
          >
            ›
          </button>

          <!-- Indicador -->
          <div
            v-if="files.length > 1"
            class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-3 py-1 rounded-full"
          >
            {{ currentIndex + 1 }} / {{ files.length }}
          </div>

          <!-- Botón flotante + -->
          <label
            for="addMoreFiles"
            class="absolute bottom-4 right-4 bg-[var(--ui-primary)] hover:bg-[var(--ui-primary-hover)] text-white rounded-full p-3 shadow-lg cursor-pointer transition"
            title="Agregar más archivos"
          >
            <UIcon name="i-heroicons-plus" class="w-5 h-5" />
          </label>
          <input
            id="addMoreFiles"
            type="file"
            multiple
            accept="image/*,video/*,application/pdf"
            class="hidden"
            @change="handleAddMoreFiles"
          />
        </div>

        <!-- GALERÍA DE MINIATURAS -->
        <div v-if="files.length > 1" class="w-full flex overflow-x-auto gap-2 mt-2 px-2">
          <div
            v-for="(file, index) in files"
            :key="index"
            @click="currentIndex = index"
            class="cursor-pointer border-2 rounded-md overflow-hidden w-20 h-20 flex-shrink-0 transition"
            :class="currentIndex === index ? 'border-[var(--ui-primary)]' : 'border-transparent hover:border-white/30'"
          >
            <img
              v-if="detectFileType(file) === 'image'"
              :src="getPreviewUrl(file)"
              class="object-cover w-full h-full"
            />
            <video
              v-else-if="detectFileType(file) === 'video'"
              :src="getPreviewUrl(file)"
              class="object-cover w-full h-full"
            />
            <div
              v-else
              class="w-full h-full bg-gray-700 text-white text-xs flex items-center justify-center text-center px-1"
            >
              PDF
            </div>
          </div>
        </div>

        <button
          @click="continueToNextStep"
          class="w-full max-w-xs bg-[var(--ui-primary)] hover:bg-[var(--ui-primary-hover)] py-2 rounded-lg text-white shadow-md transition mt-4"
        >
          Siguiente
        </button>
      </div>
    </div>
  </div>
</template>

