export default defineStore('user-plain-password', () => {
  const plainPassword = ref<string | null>(null)
  return { plainPassword }
})
