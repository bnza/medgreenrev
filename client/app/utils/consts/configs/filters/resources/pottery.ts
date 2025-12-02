import type { ResourceStaticFiltersDefinitionObject } from '~~/types'
import {
  NumericOperations,
  API_FILTERS,
  generateResourceDefinition,
} from '~/utils/consts/configs/filters/definitions'
import { propertyStaticFiltersDefinition as analysisPropertyStaticDefinition } from './analysis'
import { propertyStaticFiltersDefinition as mediaObjectPropertyStaticDefinition } from './mediaObject'
import { propertyStaticFiltersDefinition as stratigraphicUnitPropertyStaticDefinition } from './stratigraphicUnit'

const {
  Exists,
  SearchPartial,
  SearchExact,
  VocabularyCulturalContext,
  VocabularyPotteryDecoration,
  VocabularyPotteryFunctionalForm,
  VocabularyPotteryFunctionalGroups,
  VocabularyPotteryShape,
} = API_FILTERS

const stratigraphicUnitPropertyStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject =
  {
    ...generateResourceDefinition(stratigraphicUnitPropertyStaticDefinition, [
      'stratigraphicUnit',
      'stratigraphic unit',
    ]),
  }

export const propertyStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject =
  {
    culturalContext: {
      propertyLabel: 'cultural context',
      filters: {
        VocabularyCulturalContext,
        Exists,
      },
    },
    chronologyLower: {
      propertyLabel: 'chronology (lower)',
      filters: {
        SearchExact,
        Exists,
        ...NumericOperations,
      },
    },
    chronologyUpper: {
      propertyLabel: 'chronology (upper)',
      filters: {
        SearchExact,
        Exists,
        ...NumericOperations,
      },
    },
    decorationMotif: {
      propertyLabel: 'decoration motif',
      filters: {
        SearchPartial,
        Exists,
      },
    },
    'decorations.decoration': {
      propertyLabel: 'decoration',
      filters: {
        VocabularyPotteryDecoration,
      },
    },
    functionalForm: {
      propertyLabel: 'functional form',
      filters: {
        VocabularyPotteryFunctionalForm,
      },
    },
    functionalGroup: {
      propertyLabel: 'functional group',
      filters: {
        VocabularyPotteryFunctionalGroups,
      },
    },
    innerColor: {
      propertyLabel: 'inner color',
      filters: {
        SearchPartial,
        Exists,
      },
    },
    inventory: {
      filters: {
        SearchPartial,
      },
    },
    notes: {
      filters: {
        SearchPartial,
        Exists,
      },
    },
    outerColor: {
      propertyLabel: 'outer color',
      filters: {
        SearchPartial,
        Exists,
      },
    },
    shape: {
      filters: {
        Exists,
        VocabularyPotteryShape,
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
    analyses: {
      propertyLabel: 'analysis',
      filters: {
        Exists,
      },
    },
  } as const

export const staticFiltersDefinition = {
  ...propertyStaticFiltersDefinition,
  ...generateResourceDefinition(analysisPropertyStaticDefinition, [
    'analyses.analysis',
    'analysis',
  ]),
  ...stratigraphicUnitPropertyStaticFiltersDefinition,
  ...existsPropertiesStaticFiltersDefinition,
  ...generateResourceDefinition(
    mediaObjectPropertyStaticDefinition,
    ['mediaObjects.mediaObject', 'media'],
    ['uploadedBy.email'],
  ),
}

export const staticFiltersDefinitionParentStratigraphicUnit = {
  ...propertyStaticFiltersDefinition,
  ...generateResourceDefinition(analysisPropertyStaticDefinition, [
    'analyses.analysis',
    'analysis',
  ]),
  ...generateResourceDefinition(
    mediaObjectPropertyStaticDefinition,
    ['mediaObjects.mediaObject', 'media'],
    ['uploadedBy.email'],
  ),
}

export const staticFiltersDefinitionParentAnalysis = {
  ...propertyStaticFiltersDefinition,
  ...stratigraphicUnitPropertyStaticFiltersDefinition,
  ...generateResourceDefinition(
    mediaObjectPropertyStaticDefinition,
    ['mediaObjects.mediaObject', 'media'],
    ['uploadedBy.email'],
  ),
}
