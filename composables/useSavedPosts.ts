export function useSavedPosts() {
  const config = useRuntimeConfig()

  async function toggleSaved(postId: number) {
    const { data, error } = await useFetch('/saved/toggle', {
      method: 'POST',
      baseURL: config.public.postsApi,
      body: { post_id: postId },
    })
    if (error.value) throw error.value
    return data.value
  }

  async function fetchSavedPosts(userId: number) {
    const { data, error } = await useFetch(`/saved/${userId}`, {
      baseURL: config.public.postsApi,
    })
    if (error.value) throw error.value
    return data.value
  }

  return { toggleSaved, fetchSavedPosts }
}
