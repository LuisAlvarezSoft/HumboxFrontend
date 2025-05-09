<template>
  <!-- Contenedor principal centrado vertical y horizontalmente, con fondo claro/oscuro dinámico -->
  <div class="min-h-screen flex items-center justify-center bg-[#fdfdf6] dark:bg-tertiary transition-colors">
    
    <!-- Card del formulario (máximo ancho xl), con padding, fondo claro/oscuro, bordes redondeados y sombra -->
    <div class="w-full max-w-xl p-8 bg-white dark:bg-[#1f2937] rounded-2xl shadow-lg text-gray-700 dark:text-gray-100 rounded-sm">
      
      <!-- Logotipo (cambia dependiendo del modo oscuro/claro) -->
      <div class="">
        <!-- Logo para modo claro -->
        <img 
          src="/logo_claro-removebg-preview.png"
          alt="Humbox"
          class="mx-auto w-56 h-auto dark:hidden"
        />
        <!-- Logo para modo oscuro -->
        <img 
          src="/logo_oscuro-removebg-preview.png"
          alt="Humbox"
          class="mx-auto w-56 h-auto hidden dark:block"
        />
      </div>

      <!-- Formulario de inicio de sesión -->
      <form class="space-y-5" @submit.prevent="handleLogin">
        
        <!-- Muestra un mensaje de error general si existe -->
        <div v-if="errorMessage" class="text-red-500 text-sm mb-4 text-center">
          {{ errorMessage }}
        </div>

        <!-- Campo de entrada: correo electrónico o usuario -->
        <div>
          <label class="block text-sm font-medium mb-1">Correo electrónico o usuario</label>
          <input
            v-model="formData.login"
            type="text"
            placeholder="Ingresa tu correo electrónico o usuario"
            class="w-full border-0 border-b border-gray-400 dark:border-gray-500 bg-transparent focus:outline-none focus:border-red-500 transition"
            :class="{ 'border-red-500': fieldErrors.login?.length }"
          />
          <!-- Muestra el primer error de validación para login -->
          <div v-if="fieldErrors.login?.length" class="text-red-500 text-sm mt-1">
            {{ fieldErrors.login[0] }}
          </div>
        </div>

        <!-- Campo de entrada: contraseña -->
        <div>
          <label class="block text-sm font-medium mb-1">Contraseña</label>
          <input
            v-model="formData.password"
            type="password"
            placeholder="Mínimo 8 caracteres"
            class="w-full border-0 border-b border-gray-400 dark:border-gray-500 bg-transparent focus:outline-none focus:border-red-500 transition"
            :class="{ 'border-red-500': fieldErrors.password?.length }"
          />
          <!-- Muestra el primer error de validación para password -->
          <div v-if="fieldErrors.password?.length" class="text-red-500 text-sm mt-1">
            {{ fieldErrors.password[0] }}
          </div>
        </div>

        <!-- Botón de enviar (deshabilitado cuando isLoading es true) -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-red-700 dark:bg-red-600 hover:bg-red-800 dark:hover:bg-red-500 text-white font-semibold py-2 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <!-- Texto cambia dependiendo del estado de carga -->
          <span v-if="!isLoading">Ingresar</span>
          <span v-else>Cargando...</span>
        </button>
      </form>

      <!-- Enlace para recuperar contraseña -->
      <div class="text-sm text-center text-blue-700 dark:text-blue-400 mt-3 hover:underline cursor-pointer">
        <a href="/forgot-password">
          ¿Olvidaste tu contraseña?
        </a>
      </div>

      <!-- Separador visual con "o" -->
      <div class="flex items-center my-6">
        <hr class="flex-grow border-t border-gray-300 dark:border-gray-600" />
        <span class="mx-2 text-xs text-gray-400 dark:text-gray-500">o</span>
        <hr class="flex-grow border-t border-gray-300 dark:border-gray-600" />
      </div>

      <!-- Botón para iniciar sesión con Google -->
      <button
        class="w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 rounded py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      >
        <span>Continuar con Google</span>
      </button>

      <!-- Enlace para registrarse -->
      <div class="text-center text-sm mt-6">
        ¿No tienes una cuenta?
        <a href="/register" class="text-red-600 dark:text-red-400 font-medium hover:underline">Regístrate</a>
      </div>

      <!-- Footer con enlaces informativos -->
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
// Importa funciones de Vue y librerías personalizadas
import { ref } from 'vue';
import { useAuth } from '~/composables/useAuth';
import { useRouter } from 'vue-router';

// Obtiene la función login del composable de autenticación
const { login } = useAuth();
// Inicializa el enrutador para redireccionar
const router = useRouter();

// Estado reactivo para los datos del formulario
const formData = ref({
  login: '',
  password: ''
});

// Estado reactivo para mensajes de error general
const errorMessage = ref(null);
// Estado para controlar si la solicitud está en progreso
const isLoading = ref(false);
// Estado para los errores de validación de cada campo
const fieldErrors = ref({
  login: [],
  password: []
});

// Función que maneja el envío del formulario
const handleLogin = async () => {
  // Resetea los mensajes de error
  errorMessage.value = null;
  fieldErrors.value = { login: [], password: [] };
  isLoading.value = true; // Activa estado de carga
  
  try {
    // Llama a la función de login con los datos ingresados
    await login(formData.value.login, formData.value.password);
    // Redirige al perfil si la autenticación es exitosa
    await router.push('/profile');
  } catch (error) {
    // Si el backend devuelve errores
    if (error.data) {
      // Si hay errores de validación por campo, los asigna
      if (error.data.errors) {
        fieldErrors.value = {
          login: error.data.errors.login || [],
          password: error.data.errors.password || []
        };
      }
      // Si hay un mensaje de error general
      if (error.data.message && !error.data.errors) {
        errorMessage.value = error.data.message;
      }
    } else {
      // Error de conexión o inesperado
      errorMessage.value = 'Error de conexión. Intente nuevamente.';
    }
  } finally {
    // Desactiva estado de carga al finalizar
    isLoading.value = false;
  }
};
</script>
