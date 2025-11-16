import { diff } from 'deep-object-diff'
import type { ApiResourceKey, PatchItemPath } from '~~/types'

const NORMALIZATION_FN_MAP: Partial<
  Record<
    ApiResourceKey,
    (oldItem: Record<string, any>) => (item: Record<string, any>) => object
  >
> = {
  analysisContextBotany:
    (oldItem: Record<string, any>) => (item: Record<string, any>) => {
      const diffItem = diff(oldItem, item)
      if (diffItem && 'taxonomies' in diffItem && 'taxonomies' in item) {
        diffItem.taxonomies = item.taxonomies
      }
      return diffItem
    },
  analysisContextZoo:
    (oldItem: Record<string, any>) => (item: Record<string, any>) => {
      const diffItem = diff(oldItem, item)
      if (diffItem && 'taxonomies' in diffItem && 'taxonomies' in item) {
        diffItem.taxonomies = item.taxonomies
      }
      return diffItem
    },
  site: (oldItem: Record<string, any>) => (item: Record<string, any>) => {
    const diffItem = diff(oldItem, item)
    if (
      diffItem &&
      'culturalContexts' in diffItem &&
      'culturalContexts' in item
    ) {
      diffItem.culturalContexts = item.culturalContexts
    }
    return diffItem
  },
  siteUserPrivilege:
    (_oldItem: Record<string, any>) =>
    <T extends Record<string, any>>(item: T) => {
      const submitItem = {} as Partial<T>
      // Only privilege can be updated
      if ('privilege' in item) {
        submitItem['privilege' as keyof T] = Number(
          !item.privilege,
        ) as T[keyof T]
      }
      return submitItem
    },
  user: (oldItem: Record<string, any>) => (item: Record<string, any>) => {
    const diffItem = diff(oldItem, item)
    if (diffItem && 'roles' in diffItem && 'roles' in item) {
      diffItem.roles = item.roles
    }
    return diffItem
  },
}

const defaultNormalizer =
  (oldItem: Record<string, any>) => (item: Record<string, any>) => {
    return diff(oldItem, item)
  }

export const usePreUpdateNormalization = (
  resourceKeyOrPath: ApiResourceKey | PatchItemPath,
) => {
  if (!isApiResourceKey(resourceKeyOrPath)) {
    const { findApiResourceKeyFromPath } = useOpenApiStore()
    const apiResourceKey = findApiResourceKeyFromPath(resourceKeyOrPath)

    if (!isApiResourceKey(apiResourceKey)) {
      console.warn(
        `${apiResourceKey} is not a valid ApiResourceKey, using default normalizer.`,
      )
      return defaultNormalizer
    }
    resourceKeyOrPath = apiResourceKey
  }
  return NORMALIZATION_FN_MAP[resourceKeyOrPath] ?? defaultNormalizer
}

export default usePreUpdateNormalization
