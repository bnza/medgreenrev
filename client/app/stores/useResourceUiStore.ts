import type { ApiPath, paths } from '~~/types'

const useResourceUiStore = <P extends ApiPath | keyof paths>(
  path: P,
  startingPanels: string[] = [],
) =>
  defineStore(`resource-ui:${path}`, () => {
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
    const panels = ref<string[]>(startingPanels)
    return {
      dialogStates,
      isCreateDialogOpen: isDialogOpenFn('create'),
      isSearchDialogOpen: isDialogOpenFn('search'),
      redirectToItem,
      tab,
      panels,
    }
  })()

export default useResourceUiStore
