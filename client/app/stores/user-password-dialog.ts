import type { UserBaseData } from '~~/types'

export const useUserPasswordDialog = defineStore('user-password-dialog', () => {
  const userData = ref<UserBaseData>()
  const plainPassword = ref<string>()
  const isDialogOpen = computed(() => userData.value !== undefined)
  const triggered = ref(false)
  const submitStatus = ref<'idle' | 'pending' | 'success' | 'error'>('idle')
  const openUserPasswordDialog = ({
    request,
    response,
  }: {
    request: Record<string, any>
    response: Record<string, any>
  }) => {
    plainPassword.value = request.plainPassword
    if (!isValidUserBaseData(response)) {
      console.error('Invalid user data', response)
    }
    userData.value = isValidUserBaseData(response) ? response : undefined
  }
  watch(
    userData,
    (value) => {
      if (!value) {
        plainPassword.value = undefined
      }
    },
    { immediate: true },
  )
  return {
    triggered,
    isDialogOpen,
    plainPassword,
    submitStatus,
    userData,
    openUserPasswordDialog,
  }
})

export default useUserPasswordDialog
