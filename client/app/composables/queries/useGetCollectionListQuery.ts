import type { ListGetCollectionPath } from '~~/types'
import { GetCollectionOperation } from '~/api/operations/GetCollectionOperation'

export function useGetCollectionListQuery(
  path: ListGetCollectionPath,
  value: Ref<string | undefined>,
  queryParams?: Ref<Record<string, any>>,
) {
  const getCollectionOperation = new GetCollectionOperation(path)
  const baseQuery = computed(() =>
    queryParams && queryParams.value ? { query: { ...queryParams.value } } : {},
  )
  const optionsQuery = computed(() =>
    value.value
      ? 'query' in baseQuery.value
        ? { ...baseQuery.value, query: { value: value.value } }
        : { query: { value: value.value } }
      : baseQuery.value,
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
