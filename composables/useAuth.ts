// composables/useAuth.ts

/**
 * Composable que proporciona funciones para autenticación y manejo de credenciales.
 * Incluye login, registro, solicitud de código OTP, restablecimiento de contraseña y cierre de sesión.
 * 
 * Utiliza la API definida en `config.public.apiBase`.
 */
export function useAuth() {
  const config = useRuntimeConfig()

  /**
   * Inicia sesión de un usuario.
   * Guarda el token JWT en una cookie si la autenticación es exitosa.
   *
   * @param {string} login - Nombre de usuario o correo electrónico.
   * @param {string} password - Contraseña del usuario.
   * @returns {Promise<any>} Datos de la respuesta del servidor.
   * @throws {Error} Si ocurre un error en la petición.
   */
  async function login(login: string, password: string) {
    const { data, error } = await useFetch('/auth/login', {
      baseURL: config.public.apiBase,
      method: 'POST',
      body: { login, password },
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (error.value) {
      throw error.value;
    }

    if (data.value?.access_token) {
      const token = useCookie('auth_token', {
        maxAge: 60 * 60 * 24 * 7, // 1 semana
        sameSite: 'lax',
      });
      token.value = data.value.access_token;
    }

    return data.value;
  }

  /**
   * Registra un nuevo usuario y guarda el token JWT en una cookie si el registro es exitoso.
   *
   * @param {string} name - Nombre completo del usuario.
   * @param {string} username - Nombre de usuario.
   * @param {string} email - Correo electrónico del usuario.
   * @param {string} password - Contraseña.
   * @param {string} password_confirmation - Confirmación de la contraseña.
   * @returns {Promise<any>} Datos de la respuesta del servidor.
   * @throws {Error} Si ocurre un error en la petición.
   */
  async function register(
    name: string,
    username: string,
    email: string,
    password: string,
    password_confirmation: string
  ) {
    const { data, error } = await useFetch('/auth/register', {
      baseURL: config.public.apiBase,
      method: 'POST',
      body: { 
        name, 
        username, 
        email, 
        password, 
        password_confirmation 
      },
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
  
    if (error.value) {
      throw error.value;
    }
  
    if (data.value?.access_token) {
      const token = useCookie('auth_token', {
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'lax',
      });
      token.value = data.value.access_token;
    }
  
    return data.value;
  }

  /**
   * Solicita el envío de un código OTP (One-Time Password) al correo o usuario especificado.
   * Este código se usa para restablecer la contraseña.
   *
   * @param {string} login - Nombre de usuario o correo electrónico asociado a la cuenta.
   * @returns {Promise<any>} Datos de la respuesta del servidor.
   * @throws {{ data: any, status: number }} Si ocurre un error en la petición.
   */
  async function sendOtp(login: string) {
    const { data, error } = await useFetch('/auth/password/otp', {
      baseURL: config.public.apiBase,
      method: 'POST',
      body: { login },
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
  
    if (error.value) {
      throw {
        data: error.value.data,
        status: error.value.statusCode
      }
    }
  
    return data.value
  }

  /**
   * Restablece la contraseña de una cuenta utilizando el código OTP.
   *
   * @param {string} login - Nombre de usuario o correo electrónico asociado a la cuenta.
   * @param {string} otp - Código de verificación de 6 dígitos enviado al usuario.
   * @param {string} password - Nueva contraseña.
   * @param {string} password_confirmation - Confirmación de la nueva contraseña.
   * @returns {Promise<any>} Datos de la respuesta del servidor.
   * @throws {{ data: any, status: number }} Si ocurre un error en la petición.
   */
  async function resetPassword(
    login: string,
    otp: string,
    password: string,
    password_confirmation: string
  ) {
    const { data, error } = await useFetch('/auth/password/reset', {
      baseURL: config.public.apiBase,
      method: 'POST',
      body: { 
        login, 
        otp, 
        password, 
        password_confirmation 
      },
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
  
    if (error.value) {
      throw {
        data: error.value.data,
        status: error.value.statusCode
      }
    }
  
    return data.value
  }

  /**
   * Cierra la sesión del usuario y elimina el token de autenticación guardado en las cookies.
   *
   * @returns {Promise<void>}
   */
  async function logout() {
    await useFetch('/auth/logout', {
      baseURL: config.public.apiBase,
      method: 'POST'
    })
    useCookie('token').value = null
  }

  return { login, register, sendOtp, resetPassword, logout }
}
