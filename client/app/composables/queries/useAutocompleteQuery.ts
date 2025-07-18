import useAppQueryCache from '~/composables/queries/useAppQueryCache'
import type { ApiResourcePath } from '~/utils/consts/resources'
import { GetCollectionOperation } from '~/api/operations/GetCollectionOperation'

export function useAutocompleteQuery(
  path: ApiResourcePath,
  search: Ref<string>,
) {
  const { QUERY_KEYS } = useAppQueryCache(path)
  const getCollectionOperation = new GetCollectionOperation(path)

  const requestOptions = computed(() =>
    search.value ? { query: { search: search.value } } : {},
  )

  const queryOptions = defineQueryOptions((_search: Ref<string>) => ({
    key: QUERY_KEYS.bySearch(_search.value),
    query: () => getCollectionOperation.request(requestOptions.value),
  }))

  const query = useQuery(() => queryOptions(search))
  const items = computed(() => query.data.value?.member ?? [])
  return {
    items,
    ...query,
    search,
  }
}

export default useAutocompleteQuery
