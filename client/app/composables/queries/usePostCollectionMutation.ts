import type {
  ApiRequestOptions,
  OperationPathParams,
  PostCollectionPath,
  PostCollectionRequestMap,
} from '~~/types'
import useAppQueryCache from '~/composables/queries/useAppQueryCache'
import { PostCollectionOperation } from '~/api/operations/PostCollectionOperation'

export function usePostCollectionMutation<P extends PostCollectionPath>(
  path: P,
  options: ApiRequestOptions = {},
) {
  const postCollectionOperation = new PostCollectionOperation(path)
  const openApiStore = useOpenApiStore()
  const apiResourcePath = openApiStore.findApiResourcePath(path)
  if (!apiResourcePath) {
    throw new Error(`Resource key not found for path ${path}`)
  }

  const { QUERY_KEYS, invalidateQueries } = useAppQueryCache(
    apiResourcePath,
    path,
  )

  // After re-get window focus, the query cache is cleared. So we need to manually signal that we need to refetch the data.
  const invalidatedCacheEntriesRaw = ref<any[]>([])
  const invalidatedCacheEntries = computed(() =>
    invalidatedCacheEntriesRaw.value.filter((entry) => Boolean(entry)),
  )

  const postCollection = useMutation({
    mutation: ({
      param,
      model,
    }: {
      param?: OperationPathParams<P, 'post'>
      model: PostCollectionRequestMap[P]
    }) => {
      return postCollectionOperation.request(param, { ...options, body: model })
    },
    onSettled: async () => {
      const cacheHits = await invalidateQueries({ key: QUERY_KEYS.root })
      invalidatedCacheEntriesRaw.value = Array.isArray(cacheHits)
        ? cacheHits
        : []
    },
  })

  return {
    invalidatedCacheEntries,
    postCollection,
  }
}

export default usePostCollectionMutation
