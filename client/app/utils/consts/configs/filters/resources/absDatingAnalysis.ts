import type { ResourceStaticFiltersDefinitionObject } from '~~/types'
import {
  NumericOperations,
  API_FILTERS,
} from '~/utils/consts/configs/filters/definitions'

const {
  ArchaeologicalSiteEquals,
  Exists,
  SearchPartial,
  StratigraphicUnitEquals,
  VocabularyAnalysisType,
} = API_FILTERS

export const staticFiltersDefinition: ResourceStaticFiltersDefinitionObject = {
  'stratigraphicUnit.site': {
    propertyLabel: 'site',
    filters: {
      ArchaeologicalSiteEquals,
    },
  },
  stratigraphicUnit: {
    propertyLabel: 'stratigraphic unit',
    filters: {
      StratigraphicUnitEquals,
    },
  },
  'analysis.type.value': {
    propertyLabel: 'analysis type',
    filters: {
      VocabularyAnalysisType,
    },
  },
  'analysis.identifier': {
    propertyLabel: 'analysis identifier',
    filters: {
      SearchPartial,
    },
  },
  'analysis.laboratory': {
    propertyLabel: 'laboratory',
    filters: {
      SearchPartial,
    },
  },
  'analysis.responsible': {
    propertyLabel: 'responsible',
    filters: {
      SearchPartial,
    },
  },
  'analysis.year': {
    propertyLabel: 'year',
    filters: {
      ...NumericOperations,
    },
  },
  datingLower: {
    propertyLabel: 'calibrated dating (lower)',
    filters: {
      ...NumericOperations,
    },
  },
  datingUpper: {
    propertyLabel: 'calibrated dating (upper)',
    filters: {
      ...NumericOperations,
    },
  },
  probability: {
    propertyLabel: 'calibrated dating (probability %)',
    filters: {
      Exists,
      ...NumericOperations,
    },
  },
  uncalibratedDating: {
    propertyLabel: 'uncalibrated dating (BP)',
    filters: {
      ...NumericOperations,
    },
  },
  error: {
    propertyLabel: 'error (years)',
    filters: {
      ...NumericOperations,
    },
  },
} as const
