import type { ResourceStaticFiltersDefinitionObject } from '~~/types'
import {
  API_FILTERS,
  generateResourceDefinition,
} from '~/utils/consts/configs/filters/definitions'
import { propertyStaticFiltersDefinition as analysisPropertyStaticDefinition } from './analysis'
import { propertyStaticFiltersDefinition as stratigraphicUnitPropertyStaticDefinition } from './stratigraphicUnit'

const {
  Exists,
  SearchPartial,
  SelectionBotanyClass,
  SelectionBotanyFamily,
  VocabularyBotanyElement,
  VocabularyBotanyElementPart,
  VocabularyBotanyTaxonomy,
} = API_FILTERS

export const taxonomyStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject =
  {
    taxonomy: {
      propertyLabel: 'taxonomy',
      filters: {
        VocabularyBotanyTaxonomy,
      },
    },
    'taxonomy.family': {
      propertyLabel: 'taxonomy (family)',
      filters: {
        SelectionBotanyFamily,
        Exists,
      },
    },
    'taxonomy.class': {
      propertyLabel: 'taxonomy (class)',
      filters: {
        SelectionBotanyClass,
      },
    },
    'taxonomy.vernacularName': {
      propertyLabel: 'vernacular name',
      filters: {
        SearchPartial,
      },
    },
  }

export const propertyStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject =
  {
    element: {
      filters: {
        VocabularyBotanyElement,
      },
    },
    part: {
      filters: {
        VocabularyBotanyElementPart,
      },
    },
    notes: {
      filters: {
        SearchPartial,
        Exists,
      },
    },
  }

export const staticFiltersDefinition = {
  ...propertyStaticFiltersDefinition,
  ...generateResourceDefinition(stratigraphicUnitPropertyStaticDefinition, [
    'stratigraphicUnit',
    'stratigraphic unit',
  ]),
  ...generateResourceDefinition(analysisPropertyStaticDefinition, [
    'analyses.analysis',
    'analysis',
  ]),
  ...taxonomyStaticFiltersDefinition,
}

export const staticFiltersDefinitionParentStratigraphicUnit = {
  ...propertyStaticFiltersDefinition,
  ...generateResourceDefinition(analysisPropertyStaticDefinition, [
    'analyses.analysis',
    'analyses.analysis',
  ]),
  ...taxonomyStaticFiltersDefinition,
}
