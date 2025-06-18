// composables/useMetrics.ts
import { useAsyncData } from '#app'

export const useMetrics = async () => {
  const { data: users } = await useAsyncData('users', () =>
    $fetch('http://localhost:8002/api/metrics/users')
  )
  const { data: posts } = await useAsyncData('posts', () =>
    $fetch('http://localhost:8002/api/metrics/posts')
  )
  const { data: comments } = await useAsyncData('comments', () =>
    $fetch('http://localhost:8002/api/metrics/comments')
  )
  const { data: likes } = await useAsyncData('likes', () =>
    $fetch('http://localhost:8002/api/metrics/likes')
  )

  return { users, posts, comments, likes }
}
