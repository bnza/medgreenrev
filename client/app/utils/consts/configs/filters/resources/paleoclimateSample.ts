import type { ResourceStaticFiltersDefinitionObject } from '~~/types'
import {
  NumericOperations,
  API_FILTERS,
  generateResourceDefinition,
} from '~/utils/consts/configs/filters/definitions'
import { propertyStaticFiltersDefinition as mediaObjectPropertyStaticDefinition } from './mediaObject'
import { propertyStaticFiltersDefinition as paleoclimateSamplingSiteDefinition } from './paleoclimateSamplingSite'

const { Exists, SearchPartial, Boolean, PaleoclimateSamplingSiteEquals } =
  API_FILTERS

export const propertyStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject =
  {
    chronologyLower: {
      propertyLabel: 'chronology (lower)',
      filters: {
        Exists,
        ...NumericOperations,
      },
    },
    chronologyUpper: {
      propertyLabel: 'chronology (upper)',
      filters: {
        Exists,
        ...NumericOperations,
      },
    },
    description: {
      filters: {
        Exists,
        SearchPartial,
      },
    },
    number: {
      filters: {
        ...NumericOperations,
      },
    },
    site: {
      filters: {
        PaleoclimateSamplingSiteEquals,
      },
    },
    precipitationRecord: {
      propertyLabel: 'precipitation (record)',
      filters: {
        Boolean,
      },
    },
    temperatureRecord: {
      propertyLabel: 'temperature (record)',
      filters: {
        Boolean,
      },
    },
    fluidInclusions: {
      propertyLabel: 'fluid inclusions (proxy)',
      filters: {
        Boolean,
      },
    },
    petrographicDescriptions: {
      propertyLabel: 'petrographic descriptions (proxy)',
      filters: {
        Boolean,
      },
    },
    stableIsotopes: {
      propertyLabel: 'stable isotopes (proxy)',
      filters: {
        Boolean,
      },
    },
    traceElements: {
      propertyLabel: 'trace elements (proxy)',
      filters: {
        Boolean,
      },
    },
  }

const existsPropertiesStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject =
  {
    mediaObjects: {
      propertyLabel: 'media',
      filters: {
        Exists,
      },
    },
  }

export const staticFiltersDefinition = {
  ...propertyStaticFiltersDefinition,
  ...generateResourceDefinition(
    mediaObjectPropertyStaticDefinition,
    ['mediaObjects.mediaObject', 'media'],
    ['uploadedBy.email'],
  ),
  ...existsPropertiesStaticFiltersDefinition,
  // ...generateResourceDefinition(paleoclimateSamplingSiteDefinition, [
  //   'site',
  //   'site',
  // ]),
}
