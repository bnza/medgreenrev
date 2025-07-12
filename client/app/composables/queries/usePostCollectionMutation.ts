import type {PostCollectionPath, PostCollectionRequestMap} from "~~/types";
import useAppQueryCache from "~/composables/queries/useAppQueryCache";
import {PostCollectionOperation} from "~/api/operations/PostCollectionOperation";

export function usePostCollectionMutation<P extends PostCollectionPath>(path: P) {
  const postCollectionOperation = new PostCollectionOperation(path)
  const openApiStore = useOpenApiStore()
  const resourceKey = openApiStore.findRelatedApiResourcePath(path)
  if (!resourceKey) {
    throw new Error(`Resource key not found for path ${path}`)
  }

  const {RESOURCE_QUERY_KEY, invalidateQueries} = useAppQueryCache(resourceKey)

  const postCollection = useMutation({
    mutation: (model: PostCollectionRequestMap[P]) => {
      console.log('mutation', model)
      return postCollectionOperation.request({body: model})
    },
    onMutate: (...args: any[]) => console.log('onMutation', args),
    // onMutate: (params: OperationPathParams<P, 'delete'>) => ({params}),
    onSettled: async (data, error, context) => {
      return await invalidateQueries({key: RESOURCE_QUERY_KEY.root}, "all")
    }
  })

  return {
    postCollection
  }
}

export default usePostCollectionMutation
