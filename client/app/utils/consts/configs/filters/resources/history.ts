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

const historyLocation: ResourceStaticFiltersDefinitionObject = {
  value: {
    filters: {
      SearchPartial,
    },
  },
}

const historyEntityStaticFiltersDefinitionObject: ResourceStaticFiltersDefinitionObject =
  {
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
    location: {
      filters: {
        HistoryLocationEquals,
      },
    },
    ...historyEntityStaticFiltersDefinitionObject,
    animal: {
      filters: {
        VocabularyHistoryAnimal,
      },
    },
  }

export const staticFiltersDefinitionPlant: ResourceStaticFiltersDefinitionObject =
  {
    location: {
      filters: {
        HistoryLocationEquals,
      },
    },
    ...historyEntityStaticFiltersDefinitionObject,
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

export const staticFiltersDefinitionLocation: ResourceStaticFiltersDefinitionObject =
  {
    ...historyLocation,
    ...generateResourceDefinition(historyEntityStaticFiltersDefinitionObject, [
      'plants',
      'plants',
    ]),
    ...generateResourceDefinition(botanyTaxonomyStaticFilterDefinition, [
      'plants.plant',
      'plants.plant',
    ]),
  }
