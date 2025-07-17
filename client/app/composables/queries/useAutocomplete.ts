import useAppQueryCache from '~/composables/queries/useAppQueryCache'
import type { ApiResourcePath } from '~/utils/consts/resources'
import { GetCollectionOperation } from '~/api/operations/GetCollectionOperation'

export function useAutocomplete(path: ApiResourcePath) {
  const { QUERY_KEYS } = useAppQueryCache(path, path)
  const getCollectionOperation = new GetCollectionOperation(path)
  const search = ref('')
  const query = useQuery({
    key: QUERY_KEYS.bySearch(search.value),
    query: () =>
      getCollectionOperation.request({
        query: { search: search.value },
      }),
  })
  watch(search, () => {
    query.refetch()
  })
  const items = computed(() => query.data.value?.member ?? [])
  return {
    items,
    ...query,
    search,
  }
}

export default useAutocomplete
