import type { ResourceStaticFiltersDefinitionObject } from '~~/types'
import {
  API_FILTERS,
  generateResourceDefinition,
} from '~/utils/consts/configs/filters/definitions'
import { propertyStaticFiltersDefinition as mediaObjectPropertyStaticDefinition } from '~/utils/consts/configs/filters/resources/mediaObject'

const { Exists, SearchExact, SearchPartial, VocabularyRegion } = API_FILTERS

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
    region: {
      filters: {
        VocabularyRegion,
      },
    },
    'region.value': {
      propertyLabel: 'region',
      filters: {
        SearchPartial,
      },
    },
  }

const existsPropertiesStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject =
  {
    mediaObjects: {
      propertyLabel: 'media',
      filters: {
        Exists,
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
  ...existsPropertiesStaticFiltersDefinition,
}
