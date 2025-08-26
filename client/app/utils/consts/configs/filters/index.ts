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

const VocabularyPotteryDecoration: StaticFiltersDefinitionObject = {
  operationLabel: 'equals',
  multiple: false,
  componentKey: 'Vocabulary',
  path: '/api/vocabulary/pottery/decorations',
  addToQueryObject: addToQueryObjectArray,
}

const VocabularyPotteryFunctionalForm: StaticFiltersDefinitionObject = {
  operationLabel: 'equals',
  multiple: false,
  componentKey: 'Vocabulary',
  path: '/api/vocabulary/pottery/functional_forms',
  addToQueryObject: addToQueryObjectArray,
}

const VocabularyPotteryFunctionalGroups: StaticFiltersDefinitionObject = {
  operationLabel: 'equals',
  multiple: false,
  componentKey: 'Vocabulary',
  path: '/api/vocabulary/pottery/functional_groups',
  addToQueryObject: addToQueryObjectArray,
}

const VocabularyPotteryShape: StaticFiltersDefinitionObject = {
  operationLabel: 'equals',
  multiple: false,
  componentKey: 'Vocabulary',
  path: '/api/vocabulary/pottery/shapes',
  addToQueryObject: addToQueryObjectArray,
}

const VocabularyPotterySurfaceTreatment: StaticFiltersDefinitionObject = {
  operationLabel: 'equals',
  multiple: false,
  componentKey: 'Vocabulary',
  path: '/api/vocabulary/pottery/surface_treatments',
  addToQueryObject: addToQueryObjectArray,
}

const VocabularyAnalysisType: StaticFiltersDefinitionObject = {
  operationLabel: 'equals',
  multiple: false,
  componentKey: 'Vocabulary',
  path: '/api/vocabulary/analysis/types',
  addToQueryObject: addToQueryObjectArray,
}

// const VocabularyMimeType: StaticFiltersDefinitionObject = {
//   operationLabel: 'equals',
//   multiple: false,
//   componentKey: 'Vocabulary',
//   path: '/api/vocabulary/mime_types',
//   addToQueryObject: addToQueryObjectArray,
// }

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
  VocabularyPotteryDecoration,
  VocabularyPotteryFunctionalForm,
  VocabularyPotteryFunctionalGroups,
  VocabularyPotteryShape,
  VocabularyPotterySurfaceTreatment,
  VocabularyAnalysisType,
  // VocabularyMimeType,
} as const

export type FilterKey = keyof typeof API_FILTERS

export type SearchableGetCollectionPath = Extract<
  GetCollectionPath,
  | '/api/data/contexts'
  | '/api/data/potteries'
  | '/api/data/potteries/{parentId}/analyses'
  | '/api/data/sites'
  | '/api/data/sites/{parentId}/stratigraphic_units'
  | '/api/data/sites/{parentId}/contexts'
  | '/api/data/stratigraphic_units'
  | '/api/data/stratigraphic_units/{parentId}/potteries'
  | '/api/data/analyses/potteries'
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

const potteryUnitStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject =
  {
    culturalContext: {
      propertyLabel: 'cultural context',
      filters: {
        VocabularyCulturalContext,
        Exists,
      },
    },
    chronologyLower: {
      propertyLabel: 'chronology (lower)',
      filters: {
        SearchExact,
        Exists,
        ...NumericOperations,
      },
    },
    chronologyUpper: {
      propertyLabel: 'chronology (upper)',
      filters: {
        SearchExact,
        Exists,
        ...NumericOperations,
      },
    },
    decorationMotif: {
      propertyLabel: 'decoration motif',
      filters: {
        SearchPartial,
        Exists,
      },
    },
    'decorations.decoration': {
      propertyLabel: 'decoration',
      filters: {
        VocabularyPotteryDecoration,
      },
    },
    functionalForm: {
      propertyLabel: 'functional form',
      filters: {
        VocabularyPotteryFunctionalForm,
      },
    },
    functionalGroup: {
      propertyLabel: 'functional group',
      filters: {
        VocabularyPotteryFunctionalGroups,
      },
    },
    innerColor: {
      propertyLabel: 'inner color',
      filters: {
        SearchPartial,
        Exists,
      },
    },
    inventory: {
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
    outerColor: {
      propertyLabel: 'outer color',
      filters: {
        SearchPartial,
        Exists,
      },
    },
    shape: {
      filters: {
        Exists,
        VocabularyPotteryShape,
      },
    },
    stratigraphicUnit: {
      propertyLabel: 'stratigraphic unit',
      filters: {
        StratigraphicUnitEquals,
      },
    },
    'stratigraphic.number': {
      propertyLabel: 'stratigraphic unit (number)',
      filters: {
        SearchExact,
        ...NumericOperations,
      },
    },
    'stratigraphic.year': {
      propertyLabel: 'stratigraphic unit (year)',
      filters: {
        SearchExact,
        ...NumericOperations,
      },
    },
    surfaceTreatment: {
      propertyLabel: 'surface treatment',
      filters: {
        VocabularyPotterySurfaceTreatment,
        Exists,
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

const potteryAnalysisStaticFiltersDefinitionObject: ResourceStaticFiltersDefinitionObject =
  {
    'pottery.stratigraphicUnit.site': {
      propertyLabel: 'site',
      filters: {
        SiteEquals,
      },
    },
    'pottery.stratigraphicUnit': {
      propertyLabel: 'stratigraphic unit',
      filters: {
        StratigraphicUnitEquals,
      },
    },
    'pottery.stratigraphicUnit.number': {
      propertyLabel: 'stratigraphic unit (number)',
      filters: {
        SearchExact,
        ...NumericOperations,
      },
    },
    'pottery.stratigraphicUnit.year': {
      propertyLabel: 'stratigraphic unit (year)',
      filters: {
        SearchExact,
        ...NumericOperations,
      },
    },
    'pottery.decorations.decoration': {
      propertyLabel: 'pottery decoration',
      filters: {
        VocabularyPotteryDecoration,
      },
    },
    'pottery.inventory': {
      propertyLabel: 'pottery inventory',
      filters: {
        SearchPartial,
      },
    },
    'pottery.culturalContext': {
      propertyLabel: 'pottery cultural context',
      filters: {
        VocabularyCulturalContext,
        Exists,
      },
    },
    'pottery.chronologyLower': {
      propertyLabel: 'pottery chronology (lower)',
      filters: {
        SearchExact,
        Exists,
        ...NumericOperations,
      },
    },
    'pottery.chronologyUpper': {
      propertyLabel: 'pottery chronology (upper)',
      filters: {
        SearchExact,
        Exists,
        ...NumericOperations,
      },
    },
    'pottery.shape': {
      propertyLabel: 'pottery shape',
      filters: {
        VocabularyPotteryShape,
        Exists,
      },
    },
    'pottery.functionalGroup': {
      propertyLabel: 'pottery functional group',
      filters: {
        VocabularyPotteryFunctionalGroups,
      },
    },
    'pottery.functionalForm': {
      propertyLabel: 'pottery functional form',
      filters: {
        VocabularyPotteryFunctionalForm,
      },
    },
    'pottery.notes': {
      propertyLabel: 'pottery notes',
      filters: {
        SearchPartial,
        Exists,
      },
    },
    'pottery.surfaceTreatment': {
      propertyLabel: 'pottery surface treatment',
      filters: {
        VocabularyPotterySurfaceTreatment,
        Exists,
      },
    },
    'pottery.innerColor': {
      propertyLabel: 'pottery inner color',
      filters: {
        SearchPartial,
        Exists,
      },
    },
    'pottery.outerColor': {
      propertyLabel: 'pottery outer color',
      filters: {
        SearchPartial,
        Exists,
      },
    },
    'pottery.decorationMotif': {
      propertyLabel: 'pottery decoration motif',
      filters: {
        SearchPartial,
        Exists,
      },
    },
    type: {
      propertyLabel: 'analysis type',
      filters: {
        VocabularyAnalysisType,
      },
    },
    'document.mimeType': {
      propertyLabel: 'document mime type',
      filters: {
        SearchPartial,
      },
    },
    'rawData.mimeType': {
      propertyLabel: 'raw data mime type',
      filters: {
        SearchPartial,
      },
    },
    summary: {
      propertyLabel: 'analysis summary',
      filters: {
        SearchPartial,
        Exists,
      },
    },
    document: {
      propertyLabel: 'document',
      filters: {
        Exists,
      },
    },
    rawData: {
      propertyLabel: 'raw data',
      filters: {
        Exists,
      },
    },
  }

export const FILTERS_PATHS_MAP: Record<
  SearchableGetCollectionPath,
  ResourceStaticFiltersDefinitionObject
> = {
  '/api/data/contexts': contextStaticFiltersDefinition,
  '/api/data/potteries': potteryUnitStaticFiltersDefinition,
  '/api/data/potteries/{parentId}/analyses':
    potteryAnalysisStaticFiltersDefinitionObject,
  '/api/data/sites': siteUnitStaticFiltersDefinition,
  '/api/data/sites/{parentId}/contexts': contextStaticFiltersDefinition,
  '/api/data/sites/{parentId}/stratigraphic_units':
    stratigraphicUnitStaticFiltersDefinition,
  '/api/data/stratigraphic_units': stratigraphicUnitStaticFiltersDefinition,
  '/api/data/stratigraphic_units/{parentId}/potteries':
    potteryUnitStaticFiltersDefinition,
  '/api/data/analyses/potteries': potteryAnalysisStaticFiltersDefinitionObject,
} as const
