import type { ResourceStaticFiltersDefinitionObject } from '~~/types'
import {
  NumericOperations,
  API_FILTERS,
} from '~/utils/consts/configs/filters/definitions'

const { Boolean, SamplingSiteEquals, SamplingStratigraphicUnitEquals } =
  API_FILTERS

export const propertyStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject =
  {
    'sedimentCore.site': {
      propertyLabel: 'site',
      filters: {
        SamplingSiteEquals,
      },
    },
    'sedimentCore.year': {
      propertyLabel: 'sediment core (year)',
      filters: {
        ...NumericOperations,
      },
    },
    'sedimentCore.number': {
      propertyLabel: 'sediment core (number)',
      filters: {
        ...NumericOperations,
      },
    },
    'stratigraphicUnit.site': {
      propertyLabel: 'site',
      filters: {
        SamplingSiteEquals,
      },
    },
    stratigraphicUnit: {
      propertyLabel: 'stratigraphic unit',
      filters: {
        SamplingStratigraphicUnitEquals,
      },
    },
    depthMin: {
      propertyLabel: 'depth (min)',
      filters: {
        ...NumericOperations,
      },
    },
    depthMax: {
      propertyLabel: 'depth (max)',
      filters: {
        ...NumericOperations,
      },
    },
    geochemistry: {
      propertyLabel: 'results (geochemistry)',
      filters: {
        Boolean,
      },
    },
    microCharcoal: {
      propertyLabel: 'results (microcharcoal)',
      filters: {
        Boolean,
      },
    },
    organicChemistry: {
      propertyLabel: 'results (organic chemistry)',
      filters: {
        Boolean,
      },
    },
    oslDating: {
      propertyLabel: 'results (OSL dating)',
      filters: {
        Boolean,
      },
    },
    phytoliths: {
      propertyLabel: 'results (phytoliths)',
      filters: {
        Boolean,
      },
    },
    plantMacroRemains: {
      propertyLabel: 'results (plant macro-remains)',
      filters: {
        Boolean,
      },
    },
    pollen: {
      propertyLabel: 'results (pollen)',
      filters: {
        Boolean,
      },
    },
    sedimentaryDna: {
      propertyLabel: 'results (sedimentary DNA)',
      filters: {
        Boolean,
      },
    },
  }

export const staticFiltersDefinition = {
  ...propertyStaticFiltersDefinition,
}
