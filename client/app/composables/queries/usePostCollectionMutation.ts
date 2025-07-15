import type {
  OperationPathParams,
  PostCollectionPath,
  PostCollectionRequestMap,
} from '~~/types'
import useAppQueryCache from '~/composables/queries/useAppQueryCache'
import { PostCollectionOperation } from '~/api/operations/PostCollectionOperation'

export function usePostCollectionMutation<P extends PostCollectionPath>(
  path: P,
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

  const postCollection = useMutation({
    mutation: ({
      param,
      model,
    }: {
      param?: OperationPathParams<P, 'post'>
      model: PostCollectionRequestMap[P]
    }) => {
      return postCollectionOperation.request(param, { body: model })
    },
    onSettled: async () => {
      return await invalidateQueries({ key: QUERY_KEYS.root })
    },
  })

  return {
    postCollection,
  }
}

export default usePostCollectionMutation
