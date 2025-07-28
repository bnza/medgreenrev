import type { VocabularyGetCollectionPath } from '~~/types'
import { GetCollectionOperation } from '~/api/operations/GetCollectionOperation'

export function useGetCollectionVocabularyQuery(
  path: VocabularyGetCollectionPath,
  value: Ref<string | undefined>,
) {
  const getCollectionOperation = new GetCollectionOperation(path)
  const options = computed(() =>
    value.value ? { query: { value: value.value } } : {},
  )
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
