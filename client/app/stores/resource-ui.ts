import type {ApiPath} from "~~/types";

const useResourceUiStore = (path: ApiPath) => defineStore(`resource-ui:${path}`, () => {

  const deleteDialogState = ref<Record<string, string>|false>(false)

  const isDeleteDialogOpen = computed({
    get() {
      return Boolean(deleteDialogState.value)
    },
    set(value: Record<string, string>|false) {
      deleteDialogState.value = value
    }})

  const dialogStates = reactive<{ create: boolean, update: boolean, search: boolean }>({
    create: false,
    update: false,
    search: false,
  })

  const isDialogOpenFn = (mode: keyof typeof dialogStates) => computed({
    get() {
      return dialogStates[mode]
    },
    set(flag: boolean) {
      dialogStates[mode] = flag
    }
  })

  return {
    dialogStates,
    deleteDialogState,
    isDeleteDialogOpen,
    isCreateDialogOpen: isDialogOpenFn('create'),
    isUpdateDialogOpen: isDialogOpenFn('update'),
    isSearchDialogOpen: isDialogOpenFn('search'),
  }
})()

export default useResourceUiStore
