import type {
  AddToQueryObject,
  ResourceStaticFiltersDefinitionObject,
  StaticFiltersDefinitionObject,
} from '~~/types/filters'

const addToQueryObjectSingle: AddToQueryObject = (queryObject, filter) => {
  queryObject[filter.property] = filter.operands[0]
}

const addOperatorToQueryObjectSingle: (operator: string) => AddToQueryObject =
  (operator: string) => (queryObject, filter) => {
    if (!(filter.property in queryObject)) {
      queryObject[filter.property] = []
    }
    queryObject[filter.property][operator] = filter.operands[0]
  }

const addToQueryObjectMultiple: AddToQueryObject = (queryObject, filter) => {
  if (!(filter.property in queryObject)) {
    queryObject[filter.property] = []
  }
  queryObject[filter.property].push(filter.operands[0])
}

const addToQueryObjectArray: AddToQueryObject = (queryObject, filter) => {
  queryObject[filter.property] = filter.operands
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

const NumericEqual: StaticFiltersDefinitionObject = {
  operationLabel: 'equals',
  multiple: true,
  componentKey: 'Numeric',
  addToQueryObject: addToQueryObjectMultiple,
}

const NumericGreaterThan: StaticFiltersDefinitionObject = {
  operationLabel: 'greater than',
  multiple: false,
  componentKey: 'Numeric',
  addToQueryObject: addOperatorToQueryObjectSingle('gt'),
}

const NumericGreaterThanOrEqualTo: StaticFiltersDefinitionObject = {
  operationLabel: 'greater than or equal to',
  multiple: false,
  componentKey: 'Numeric',
  addToQueryObject: addOperatorToQueryObjectSingle('gte'),
}

const NumericLessThan: StaticFiltersDefinitionObject = {
  operationLabel: 'less than',
  multiple: false,
  componentKey: 'Numeric',
  addToQueryObject: addOperatorToQueryObjectSingle('lt'),
}

const NumericLessThanOrEqualTo: StaticFiltersDefinitionObject = {
  operationLabel: 'less than or equal to',
  multiple: false,
  componentKey: 'Numeric',
  addToQueryObject: addOperatorToQueryObjectSingle('lte'),
}

const NumericRange: StaticFiltersDefinitionObject = {
  operationLabel: 'between',
  multiple: true,
  componentKey: 'NumericRange',
  addToQueryObject: (queryObject, filter) => {
    if (!(filter.property in queryObject)) {
      queryObject[filter.property] = {}
    }
    queryObject[filter.property].between =
      `${filter.operands[0]}..${filter.operands[1]}`
  },
}

const VocabularyCulturalContext: StaticFiltersDefinitionObject = {
  operationLabel: 'equals',
  multiple: false,
  componentKey: 'Vocabulary',
  path: '/api/vocabulary/cultural_contexts',
  addToQueryObject: addToQueryObjectArray,
}

const NumericOperations = {
  NumericEqual,
  NumericGreaterThan,
  NumericGreaterThanOrEqualTo,
  NumericLessThan,
  NumericLessThanOrEqualTo,
  NumericRange,
}

const Exists: StaticFiltersDefinitionObject = {
  operationLabel: 'has any value',
  multiple: false,
  componentKey: 'Boolean',
  addToQueryObject: (queryObject, filter) => {
    if (!('exists' in queryObject)) {
      queryObject.exists = {}
    }
    queryObject.exists[filter.property] = filter.operands[0]
  },
} as const

export const API_FILTERS = {
  Exists,
  SearchExact,
  SearchPartial,
  NumericEqual,
  NumericGreaterThan,
  NumericGreaterThanOrEqualTo,
  NumericLessThan,
  NumericLessThanOrEqualTo,
  NumericRange,
  VocabularyCulturalContext,
} as const

export type FilterKey = keyof typeof API_FILTERS

export type SearchableGetCollectionPath = '/api/data/sites'

export const FILTERS_PATHS_MAP: Record<
  SearchableGetCollectionPath,
  ResourceStaticFiltersDefinitionObject
> = {
  '/api/data/sites': {
    code: {
      filters: {
        SearchExact,
      },
    },
    'culturalContexts.culturalContext': {
      propertyLabel: 'cultural context',
      filters: {
        VocabularyCulturalContext,
      },
    },
    culturalContexts: {
      propertyLabel: 'cultural context',
      filters: {
        Exists,
      },
    },
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
        SearchPartial,
        Exists,
      },
    },
    fieldDirector: {
      propertyLabel: 'field director',
      filters: {
        SearchPartial,
        Exists,
      },
    },
  },
} as const
