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

  watch(params, (value) => {
    if (value && !openApiStore.isValidOperationPathParams(path, 'get', value)) {
      console.error(
        `Invalid get item operation params for path "${path}": `,
        value,
      )
    }
  })

  return useQuery({
    key: () =>
      params.value ? RESOURCE_QUERY_KEY.byId(params.value) : QUERY_KEYS.root,
    query: () => getItemOperation.request(params.value),
    enabled: () =>
      openApiStore.isValidOperationPathParams(path, 'get', params.value),
  })
}

export default useGetItemQuery
