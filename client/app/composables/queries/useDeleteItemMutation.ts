import type { DeleteItemPath, OperationPathParams } from '~~/types'
import { DeleteItemOperation } from '~/api/operations/DeleteItemOperation'
import useAppQueryCache from '~/composables/queries/useAppQueryCache'

export function useDeleteItemMutation<P extends DeleteItemPath>(path: P) {
  const deleteItemOperation = new DeleteItemOperation(path)
  const openApiStore = useOpenApiStore()
  const apiResourcePath = openApiStore.findApiResourcePath(path)
  if (!apiResourcePath) {
    throw new Error(`Resource key not found for path ${path}`)
  }

  const {
    QUERY_KEYS,
    RESOURCE_QUERY_KEY,
    toCacheKey,
    remove,
    invalidateQueries,
    caches,
  } = useAppQueryCache(apiResourcePath, path)

  // After re-get window focus, the query cache is cleared. So we need to manually signal that we need to refetch the data.
  const invalidatedCacheEntriesRaw = ref<any[]>([])
  const invalidatedCacheEntries = computed(() =>
    invalidatedCacheEntriesRaw.value.filter((entry) => Boolean(entry)),
  )

  const deleteItem = useMutation({
    mutation: (params: OperationPathParams<P, 'delete'>) =>
      deleteItemOperation.request(params),
    // onMutate: (params: OperationPathParams<P, 'delete'>) => ({params}),
    onSettled: async (data, error, context) => {
      const key = RESOURCE_QUERY_KEY.byId({ id: context.id })

      const keyHash = toCacheKey(key)

      if (keyHash && caches.has(keyHash)) {
        remove(caches.get(keyHash)!)
      }

      const cacheHits = await invalidateQueries({ key: QUERY_KEYS.root })
      invalidatedCacheEntriesRaw.value = Array.isArray(cacheHits)
        ? cacheHits
        : []
    },
  })

  return {
    deleteItem,
    invalidatedCacheEntries,
  }
}

export default useDeleteItemMutation
