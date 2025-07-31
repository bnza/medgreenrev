import {
  FILTERS_PATHS_MAP,
  type SearchableGetCollectionPath,
} from '~/utils/consts/configs/filters'
import type { ComponentFiltersMap } from '~~/types/filters'
import useResourceConfig from '~/stores/resource-config'
import {
  createComponentFiltersMap,
  normalizeResourceFiltersDefinition,
} from '~/utils/filters'

export const useFilterConfig = (path: SearchableGetCollectionPath) => {
  const resourceFiltersStaticDefinition = FILTERS_PATHS_MAP[path]

  const { protectedFields } = useResourceConfig(path)
  const { isAuthenticated } = useAppAuth()

  const resourceFiltersDefinition = normalizeResourceFiltersDefinition(
    resourceFiltersStaticDefinition,
  )
  const componentFiltersMap = computed<ComponentFiltersMap>(() =>
    createComponentFiltersMap(
      resourceFiltersDefinition,
      isAuthenticated.value,
      protectedFields,
    ),
  )

  const propertyLabel = ref<string>()
  const operationLabel = ref<string>()

  const availableProperties = computed(() =>
    Object.keys(componentFiltersMap.value),
  )

  const availableOperations = computed(() =>
    propertyLabel.value
      ? Object.keys(componentFiltersMap.value[propertyLabel.value] || {})
      : [],
  )

  const filterDefinition = computed(() => {
    if (!operationLabel.value || !propertyLabel.value) {
      return undefined
    }

    // Check if propertyLabel exists in componentFiltersMap
    const propertyFilters = componentFiltersMap.value[propertyLabel.value]
    if (!propertyFilters) {
      return undefined
    }

    return propertyFilters[operationLabel.value]
  })

  const filterDefinitionKey = computed(() => filterDefinition.value?.key)
  const filterComponentKey = computed(
    () => filterDefinition.value?.componentKey,
  )

  return {
    componentFiltersMap,
    resourceFiltersDefinition,
    propertyLabel,
    operationLabel,
    filterDefinition,
    filterComponentKey,
    filterDefinitionKey,
    availableProperties,
    availableOperations,
  }
}
