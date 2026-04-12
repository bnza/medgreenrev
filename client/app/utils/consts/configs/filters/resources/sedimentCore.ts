import type { ResourceStaticFiltersDefinitionObject } from '~~/types'
import {
  NumericOperations,
  API_FILTERS,
} from '~/utils/consts/configs/filters/definitions'

const { SearchPartial, SamplingSiteEquals, SamplingStratigraphicUnitEquals } = API_FILTERS

export const propertyStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject = {
  description: {
    filters: {
      SearchPartial,
    },
  },
  number: {
    filters: {
      ...NumericOperations,
    },
  },
  site: {
    filters: {
        SamplingSiteEquals,
    },
  },
  'sedimentCoresStratigraphicUnits.stratigraphicUnit': {
    propertyLabel: 'stratigraphic unit',
    filters: {
        SamplingStratigraphicUnitEquals,
    },
  },
  year: {
    filters: {
      ...NumericOperations,
    },
  },
}

export const staticFiltersDefinition = {
  ...propertyStaticFiltersDefinition,
}
