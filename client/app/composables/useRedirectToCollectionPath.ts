import type { GetItemPath } from '~~/types'

export const useRedirectToCollectionPath = (path: GetItemPath) => {
  const { pop } = useHistoryStackStore()
  const router = useRouter()
  const collectionPath = path.slice(-5)
  return () => router.replace(pop() ?? collectionPath)
}
