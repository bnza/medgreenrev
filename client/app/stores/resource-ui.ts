import type { ApiPath, OperationPathParams, paths } from '~~/types'

const useResourceUiStore = <P extends ApiPath | keyof paths>(path: P) =>
  defineStore(`resource-ui:${path}`, () => {
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

    const dialogStates = reactive<{ create: boolean; search: boolean }>({
      create: false,
      search: false,
    })

    const isDialogOpenFn = (mode: keyof typeof dialogStates) =>
      computed({
        get() {
          return dialogStates[mode]
        },
        set(flag: boolean) {
          dialogStates[mode] = flag
        },
      })

    const redirectToItem = ref(false)

    const tab = ref('')
    const panels = ref<string[]>([])
    return {
      dialogStates,
      deleteDialogState,
      updateDialogState,
      isDeleteDialogOpen,
      isUpdateDialogOpen,
      isCreateDialogOpen: isDialogOpenFn('create'),
      isSearchDialogOpen: isDialogOpenFn('search'),
      redirectToItem,
      tab,
      panels,
    }
  })()

export default useResourceUiStore
