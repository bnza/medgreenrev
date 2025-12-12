import type {
  ApiResourcePath,
  OperationPathParams,
  PatchItemPath,
  PatchItemRequestMap,
} from '~~/types'
import useAppQueryCache from '~/composables/queries/useAppQueryCache'
import { PatchItemOperation } from '~/api/operations/PatchItemOperation'

// Some resource is updated by patching the parent resource.
const patchedSubresourceMap: Partial<Record<ApiResourcePath, ApiResourcePath>> =
  {
    '/api/data/analyses/botany/charcoals':
      '/api/data/analyses/absolute_dating/botany/charcoals',
    '/api/data/analyses/botany/seeds':
      '/api/data/analyses/absolute_dating/botany/seeds',
    '/api/data/analyses/individuals':
      '/api/data/analyses/absolute_dating/individuals',
    '/api/data/analyses/potteries':
      '/api/data/analyses/absolute_dating/potteries',
    '/api/data/analyses/zoo/bones':
      '/api/data/analyses/absolute_dating/zoo/bones',
    '/api/data/analyses/zoo/teeth':
      '/api/data/analyses/absolute_dating/zoo/teeth',
  }

const patchedSubresourcePath = Object.keys(patchedSubresourceMap)
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

        // Force subresource invalidation
        const subResourcePath = patchedSubresourceMap[QUERY_KEYS.root[0]]
        if (subResourcePath) {
          await invalidateQueries({ key: [subResourcePath] })
        }
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
