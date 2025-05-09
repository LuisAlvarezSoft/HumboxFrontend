import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import { useCookie } from '#imports'

export default defineNuxtRouteMiddleware((to) => {
    // Rutas que pueden verse sin token
    const publicRoutes = ['/login', '/register', '/forgot-password']
    const token = useCookie('token').value

    // Si vas a una ruta privada sin token, te mandamos al login
    if (!publicRoutes.includes(to.path) && !token) {
        return navigateTo('/login')
    }
    // Si tienes token y vas a la ruta de login, te mandamos al home
    if (token && to.path === '/login') {
      return navigateTo('/')
    }
})