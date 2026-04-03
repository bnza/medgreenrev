import type { ApiResourcePath } from '~/utils/consts/resources'
import type { ApiPath } from '~~/types'
import { toCacheKey } from '@pinia/colada'

type QueryRootKey = ApiResourcePath
export default function useAppQueryCache(
  rootKey: QueryRootKey,
  resourcePath?: ApiPath,
) {
  const { invalidateQueries, remove, caches } = useQueryCache()
  const { statusChanged } = useAppAuth()

  resourcePath = resourcePath || rootKey

  const QUERY_KEYS = {
    root: [rootKey] as const,
    bySearch: (value: string, grantedOnly: boolean) =>
      [...QUERY_KEYS.root, value, grantedOnly] as const,
  } as const

  const RESOURCE_QUERY_KEY = {
    root: [rootKey, resourcePath] as const,
    byFilter: (query?: Record<string, any>) =>
      [...RESOURCE_QUERY_KEY.root, query || {}] as const,
    byId: (params: Record<string, string>) =>
      [...RESOURCE_QUERY_KEY.root, params] as const,
  } as const

  const removeQueries = () => {
    caches.entries().forEach(([_key, value]) => {
      remove(value)
    })
  }

  watch(
    () => statusChanged.value,
    async () => {
      console.log('statusChanged: invalidating queries')
      await invalidateQueries({ key: QUERY_KEYS.root })
    },
  )

  return {
    caches,
    toCacheKey,
    invalidateQueries,
    remove,
    removeQueries,
    QUERY_KEYS,
    RESOURCE_QUERY_KEY,
  }
}
