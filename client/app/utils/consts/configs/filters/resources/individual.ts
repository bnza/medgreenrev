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
  SelectionIndividualSex,
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
        SelectionIndividualSex,
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

export const staticFiltersDefinition = {
  ...propertyStaticFiltersDefinition,
  ...analysisPropertyStaticFiltersDefinition,
  ...stratigraphicUnitPropertyStaticFiltersDefinition,
  ...existsPropertiesStaticFiltersDefinition,
}

export const staticFiltersDefinitionParentStratigraphicUnit = {
  ...propertyStaticFiltersDefinition,
  ...analysisPropertyStaticFiltersDefinition,
  ...existsPropertiesStaticFiltersDefinition,
}

export const staticFiltersDefinitionParentAnalysis = {
  ...propertyStaticFiltersDefinition,
  ...stratigraphicUnitPropertyStaticFiltersDefinition,
}
