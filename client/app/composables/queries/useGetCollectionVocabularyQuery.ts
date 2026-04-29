import type { VocabularyGetCollectionPath } from '~~/types'
import { GetCollectionOperation } from '~/api/operations/GetCollectionOperation'

export function useGetCollectionVocabularyQuery(
  path: VocabularyGetCollectionPath,
  value: Ref<string | undefined>,
  queryParams?: Record<string, string>,
) {
  const getCollectionOperation = new GetCollectionOperation(path)
  const options = computed(() => {
    const query: Record<string, string> = { ...queryParams }
    if (value.value) {
      query.value = value.value
    }
    return Object.keys(query).length > 0 ? { query } : {}
  })
  const query = useQuery({
    key: () => [path, options.value],
    query: () => getCollectionOperation.request(options.value),
    gcTime: 10 * 60 * 1000,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })
  const items = computed(() => query.data.value?.member ?? [])
  return {
    items,
    ...query,
  }
}
