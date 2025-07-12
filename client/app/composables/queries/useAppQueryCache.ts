import type {RepositoryPath} from "~/api/Api";
import type {ApiResourcePath} from "~/utils/consts/resources";
import type {GetCollectionPath} from "~~/types";

type QueryRootKey = RepositoryPath | ApiResourcePath
export default function useAppQueryCache(rootKey: QueryRootKey, resourcePath?: GetCollectionPath) {
  const {invalidateQueries, remove, cancelQueries, caches} = useQueryCache()

  resourcePath = resourcePath || rootKey

  const QUERY_KEYS = {
    root: [rootKey] as const,
  } as const

  const RESOURCE_QUERY_KEY = {
    root: [rootKey, resourcePath ] as const,
    byFilter: (query?: Record<string, any>) => [...RESOURCE_QUERY_KEY.root, query || {} ] as const,
    byId: (params: Record<string, string> ) => [...RESOURCE_QUERY_KEY.root, params ] as const,
  } as const

  return {
    caches,
    cancelQueries,
    remove,
    invalidateQueries,
    QUERY_KEYS,
    RESOURCE_QUERY_KEY
  }
}
