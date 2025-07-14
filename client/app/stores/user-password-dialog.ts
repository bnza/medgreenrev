import type { UserBaseData } from '~~/types'
import { isValidUserBaseData } from '~/utils/guards'

export const useUserPasswordDialog = defineStore('user-password-dialog', () => {
  const userData = ref<UserBaseData>()
  const plainPassword = ref<string>()
  const isDialogOpen = computed(() => userData.value !== undefined)
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
  return { isDialogOpen, plainPassword, userData, openUserPasswordDialog }
})

export default useUserPasswordDialog
