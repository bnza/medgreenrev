import type { GetItemPath, OperationPathParams } from '~~/types'
import { GetItemOperation } from '~/api/operations/GetItemOperation'
import useAppQueryCache from '~/composables/queries/useAppQueryCache'

export function useGetItemQuery<P extends GetItemPath>(
  path: P,
  params: Ref<OperationPathParams<P, 'get'> | undefined>,
) {
  const getItemOperation = new GetItemOperation(path)

  const openApiStore = useOpenApiStore()
  const apiResourcePath = openApiStore.findApiResourcePath(path)

  if (!apiResourcePath) {
    throw new Error(`Resource key not found for path ${path}`)
  }
  const { RESOURCE_QUERY_KEY } = useAppQueryCache(apiResourcePath, path)

  const queryOptions = defineQueryOptions(
    (_params: Ref<OperationPathParams<P, 'get'> | undefined>) => ({
      key: _params.value ? RESOURCE_QUERY_KEY.byId(_params.value) : ['*'],
      query: () =>
        _params.value
          ? getItemOperation.request(_params.value)
          : Promise.resolve(null),
      enabled: Boolean(_params),
    }),
  )

  return defineQuery(() => {
    const query = useQuery(() => queryOptions(params))
    return {
      ...query,
    }
  })()
}

export default useGetItemQuery
