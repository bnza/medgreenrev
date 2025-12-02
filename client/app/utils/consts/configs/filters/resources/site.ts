import type { ResourceStaticFiltersDefinitionObject } from '~~/types'
import {
  NumericOperations,
  API_FILTERS,
} from '~/utils/consts/configs/filters/definitions'

const { Exists, SearchExact, SearchPartial, VocabularyCulturalContext } =
  API_FILTERS

export const propertyStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject =
  {
    code: {
      filters: {
        SearchExact,
      },
    },
    'culturalContexts.culturalContext': {
      propertyLabel: 'cultural context',
      filters: {
        VocabularyCulturalContext,
      },
    },
    culturalContexts: {
      propertyLabel: 'cultural context',
      filters: {
        Exists,
      },
    },
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
        SearchPartial,
        Exists,
      },
    },
    fieldDirector: {
      propertyLabel: 'field director',
      filters: {
        SearchPartial,
        Exists,
      },
    },
  }

const existsPropertiesStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject =
  {
    culturalContexts: {
      propertyLabel: 'cultural context',
      filters: {
        Exists,
      },
    },
  }

export const staticFiltersDefinition = {
  ...propertyStaticFiltersDefinition,
  ...existsPropertiesStaticFiltersDefinition,
}
