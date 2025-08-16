import type {
  AddToQueryObject,
  ResourceStaticFiltersDefinitionObject,
  StaticFiltersDefinitionObject,
} from '~~/types/filters'
import type { GetCollectionPath } from '~~/types'

const addToQueryObjectSingle: AddToQueryObject = (queryObject, filter) => {
  queryObject[filter.property] = filter.operands[0]
}

const addOperatorToQueryObjectSingle: (operator: string) => AddToQueryObject =
  (operator: string) => (queryObject, filter) => {
    if (!(filter.property in queryObject)) {
      queryObject[filter.property] = {}
    }
    if (!(filter.property in queryObject)) {
      queryObject[filter.property][operator] = []
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

const VocabularyContextType: StaticFiltersDefinitionObject = {
  operationLabel: 'equals',
  multiple: false,
  componentKey: 'Vocabulary',
  path: '/api/vocabulary/context/types',
  addToQueryObject: addToQueryObjectArray,
}

const SiteEquals: StaticFiltersDefinitionObject = {
  operationLabel: 'equals',
  multiple: true,
  componentKey: 'Site',
  addToQueryObject: addToQueryObjectMultiple,
}

const StratigraphicUnitEquals: StaticFiltersDefinitionObject = {
  operationLabel: 'equals',
  multiple: true,
  componentKey: 'StratigraphicUnit',
  addToQueryObject: addToQueryObjectMultiple,
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
  SiteEquals,
  StratigraphicUnitEquals,
  NumericEqual,
  NumericGreaterThan,
  NumericGreaterThanOrEqualTo,
  NumericLessThan,
  NumericLessThanOrEqualTo,
  NumericRange,
  VocabularyContextType,
  VocabularyCulturalContext,
} as const

export type FilterKey = keyof typeof API_FILTERS

export type SearchableGetCollectionPath = Extract<
  GetCollectionPath,
  | '/api/data/contexts'
  | '/api/data/sites'
  | '/api/data/sites/{parentId}/stratigraphic_units'
  | '/api/data/sites/{parentId}/contexts'
  | '/api/data/stratigraphic_units'
>
const contextStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject = {
  site: {
    filters: {
      SiteEquals,
    },
  },
  'contextStratigraphicUnits.stratigraphicUnit': {
    propertyLabel: 'stratigraphic unit',
    filters: {
      StratigraphicUnitEquals,
    },
  },
  'contextStratigraphicUnits.stratigraphicUnit.interpretation': {
    propertyLabel: 'stratigraphic unit (interpretation)',
    filters: {
      SearchPartial,
    },
  },
  'contextStratigraphicUnits.stratigraphicUnit.description': {
    propertyLabel: 'stratigraphic unit (description)',
    filters: {
      SearchPartial,
      Exists,
    },
  },
  'contextStratigraphicUnits.stratigraphicUnit.year': {
    propertyLabel: 'stratigraphic unit (year)',
    filters: {
      SearchExact,
      ...NumericOperations,
    },
  },
  'contextStratigraphicUnits.stratigraphicUnit.number': {
    propertyLabel: 'stratigraphic unit (number)',
    filters: {
      SearchExact,
      ...NumericOperations,
    },
  },
  name: {
    filters: {
      SearchPartial,
    },
  },
  description: {
    filters: {
      SearchPartial,
      Exists,
    },
  },
  type: {
    filters: {
      VocabularyContextType,
    },
  },
}

const siteUnitStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject = {
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
}

const stratigraphicUnitStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject =
  {
    site: {
      filters: {
        SiteEquals,
      },
    },
    interpretation: {
      filters: {
        SearchPartial,
      },
    },
    description: {
      filters: {
        SearchPartial,
        Exists,
      },
    },
    year: {
      filters: {
        ...NumericOperations,
      },
    },
    number: {
      filters: {
        ...NumericOperations,
      },
    },
  }

export const FILTERS_PATHS_MAP: Record<
  SearchableGetCollectionPath,
  ResourceStaticFiltersDefinitionObject
> = {
  '/api/data/contexts': contextStaticFiltersDefinition,
  '/api/data/sites': siteUnitStaticFiltersDefinition,
  '/api/data/sites/{parentId}/contexts': contextStaticFiltersDefinition,
  '/api/data/sites/{parentId}/stratigraphic_units':
    stratigraphicUnitStaticFiltersDefinition,
  '/api/data/stratigraphic_units': stratigraphicUnitStaticFiltersDefinition,
} as const
