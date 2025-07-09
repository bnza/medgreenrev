type HistoryStackItem = {
  path: string
  isUserAction: boolean
}
export const useHistoryStackStore = defineStore('history-stack', () => {
  const defaultItem = () => ({path: '/', isUserAction: false})
  const history = ref<HistoryStackItem[]>([defaultItem()])
  const route = useRoute()

  const {isAuthenticated} = useAppAuth()

  const last = computed(() =>
    history.value.at(-1) || defaultItem()
  )


  /**
   * A computed variable that determines the redirection path based on user actions, authentication status, and navigation history.
   *
   * If the latest entry was caused by a user action (`isUserAction` is true), it uses the path from the last action.
   * Otherwise, if it was an auth middleware redirect, but the user is now successfully authenticated (`isAuthenticated` is true), it still uses the path from the last action.
   * If neither condition is met, it defaults to the second last entry in the navigation history, or '/' if no such entry exists.
   *
   * Returns:
   * - A string representing the determined redirection path.
   */
  const redirectionPath = computed(
    () =>
      last.value.isUserAction
        ? last.value.path
        : isAuthenticated.value
          ? last.value.path
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

  const pushCurrentPath = (isUserAction: boolean = true) => push({path: route.fullPath, isUserAction})

  const pop = () => history.value.pop() || defaultItem()

  function $reset() {
    history.value = [defaultItem()]
  }

  return {
    history,
    last,
    push,
    pushCurrentPath,
    pop,
    $reset,
    redirectionPath
  }
})
