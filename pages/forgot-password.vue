<script setup lang="ts">
import ForgotPasswordForm from '~/components/ForgotPasswordForm.vue'
import ColorModeSwitch from '~/components/ColorModeSwitch.vue'
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-secondary dark:bg-tertiary p-4">
    <ColorModeSwitch class="absolute top-4 right-4" />
    <ForgotPasswordForm />
  </div>
</template>
