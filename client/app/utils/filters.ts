import type {
  ComponentFiltersMap,
  ResourceFiltersDefinitionObject,
  ResourceStaticFiltersDefinitionObject,
} from '~~/types/filters'
import type { FilterKey } from '~/utils/consts/configs/filters'

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
