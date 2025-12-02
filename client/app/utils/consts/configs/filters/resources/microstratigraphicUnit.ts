import type { ResourceStaticFiltersDefinitionObject } from '~~/types'
import {
  API_FILTERS,
  generateResourceDefinition,
} from '~/utils/consts/configs/filters/definitions'
import { propertyStaticFiltersDefinition as stratigraphicUnitPropertyStaticDefinition } from './stratigraphicUnit'

const { Exists, SearchPartial } = API_FILTERS

const stratigraphicUnitPropertyStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject =
  {
    ...generateResourceDefinition(stratigraphicUnitPropertyStaticDefinition, [
      'stratigraphicUnit',
      'stratigraphic unit',
    ]),
  }

export const propertyStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject =
  {
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
  } as const

export const staticFiltersDefinition = {
  ...propertyStaticFiltersDefinition,
  ...stratigraphicUnitPropertyStaticFiltersDefinition,
}

export const staticFiltersDefinitionParentStratigraphicUnit = {
  ...propertyStaticFiltersDefinition,
}
