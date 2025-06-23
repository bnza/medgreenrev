type HistoryStackItem = {
  path: string
  isUserAction: boolean
}
export const useHistoryStackStore = defineStore('loginRedirectTo', () => {

  const defaultItem = () => ({path: '/', isUserAction: false})

  const history = ref<HistoryStackItem[]>([defaultItem()])

  const route = useRoute()

  const current = computed(() =>
    history.value.at(-1) || defaultItem()
  )

  const redirectionPath = computed(() => current.value.isUserAction ? current.value.path : '/')

  const push = (item?: HistoryStackItem) => {
    if (!item) {
      item = route.redirectedFrom?.fullPath
        ? {path: route.redirectedFrom.fullPath, isUserAction: false}
        : defaultItem()
    }
    history.value.push(item)
  }

  const pop = () => history.value.pop() || defaultItem()

  function $reset() {
    history.value = [defaultItem()]
  }

  return {history, current, push, pop, $reset, redirectionPath}
})
