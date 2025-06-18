<template>
  <!-- Contenedor principal centrado vertical y horizontalmente -->
  <div class="min-h-screen flex items-center justify-center bg-[#fdfdf6] dark:bg-tertiary transition-colors">
    <div class="w-full max-w-xl p-8 bg-white dark:bg-[#1f2937] rounded-md shadow-lg text-gray-700 dark:text-gray-100">
      
      <!-- Logo claro/oscuro -->
      <div>
        <!-- Logo claro (visible solo en modo claro) -->
        <img 
          src="/logo_claro-removebg-preview.png"
          alt="Humbox"
          class="mx-auto w-56 h-auto dark:hidden"
        />
        <!-- Logo oscuro (visible solo en modo oscuro) -->
        <img 
          src="/logo_oscuro-removebg-preview.png"
          alt="Humbox"
          class="mx-auto w-56 h-auto hidden dark:block"
        />
      </div>

      <!-- Título del formulario -->
      <h2 class="text-xl font-semibold text-center my-4">Crear una cuenta</h2>

      <!-- Formulario de registro -->
      <form class="space-y-5" @submit.prevent="handleSubmit">

        <!-- Mensaje de error general (si existe) -->
        <div v-if="errorMessage" class="text-red-500 text-sm mb-4 text-center">
          {{ errorMessage }}
        </div>

        <!-- Campo: Nombre completo -->
        <div>
          <label class="block text-sm font-medium mb-1">Nombre completo</label>
          <input
            v-model="formData.name"
            type="text"
            placeholder="Ingresa tu nombre completo"
            class="w-full border-0 border-b border-gray-400 dark:border-gray-500 bg-transparent focus:outline-none focus:border-red-500 transition"
            :class="{ 'border-red-500': fieldErrors.name?.length }"
          />
          <!-- Error específico del campo (si existe) -->
          <div v-if="fieldErrors.name?.length" class="text-red-500 text-sm mt-1">
            {{ fieldErrors.name[0] }}
          </div>
        </div>

        <!-- Campo: Nombre de usuario -->
        <div>
          <label class="block text-sm font-medium mb-1">Nombre de usuario</label>
          <input
            v-model="formData.username"
            type="text"
            placeholder="Elige un nombre de usuario"
            class="w-full border-0 border-b border-gray-400 dark:border-gray-500 bg-transparent focus:outline-none focus:border-red-500 transition"
            :class="{ 'border-red-500': fieldErrors.username?.length }"
          />
          <div v-if="fieldErrors.username?.length" class="text-red-500 text-sm mt-1">
            {{ fieldErrors.username[0] }}
          </div>
        </div>

        <!-- Campo: Email -->
        <div>
          <label class="block text-sm font-medium mb-1">Correo electrónico</label>
          <input
            v-model="formData.email"
            type="email"
            placeholder="Ingresa tu correo electrónico"
            class="w-full border-0 border-b border-gray-400 dark:border-gray-500 bg-transparent focus:outline-none focus:border-red-500 transition"
            :class="{ 'border-red-500': fieldErrors.email?.length }"
          />
          <div v-if="fieldErrors.email?.length" class="text-red-500 text-sm mt-1">
            {{ fieldErrors.email[0] }}
          </div>
        </div>

        <!-- Campo: Contraseña con botón para mostrar/ocultar -->
        <div class="relative">
          <label class="block text-sm font-medium mb-1">Contraseña</label>
          <div class="relative">
            <input
              v-model="formData.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Mínimo 8 caracteres"
              class="w-full border-0 border-b border-gray-400 dark:border-gray-500 bg-transparent focus:outline-none focus:border-red-500 pr-10 transition"
              :class="{ 'border-red-500': fieldErrors.password?.length }"
            />
            <!-- Botón para alternar visibilidad de la contraseña -->
            <button 
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-0 bottom-1 text-gray-500 dark:text-gray-400 focus:outline-none"
            >
              <i v-if="showPassword" class="i-lucide-eye-off w-5 h-5"></i>
              <i v-else class="i-lucide-eye w-5 h-5"></i>
            </button>
          </div>
          <div v-if="fieldErrors.password?.length" class="text-red-500 text-sm mt-1">
            {{ fieldErrors.password[0] }}
          </div>
        </div>

        <!-- Campo: Confirmar contraseña -->
        <div>
          <label class="block text-sm font-medium mb-1">Confirmar contraseña</label>
          <input
            v-model="formData.password_confirmation"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Confirma tu contraseña"
            class="w-full border-0 border-b border-gray-400 dark:border-gray-500 bg-transparent focus:outline-none focus:border-red-500 transition"
          />
        </div>

        <!-- Botón de enviar -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-red-700 dark:bg-red-600 hover:bg-red-800 dark:hover:bg-red-500 text-white font-semibold py-2 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="!isLoading">Registrarse</span>
          <span v-else>Cargando...</span>
        </button>
      </form>

      <!-- Link para volver a inicio de sesión -->
      <div class="text-center text-sm mt-6">
        <router-link to="/login" class="text-red-600 dark:text-red-400 font-medium hover:underline">
          Volver al inicio de sesión
        </router-link>
      </div>

      <!-- Links y pie de página -->
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

<script setup>
import { ref } from 'vue';
import { useAuth } from '~/composables/useAuth';
import { useRouter } from 'vue-router';

// Importa función register desde el composable de autenticación
const { register } = useAuth();
const router = useRouter();

// Datos del formulario (reactivo)
const formData = ref({
  name: '',
  username: '',
  email: '',
  password: '',
  password_confirmation: ''
});

// Controla visibilidad de la contraseña
const showPassword = ref(false);

// Estado de carga para el botón de enviar
const isLoading = ref(false);

// Mensaje de error general
const errorMessage = ref('');

// Errores específicos por campo
const fieldErrors = ref({
  name: [],
  username: [],
  email: [],
  password: []
});

// Función que maneja el envío del formulario
const handleSubmit = async () => {
  // Reinicia errores y estados previos
  errorMessage.value = '';
  fieldErrors.value = {
    name: [],
    username: [],
    email: [],
    password: []
  };
  isLoading.value = true;

  try {
    // Intenta registrar al usuario con los datos ingresados
    await register(
      formData.value.name,
      formData.value.username,
      formData.value.email,
      formData.value.password,
      formData.value.password_confirmation
    );

    // Redirige al perfil tras el registro exitoso
    router.push('/profile/setup')

  } catch (error) {
    if (error.data) {
      // Manejo de errores de validación (errores por campo)
      if (error.data.errors) {
        fieldErrors.value = {
          name: error.data.errors.name || [],
          username: error.data.errors.username || [],
          email: error.data.errors.email || [],
          password: error.data.errors.password || []
        };
      }
      // Manejo de mensaje general de error
      if (error.data.message && !error.data.errors) {
        errorMessage.value = error.data.message;
      }
    } else {
      // Error de conexión u otro imprevisto
      errorMessage.value = 'Error de conexión. Intente nuevamente.';
    }
  } finally {
    // Finaliza estado de carga
    isLoading.value = false;
  }
};
</script>
