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

const SelectionZooBoneEndsPreserved: StaticFiltersDefinitionObject = {
  operationLabel: 'equals',
  multiple: false,
  componentKey: 'SelectionZooBoneEndsPreserved',
  addToQueryObject: addOperatorToQueryObjectSingle('any'),
}

const SelectionZooBoneSide: StaticFiltersDefinitionObject = {
  operationLabel: 'equals',
  multiple: false,
  componentKey: 'SelectionZooBoneSide',
  addToQueryObject: addToQueryObjectArray,
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

const VocabularyMediaObjectType: StaticFiltersDefinitionObject = {
  operationLabel: 'equals',
  multiple: false,
  componentKey: 'Vocabulary',
  path: '/api/vocabulary/media_object/types',
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

const VocabularyZooTaxonomy: StaticFiltersDefinitionObject = {
  operationLabel: 'equals',
  multiple: false,
  componentKey: 'Vocabulary',
  path: '/api/vocabulary/zoo/taxonomies',
  addToQueryObject: addToQueryObjectArray,
}

const VocabularyZooBone: StaticFiltersDefinitionObject = {
  operationLabel: 'equals',
  multiple: false,
  componentKey: 'Vocabulary',
  path: '/api/vocabulary/zoo/bones',
  addToQueryObject: addToQueryObjectArray,
}

const VocabularyZooBonePart: StaticFiltersDefinitionObject = {
  operationLabel: 'equals',
  multiple: false,
  componentKey: 'Vocabulary',
  path: '/api/vocabulary/zoo/bone_parts',
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
  SelectionZooBoneEndsPreserved,
  SelectionZooBoneSide,
  VocabularyAnalysisType,
  VocabularyContextType,
  VocabularyCulturalContext,
  VocabularyMediaObjectType,
  VocabularyPotteryDecoration,
  VocabularyPotteryFunctionalForm,
  VocabularyPotteryFunctionalGroups,
  VocabularyPotteryShape,
  VocabularyPotterySurfaceTreatment,
  VocabularyZooTaxonomy,
  VocabularyZooBone,
  VocabularyZooBonePart,
  // VocabularyMimeType,
} as const

export type FilterKey = keyof typeof API_FILTERS

export type SearchableGetCollectionPath = Extract<
  GetCollectionPath,
  | '/api/data/analyses'
  | '/api/data/analyses/contexts/zoo'
  | '/api/data/analyses/potteries'
  | '/api/data/analyses/zoo/bones'
  | '/api/data/analyses/zoo/teeth'
  | '/api/data/media_objects'
  | '/api/data/contexts'
  | '/api/data/contexts/{parentId}/analyses/zoo'
  | '/api/data/potteries'
  | '/api/data/potteries/{parentId}/analyses'
  | '/api/data/sites'
  | '/api/data/sites/{parentId}/stratigraphic_units'
  | '/api/data/sites/{parentId}/contexts'
  | '/api/data/stratigraphic_units'
  | '/api/data/stratigraphic_units/{parentId}/potteries'
  | '/api/data/stratigraphic_units/{parentId}/zoo/bones'
  | '/api/data/stratigraphic_units/{parentId}/zoo/teeth'
  | '/api/data/zoo/bones'
  | '/api/data/zoo/bones/{parentId}/analyses'
  | '/api/data/zoo/teeth'
  | '/api/data/zoo/teeth/{parentId}/analyses'
>

const analysisStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject = {
  type: {
    filters: {
      VocabularyAnalysisType,
    },
  },
  year: {
    filters: {
      SearchExact,
      ...NumericOperations,
    },
  },
  identifier: {
    filters: {
      SearchPartial,
    },
  },
  laboratory: {
    filters: {
      SearchPartial,
      Exists,
    },
  },
  responsible: {
    filters: {
      SearchPartial,
      Exists,
    },
  },
  summary: {
    filters: {
      SearchPartial,
      Exists,
    },
  },
  createdBy: {
    filters: {
      SearchExact,
      Exists,
    },
  },
  mediaObjectsAnalysis: {
    propertyLabel: 'media',
    filters: {
      Exists,
    },
  },
  'mediaObjectsAnalysis.mediaObject.originalFilename': {
    propertyLabel: 'media (filename)',
    filters: {
      SearchPartial,
    },
  },
  'mediaObjectsAnalysis.mediaObject.mimeType': {
    propertyLabel: 'media (mime type)',
    filters: {
      SearchPartial,
    },
  },
  'mediaObjectsAnalysis.mediaObject.group': {
    propertyLabel: 'media (group)',
    filters: {
      SearchPartial,
    },
  },
  'mediaObjectsAnalysis.mediaObject.type': {
    propertyLabel: 'media (type)',
    filters: {
      VocabularyMediaObjectType,
    },
  },
  'mediaObjectsAnalysis.mediaObject.uploadedBy.email': {
    propertyLabel: 'media (created by)',
    filters: {
      SearchPartial,
    },
  },
}

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

const mediaObjectStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject =
  {
    mimeType: {
      propertyLabel: 'mime type',
      filters: {
        SearchPartial,
      },
    },
    originalFilename: {
      propertyLabel: 'name',
      filters: {
        SearchPartial,
      },
    },
    type: {
      propertyLabel: 'type',
      filters: {
        VocabularyMediaObjectType,
      },
    },
    'uploadedBy.email': {
      propertyLabel: 'uploaded by',
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
  }

const potteryStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject = {
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

const siteStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject = {
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

const analysisContextZooStaticFiltersDefinitionObject: ResourceStaticFiltersDefinitionObject =
  {
    'subject.site': {
      propertyLabel: 'site',
      filters: {
        SiteEquals,
      },
    },
    'subject.type': {
      propertyLabel: 'item type',
      filters: {
        SearchExact,
      },
    },
    'subject.contextStratigraphicUnits.stratigraphicUnit': {
      propertyLabel: 'stratigraphic unit',
      filters: {
        StratigraphicUnitEquals,
      },
    },
    'subject.contextStratigraphicUnits.stratigraphicUnit.year': {
      propertyLabel: 'stratigraphic unit (year)',
      filters: {
        SearchExact,
        ...NumericOperations,
      },
    },
    'subject.contextStratigraphicUnits.stratigraphicUnit.number': {
      propertyLabel: 'stratigraphic unit (number)',
      filters: {
        SearchExact,
        ...NumericOperations,
      },
    },
    'subject.name': {
      propertyLabel: 'item name',
      filters: {
        SearchPartial,
      },
    },
    'subject.description': {
      propertyLabel: 'item description',
      filters: {
        SearchPartial,
        Exists,
      },
    },
    'subject.contextStratigraphicUnits.stratigraphicUnit.interpretation': {
      propertyLabel: 'stratigraphic unit (interpretation)',
      filters: {
        SearchPartial,
      },
    },
    'subject.contextStratigraphicUnits.stratigraphicUnit.description': {
      propertyLabel: 'stratigraphic unit (description)',
      filters: {
        SearchPartial,
        Exists,
      },
    },
    'analysis.type': {
      propertyLabel: 'analysis type',
      filters: {
        VocabularyAnalysisType,
      },
    },
    'analysis.summary': {
      propertyLabel: 'analysis summary',
      filters: {
        SearchPartial,
        Exists,
      },
    },
    summary: {
      propertyLabel: 'summary',
      filters: {
        SearchPartial,
        Exists,
      },
    },
  }

const analysisPotteryStaticFiltersDefinitionObject: ResourceStaticFiltersDefinitionObject =
  {
    'subject.stratigraphicUnit.site': {
      propertyLabel: 'site',
      filters: {
        SiteEquals,
      },
    },
    'subject.stratigraphicUnit': {
      propertyLabel: 'stratigraphic unit',
      filters: {
        StratigraphicUnitEquals,
      },
    },
    'subject.stratigraphicUnit.number': {
      propertyLabel: 'stratigraphic unit (number)',
      filters: {
        SearchExact,
        ...NumericOperations,
      },
    },
    'subject.stratigraphicUnit.year': {
      propertyLabel: 'stratigraphic unit (year)',
      filters: {
        SearchExact,
        ...NumericOperations,
      },
    },
    'subject.decorations.decoration': {
      propertyLabel: 'pottery (decoration)',
      filters: {
        VocabularyPotteryDecoration,
      },
    },
    'subject.inventory': {
      propertyLabel: 'pottery (inventory)',
      filters: {
        SearchPartial,
      },
    },
    'subject.culturalContext': {
      propertyLabel: 'pottery (cultural context)',
      filters: {
        VocabularyCulturalContext,
        Exists,
      },
    },
    'subject.chronologyLower': {
      propertyLabel: 'pottery (chronology lower)',
      filters: {
        SearchExact,
        Exists,
        ...NumericOperations,
      },
    },
    'subject.chronologyUpper': {
      propertyLabel: 'pottery (chronology upper)',
      filters: {
        SearchExact,
        Exists,
        ...NumericOperations,
      },
    },
    'subject.shape': {
      propertyLabel: 'pottery shape',
      filters: {
        VocabularyPotteryShape,
        Exists,
      },
    },
    'subject.functionalGroup': {
      propertyLabel: 'pottery functional group',
      filters: {
        VocabularyPotteryFunctionalGroups,
      },
    },
    'subject.functionalForm': {
      propertyLabel: 'pottery functional form',
      filters: {
        VocabularyPotteryFunctionalForm,
      },
    },
    'subject.notes': {
      propertyLabel: 'pottery notes',
      filters: {
        SearchPartial,
        Exists,
      },
    },
    'subject.surfaceTreatment': {
      propertyLabel: 'pottery surface treatment',
      filters: {
        VocabularyPotterySurfaceTreatment,
        Exists,
      },
    },
    'subject.innerColor': {
      propertyLabel: 'pottery inner color',
      filters: {
        SearchPartial,
        Exists,
      },
    },
    'subject.outerColor': {
      propertyLabel: 'pottery outer color',
      filters: {
        SearchPartial,
        Exists,
      },
    },
    'item.decorationMotif': {
      propertyLabel: 'pottery decoration motif',
      filters: {
        SearchPartial,
        Exists,
      },
    },
    'analysis.type': {
      propertyLabel: 'analysis type',
      filters: {
        VocabularyAnalysisType,
      },
    },
    'analysis.summary': {
      propertyLabel: 'analysis summary',
      filters: {
        SearchPartial,
        Exists,
      },
    },
    summary: {
      propertyLabel: 'summary',
      filters: {
        SearchPartial,
        Exists,
      },
    },
  }

const zooBoneStaticFiltersDefinitionObject: ResourceStaticFiltersDefinitionObject =
  {
    'stratigraphicUnit.site': {
      filters: {
        SiteEquals,
      },
      propertyLabel: 'site',
    },
    stratigraphicUnit: {
      filters: {
        StratigraphicUnitEquals,
      },
      propertyLabel: 'stratigraphic unit',
    },
    'stratigraphicUnit.lowerChronology': {
      filters: {
        SearchExact,
        ...NumericOperations,
      },
      propertyLabel: 'stratigraphic unit (lower chronology)',
    },
    'stratigraphicUnit.upperChronology': {
      filters: {
        SearchExact,
        ...NumericOperations,
      },
      propertyLabel: 'stratigraphic unit (upper chronology)',
    },
    taxonomy: {
      filters: {
        VocabularyZooTaxonomy,
      },
    },
    element: {
      filters: {
        VocabularyZooBone,
      },
    },
    part: {
      filters: {
        VocabularyZooBonePart,
      },
      propertyLabel: 'part',
    },
    endsPreserved: {
      filters: {
        SelectionZooBoneEndsPreserved,
      },
      propertyLabel: 'ends preserved',
    },
    side: {
      filters: {
        SelectionZooBoneSide,
      },
    },
  }

const zooToothStaticFiltersDefinitionObject: ResourceStaticFiltersDefinitionObject =
  {
    'stratigraphicUnit.site': {
      filters: {
        SiteEquals,
      },
      propertyLabel: 'site',
    },
    stratigraphicUnit: {
      filters: {
        StratigraphicUnitEquals,
      },
      propertyLabel: 'stratigraphic unit',
    },
    'stratigraphicUnit.lowerChronology': {
      filters: {
        SearchExact,
        ...NumericOperations,
      },
      propertyLabel: 'stratigraphic unit (lower chronology)',
    },
    'stratigraphicUnit.upperChronology': {
      filters: {
        SearchExact,
        ...NumericOperations,
      },
      propertyLabel: 'stratigraphic unit (upper chronology)',
    },
    taxonomy: {
      filters: {
        VocabularyZooTaxonomy,
      },
    },
    element: {
      filters: {
        VocabularyZooBone,
      },
    },
    side: {
      filters: {
        SelectionZooBoneSide,
      },
    },
  }

const analysisZooBoneStaticFiltersDefinitionObject: ResourceStaticFiltersDefinitionObject =
  {
    'item.stratigraphicUnit.site': {
      propertyLabel: 'site',
      filters: {
        SiteEquals,
      },
    },
    'item.stratigraphicUnit': {
      propertyLabel: 'stratigraphic unit',
      filters: {
        StratigraphicUnitEquals,
      },
    },
    'item.stratigraphicUnit.number': {
      propertyLabel: 'stratigraphic unit (number)',
      filters: {
        SearchExact,
        ...NumericOperations,
      },
    },
    'item.stratigraphicUnit.year': {
      propertyLabel: 'stratigraphic unit (year)',
      filters: {
        SearchExact,
        ...NumericOperations,
      },
    },
    'item.notes': {
      propertyLabel: 'bone (notes)',
      filters: {
        SearchPartial,
        Exists,
      },
    },
    'item.species': {
      propertyLabel: 'bone (taxonomy)',
      filters: {
        VocabularyZooTaxonomy,
      },
    },
    'item.element': {
      propertyLabel: 'bone (element)',
      filters: {
        VocabularyZooBone,
      },
    },
    'item.part': {
      filters: {
        VocabularyZooBonePart,
      },
      propertyLabel: 'bone (part)',
    },
    'item.endsPreserved': {
      filters: {
        SelectionZooBoneEndsPreserved,
      },
      propertyLabel: 'bone (ends preserved)',
    },
    'item.side': {
      filters: {
        SelectionZooBoneSide,
      },
    },
    type: {
      propertyLabel: 'analysis type',
      filters: {
        VocabularyAnalysisType,
      },
    },
    summary: {
      propertyLabel: 'summary',
      filters: {
        SearchPartial,
        Exists,
      },
    },
  }

const analysisZooToothStaticFiltersDefinitionObject: ResourceStaticFiltersDefinitionObject =
  {
    'subject.stratigraphicUnit.site': {
      propertyLabel: 'site',
      filters: {
        SiteEquals,
      },
    },
    'subject.stratigraphicUnit': {
      propertyLabel: 'stratigraphic unit',
      filters: {
        StratigraphicUnitEquals,
      },
    },
    'subject.stratigraphicUnit.number': {
      propertyLabel: 'stratigraphic unit (number)',
      filters: {
        SearchExact,
        ...NumericOperations,
      },
    },
    'subject.stratigraphicUnit.year': {
      propertyLabel: 'stratigraphic unit (year)',
      filters: {
        SearchExact,
        ...NumericOperations,
      },
    },
    'subject.notes': {
      propertyLabel: 'teeth (notes)',
      filters: {
        SearchPartial,
        Exists,
      },
    },
    'subject.species': {
      propertyLabel: 'teeth (taxonomy)',
      filters: {
        VocabularyZooTaxonomy,
      },
    },
    'subject.element': {
      propertyLabel: 'teeth (element)',
      filters: {
        VocabularyZooBone,
      },
    },
    'subject.connected': {
      filters: {
        SelectionZooBoneEndsPreserved,
      },
      propertyLabel: 'teeth (connected to jaw)',
    },
    'subject.side': {
      filters: {
        SelectionZooBoneSide,
      },
    },
    'analysis.type': {
      propertyLabel: 'analysis type',
      filters: {
        VocabularyAnalysisType,
      },
    },
    summary: {
      propertyLabel: 'summary',
      filters: {
        SearchPartial,
        Exists,
      },
    },
  }

export const FILTERS_PATHS_MAP: Record<
  SearchableGetCollectionPath,
  ResourceStaticFiltersDefinitionObject
> = {
  '/api/data/analyses': analysisStaticFiltersDefinition,
  '/api/data/analyses/contexts/zoo':
    analysisContextZooStaticFiltersDefinitionObject,
  '/api/data/analyses/potteries': analysisPotteryStaticFiltersDefinitionObject,
  '/api/data/analyses/zoo/bones': analysisZooBoneStaticFiltersDefinitionObject,
  '/api/data/analyses/zoo/teeth': analysisZooToothStaticFiltersDefinitionObject,
  '/api/data/contexts': contextStaticFiltersDefinition,
  '/api/data/contexts/{parentId}/analyses/zoo':
    analysisContextZooStaticFiltersDefinitionObject,
  '/api/data/media_objects': mediaObjectStaticFiltersDefinition,
  '/api/data/potteries': potteryStaticFiltersDefinition,
  '/api/data/potteries/{parentId}/analyses':
    analysisPotteryStaticFiltersDefinitionObject,
  '/api/data/sites': siteStaticFiltersDefinition,
  '/api/data/sites/{parentId}/contexts': contextStaticFiltersDefinition,
  '/api/data/sites/{parentId}/stratigraphic_units':
    stratigraphicUnitStaticFiltersDefinition,
  '/api/data/stratigraphic_units': stratigraphicUnitStaticFiltersDefinition,
  '/api/data/stratigraphic_units/{parentId}/potteries':
    potteryStaticFiltersDefinition,
  '/api/data/stratigraphic_units/{parentId}/zoo/bones':
    zooBoneStaticFiltersDefinitionObject,
  '/api/data/stratigraphic_units/{parentId}/zoo/teeth':
    zooToothStaticFiltersDefinitionObject,
  '/api/data/zoo/bones': zooBoneStaticFiltersDefinitionObject,
  '/api/data/zoo/bones/{parentId}/analyses':
    analysisZooBoneStaticFiltersDefinitionObject,
  '/api/data/zoo/teeth': zooToothStaticFiltersDefinitionObject,
  '/api/data/zoo/teeth/{parentId}/analyses':
    analysisZooToothStaticFiltersDefinitionObject,
} as const
