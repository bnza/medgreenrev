import type { GetItemPath, OperationPathParams } from '~~/types'
import { GetItemOperation } from '~/api/operations/GetItemOperation'
import useAppQueryCache from '~/composables/queries/useAppQueryCache'

export function useDefineGetItemQuery<P extends GetItemPath>(path: P) {
  const getItemOperation = new GetItemOperation(path)

  const openApiStore = useOpenApiStore()
  const resourceKey = openApiStore.findRelatedApiResourcePath(path)

  if (!resourceKey) {
    throw new Error(`Resource key not found for path ${path}`)
  }
  const { RESOURCE_QUERY_KEY } = useAppQueryCache(resourceKey, path)

  const queryOptions = (params?: OperationPathParams<P, 'get'>) =>
    defineQueryOptions({
      key: RESOURCE_QUERY_KEY.byId(params as Record<string, string>),
      query: () =>
        params ? getItemOperation.request(params) : Promise.resolve(null),
      enabled: Boolean(params),
    })

  /**
   * A reactive query object used to fetch and manage data from a GET operation.
   *
   * It provides read and reactive bindings for query-related parameters and results.
   * Use it if you want to share the params parameter through components
   */
  const useGetItem = defineQuery(() => {
    const params = ref<OperationPathParams<P, 'get'> | undefined>()
    const query = useQuery(queryOptions, () => params.value)
    return {
      params,
      ...query,
    }
  })

  return {
    queryOptions,
    useGetItem,
  }
}

export default useDefineGetItemQuery
