import qs from 'qs';
import type {CollectionResponse, CollectionResponses} from "~~/types";
import useCollectionPaginationStore from "~/stores/collection-pagination";

const useCollectionQueryStore = <PATH extends keyof CollectionResponses>(path: PATH) => {
  return defineStore(`collection-query:${path}`, () => {
    // Get the response type directly from our mapping
    type ApiResponse = CollectionResponse<PATH>

    const paginationStore = useCollectionPaginationStore(path)
    const {query: paginationQuery} = storeToRefs(paginationStore)

    const config = useRuntimeConfig()
    const baseURL = config.public.apiBaseUrl

    const {token} = useAuth()

    const headers = computed(() => {
      const _headers: Record<string, string> = {
        'Content-Type': 'application/ld+json',
      }
      if (token.value) {
        _headers['Authorization'] = `Bearer ${token.value}`
      }
      return _headers
    })

    const {data, status, error, refresh} = useQuery<ApiResponse>({
      key: () => [path, paginationQuery.value, headers.value],
      query: async () => {
        const queryString = qs.stringify(paginationQuery.value, {
          arrayFormat: 'brackets',
        })
        return $fetch<ApiResponse>(`${path}?${queryString}`, {
          baseURL,
          headers: headers.value
        })
      }
    })

    const items = computed(() => data.value?.member ?? [])

    const totalItems = computed(() => data.value?.totalItems ?? 0)

    return {
      items,
      status,
      error,
      pagination: paginationStore.component,
      totalItems,
    }
  })()
}

export default useCollectionQueryStore
