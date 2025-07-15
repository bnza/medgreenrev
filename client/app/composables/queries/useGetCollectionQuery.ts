import type {
  DataTableComponentOptions,
  GetCollectionPath,
  OperationPathParams,
} from '~~/types'
import { GetCollectionOperation } from '~/api/operations/GetCollectionOperation'
import useAppQueryCache from './useAppQueryCache'
import { dataTableOptionsToQsObject } from '~/utils/requests'

const defaultPagination = () =>
  ({
    page: 1,
    itemsPerPage: 10,
    sortBy: [],
    groupBy: [],
  }) as const as DataTableComponentOptions

export function useDefineGetCollectionQuery(path: GetCollectionPath) {
  const getCollectionOperation = new GetCollectionOperation(path)

  const openApiStore = useOpenApiStore()
  const apiResourcePath = openApiStore.findApiResourcePath(path)
  if (!apiResourcePath) {
    throw new Error(`Resource key not found for path ${path}`)
  }

  const { RESOURCE_QUERY_KEY } = useAppQueryCache(apiResourcePath, path)

  const queryOptions = (options: {
    query: Record<string, any> // URL query params
    params?: OperationPathParams<typeof path, 'get'> // Path params
  }) =>
    defineQueryOptions({
      key: RESOURCE_QUERY_KEY.byFilter({
        ...options.query,
        ...(options.params || {}),
      }),
      query: () => getCollectionOperation.request(options),
    })

  const useGetCollection = defineQuery(() => {
    const pathParams = ref<
      OperationPathParams<typeof path, 'get'> | undefined
    >()
    const pagination = reactive(defaultPagination())
    const query = useQuery(queryOptions, () => ({
      query: { ...dataTableOptionsToQsObject(pagination) },
      params: pathParams.value,
    }))

    const items = computed(() => query.data.value?.member ?? [])
    const totalItems = computed(() => query.data.value?.totalItems ?? 0)
    return {
      items,
      ...query,
      totalItems,
      pagination,
      pathParams,
    }
  })

  return {
    useGetCollection,
  }
}

export default useDefineGetCollectionQuery
