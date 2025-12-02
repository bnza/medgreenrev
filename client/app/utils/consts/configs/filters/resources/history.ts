import type { ResourceStaticFiltersDefinitionObject } from '~~/types'
import {
  NumericOperations,
  API_FILTERS,
  generateResourceDefinition,
} from '~/utils/consts/configs/filters/definitions'
import { taxonomyStaticFiltersDefinition as botanyTaxonomyStaticFilterDefinition } from './botany'

const {
  Exists,
  HistoryLocationEquals,
  SearchExact,
  SearchPartial,
  VocabularyHistoryAnimal,
  VocabularyHistoryPlant,
} = API_FILTERS

const historyStaticFiltersDefinitionObject: ResourceStaticFiltersDefinitionObject =
  {
    location: {
      filters: {
        HistoryLocationEquals,
      },
    },
    reference: {
      filters: {
        SearchPartial,
      },
    },
    chronologyLower: {
      filters: {
        SearchExact,
        ...NumericOperations,
      },
      propertyLabel: 'chronology (lower)',
    },
    chronologyUpper: {
      filters: {
        SearchExact,
        ...NumericOperations,
      },
      propertyLabel: 'chronology (upper)',
    },
    notes: {
      filters: {
        SearchPartial,
        Exists,
      },
    },
  }

export const staticFiltersDefinitionAnimal: ResourceStaticFiltersDefinitionObject =
  {
    ...historyStaticFiltersDefinitionObject,
    animal: {
      filters: {
        VocabularyHistoryAnimal,
      },
    },
  }

export const staticFiltersDefinitionPlant: ResourceStaticFiltersDefinitionObject =
  {
    ...historyStaticFiltersDefinitionObject,
    ...generateResourceDefinition(botanyTaxonomyStaticFilterDefinition, [
      'plant',
      'plant',
    ]),
    plant: {
      filters: {
        VocabularyHistoryPlant,
      },
    },
  }
