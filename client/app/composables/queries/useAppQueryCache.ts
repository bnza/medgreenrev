import type { ApiResourcePath } from '~/utils/consts/resources'
import type { ApiPath, GetCollectionPath } from '~~/types'
import type { EntryKey } from '@pinia/colada'

declare function toCacheKey(key: undefined): undefined
declare function toCacheKey(key: EntryKey): string
declare function toCacheKey(key: EntryKey | undefined): string | undefined

type QueryRootKey = ApiResourcePath
export default function useAppQueryCache(
  rootKey: QueryRootKey,
  resourcePath?: ApiPath,
) {
  const { invalidateQueries, remove, caches } = useQueryCache()

  // copy of the internal @pinia/colada toCacheKey function which declared in index.d.ts but actually not exported
  // @TODO check if bug has been fixed
  function toCacheKey(key: EntryKey | undefined) {
    return (
      key &&
      JSON.stringify(key, (_, val) =>
        !val || typeof val !== 'object' || Array.isArray(val)
          ? val
          : Object.keys(val)
              .sort()
              .reduce<Record<string, any>>((result, key2) => {
                result[key2] = val[key2]
                return result
              }, {}),
      )
    )
  }

  resourcePath = resourcePath || rootKey

  const QUERY_KEYS = {
    root: [rootKey] as const,
  } as const

  const RESOURCE_QUERY_KEY = {
    root: [rootKey, resourcePath] as const,
    byFilter: (query?: Record<string, any>) =>
      [...RESOURCE_QUERY_KEY.root, query || {}] as const,
    byId: (params: Record<string, string>) =>
      [...RESOURCE_QUERY_KEY.root, params] as const,
  } as const

  return {
    caches,
    toCacheKey,
    invalidateQueries,
    remove,
    QUERY_KEYS,
    RESOURCE_QUERY_KEY,
  }
}
