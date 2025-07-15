import type {
  GetItemResponseMap,
  OperationPathParams,
  PatchItemPath,
} from '~~/types'
import useAppQueryCache from '~/composables/queries/useAppQueryCache'
import { PatchItemOperation } from '~/api/operations/PatchItemOperation'

export function useDeleteItemMutation<P extends PatchItemPath>(path: P) {
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

  // const patchNormalize = getPatchNormalizer(path)

  const patchItem = defineMutation(() => {
    const item = ref<GetItemResponseMap[`${typeof apiResourcePath}/{id}`]>()
    const mutation = useMutation({
      mutation: ({
        param,
        model,
      }: {
        param: OperationPathParams<P, 'patch'>
        model: Record<string, any>
      }) => {
        // const diffObject = patchNormalize(item.value ?? {}, model)
        return patchItemOperation.request(param, { body: model })
      },
      onSettled: async () => {
        return await invalidateQueries({ key: QUERY_KEYS.root })
      },
    })
    return {
      item,
      ...mutation,
    }
  })()

  return {
    patchItem,
  }
}

export default useDeleteItemMutation
