import type { GetCollectionPath, PostCollectionPath } from '~~/types'
import useGetCollectionTotalItemQuery from '~/composables/queries/useGetCollectionTotalItemQuery'

export const useCollectionCanCreate = (
  postPath: (PostCollectionPath & GetCollectionPath) | null,
) => {
  if (!postPath) {
    return computed(() => false)
  }
  const { acl } = useGetCollectionTotalItemQuery(postPath)
  return computed(() => Boolean(acl.value?.canCreate))
}
