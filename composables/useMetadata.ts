// composables/useMetadata.ts

export function useMetadata() {
  const config = useRuntimeConfig()
  const token = useCookie('auth_token')

  const headers = {
    Authorization: `Bearer ${token.value}`,
    Accept: 'application/json'
  }

  /**
   * Obtiene todos los tipos de recurso (documento, imagen, video, etc.)
   */
  async function fetchResourceTypes() {
    const { data, error } = await useFetch('/resource-types', {
      baseURL: config.public.postsApi,
      headers,
    })
    if (error.value) throw error.value
    return data.value
  }

  /**
   * Obtiene todas las etiquetas agrupadas por categoría
   */
  async function fetchTags() {
    const { data, error } = await useFetch('/tags', {
      baseURL: config.public.postsApi,
      headers,
    })
    if (error.value) throw error.value
    return data.value
  }

  return {
    fetchResourceTypes,
    fetchTags
  }
}
