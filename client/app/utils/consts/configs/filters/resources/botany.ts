import type { ResourceStaticFiltersDefinitionObject } from '~~/types'
import {
  API_FILTERS,
  generateResourceDefinition,
} from '~/utils/consts/configs/filters/definitions'
import { propertyStaticFiltersDefinition as analysisPropertyStaticDefinition } from './analysis'
import { associationPropertyStaticFiltersDefinition } from './analysisAssociation'
import { propertyStaticFiltersDefinition as stratigraphicUnitPropertyStaticDefinition } from './stratigraphicUnit'

const {
  Boolean,
  Exists,
  SearchPartial,
  VocabularyBotanyElement,
  VocabularyBotanyElementPart,
  VocabularyBotanyTaxonomy,
  VocabularyBotanyTaxonomyClass,
  VocabularyBotanyTaxonomyFamily,
  VocabularyBotanyTaxonomyGenus,
} = API_FILTERS

export const taxonomyStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject =
  {
    taxonomy: {
      propertyLabel: 'taxonomy',
      filters: {
        VocabularyBotanyTaxonomy,
      },
    },
    'taxonomy.flat.classId': {
      propertyLabel: 'taxonomy (class)',
      filters: {
        VocabularyBotanyTaxonomyClass,
      },
    },
    'taxonomy.flat.familyId': {
      propertyLabel: 'taxonomy (family)',
      filters: {
        VocabularyBotanyTaxonomyFamily,
      },
    },
    'taxonomy.flat.genusId': {
      propertyLabel: 'taxonomy (genus)',
      filters: {
        VocabularyBotanyTaxonomyGenus,
      },
    },
  }

export const propertyStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject =
  {
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
    type: {
      propertyLabel: 'taxonomy (type)',
      filters: {
        Boolean,
      },
    },
  }

export const propertyStaticFiltersDefinitionCharcoal: ResourceStaticFiltersDefinitionObject =
  {
    ...propertyStaticFiltersDefinition,
  }
export const propertyStaticFiltersDefinitionSeed: ResourceStaticFiltersDefinitionObject =
  {
    ...propertyStaticFiltersDefinition,
    element: {
      filters: {
        VocabularyBotanyElement,
      },
    },
  }
export const staticFiltersDefinitionCharcoal = {
  ...propertyStaticFiltersDefinitionCharcoal,
  ...generateResourceDefinition(stratigraphicUnitPropertyStaticDefinition, [
    'stratigraphicUnit',
    'stratigraphic unit',
  ]),
  ...generateResourceDefinition(analysisPropertyStaticDefinition, [
    'analyses.analysis',
    'analysis',
  ]),
  ...generateResourceDefinition(associationPropertyStaticFiltersDefinition, [
    'analyses',
    'analysis association',
  ]),
  ...taxonomyStaticFiltersDefinition,
}

export const staticFiltersDefinitionSeed = {
  ...propertyStaticFiltersDefinitionSeed,
  ...generateResourceDefinition(stratigraphicUnitPropertyStaticDefinition, [
    'stratigraphicUnit',
    'stratigraphic unit',
  ]),
  ...generateResourceDefinition(analysisPropertyStaticDefinition, [
    'analyses.analysis',
    'analysis',
  ]),
  ...generateResourceDefinition(associationPropertyStaticFiltersDefinition, [
    'analyses',
    'analysis association',
  ]),
  ...taxonomyStaticFiltersDefinition,
}
export const staticFiltersDefinitionParentStratigraphicUnit = {
  ...propertyStaticFiltersDefinitionCharcoal,
  ...generateResourceDefinition(analysisPropertyStaticDefinition, [
    'analyses.analysis',
    'analyses.analysis',
  ]),
  ...generateResourceDefinition(associationPropertyStaticFiltersDefinition, [
    'analyses',
    'analysis association',
  ]),
  ...taxonomyStaticFiltersDefinition,
}
export const staticFiltersDefinitionParentStratigraphicUnitSeed = {
  ...propertyStaticFiltersDefinitionSeed,
  ...generateResourceDefinition(analysisPropertyStaticDefinition, [
    'analyses.analysis',
    'analyses.analysis',
  ]),
  ...generateResourceDefinition(associationPropertyStaticFiltersDefinition, [
    'analyses',
    'analysis association',
  ]),
  ...taxonomyStaticFiltersDefinition,
}
