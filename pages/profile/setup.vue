<template>
  <div class="min-h-screen flex items-center justify-center bg-secondary dark:bg-tertiary p-4">
    <ColorModeSwitch class="absolute top-4 right-4" />

    <div v-if="loading" class="text-center text-gray-600 dark:text-gray-300">
      Cargando perfil...
    </div>

    <ProfileModal
      v-else
      :initial-description="profile?.description || ''"
      :initialPreferences="profile?.preferences || []"
      @submit="handleSubmit"
      @cancel="navigateHome"
    />
  </div>
</template>

<script setup lang="ts">
import { useProfile } from '~/composables/useProfile'

const router = useRouter()
const { getProfile, updateProfile } = useProfile()

const profile = ref<any>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const data = await getProfile()
    profile.value = data
  } catch (err) {
    console.error('Error cargando perfil:', err)
  } finally {
    loading.value = false
  }
})

async function handleSubmit(data: { description: string; preferences: string[] }) {
  try {
    await updateProfile(data.description, data.preferences)
    navigateHome()
  } catch (err) {
    console.error('Error actualizando perfil:', err)
  }
}

function navigateHome() {
 router.push('/profile')
}
</script>
