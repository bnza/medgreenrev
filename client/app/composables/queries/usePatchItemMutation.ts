import type {DeleteItemPath, OperationPathParams} from "~~/types";
import useAppQueryCache from "~/composables/queries/useAppQueryCache";
import {PatchItemOperation} from "~/api/operations/PatchItemOperation";

export function useDeleteItemMutation<P extends DeleteItemPath>(path: P) {
  const patchItemOperation = new PatchItemOperation(path)
  const openApiStore = useOpenApiStore()
  const resourceKey = openApiStore.findRelatedApiResourcePath(path)
  if (!resourceKey) {
    throw new Error(`Resource key not found for path ${path}`)
  }

  const {RESOURCE_QUERY_KEY, invalidateQueries} = useAppQueryCache(resourceKey)

  const patchItem = useMutation({
    mutation: (model: OperationPathParams<P, 'patch'>) => patchItemOperation.request(model),
    // onMutate: (params: OperationPathParams<P, 'delete'>) => ({params}),
    onSettled: async (data, error, context) => {
      return await invalidateQueries({key: RESOURCE_QUERY_KEY.root}, "all")
    }
  })

  return {
    patchItem
  }
}

export default useDeleteItemMutation
