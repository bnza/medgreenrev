import type { PatchItemPath, GetItemPath, OperationPathParams } from '~~/types'

export const useResourceUpdateDialogStore = <
  P extends PatchItemPath | GetItemPath,
>(
  path: P,
) =>
  defineStore(`resource-dialog:update:${path}`, () => {
    const updateDialogState = ref<
      OperationPathParams<P, 'get' | 'patch'> | undefined
    >()

    const isUpdateDialogOpen = computed({
      get() {
        return Boolean(updateDialogState.value)
      },
      set(value: OperationPathParams<P, 'get' | 'patch'> | undefined) {
        updateDialogState.value = value
      },
    })

    return {
      updateDialogState,
      isUpdateDialogOpen,
    }
  })()
