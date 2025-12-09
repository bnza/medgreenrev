import type { GetCollectionPath, OperationPathParams } from '~~/types'
import { GetCollectionOperation } from '~/api/operations/GetCollectionOperation'
import useAppQueryCache from './useAppQueryCache'
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

  const {
    pagination,
    queryObject,
    totalItems: storeTotalItems,
  } = storeToRefs(useCollectionQueryStore(path))

  const key = computed(() =>
    RESOURCE_QUERY_KEY.byFilter({
      ...queryObject.value,
      ...(params?.value || {}),
    }),
  )

  const query = useQuery({
    key: () => key.value,
    query: () =>
      getCollectionOperation.request({
        query: { ...queryObject.value },
        params: params?.value,
      }),
    enabled: () =>
      /\{[^}]*}/.test(path) === (typeof params?.value !== 'undefined'),
  })
  const items = computed(() => query.data.value?.member ?? [])
  const totalItems = computed(() => query.data.value?.totalItems ?? 0)
  const acl = computed(() => query.data.value?._acl ?? { canCreate: false })

  watch(
    () => totalItems.value,
    (value) => {
      storeTotalItems.value = value
    },
  )

  return {
    acl,
    items,
    ...query,
    totalItems,
    pagination,
  }
}

export default useGetCollectionQuery
