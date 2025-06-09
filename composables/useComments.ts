export function useComments() {
  const config = useRuntimeConfig()
  const token = useCookie('auth_token')

  const headers = {
    'Accept': 'application/json',
    ...(token.value && { 'Authorization': `Bearer ${token.value}` })
  }

  // Crear un nuevo comentario en una publicación
  async function createComment(postId: number, content: string) {
    const response = await fetch(`${config.public.postsApi}/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Error al crear comentario')
    }

    return await response.json()
  }

  // Obtener comentarios de una publicación
  async function fetchComments(postId: number) {
    const response = await fetch(`${config.public.postsApi}/posts/${postId}/comments`, {
      method: 'GET',
      headers
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Error al obtener comentarios')
    }

    return await response.json()
  }

  return {
    createComment,
    fetchComments
  }
}
