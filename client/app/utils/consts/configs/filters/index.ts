import type {
  AddToQueryObject,
  ResourceStaticFiltersDefinitionObject,
  StaticFiltersDefinitionObject,
} from '~~/types/filters'

const addToQueryObjectSingle: AddToQueryObject = (queryObject, filter) => {
  queryObject[filter.property] = filter.operands[0]
}

const addToQueryObjectMultiple: AddToQueryObject = (queryObject, filter) => {
  if (!(filter.property in queryObject)) {
    queryObject[filter.property] = []
  }
  queryObject[filter.property].push(filter.operands[0])
}

const SearchExact: StaticFiltersDefinitionObject = {
  operationLabel: 'equals',
  multiple: true,
  componentKey: 'Single',
  addToQueryObject: addToQueryObjectMultiple,
} as const

const SearchPartial: StaticFiltersDefinitionObject = {
  operationLabel: 'contains',
  multiple: false,
  componentKey: 'Single',
  addToQueryObject: addToQueryObjectSingle,
} as const

const Exists: StaticFiltersDefinitionObject = {
  operationLabel: 'has any value',
  multiple: false,
  componentKey: 'Boolean',
  addToQueryObject: addToQueryObjectMultiple,
} as const

export const API_FILTERS = {
  Exists,
  SearchExact,
  SearchPartial,
} as const

export type FilterKey = keyof typeof API_FILTERS

export type SearchableGetCollectionPath = '/api/sites'

export const FILTERS_PATHS_MAP: Record<
  SearchableGetCollectionPath,
  ResourceStaticFiltersDefinitionObject
> = {
  '/api/sites': {
    code: {
      filters: {
        SearchExact,
      },
    },
    'culturalContexts.culturalContext': {
      propertyLabel: 'cultural context',
      filters: {
        SearchExact,
      },
    },
    culturalContexts: {
      propertyLabel: 'cultural context',
      filters: {
        Exists,
      },
    },
    fieldDirector: {
      propertyLabel: 'field director',
      filters: {
        SearchPartial,
      },
    },
  },
} as const
