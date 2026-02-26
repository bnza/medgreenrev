import type { ResourceStaticFiltersDefinitionObject } from '~~/types'
import {
  NumericOperations,
  API_FILTERS,
} from '~/utils/consts/configs/filters/definitions'

const { Exists, SearchExact, SearchPartial } = API_FILTERS

export const propertyStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject =
  {
    code: {
      filters: {
        SearchExact,
      },
    },
    description: {
      filters: {
        SearchPartial,
        Exists,
      },
    },
    name: {
      filters: {
        SearchPartial,
      },
    },
  }

export const staticFiltersDefinition = {
  ...propertyStaticFiltersDefinition,
}
