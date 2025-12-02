import type { ResourceStaticFiltersDefinitionObject } from '~~/types'
import {
  NumericOperations,
  API_FILTERS,
  generateResourceDefinition,
} from '~/utils/consts/configs/filters/definitions'
import { propertyStaticFiltersDefinition as analysisPropertyStaticDefinition } from './analysis'
import { propertyStaticFiltersDefinition as stratigraphicUnitPropertyStaticDefinition } from './stratigraphicUnit'

const { Exists, SearchExact, SearchPartial, SiteEquals, VocabularySampleType } =
  API_FILTERS

export const propertyStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject =
  {
    description: {
      filters: {
        SearchPartial,
      },
    },
    number: {
      filters: {
        SearchExact,
        ...NumericOperations,
      },
    },
    site: {
      filters: {
        SiteEquals,
      },
    },
    type: {
      filters: {
        VocabularySampleType,
      },
    },
    year: {
      filters: {
        SearchExact,
        ...NumericOperations,
      },
    },
  }

const existsPropertiesStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject =
  {
    analysesMicrostratigraphicUnits: {
      propertyLabel: 'microstratigraphic analysis',
      filters: {
        Exists,
      },
    },
  }

export const staticFiltersDefinition = {
  ...propertyStaticFiltersDefinition,
  ...generateResourceDefinition(analysisPropertyStaticDefinition, [
    'analysis',
    'analysis',
  ]),
  ...generateResourceDefinition(stratigraphicUnitPropertyStaticDefinition, [
    'sampleStratigraphicUnits.stratigraphicUnit',
    'stratigraphic unit',
  ]),
  ...existsPropertiesStaticFiltersDefinition,
}
