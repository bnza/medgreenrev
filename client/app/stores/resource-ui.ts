import type {ApiPath} from "~~/types";

const useResourceUiStore = (path: ApiPath) => defineStore(`resource-ui:${path}`, () => {
  const dialogStates = reactive<{ delete: boolean, create: boolean, update: boolean, search: boolean }>({
    delete: false,
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
    isDeleteDialogOpen: isDialogOpenFn('delete'),
    isCreateDialogOpen: isDialogOpenFn('create'),
    isUpdateDialogOpen: isDialogOpenFn('update'),
    isSearchDialogOpen: isDialogOpenFn('search'),
  }
})()

export default useResourceUiStore
