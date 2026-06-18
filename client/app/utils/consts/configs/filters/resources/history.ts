import type { ResourceStaticFiltersDefinitionObject } from '~~/types'
import {
  NumericOperations,
  API_FILTERS,
  generateResourceDefinition,
} from '~/utils/consts/configs/filters/definitions'
const {
  Exists,
  HistoryLocationEquals,
  HistoryWrittenSourceEquals,
  SearchExact,
  SearchPartial,
  SelectionZooClass,
  SelectionZooFamily,
  VocabularyHistoryAuthor,
  VocabularyHistoryLanguage,
  VocabularyHistoryWrittenSourceType,
  VocabularyRegion,
  VocabularyCentury,
  VocabularyHistoryCitedWork,
  VocabularyBotanyTaxonomyClass,
  VocabularyBotanyTaxonomyFamily,
  VocabularyBotanyTaxonomyGenus,
} = API_FILTERS

// Flattened taxonomy filters exposed through the read-only `flat` view
// (history plant/animal no longer hold a direct taxonomy relation).
const flatStaticFiltersDefinitionAnimal: ResourceStaticFiltersDefinitionObject =
  {
    'flat.taxonomyId': {
      propertyLabel: 'taxonomy',
      filters: {
        Exists,
      },
    },
    'flat.class': {
      propertyLabel: 'taxonomy (class)',
      filters: {
        SelectionZooClass,
      },
    },
    'flat.family': {
      propertyLabel: 'taxonomy (family)',
      filters: {
        SelectionZooFamily,
        Exists,
      },
    },
    'flat.spanishName': {
      propertyLabel: 'taxonomy (spanish name)',
      filters: {
        SearchPartial,
      },
    },
  }

const flatStaticFiltersDefinitionPlant: ResourceStaticFiltersDefinitionObject =
  {
    'flat.taxonomyId': {
      propertyLabel: 'taxonomy',
      filters: {
        Exists,
      },
    },
    'flat.classId': {
      propertyLabel: 'taxonomy (class)',
      filters: {
        VocabularyBotanyTaxonomyClass,
      },
    },
    'flat.familyId': {
      propertyLabel: 'taxonomy (family)',
      filters: {
        VocabularyBotanyTaxonomyFamily,
      },
    },
    'flat.genusId': {
      propertyLabel: 'taxonomy (genus)',
      filters: {
        VocabularyBotanyTaxonomyGenus,
      },
    },
  }

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
    ...flatStaticFiltersDefinitionAnimal,
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
    ...flatStaticFiltersDefinitionPlant,
  }

export const staticFiltersDefinitionLocation: ResourceStaticFiltersDefinitionObject =
  {
    ...historyLocation,
    ...generateResourceDefinition(historyEntityStaticFiltersDefinitionObject, [
      'animals',
      'animals',
    ]),
    ...generateResourceDefinition(flatStaticFiltersDefinitionAnimal, [
      'animals',
      'animals',
    ]),
    ...generateResourceDefinition(historyEntityStaticFiltersDefinitionObject, [
      'plants',
      'plants',
    ]),
    ...generateResourceDefinition(flatStaticFiltersDefinitionPlant, [
      'plants',
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
