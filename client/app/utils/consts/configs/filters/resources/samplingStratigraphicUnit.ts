import type { ResourceStaticFiltersDefinitionObject } from '~~/types'
import {
  NumericOperations,
  API_FILTERS,
  generateResourceDefinition,
} from '~/utils/consts/configs/filters/definitions'
import { propertyStaticFiltersDefinition as mediaObjectPropertyStaticDefinition } from './mediaObject'

const { Exists, SearchPartial, SamplingSiteEquals } = API_FILTERS

export const propertyStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject =
  {
    chronologyLower: {
      propertyLabel: 'chronology (lower)',
      filters: {
        Exists,
        ...NumericOperations,
      },
    },
    chronologyUpper: {
      propertyLabel: 'chronology (upper)',
      filters: {
        Exists,
        ...NumericOperations,
      },
    },
    description: {
      filters: {
        Exists,
        SearchPartial,
      },
    },
    interpretation: {
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
  }

// const existsPropertiesStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject =
//   {
//     mediaObjects: {
//       propertyLabel: 'media',
//       filters: {
//         Exists,
//       },
//     },
//   }

export const staticFiltersDefinition = {
  ...propertyStaticFiltersDefinition,
  // ...generateResourceDefinition(
  //   mediaObjectPropertyStaticDefinition,
  //   ['mediaObjects.mediaObject', 'media'],
  //   ['uploadedBy.email'],
  // ),
  // ...existsPropertiesStaticFiltersDefinition,
}
