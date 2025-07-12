import type {DeleteItemPath, GetItemResponseMap, OperationPathParams} from "~~/types";
import useAppQueryCache from "~/composables/queries/useAppQueryCache";
import {PatchItemOperation} from "~/api/operations/PatchItemOperation";
import {getNormalizer, getPatchNormalizer} from "~/api/requests";

export function useDeleteItemMutation<P extends DeleteItemPath>(path: P) {
  const patchItemOperation = new PatchItemOperation(path)
  const openApiStore = useOpenApiStore()
  const resourceKey = openApiStore.findRelatedApiResourcePath(path)
  if (!resourceKey) {
    throw new Error(`Resource key not found for path ${path}`)
  }

  const {QUERY_KEYS, invalidateQueries} = useAppQueryCache(resourceKey, path)

  const patchNormalize = getPatchNormalizer(path)

  const patchItem = defineMutation(() => {
    const item = ref<GetItemResponseMap[`${typeof resourceKey}/{id}`]>()
    const mutation = useMutation({
      mutation: ({param, model}: {param: OperationPathParams<P, 'patch'>, model: Record<string, any> }) => {
        const diffObject = patchNormalize(item.value ?? {}, model)
        return patchItemOperation.request(param, {body: diffObject})
      },
      onSettled: async (data, error, context) => {
        return await invalidateQueries({key: QUERY_KEYS.root})
      }
      })
    return {
      item,
      ...mutation
    }
  })()

  return {
    patchItem
  }
}

export default useDeleteItemMutation
