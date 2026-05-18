import type { ResourceStaticFiltersDefinitionObject } from '~~/types'
import {
  NumericOperations,
  API_FILTERS,
  generateResourceDefinition,
} from '~/utils/consts/configs/filters/definitions'
import { taxonomyStaticFiltersDefinition as zooTaxonomyStaticFilterDefinition } from './zoo'
import { taxonomyStaticFiltersDefinition as botanyTaxonomyStaticFilterDefinition } from './botany'

const {
  Boolean,
  Exists,
  HistoryLocationEquals,
  HistoryWrittenSourceEquals,
  SearchExact,
  SearchPartial,
  VocabularyHistoryAuthor,
  VocabularyHistoryLanguage,
  VocabularyHistoryWrittenSourceType,
  VocabularyRegion,
  VocabularyCentury,
  VocabularyHistoryCitedWork,
  VocabularyBotanyTaxonomy,
  VocabularyZooTaxonomy,
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
        SearchPartial,
      },
    },
    'location.region': {
      propertyLabel: 'region',
      filters: {
        VocabularyRegion,
      },
    },
    ...zooTaxonomyStaticFilterDefinition,
    taxonomy: {
      propertyLabel: 'taxonomy',
      filters: {
        VocabularyZooTaxonomy,
        Exists,
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
    plant: {
      filters: {
        SearchPartial,
      },
    },
    cf: {
      propertyLabel: 'taxonomy (cf)',
      filters: {
        Boolean,
      },
    },
    sp: {
      propertyLabel: 'taxonomy (sp)',
      filters: {
        Boolean,
      },
    },
    ...botanyTaxonomyStaticFilterDefinition,
    'taxonomy.englishName': {
      propertyLabel: 'taxonomy (english name)',
      filters: {
        SearchPartial,
      },
    },
    taxonomy: {
      propertyLabel: 'taxonomy',
      filters: {
        VocabularyBotanyTaxonomy,
        Exists,
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
      'animals.taxonomy',
      'animals',
    ]),
    ...generateResourceDefinition(historyEntityStaticFiltersDefinitionObject, [
      'plants',
      'plants',
    ]),
    ...generateResourceDefinition(botanyTaxonomyStaticFilterDefinition, [
      'plants.taxonomy',
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
    'regions.region': {
      filters: {
        VocabularyRegion,
      },
      propertyLabel: 'regions',
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
    'writtenSource.regions.region': {
      filters: {
        VocabularyRegion,
      },
      propertyLabel: 'written source (regions)',
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
      },
      propertyLabel: 'year completed (upper)',
    },
  }
