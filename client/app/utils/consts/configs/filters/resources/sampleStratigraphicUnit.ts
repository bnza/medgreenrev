import type { ResourceStaticFiltersDefinitionObject } from '~~/types'
import {
  API_FILTERS,
  generateResourceDefinition,
} from '~/utils/consts/configs/filters/definitions'
import { propertyStaticFiltersDefinition as mediaObjectPropertyStaticDefinition } from './mediaObject'
import { propertyStaticFiltersDefinition as samplePropertyStaticDefinition } from './sample'
import { propertyStaticFiltersDefinition as stratigraphicUnitPropertyStaticDefinition } from './stratigraphicUnit'

const { Exists } = API_FILTERS

const stratigraphicUnitPropertyStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject =
  {
    ...generateResourceDefinition(
      mediaObjectPropertyStaticDefinition,
      ['stratigraphicUnit.mediaObjects.mediaObject', 'media'],
      ['uploadedBy.email'],
    ),
    ...generateResourceDefinition(stratigraphicUnitPropertyStaticDefinition, [
      'stratigraphicUnit',
      'stratigraphic unit',
    ]),
  }

const samplePropertyStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject =
  {
    ...generateResourceDefinition(samplePropertyStaticDefinition, [
      'sample',
      'sample',
    ]),
  }
export const propertyStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject =
  {
    ...stratigraphicUnitPropertyStaticFiltersDefinition,
    ...samplePropertyStaticFiltersDefinition,
  } as const

const existsPropertiesStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject =
  {
    'stratigraphicUnit.mediaObjects': {
      propertyLabel: 'stratigraphic unit [media]',
      filters: {
        Exists,
      },
    },
  }

export const staticFiltersDefinition = {
  ...propertyStaticFiltersDefinition,
  ...existsPropertiesStaticFiltersDefinition,
}

export const staticFiltersDefinitionParentSample = {
  ...stratigraphicUnitPropertyStaticFiltersDefinition,
  ...existsPropertiesStaticFiltersDefinition,
}

export const staticFiltersDefinitionParentStratigraphicUnit = {
  ...samplePropertyStaticFiltersDefinition,
  ...existsPropertiesStaticFiltersDefinition,
}
