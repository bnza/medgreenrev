import type { GetCollectionPath, OperationPathParams } from '~~/types'
import { GetCollectionOperation } from '~/api/operations/GetCollectionOperation'
import useAppQueryCache from './useAppQueryCache'
import { dataTableOptionsToQsObject } from '~/utils/requests'
import useCollectionQueryStore from '~/stores/collection-query'

export function useGetCollectionQuery(
  path: GetCollectionPath,
  params?: Ref<OperationPathParams<typeof path, 'get'> | undefined>,
) {
  const getCollectionOperation = new GetCollectionOperation(path)

  const openApiStore = useOpenApiStore()
  const apiResourcePath = openApiStore.findApiResourcePath(path)
  if (!apiResourcePath) {
    throw new Error(`Resource key not found for path ${path}`)
  }

  const { RESOURCE_QUERY_KEY } = useAppQueryCache(apiResourcePath, path)

  return defineQuery(() => {
    const { pagination } = useCollectionQueryStore(path)
    const query = useQuery({
      key: RESOURCE_QUERY_KEY.byFilter({
        pagination,
        ...(params?.value || {}),
      }),
      query: () =>
        getCollectionOperation.request({
          query: { ...dataTableOptionsToQsObject(pagination) },
          params: params?.value,
        }),
      enabled: /\{[^}]*}/.test(path) === (typeof params?.value !== 'undefined'),
    })
    const items = computed(() => query.data.value?.member ?? [])
    const totalItems = computed(() => query.data.value?.totalItems ?? 0)
    return {
      items,
      ...query,
      totalItems,
      pagination,
    }
  })()
}

export default useGetCollectionQuery
