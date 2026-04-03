import type { DeleteItemPath, GetItemPath, OperationPathParams } from '~~/types'

export const useResourceDeleteDialogStore = <
  P extends DeleteItemPath | GetItemPath,
>(
  path: P,
) =>
  defineStore(`resource-dialog:delete:${path}`, () => {
    const deleteDialogState = ref<
      OperationPathParams<P, 'get' | 'delete'> | undefined
    >()

    const isDeleteDialogOpen = computed({
      get() {
        return Boolean(deleteDialogState.value)
      },
      set(value: OperationPathParams<P, 'get' | 'delete'> | undefined) {
        deleteDialogState.value = value
      },
    })

    return {
      deleteDialogState,
      isDeleteDialogOpen,
    }
  })()
