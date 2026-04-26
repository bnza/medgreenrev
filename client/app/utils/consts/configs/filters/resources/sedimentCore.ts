import type { ResourceStaticFiltersDefinitionObject } from '~~/types'
import { propertyStaticFiltersDefinition as mediaObjectPropertyStaticDefinition } from './mediaObject'
import {
  NumericOperations,
  API_FILTERS,
  generateResourceDefinition,
} from '~/utils/consts/configs/filters/definitions'

const {
  Exists,
  SearchPartial,
  SamplingSiteEquals,
  SamplingStratigraphicUnitEquals,
} = API_FILTERS

export const propertyStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject =
  {
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
    'sedimentCoreDepths.stratigraphicUnit': {
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
  ...generateResourceDefinition(
    mediaObjectPropertyStaticDefinition,
    ['mediaObjects.mediaObject', 'media'],
    ['uploadedBy.email'],
  ),
  mediaObjects: {
    propertyLabel: 'media',
    filters: { Exists },
  },
}
