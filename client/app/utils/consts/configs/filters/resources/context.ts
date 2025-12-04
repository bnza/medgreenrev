import type { ResourceStaticFiltersDefinitionObject } from '~~/types'
import {
  API_FILTERS,
  generateResourceDefinition,
} from '~/utils/consts/configs/filters/definitions'
import { propertyStaticFiltersDefinition as stratigraphicUnitPropertyStaticDefinition } from './stratigraphicUnit'

const { Exists, SearchPartial, SiteEquals, SelectionContextType } = API_FILTERS

export const propertyStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject =
  {
    description: {
      filters: {
        SearchPartial,
        Exists,
      },
    },
    name: {
      filters: {
        SearchPartial,
      },
    },
    site: {
      filters: {
        SiteEquals,
      },
    },
    type: {
      filters: {
        SelectionContextType,
      },
    },
  }

export const staticFiltersDefinition = {
  ...propertyStaticFiltersDefinition,
  ...generateResourceDefinition(stratigraphicUnitPropertyStaticDefinition, [
    'contextStratigraphicUnits.stratigraphicUnit',
    'stratigraphic unit',
  ]),
}
