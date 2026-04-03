import type { SearchableGetCollectionPath } from '~/utils/consts/configs/filters'
import useCollectionQueryStore from '~/stores/useCollectionQueryStore'
import type { FilterState } from '~~/types'
import { diff } from 'deep-object-diff'

/**
 * Provides reactive management of query filters for a collection.
 *
 * This function uses a specified collection path to retrieve and manage query filters
 * via a reactive store. It maintains synchronization between the internal filter map state
 * and the collection store state. Additionally, it provides computed properties to represent
 * the current state of filters and whether any changes have been made.
 */
export const useCollectionQueryFilters = (
  path: SearchableGetCollectionPath,
) => {
  const collectionStore = useCollectionQueryStore(path)
  const { filtersState } = storeToRefs(collectionStore)
  const filtersMap = ref(new Map(Object.entries({} as FilterState)))
  const filters = computed(
    () => Object.fromEntries(filtersMap.value.entries()) || {},
  )
  const isChanged = computed(
    () => Object.keys(diff(filtersState.value, filters.value)).length > 0,
  )
  const syncFilterMapToState = () =>
    (filtersMap.value = new Map(Object.entries(filtersState.value)))

  return {
    syncFilterMapToState,
    filtersMap,
    filters,
    isChanged,
    setFilters: collectionStore.setFilters,
  }
}

export default useCollectionQueryFilters
