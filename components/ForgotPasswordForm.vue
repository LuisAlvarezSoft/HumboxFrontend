<template>
  <!-- Contenedor principal centrado vertical y horizontalmente con fondo claro/oscuro -->
  <div class="min-h-screen flex items-center justify-center bg-[#fdfdf6] dark:bg-tertiary transition-colors">
    
    <!-- Card del formulario -->
    <div class="w-full max-w-sm p-8 bg-white dark:bg-[#1f2937] rounded-md shadow-lg text-gray-700 dark:text-gray-100">
      
      <!-- Logo (cambia según modo claro/oscuro) -->
      <div>
        <img src="/logo_claro-removebg-preview.png" alt="Humbox" class="mx-auto w-56 h-auto dark:hidden" />
        <img src="/logo_oscuro-removebg-preview.png" alt="Humbox" class="mx-auto w-56 h-auto hidden dark:block" />
      </div>

      <!-- Título de la página -->
      <h2 class="text-xl font-semibold text-center my-4">Restablecer Contraseña</h2>

      <!-- Paso 1: Solicitar email/usuario -->
      <form v-if="step === 1" class="space-y-5" @submit.prevent="requestOtp">
        
        <!-- Error general -->
        <div v-if="errorMessage" class="text-red-500 text-sm mb-4 text-center">
          {{ errorMessage }}
        </div>

        <!-- Campo de login (email o usuario) -->
        <div>
          <label class="block text-sm font-medium mb-1">Usuario o correo electrónico</label>
          <input
            v-model="form.login"
            type="text"
            placeholder="Ingresa tu usuario o correo"
            class="w-full border-0 border-b border-gray-400 dark:border-gray-500 bg-transparent focus:outline-none focus:border-red-500 transition"
            :class="{ 'border-red-500': fieldErrors.login?.length }"
          />
          <!-- Mensaje de error específico del campo -->
          <div v-if="fieldErrors.login?.length" class="text-red-500 text-sm mt-1">
            {{ fieldErrors.login[0] }}
          </div>
        </div>

        <!-- Botón para solicitar el código (OTP) -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-red-700 dark:bg-red-600 hover:bg-red-800 dark:hover:bg-red-500 text-white font-semibold py-2 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="!isLoading">Solicitar código</span>
          <span v-else>Cargando...</span>
        </button>
      </form>

      <!-- Paso 2: Ingresar OTP y nueva contraseña -->
      <form v-else class="space-y-5" @submit.prevent="submitReset">
        
        <!-- Error general -->
        <div v-if="errorMessage" class="text-red-500 text-sm mb-4 text-center">
          {{ errorMessage }}
        </div>

        <!-- Mensaje de éxito -->
        <div v-if="message" class="text-green-600 text-sm mb-4 text-center">
          {{ message }}
        </div>

        <!-- Campo código de verificación (OTP) -->
        <div>
          <label class="block text-sm font-medium mb-1">Código de verificación</label>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
            Se ha enviado un código a {{ hideEmail(form.login) }}
          </p>
          <div class="flex justify-center">
            <UPinInput v-model="form.otp" :length="6" class="w-full justify-center" placeholder="O" />
          </div>
          <div v-if="fieldErrors.otp?.length" class="text-red-500 text-sm mt-1 text-center">
            {{ fieldErrors.otp[0] }}
          </div>
        </div>

        <!-- Campo nueva contraseña -->
        <div class="relative">
          <label class="block text-sm font-medium mb-1">Nueva contraseña</label>
          <div class="relative">
            <input
              v-model="form.password"
              :type="showPass ? 'text' : 'password'"
              placeholder="Mínimo 8 caracteres"
              class="w-full border-0 border-b border-gray-400 dark:border-gray-500 bg-transparent focus:outline-none focus:border-red-500 pr-10 transition"
              :class="{ 'border-red-500': fieldErrors.password?.length }"
            />
            <!-- Botón para mostrar/ocultar contraseña -->
            <button 
              type="button"
              @click="showPass = !showPass"
              class="absolute right-0 bottom-1 text-gray-500 dark:text-gray-400 focus:outline-none"
            >
              <i v-if="showPass" class="i-lucide-eye-off w-5 h-5"></i>
              <i v-else class="i-lucide-eye w-5 h-5"></i>
            </button>
          </div>
          <div v-if="fieldErrors.password?.length" class="text-red-500 text-sm mt-1">
            {{ fieldErrors.password[0] }}
          </div>
        </div>

        <!-- Confirmar nueva contraseña -->
        <div>
          <label class="block text-sm font-medium mb-1">Confirmar nueva contraseña</label>
          <input
            v-model="form.password_confirmation"
            :type="showPass ? 'text' : 'password'"
            placeholder="Confirma tu nueva contraseña"
            class="w-full border-0 border-b border-gray-400 dark:border-gray-500 bg-transparent focus:outline-none focus:border-red-500 transition"
            :class="{ 'border-red-500': fieldErrors.password_confirmation?.length }"
          />
          <div v-if="fieldErrors.password_confirmation?.length" class="text-red-500 text-sm mt-1">
            {{ fieldErrors.password_confirmation[0] }}
          </div>
        </div>

        <!-- Botones: restablecer, reenviar código, volver atrás -->
        <div class="flex flex-col space-y-3">
          <button type="submit" :disabled="isLoading" class="w-full bg-red-700 dark:bg-red-600 hover:bg-red-800 dark:hover:bg-red-500 text-white font-semibold py-2 rounded transition disabled:opacity-50 disabled:cursor-not-allowed">
            <span v-if="!isLoading">Restablecer contraseña</span>
            <span v-else>Cargando...</span>
          </button>
          <button type="button" @click="requestOtp" :disabled="isLoading" class="text-sm text-red-600 dark:text-red-400 hover:underline disabled:opacity-50">
            Reenviar código
          </button>
          <button type="button" @click="step = 1" class="text-sm text-gray-500 dark:text-gray-400 hover:underline">
            Volver atrás
          </button>
        </div>
      </form>

      <!-- Link para volver al login -->
      <div class="text-center text-sm mt-6">
        <router-link to="/login" class="text-red-600 dark:text-red-400 font-medium hover:underline">
          Volver al inicio de sesión
        </router-link>
      </div>

      <!-- Footer -->
      <div class="text-center mt-6 text-xs text-gray-400 dark:text-gray-500 space-y-1">
        <div>
          <a href="#" class="hover:underline">Página AVH</a> &nbsp; | &nbsp;
          <a href="#" class="hover:underline">Instagram AVH</a>
        </div>
        <p>Español (Latinoamérica)</p>
        <p>© Copyright Alexander Von Humboldt. Todos los derechos reservados</p>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'

