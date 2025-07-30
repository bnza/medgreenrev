import { processPathFilters } from '~/utils/filters'
import type { GetCollectionPath } from '~~/types'
import type {
  ApiPathFilters,
  SearchableGetCollectionPath,
} from '~~/types/filters'

// Cache for processed filter configurations
const filterCache = new Map<GetCollectionPath, ApiPathFilters>()

export const useFilterConfig = (path: SearchableGetCollectionPath) => {
  const { specInternal, ready } = storeToRefs(useOpenApiStore())

  /**
   * Get filter configuration for a specific path, with caching
   */
  const getPathFilters = (): ApiPathFilters => {
    // Return cached result if available
    if (filterCache.has(path)) {
      return filterCache.get(path)!
    }

    // Return empty if OpenAPI spec is not ready
    if (!ready.value || !specInternal.value) {
      return {}
    }

    // Process and cache the result
    const pathFilters = processPathFilters(specInternal.value, path)
    filterCache.set(path, pathFilters)

    return pathFilters
  }

  /**
   * Get filter operations for a specific property on a path
   */
  const getPropertyOperations = (property: string) => {
    const pathFilters = getPathFilters()
    return pathFilters[property] || {}
  }

  /**
   * Get available properties for filtering on a path
   */
  const getAvailableProperties = (): string[] => {
    const pathFilters = getPathFilters()
    return Object.keys(pathFilters)
  }

  /**
   * Get available operations for a specific property
   */
  const getAvailableOperations = (
    path: GetCollectionPath,
    property: string,
  ): string[] => {
    const propertyFilters = getPropertyOperations(property)
    return Object.keys(propertyFilters)
  }

  /**
   * Clear cache for a specific path (useful for testing or if spec changes)
   */
  const clearPathCache = (path: GetCollectionPath) => {
    filterCache.delete(path)
  }

  /**
   * Clear entire filter cache
   */
  const clearAllCache = () => {
    filterCache.clear()
  }

  /**
   * Check if a path has filter configuration available
   */
  const hasFilters = (): boolean => {
    const pathFilters = getPathFilters()
    return Object.keys(pathFilters).length > 0
  }

  return {
    getPathFilters,
    getPropertyOperations,
    getAvailableProperties,
    getAvailableOperations,
    hasFilters,
    clearPathCache,
    clearAllCache,
  }
}
