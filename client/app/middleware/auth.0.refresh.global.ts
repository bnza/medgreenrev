export default defineNuxtRouteMiddleware(() => {
  const { refresh, signOut, status } = useAuth()

  if (status.value !== 'unauthenticated') {
    refresh()
      .then((result) => {
        console.log('get-session result:', result)
      })
      .catch(async (err) => {
        console.error('get-session error:', err)
        //await signOut({ callbackUrl: 'logout', external: false })
      })
  }
})
