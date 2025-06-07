// composables/usePosts.ts

export function usePosts() {
  const config = useRuntimeConfig()
  const token = useCookie('auth_token')

  // Construye headers dinámicamente
  const buildHeaders = (isJson = false): Record<string, string> => {
    const headers: Record<string, string> = {}

    if (token.value) {
      headers['Authorization'] = `Bearer ${token.value}`
    }

    if (isJson) {
      headers['Content-Type'] = 'application/json'
      headers['Accept'] = 'application/json'
    }

    return headers
  }

  async function fetchPosts() {
    const { data, error } = await useFetch('/posts', {
      baseURL: config.public.postsApi,
      headers: buildHeaders(true)
    })

    if (error.value) {
      console.error('❌ Error al traer posts:', error.value)
      throw error.value
    }

    return data.value
  }

  async function createPost(formData: FormData) {
  console.log("📡 POST API URL:", config.public.postsApi)

  try {
    const response = await fetch(`${config.public.postsApi}/posts`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json'
      },
      body: formData,
      // ❌ IMPORTANTE: NO uses credentials aquí si no tienes auth con cookies
      // credentials: 'include'
    })

    if (!response.ok) {
      const contentType = response.headers.get('content-type')

      if (contentType?.includes('application/json')) {
        const error = await response.json()
        throw new Error(error.message || 'Error al crear el post')
      } else {
        const errorText = await response.text()
        console.error('❌ Respuesta HTML o inesperada:', errorText)
        throw new Error('Error desconocido al crear el post')
      }
    }

    return await response.json()
  } catch (error) {
    console.error('💥 Error en createPost:', error)
    throw error
  }
}


  return {
    fetchPosts,
    createPost
  }
}
