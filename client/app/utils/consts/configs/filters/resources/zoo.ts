import type { ResourceStaticFiltersDefinitionObject } from '~~/types'
import {
  API_FILTERS,
  generateResourceDefinition,
} from '~/utils/consts/configs/filters/definitions'
import { propertyStaticFiltersDefinition as analysisPropertyStaticDefinition } from './analysis'
import { propertyStaticFiltersDefinition as stratigraphicUnitPropertyStaticDefinition } from './stratigraphicUnit'

const {
  Exists,
  SearchExact,
  SearchPartial,
  SelectionZooClass,
  SelectionZooFamily,
  SelectionZooBoneSide,
  SelectionZooBoneEndsPreserved,
  VocabularyZooBone,
  VocabularyZooBonePart,
  VocabularyZooTaxonomy,
} = API_FILTERS

export const taxonomyStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject =
  {
    taxonomy: {
      propertyLabel: 'taxonomy',
      filters: {
        VocabularyZooTaxonomy,
      },
    },
    'taxonomy.family': {
      propertyLabel: 'taxonomy (family)',
      filters: {
        SelectionZooFamily,
        Exists,
      },
    },
    'taxonomy.class': {
      propertyLabel: 'taxonomy (class)',
      filters: {
        SelectionZooClass,
      },
    },
    'taxonomy.vernacularName': {
      propertyLabel: 'vernacular name',
      filters: {
        SearchPartial,
      },
    },
  }

const commonPropertiesStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject =
  {
    ...taxonomyStaticFiltersDefinition,
    'taxonomy.code': {
      propertyLabel: 'taxonomy (code)',
      filters: {
        SearchExact,
      },
    },
    element: {
      filters: {
        VocabularyZooBone,
      },
    },
    notes: {
      filters: {
        SearchPartial,
        Exists,
      },
    },
    side: {
      filters: {
        SelectionZooBoneSide,
      },
    },
  }

export const propertyBoneStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject =
  {
    ...commonPropertiesStaticFiltersDefinition,
    part: {
      filters: {
        VocabularyZooBonePart,
      },
    },
    endsPreserved: {
      filters: {
        SelectionZooBoneEndsPreserved,
      },
      propertyLabel: 'ends preserved',
    },
  }

export const propertyToothStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject =
  {
    ...commonPropertiesStaticFiltersDefinition,
    connected: {
      filters: {
        SelectionZooBoneEndsPreserved,
      },
    },
  }

export const staticFiltersDefinitionBone = {
  ...propertyBoneStaticFiltersDefinition,
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

export const staticFiltersDefinitionBoneParentStratigraphicUnit = {
  ...propertyBoneStaticFiltersDefinition,
  ...generateResourceDefinition(analysisPropertyStaticDefinition, [
    'analyses.analysis',
    'analyses.analysis',
  ]),
  ...taxonomyStaticFiltersDefinition,
}

export const staticFiltersDefinitionTooth = {
  ...propertyToothStaticFiltersDefinition,
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

export const staticFiltersDefinitionToothParentStratigraphicUnit = {
  ...propertyToothStaticFiltersDefinition,
  ...generateResourceDefinition(analysisPropertyStaticDefinition, [
    'analyses.analysis',
    'analyses.analysis',
  ]),
  ...taxonomyStaticFiltersDefinition,
}
