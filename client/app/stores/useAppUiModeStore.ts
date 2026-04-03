type UiMode = 'default' | 'map'

export default defineStore('app-ui-mode', () => {
  const state = ref<UiMode>('default')
  const toggle = () => {
    state.value = state.value === 'default' ? 'map' : 'default'
  }
  const icon = computed(() =>
    state.value === 'default' ? 'fas fa-globe' : 'fas fa-table',
  )
  return { icon, state, toggle }
})
