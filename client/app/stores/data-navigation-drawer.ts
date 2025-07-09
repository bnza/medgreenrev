export const useDataNavigationDrawerStore = defineStore('ui/appNavigationDrawer', () => {
  const visible = ref(false)
  const toggleVisible = () => {
    visible.value = !visible.value
  }
  const dataOpened = ref<string[]>([])
  return {
    dataOpened,
    visible,
    toggleVisible
  }
})
