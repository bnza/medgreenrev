import type {
  ComponentFiltersMap,
  FilterState,
  ResourceFiltersDefinitionObject,
  ResourceStaticFiltersDefinitionObject,
} from '~~/types/filters'
import { API_FILTERS, type FilterKey } from '~/utils/consts/configs/filters'

export const normalizeResourceFiltersDefinition = (
  staticDefinition: ResourceStaticFiltersDefinitionObject,
): ResourceFiltersDefinitionObject => {
  const result: ResourceFiltersDefinitionObject = {}

  for (const [propertyPath, propertyConfig] of Object.entries(
    staticDefinition,
  )) {
    result[propertyPath] = {} as Record<FilterKey, any>

    for (const [filterKey, staticFilter] of Object.entries(
      propertyConfig.filters,
    )) {
      const { addToQueryObject: _, ...storableValues } = staticFilter
      result[propertyPath][filterKey as FilterKey] = {
        key: filterKey as FilterKey,
        property: propertyPath,
        propertyLabel: propertyConfig.propertyLabel || propertyPath,
        ...storableValues,
      }
    }
  }
  return result
}

export const createComponentFiltersMap = (
  resourceFilters: ResourceFiltersDefinitionObject,
  isAuthenticated: boolean,
  protectedFields: string[] = [],
): ComponentFiltersMap => {
  const result: ComponentFiltersMap = {}

  // Filter available properties based on authentication and protected fields
  const availableProperties = Object.keys(resourceFilters).filter(
    (property) => isAuthenticated || !protectedFields.includes(property),
  )

  for (const propertyPath of availableProperties) {
    const propertyFilters = resourceFilters[propertyPath]

    // Add type guard to ensure propertyFilters exists
    if (!propertyFilters) continue

    for (const [_filterKey, filterDefinition] of Object.entries(
      propertyFilters,
    )) {
      const propertyLabel = filterDefinition.propertyLabel
      const operationLabel = filterDefinition.operationLabel

      if (!result[propertyLabel]) {
        result[propertyLabel] = {}
      }

      result[propertyLabel][operationLabel] = filterDefinition
    }
  }

  return result
}

/**
 * A computed property that determines the available filters for a given component's filter map.
 * It filters out operations that are already matched by existing filters, except when the filter
 * supports multiple instances.
 *
 * The resulting map contains only those operations that are not explicitly filtered out and have
 * at least one valid, available operation for a given property.
 *
 * This computation involves:
 * - Iterating over the provided component filter definitions.
 * - Filtering out operations that have matching active filters unless the filter allows multiple usage.
 * - Constructing a final map that includes only the properties with valid operations remaining.
 */
export const createAvailableFiltersMap = (
  componentFiltersMap: ComponentFiltersMap,
  filters: FilterState,
) => {
  const result: ComponentFiltersMap = {}

  // Filter out operations that match existing filters where multiple is false
  for (const [propertyLabel, operations] of Object.entries(
    componentFiltersMap,
  )) {
    const availableOperations: typeof operations = {}

    for (const [operationLabel, filterDefinition] of Object.entries(
      operations,
    )) {
      // Check if there's an existing filter with the same prop and key
      const matchingFilter = Object.values(filters).find(
        (filter) =>
          filter.property === filterDefinition.property &&
          filter.key === filterDefinition.key,
      )

      // Include operation only if no matching filter exists OR multiple is true
      if (
        !matchingFilter ||
        API_FILTERS[filterDefinition.key]?.multiple !== false
      ) {
        availableOperations[operationLabel] = filterDefinition
      }
    }

    // Only include property if it has available operations
    if (Object.keys(availableOperations).length > 0) {
      result[propertyLabel] = availableOperations
    }
  }

  return result
}
