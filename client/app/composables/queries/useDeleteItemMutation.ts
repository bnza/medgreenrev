import type { DeleteItemPath, OperationPathParams } from '~~/types'
import { DeleteItemOperation } from '~/api/operations/DeleteItemOperation'
import useAppQueryCache from '~/composables/queries/useAppQueryCache'

export function useDeleteItemMutation<P extends DeleteItemPath>(path: P) {
  const deleteItemOperation = new DeleteItemOperation(path)
  const openApiStore = useOpenApiStore()
  const resourceKey = openApiStore.findRelatedApiResourcePath(path)
  if (!resourceKey) {
    throw new Error(`Resource key not found for path ${path}`)
  }

  const {
    QUERY_KEYS,
    RESOURCE_QUERY_KEY,
    toCacheKey,
    remove,
    invalidateQueries,
    caches,
  } = useAppQueryCache(resourceKey, path)

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

      return await invalidateQueries({ key: QUERY_KEYS.root })
    },
  })

  return {
    deleteItem,
  }
}

export default useDeleteItemMutation
