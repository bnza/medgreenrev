import type { ListGetCollectionPath } from '~~/types'
import { GetCollectionOperation } from '~/api/operations/GetCollectionOperation'

export function useGetCollectionListQuery(
  path: ListGetCollectionPath,
  value: Ref<string | undefined>,
) {
  const getCollectionOperation = new GetCollectionOperation(path)
  const optionsQuery = computed(() =>
    value.value ? { query: { value: value.value } } : {},
  )
  const query = useQuery({
    key: () => [path, optionsQuery.value],
    query: () =>
      getCollectionOperation.request({
        ...optionsQuery.value,
      }),
  })
  const items = computed(() => query.data.value?.member ?? [])
  return {
    items,
    ...query,
  }
}
