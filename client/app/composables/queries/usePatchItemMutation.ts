import type {
  OperationPathParams,
  PatchItemPath,
  PatchItemRequestMap,
} from '~~/types'
import useAppQueryCache from '~/composables/queries/useAppQueryCache'
import { PatchItemOperation } from '~/api/operations/PatchItemOperation'

export function usePatchItemMutation<P extends PatchItemPath>(path: P) {
  const patchItemOperation = new PatchItemOperation(path)
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

  const patchItem = defineMutation(() => {
    const item = ref<PatchItemRequestMap[P]>()
    const mutation = useMutation({
      mutation: ({
        param,
        model,
      }: {
        param: OperationPathParams<P, 'patch'>
        model: Record<string, any>
      }) => {
        return patchItemOperation.request(param, { body: model })
      },
      onSettled: async () => {
        const cacheHits = await invalidateQueries({ key: QUERY_KEYS.root })
        invalidatedCacheEntriesRaw.value = Array.isArray(cacheHits)
          ? cacheHits
          : []
      },
    })
    return {
      item,
      ...mutation,
    }
  })()

  return {
    invalidatedCacheEntries,
    patchItem,
  }
}

export default usePatchItemMutation
