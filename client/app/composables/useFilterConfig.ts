import {
  FILTERS_PATHS_MAP,
  type SearchableGetCollectionPath,
} from '~/utils/consts/configs/filters'
import type { ComponentFiltersMap } from '~~/types/filters'

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

  return {
    componentFiltersMap,
    resourceFiltersDefinition,
  }
}
