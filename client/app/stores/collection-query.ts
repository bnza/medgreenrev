import type {
  ApiDataResourceKey,
  DataTableComponentOptions,
  paths,
} from '~~/types'

const defaultPagination = () =>
  ({
    page: 1,
    itemsPerPage: 10,
    sortBy: [],
    groupBy: [],
  }) as const as DataTableComponentOptions

const useCollectionQueryStore = <Path extends keyof paths>(path: Path) => {
  return defineStore(`collection-query:${path}`, () => {
    const pagination = reactive(defaultPagination())

    return {
      pagination,
    }
  })()
}

export default useCollectionQueryStore