// Hooks para autenticación y navegación
const { sendOtp, resetPassword } = useAuth()
const router = useRouter()

// Estado del formulario y otras variables
const form = ref({ login: '', otp: [], password: '', password_confirmation: '' })
const showPass = ref(false)
const message = ref('')
const errorMessage = ref(null)
const fieldErrors = ref({ login: [], otp: [], password: [], password_confirmation: [] })
const step = ref(1)

// Función para ocultar parte del correo/usuario al mostrarlo (por privacidad)
function hideEmail(email) {
  if (!email) return ''
  if (email.includes('@')) {
    const [name, domain] = email.split('@')
    return (name.length <= 2 ? name : name.slice(0,2)) + '***@' + domain
  }
  return (email.length <= 2 ? email : email.slice(0,2)) + '***'
}

// Solicitar OTP
async function requestOtp() {
  errorMessage.value = null
  fieldErrors.value = { login: [] }
  message.value = ''
  step.value = 1
  try {
    await sendOtp(form.value.login)
    step.value = 2
  } catch (err) {
    const data = err.data || {}
    if (data.errors) {
      fieldErrors.value.login = data.errors.login || []
    }
    if (data.message) {
      errorMessage.value = data.message
    } else if (!data.errors) {
      errorMessage.value = 'Error de conexión. Intente nuevamente.'
    }
  }
}

// Enviar formulario para restablecer contraseña
async function submitReset() {
  errorMessage.value = null
  message.value = ''
  fieldErrors.value = { otp: [], password: [], password_confirmation: [] }

  // Convertir array de OTP a string
  const otpString = Array.isArray(form.value.otp) ? form.value.otp.join('') : form.value.otp

  // Validaciones
  if (!otpString || otpString.length !== 6) {
    fieldErrors.value.otp = ['El código de verificación debe tener 6 dígitos']
    return
  }
  if (form.value.password.length < 8) {
    fieldErrors.value.password = ['La contraseña debe tener al menos 8 caracteres']
    return
  }
  if (form.value.password !== form.value.password_confirmation) {
    fieldErrors.value.password_confirmation = ['Las contraseñas no coinciden']
    return
  }

  // Enviar solicitud de cambio de contraseña
  try {
    await resetPassword(
      form.value.login,
      otpString,
      form.value.password,
      form.value.password_confirmation
    )
    message.value = 'Contraseña restablecida con éxito'
    setTimeout(() => router.push('/login'), 1500)
  } catch (err) {
    const data = err.data || {}
    if (data.errors) {
      fieldErrors.value = {
        otp: data.errors.otp || [],
        password: data.errors.password || [],
        password_confirmation: data.errors.password_confirmation || []
      }
    }
    if (data.message) {
      errorMessage.value = data.message
    } else if (!data.errors) {
      errorMessage.value = 'Error de conexión. Intente nuevamente.'
    }
  }
}
</script>
