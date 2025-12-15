export const useAppNavigationDrawerStore = defineStore(
  'ui-app-navigation-drawer',
  () => {
    const visible = ref(false)
    const toggleVisible = () => {
      visible.value = !visible.value
    }
    const dataOpened = ref<string[]>([])
    const mapOpened = ref<string[]>([])
    return {
      dataOpened,
      mapOpened,
      toggleVisible,
      visible,
    }
  },
)
