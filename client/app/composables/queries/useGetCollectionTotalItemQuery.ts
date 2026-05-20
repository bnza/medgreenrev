import type { CollectionAcl, GetCollectionPath, OperationPathParams } from '~~/types'
import { GetCollectionOperation } from '~/api/operations/GetCollectionOperation'
import useAppQueryCache from '~/composables/queries/useAppQueryCache'
import useCollectionQueryStore from '~/stores/useCollectionQueryStore'

export function useGetCollectionTotalItemQuery(
  path: GetCollectionPath,
  params?: Ref<OperationPathParams<typeof path, 'get'> | undefined>,
) {
  const getCollectionOperation = new GetCollectionOperation(path)

  const openApiStore = useOpenApiStore()
  const apiResourcePath = openApiStore.findApiResourcePath(path)
  if (!apiResourcePath) {
    throw new Error(`Resource key not found for path ${path}`)
  }

  const { unfilteredTotalItems: storeTotalItems } = storeToRefs(
    useCollectionQueryStore(path),
  )

  const { RESOURCE_QUERY_KEY } = useAppQueryCache(apiResourcePath, path)

  const query = useQuery({
    key: () => RESOURCE_QUERY_KEY.byFilter({ ...params?.value, itemsPerPage: 0 }),
    query: () =>
      getCollectionOperation.request({
        query: { itemsPerPage: 0 },
        params: params?.value,
      }),
  })
  const totalItems = computed(() => query.data.value?.totalItems ?? 0)
  const acl = computed<CollectionAcl>(
    () => query.data.value?._acl ?? { canCreate: false, canExport: false },
  )

  watch(
    () => totalItems.value,
    (value) => {
      storeTotalItems.value = value
    },
  )

  return {
    ...query,
    totalItems,
    acl,
  }
}

export default useGetCollectionTotalItemQuery
