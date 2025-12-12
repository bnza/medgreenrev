type HistoryStackItem = {
  path: string
  isUserAction: boolean
}
export const useHistoryStackStore = defineStore('history-stack', () => {
  const defaultItem = () => ({ path: '/', isUserAction: false })
  const history = ref<HistoryStackItem[]>([defaultItem()])

  const { isAuthenticated } = useAppAuth()

  const route = useRoute()

  const last = computed(() => history.value.at(-1) || defaultItem())

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
  const redirectionPath = computed(() =>
    last.value.isUserAction
      ? last.value.path
      : isAuthenticated.value
        ? last.value.path
        : history.value.at(-2)?.path || '/',
  )

  const push = (item?: HistoryStackItem | string | { fullPath: string }) => {
    const pushingItem = ref<HistoryStackItem>()
    if (!item) {
      pushingItem.value = defaultItem()
    }
    if (typeof item === 'string') {
      pushingItem.value = { path: item, isUserAction: true }
    }
    // item is a vue-route route object
    if (isPlainObject(item) && 'fullPath' in item) {
      pushingItem.value = { path: item.fullPath, isUserAction: false }
    }
    if (isPlainObject(item) && 'isUserAction' in item) {
      pushingItem.value = item
    }
    if (!pushingItem.value) {
      console.warn('Invalid pushing item. Pushing default one.', item)
      pushingItem.value = defaultItem()
    }
    history.value.push(pushingItem.value)
  }

  const pushForcedLogin = (path?: string) => {
    push({ path: path ?? route.fullPath, isUserAction: false })
  }

  const pop = () => history.value.pop() || defaultItem()

  function $reset() {
    history.value = [defaultItem()]
  }

  return {
    history,
    last,
    push,
    pushForcedLogin,
    pop,
    $reset,
    redirectionPath,
  }
})
