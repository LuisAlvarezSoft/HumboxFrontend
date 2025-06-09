export function useLikes() {
  const config = useRuntimeConfig()

  async function toggleLike(postId: number) {
    const { data, error } = await useFetch('/likes/toggle', {
      method: 'POST',
      baseURL: config.public.postsApi,
      body: { post_id: postId },
    })
    if (error.value) throw error.value
    return data.value
  }

  async function fetchLikeCount(postId: number) {
    const { data, error } = await useFetch(`/posts/${postId}/likes/count`, {
      baseURL: config.public.postsApi,
    })
    if (error.value) throw error.value
    return data.value.likes || 0
  }

  return { toggleLike, fetchLikeCount }
}