import type { VocabularyGetCollectionPath } from '~~/types'
import { useGetCollectionVocabularyQuery } from '~/composables/queries/useGetCollectionVocabularyQuery'

export const useVocabularyStore = <Path extends VocabularyGetCollectionPath>(
  path: Path,
) => {
  const query = useGetCollectionVocabularyQuery(path, ref(undefined))
  return defineStore(`vocabulary:${path}`, () => {
    const state = computed(() => query.data.value?.member || [])

    const normalizedState = computed(() =>
      Object.fromEntries(
        state.value
          .filter((item) => item && '@id' in item)
          .map((item) => [item['@id'], item] as const),
      ),
    )

    // Make get reactive by returning a computed function
    const get = (iri?: string) =>
      computed(() => (iri ? normalizedState.value[iri] : undefined))

    // Helper function to safely access properties
    const getPropertyValue = (item: unknown, prop: string): unknown =>
      isPlainObject(item) ? item[prop] : undefined

    const getValue = (id?: string, prop = 'value') =>
      computed(() => {
        return id
          ? getPropertyValue(normalizedState.value[id], prop)
          : undefined
      })

    const getValuesText = (
      ids: { '@id'?: string }[] | undefined,
      prop = 'value',
      separator = ', ',
    ) =>
      computed(() => {
        return (ids || [])
          .filter((item) => item['@id'])
          .map((item) =>
            getPropertyValue(normalizedState.value[item['@id']!], prop),
          )
          .filter(Boolean)
          .join(separator)
      })

    // Getter to check if data is loaded
    const isLoaded = computed(() => !!query.data.value)

    // Getter to check if data is loading
    const isLoading = computed(() => query.isLoading.value)

    return {
      state,
      normalizedState,
      get,
      getValue,
      getValuesText,
      isLoaded,
      isLoading,
    }
  })()
}
