import type { ResourceStaticFiltersDefinitionObject } from '~~/types'
import { API_FILTERS } from '~/utils/consts/configs/filters/definitions'

const { Exists, SearchPartial } = API_FILTERS

export const associationPropertyStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject =
  {
    summary: {
      filters: {
        Exists,
        SearchPartial,
      },
    },
  }
