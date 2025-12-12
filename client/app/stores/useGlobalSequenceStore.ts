export const useGlobalSequenceStore = defineStore('global-sequence', () => {
  const counter = ref(0)
  const increment = () => counter.value++
  return { counter, increment }
})

export default useGlobalSequenceStore
