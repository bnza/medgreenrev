import type { UserBaseData } from '~~/types'

export const useUserPasswordDialog = defineStore('user-password-dialog', () => {
  const userData = ref<UserBaseData>()
  const plainPassword = ref<string>()
  const isDialogOpen = computed(() => userData.value !== undefined)
  watch(
    userData,
    (value) => {
      if (!value) {
        plainPassword.value = undefined
      }
    },
    { immediate: true },
  )
  return { isDialogOpen, plainPassword, userData }
})

export default useUserPasswordDialog
