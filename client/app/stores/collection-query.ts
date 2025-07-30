import type { DataTableComponentOptions, GetCollectionPath } from '~~/types'
import type { FilterState, Filter } from '~~/types/filters'

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
    const pagination = reactive(defaultPagination())

    const filters = shallowRef<FilterState>({})

    const isFiltered = computed(() =>
      Boolean(Object.keys(filters.value).length > 0),
    )

    const clonedFilters = computed(() => structuredClone(filters.value))

    const getFilter = (key?: string) =>
      key
        ? structuredClone(filters.value[key] || ({} as Partial<Filter>))
        : ({} as Partial<Filter>)

    return {
      pagination,
      clonedFilters,
      getFilter,
      filters,
      isFiltered,
    }
  })()
}

export default useCollectionQueryStore
