type HistoryStackItem = {
  path: string
  isUserAction: boolean
}
export const useHistoryStackStore = defineStore('historyStack', () => {
  const defaultItem = () => ({path: '/', isUserAction: false})
  const history = ref<HistoryStackItem[]>([defaultItem()])
  const route = useRoute()

  const {isAuthenticated} = useAppAuth()

  const current = computed(() =>
    history.value.at(-1) || defaultItem()
  )

  /**
   * A computed property that determines the path to redirect to based on the current user action state,
   * authentication status, and navigation history.
   *
   * The computation prioritizes user action paths if triggered by the user. Otherwise, it uses the most
   * recent paths from the navigation history depending on the user's authentication state.
   *
   * Conditions:
   * - If the current action is triggered by the user (`current.value.isUserAction`), the `current.value.path` is used.
   * - If the user is authenticated (`isAuthenticated.value`), the second-to-last path in the history (`history.value.at(-1)?.path`) is used, defaulting to `'/'` if unavailable.
   * - If the user is not authenticated, the third-to-last path in the history (`history.value.at(-2)?.path`) is used, defaulting to `'/'` if unavailable.
   */
  const redirectionPath = computed(
    () =>
      current.value.isUserAction
        ? current.value.path
        : isAuthenticated.value
          ? history.value.at(-1)?.path || '/'
          : history.value.at(-2)?.path || '/'
  )

  const push = (item?: HistoryStackItem | string) => {
    if (typeof item === 'string') {
      item = {path: item, isUserAction: true}
    }
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
