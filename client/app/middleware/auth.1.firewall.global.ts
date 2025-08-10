export default defineNuxtRouteMiddleware((to) => {
  if (to.meta.public) return

  const { isAuthenticated } = useAppAuth()
  const historyStack = useHistoryStackStore()
  if (!isAuthenticated.value) {
    historyStack.pushForcedLogin(to.fullPath)
    return navigateTo('/login')
  }
})
