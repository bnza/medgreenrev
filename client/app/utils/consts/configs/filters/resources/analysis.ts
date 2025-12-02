import type { ResourceStaticFiltersDefinitionObject } from '~~/types'
import {
  NumericOperations,
  API_FILTERS,
  generateResourceDefinition,
} from '~/utils/consts/configs/filters/definitions'
import { propertyStaticFiltersDefinition as mediaObjectPropertyStaticDefinition } from '~/utils/consts/configs/filters/resources/mediaObject'

const { Exists, SearchExact, SearchPartial, VocabularyAnalysisType } =
  API_FILTERS

export const propertyStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject =
  {
    createdBy: {
      filters: {
        Exists,
        SearchExact,
      },
    },
    identifier: {
      filters: {
        SearchPartial,
      },
    },
    laboratory: {
      filters: {
        Exists,
        SearchPartial,
      },
    },
    responsible: {
      filters: {
        Exists,
        SearchPartial,
      },
    },
    summary: {
      filters: {
        Exists,
        SearchPartial,
      },
    },
    type: {
      filters: {
        VocabularyAnalysisType,
      },
    },
    year: {
      filters: {
        SearchExact,
        ...NumericOperations,
      },
    },
  } as const

const existsPropertiesStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject =
  {
    mediaObjects: {
      propertyLabel: 'media',
      filters: {
        Exists,
      },
    },
  } as const

export const staticFiltersDefinition = {
  ...propertyStaticFiltersDefinition,
  ...generateResourceDefinition(
    mediaObjectPropertyStaticDefinition,
    ['mediaObjects.mediaObject', 'media'],
    ['uploadedBy.email'],
  ),
  ...existsPropertiesStaticFiltersDefinition,
} as const
