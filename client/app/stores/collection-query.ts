import type { DataTableComponentOptions, GetCollectionPath } from '~~/types'
import type { FilterState, Filter } from '~~/types/filters'
import { API_FILTERS } from '~/utils/consts/configs/filters'
import { dataTableOptionsToQsObject } from '~/utils/requests'

const defaultPagination = () =>
  ({
    page: 1,
    itemsPerPage: 10,
    sortBy: [],
    groupBy: [],
  }) as const as DataTableComponentOptions

const useCollectionQueryStore = <Path extends GetCollectionPath>(
  path: Path,
) => {
  return defineStore(`collection-query:${path}`, () => {
    const pagination = shallowRef(defaultPagination())

    const paginationQueryObject = computed(() =>
      dataTableOptionsToQsObject(pagination.value),
    )

    const filtersState = shallowRef<FilterState>({})

    const isFiltered = computed(() =>
      Boolean(Object.keys(filtersState.value).length > 0),
    )

    const clonedFilters = computed(
      () => JSON.parse(JSON.stringify(filtersState.value)) as FilterState,
    )

    const setFilters = (map: Map<string, Filter>) =>
      (filtersState.value = Object.fromEntries(map.entries()))

    const clearFilters = () => (filtersState.value = {})

    const filterQueryObject = computed(() => {
      const queryObject: Record<string, unknown> = {}
      for (const filter of Object.values(filtersState.value)) {
        API_FILTERS[filter.key].addToQueryObject(queryObject, filter)
      }
      return queryObject
    })

    const queryObject = computed(() => ({
      ...paginationQueryObject.value,
      ...filterQueryObject.value,
    }))

    const totalItems = ref(0)

    return {
      pagination,
      paginationQueryObject,
      totalItems,
      queryObject,
      clonedFilters,
      clearFilters,
      setFilters,
      filterQueryObject,
      filtersState,
      isFiltered,
    }
  })()
}

export default useCollectionQueryStore
