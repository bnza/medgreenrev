import type { ResourceStaticFiltersDefinitionObject } from '~~/types'
import {
  API_FILTERS,
  generateResourceDefinition,
} from '~/utils/consts/configs/filters/definitions'
import { propertyStaticFiltersDefinition as analysisPropertyStaticDefinition } from './analysis'
import { associationPropertyStaticFiltersDefinition } from './analysisAssociation'
import { propertyStaticFiltersDefinition as stratigraphicUnitPropertyStaticDefinition } from './stratigraphicUnit'

const {
  Exists,
  SearchPartial,
  VocabularyIndividualSex,
  VocabularyIndividualAge,
} = API_FILTERS

const stratigraphicUnitPropertyStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject =
  {
    ...generateResourceDefinition(stratigraphicUnitPropertyStaticDefinition, [
      'stratigraphicUnit',
      'stratigraphic unit',
    ]),
  }

const analysisPropertyStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject =
  {
    ...generateResourceDefinition(analysisPropertyStaticDefinition, [
      'analyses.analysis',
      'analysis',
    ]),
  }

export const propertyStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject =
  {
    age: {
      filters: {
        VocabularyIndividualAge,
        Exists,
      },
    },
    identifier: {
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
    sex: {
      filters: {
        Exists,
        VocabularyIndividualSex,
      },
    },
  } as const

const existsPropertiesStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject =
  {
    analyses: {
      propertyLabel: 'analysis',
      filters: {
        Exists,
      },
    },
  } as const

const analysisAssociationPropertyStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject =
  generateResourceDefinition(associationPropertyStaticFiltersDefinition, [
    'analyses',
    'analysis association',
  ])

export const staticFiltersDefinition = {
  ...propertyStaticFiltersDefinition,
  ...analysisPropertyStaticFiltersDefinition,
  ...analysisAssociationPropertyStaticFiltersDefinition,
  ...stratigraphicUnitPropertyStaticFiltersDefinition,
  ...existsPropertiesStaticFiltersDefinition,
}

export const staticFiltersDefinitionParentStratigraphicUnit = {
  ...propertyStaticFiltersDefinition,
  ...analysisPropertyStaticFiltersDefinition,
  ...analysisAssociationPropertyStaticFiltersDefinition,
  ...existsPropertiesStaticFiltersDefinition,
}

export const staticFiltersDefinitionParentAnalysis = {
  ...propertyStaticFiltersDefinition,
  ...analysisAssociationPropertyStaticFiltersDefinition,
  ...stratigraphicUnitPropertyStaticFiltersDefinition,
}
