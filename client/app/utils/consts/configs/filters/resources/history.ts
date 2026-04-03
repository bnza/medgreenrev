import type { ResourceStaticFiltersDefinitionObject } from '~~/types'
import {
  NumericOperations,
  API_FILTERS,
  generateResourceDefinition,
} from '~/utils/consts/configs/filters/definitions'
import { taxonomyStaticFiltersDefinition as zooTaxonomyStaticFilterDefinition } from './zoo'
import { taxonomyStaticFiltersDefinition as botanyTaxonomyStaticFilterDefinition } from './botany'

const {
  Exists,
  HistoryLocationEquals,
  HistoryWrittenSourceEquals,
  SearchExact,
  SearchPartial,
  VocabularyHistoryAnimal,
  VocabularyHistoryAuthor,
  VocabularyHistoryLanguage,
  VocabularyHistoryPlant,
  VocabularyHistoryWrittenSourceType,
  VocabularyRegion,
  VocabularyCentury,
  VocabularyHistoryCitedWork,
} = API_FILTERS

const historyLocation: ResourceStaticFiltersDefinitionObject = {
  value: {
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

const historyEntityStaticFiltersDefinitionObject: ResourceStaticFiltersDefinitionObject =
  {
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
    language: {
      filters: {
        VocabularyHistoryLanguage,
      },
    },
    notes: {
      filters: {
        SearchPartial,
        Exists,
      },
    },
    reference: {
      filters: {
        SearchPartial,
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
      'animals',
      'animals',
    ]),
    ...generateResourceDefinition(zooTaxonomyStaticFilterDefinition, [
      'animals.animal',
      'animals',
    ]),
    ...generateResourceDefinition(historyEntityStaticFiltersDefinitionObject, [
      'plants',
      'plants',
    ]),
    ...generateResourceDefinition(botanyTaxonomyStaticFilterDefinition, [
      'plants.plant',
      'plants',
    ]),
  }

export const staticFiltersDefinitionWrittenSource: ResourceStaticFiltersDefinitionObject =
  {
    author: {
      filters: {
        VocabularyHistoryAuthor,
      },
    },
    writtenSourceType: {
      filters: {
        VocabularyHistoryWrittenSourceType,
      },
      propertyLabel: 'type',
    },
    title: {
      filters: {
        SearchPartial,
      },
    },
    publicationDetails: {
      filters: {
        SearchPartial,
      },
      propertyLabel: 'publication details',
    },
    'centuries.century': {
      filters: {
        VocabularyCentury,
      },
      propertyLabel: 'century',
    },
    'citedWorks.citedWork': {
      filters: {
        VocabularyHistoryCitedWork,
      },
      propertyLabel: 'cited work',
    },
    notes: {
      filters: {
        Exists,
        SearchPartial,
      },
    },
    reference: {
      filters: {
        SearchPartial,
      },
    },
  }

export const staticFiltersDefinitionWrittenSourceCitedWork: ResourceStaticFiltersDefinitionObject =
  {
    citedWork: {
      filters: {
        VocabularyHistoryCitedWork,
      },
      propertyLabel: 'cited work',
    },
    writtenSource: {
      filters: {
        HistoryWrittenSourceEquals,
      },
      propertyLabel: 'written source',
    },
    'writtenSource.author': {
      filters: {
        VocabularyHistoryAuthor,
      },
      propertyLabel: 'written source (author)',
    },
    'writtenSource.centuries.century': {
      filters: {
        VocabularyCentury,
      },
      propertyLabel: 'written source (century)',
    },
    'writtenSource.title': {
      filters: {
        SearchPartial,
      },
      propertyLabel: 'written source (title)',
    },
    'writtenSource.subtitle': {
      filters: {
        Exists,
        SearchPartial,
      },
      propertyLabel: 'written source (subtitle)',
    },
    'writtenSource.publicationDetails': {
      filters: {
        SearchPartial,
      },
      propertyLabel: 'written source (publication details)',
    },
    yearCompleted: {
      filters: {
        SearchExact,
        ...NumericOperations,
      },
      propertyLabel: 'year completed',
    },
    yearCompletedUpper: {
      filters: {
        Exists,
        SearchExact,
        ...NumericOperations,
      },
      propertyLabel: 'year completed (upper)',
    },
  }
