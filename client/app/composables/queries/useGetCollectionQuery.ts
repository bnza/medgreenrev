import type { GetCollectionPath, OperationPathParams } from '~~/types'
import { GetCollectionOperation } from '~/api/operations/GetCollectionOperation'
import useAppQueryCache from './useAppQueryCache'
import { dataTableOptionsToQsObject } from '~/utils/requests'
import useCollectionQueryStore from '~/stores/collection-query'

export function useDefineGetCollectionQuery(path: GetCollectionPath) {
  const getCollectionOperation = new GetCollectionOperation(path)

  const openApiStore = useOpenApiStore()
  const apiResourcePath = openApiStore.findApiResourcePath(path)
  if (!apiResourcePath) {
    throw new Error(`Resource key not found for path ${path}`)
  }

  const { RESOURCE_QUERY_KEY } = useAppQueryCache(apiResourcePath, path)

  const useGetCollection = (
    params?: Ref<OperationPathParams<typeof path, 'get'> | undefined>,
  ) =>
    defineQuery(() => {
      const { pagination } = useCollectionQueryStore(path)
      const pathParams = computed(() => params?.value)
      const query = useQuery({
        key: RESOURCE_QUERY_KEY.byFilter({
          pagination,
          ...(pathParams.value || {}),
        }),
        query: () =>
          getCollectionOperation.request({
            query: { ...dataTableOptionsToQsObject(pagination) },
            params: pathParams.value,
          }),
        enabled:
          /\{[^}]*}/.test(path) === (typeof pathParams.value !== 'undefined'),
      })
      const items = computed(() => query.data.value?.member ?? [])
      const totalItems = computed(() => query.data.value?.totalItems ?? 0)
      return {
        items,
        ...query,
        totalItems,
        pagination,
        pathParams,
      }
    })()

  return {
    useGetCollection,
  }
}

export default useDefineGetCollectionQuery
