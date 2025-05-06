// middleware/auth.ts
export default defineNuxtRouteMiddleware(async () => {
    const userStore = useUserStore()

    if (import.meta.client) {
        await userStore.fetchUser()
        if (!userStore.user) {
            return navigateTo('/login')
        }
    }
})
