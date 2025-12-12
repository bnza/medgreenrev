import type { GetCollectionPath, OperationPathParams } from '~~/types'
import { GetCollectionOperation } from '~/api/operations/GetCollectionOperation'
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

  const query = useQuery({
    key: () => [`${path}:${JSON.stringify(params?.value ?? {})}:totalItems`],
    query: () =>
      getCollectionOperation.request({
        query: { itemsPerPage: 0 },
        params: params?.value,
      }),
  })
  const totalItems = computed(() => query.data.value?.totalItems ?? 0)

  watch(
    () => totalItems.value,
    (value) => {
      storeTotalItems.value = value
    },
  )

  return {
    ...query,
    totalItems,
  }
}

export default useGetCollectionTotalItemQuery
