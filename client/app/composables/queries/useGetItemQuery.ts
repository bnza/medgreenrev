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
  const { QUERY_KEYS, RESOURCE_QUERY_KEY } = useAppQueryCache(
    apiResourcePath,
    path,
  )

  const queryOptions = defineQueryOptions(
    (_params: Ref<OperationPathParams<P, 'get'> | undefined>) => ({
      key: _params.value
        ? RESOURCE_QUERY_KEY.byId(_params.value)
        : QUERY_KEYS.root,
      query: () => getItemOperation.request(_params.value),
      enabled: openApiStore.isValidOperationPathParams(
        path,
        'get',
        _params.value,
      ),
    }),
  )

  watch(params, (value) => {
    if (value && !openApiStore.isValidOperationPathParams(path, 'get', value)) {
      console.error(
        `Invalid get item operation params for path "${path}": `,
        value,
      )
    }
  })

  return useQuery(() => queryOptions(params))
}

export default useGetItemQuery
