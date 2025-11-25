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

const SelectionBotanyFamily: StaticFiltersDefinitionObject = {
  operationLabel: 'equals',
  multiple: true,
  componentKey: 'Selection',
  path: '/api/list/vocabulary/botany/taxonomy_families',
  addToQueryObject: addToQueryObjectMultiple,
}

const SelectionBotanyClass: StaticFiltersDefinitionObject = {
  operationLabel: 'equals',
  multiple: true,
  componentKey: 'Selection',
  path: '/api/list/vocabulary/botany/taxonomy_classes',
  addToQueryObject: addToQueryObjectArray,
}

const SelectionContextType: StaticFiltersDefinitionObject = {
  operationLabel: 'equals',
  multiple: true,
  componentKey: 'Selection',
  path: '/api/list/contexts/types',
  addToQueryObject: addToQueryObjectArray,
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
const VocabularyBotanyElement: StaticFiltersDefinitionObject = {
  operationLabel: 'equals',
  multiple: false,
  componentKey: 'Vocabulary',
  path: '/api/vocabulary/botany/elements',
  addToQueryObject: addToQueryObjectArray,
}

const VocabularyBotanyElementPart: StaticFiltersDefinitionObject = {
  operationLabel: 'equals',
  multiple: false,
  componentKey: 'Vocabulary',
  path: '/api/vocabulary/botany/element_parts',
  addToQueryObject: addToQueryObjectArray,
}

const VocabularyIndividualAge: StaticFiltersDefinitionObject = {
  operationLabel: 'equals',
  multiple: false,
  componentKey: 'Vocabulary',
  path: '/api/vocabulary/individual/age',
  addToQueryObject: addToQueryObjectArray,
}

const VocabularyBotanyTaxonomy: StaticFiltersDefinitionObject = {
  operationLabel: 'equals',
  multiple: false,
  componentKey: 'Vocabulary',
  path: '/api/vocabulary/botany/taxonomies',
  addToQueryObject: addToQueryObjectArray,
}

const VocabularyHistoryAnimals: StaticFiltersDefinitionObject = {
  operationLabel: 'equals',
  multiple: false,
  componentKey: 'Vocabulary',
  addToQueryObject: addToQueryObjectArray,
  path: '/api/vocabulary/history/animals',
}

const VocabularyHistoryPlant: StaticFiltersDefinitionObject = {
  operationLabel: 'equals',
  multiple: false,
  componentKey: 'Vocabulary',
  addToQueryObject: addToQueryObjectArray,
  path: '/api/vocabulary/history/plants',
}

const VocabularyCulturalContext: StaticFiltersDefinitionObject = {
  operationLabel: 'equals',
  multiple: false,
  componentKey: 'Vocabulary',
  path: '/api/vocabulary/cultural_contexts',
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

const HistoryLocationEquals: StaticFiltersDefinitionObject = {
  operationLabel: 'equals',
  multiple: true,
  componentKey: 'HistoryLocation',
  addToQueryObject: addToQueryObjectMultiple,
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
  HistoryLocationEquals,
  NumericEqual,
  NumericGreaterThan,
  NumericGreaterThanOrEqualTo,
  NumericLessThan,
  NumericLessThanOrEqualTo,
  NumericRange,
  SelectionBotanyClass,
  SelectionBotanyFamily,
  SelectionContextType,
  SelectionZooBoneEndsPreserved,
  SelectionZooBoneSide,
  VocabularyAnalysisType,
  VocabularyBotanyElement,
  VocabularyBotanyElementPart,
  VocabularyIndividualAge,
  VocabularyBotanyTaxonomy,
  VocabularyCulturalContext,
  VocabularyHistoryAnimals,
  VocabularyHistoryPlant,
  VocabularyMediaObjectType,
  VocabularyPotteryDecoration,
  VocabularyPotteryFunctionalForm,
  VocabularyPotteryFunctionalGroups,
  VocabularyPotteryShape,
  VocabularyPotterySurfaceTreatment,
  VocabularyZooTaxonomy,
  VocabularyZooBone,
  VocabularyZooBonePart,
} as const

export type FilterKey = keyof typeof API_FILTERS

export type SearchableGetCollectionPath = Extract<
  GetCollectionPath,
  | '/api/data/analyses'
  | '/api/data/analyses/botany/charcoals'
  | '/api/data/analyses/botany/seeds'
  | '/api/data/analyses/contexts/botany'
  | '/api/data/analyses/individuals'
  | '/api/data/analyses/samples/microstratigraphy'
  | '/api/data/analyses/{parentId}/samples/microstratigraphy'
  | '/api/data/botany/charcoals'
  | '/api/data/botany/charcoals/{parentId}/analyses'
  | '/api/data/botany/seeds'
  | '/api/data/botany/seeds/{parentId}/analyses'
  | '/api/data/analyses/contexts/zoo'
  | '/api/data/analyses/potteries'
  | '/api/data/analyses/zoo/bones'
  | '/api/data/analyses/zoo/teeth'
  | '/api/data/history/plants'
  | '/api/data/history/animals'
  | '/api/data/individuals/{parentId}/analyses'
  | '/api/data/contexts'
  | '/api/data/contexts/{parentId}/analyses/botany'
  | '/api/data/contexts/{parentId}/analyses/zoo'
  | '/api/data/media_objects'
  | '/api/data/potteries'
  | '/api/data/potteries/{parentId}/analyses'
  | '/api/data/samples/{parentId}/analyses/microstratigraphy'
  | '/api/data/sites'
  | '/api/data/sites/{parentId}/stratigraphic_units'
  | '/api/data/sites/{parentId}/contexts'
  | '/api/data/stratigraphic_units'
  | '/api/data/stratigraphic_units/{parentId}/botany/charcoals'
  | '/api/data/stratigraphic_units/{parentId}/botany/seeds'
  | '/api/data/stratigraphic_units/{parentId}/potteries'
  | '/api/data/stratigraphic_units/{parentId}/zoo/bones'
  | '/api/data/stratigraphic_units/{parentId}/zoo/teeth'
  | '/api/data/zoo/bones'
  | '/api/data/zoo/bones/{parentId}/analyses'
  | '/api/data/zoo/teeth'
  | '/api/data/zoo/teeth/{parentId}/analyses'
>

const stratigraphicUnitPropertyStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject =
  {
    'stratigraphicUnit.site': {
      propertyLabel: 'site',
      filters: {
        SiteEquals,
      },
    },
    'stratigraphicUnit.interpretation': {
      propertyLabel: 'stratigraphic unit (interpretation)',
      filters: {
        SearchPartial,
      },
    },
    'stratigraphicUnit.description': {
      propertyLabel: 'stratigraphic unit (description)',
      filters: {
        SearchPartial,
        Exists,
      },
    },
    'stratigraphicUnit.year': {
      propertyLabel: 'stratigraphic unit (year)',
      filters: {
        ...NumericOperations,
        Exists,
      },
    },
    'stratigraphicUnit.chronologyLower': {
      propertyLabel: 'stratigraphic unit (chronology lower)',
      filters: {
        Exists,
        ...NumericOperations,
      },
    },
    'stratigraphicUnit.chronologyUpper': {
      propertyLabel: 'stratigraphic unit (chronology upper)',
      filters: {
        Exists,
        ...NumericOperations,
      },
    },
    number: {
      propertyLabel: 'stratigraphic unit (number)',
      filters: {
        ...NumericOperations,
      },
    },
  }

const analysisJoinStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject =
  {
    'analysis.type': {
      propertyLabel: 'analysis (type)',
      filters: {
        VocabularyAnalysisType,
      },
    },
    'analysis.summary': {
      propertyLabel: 'analysis (summary)',
      filters: {
        SearchPartial,
        Exists,
      },
    },
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
        ...NumericOperations,
      },
    },
    'subject.stratigraphicUnit.year': {
      propertyLabel: 'stratigraphic unit (year)',
      filters: {
        ...NumericOperations,
        Exists,
      },
    },
    summary: {
      filters: {
        SearchPartial,
        Exists,
      },
    },
  }

const analysisBotanyStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject =
  {
    'subject.taxonomy.family': {
      propertyLabel: 'taxonomy (family)',
      filters: {
        SelectionBotanyFamily,
      },
    },
    'subject.taxonomy.class': {
      propertyLabel: 'taxonomy (class)',
      filters: {
        SelectionBotanyClass,
      },
    },
    'subject.taxonomy': {
      filters: {
        VocabularyBotanyTaxonomy,
      },
    },
  }

const analysisBotanyCharcoalStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject =
  {
    ...analysisJoinStaticFiltersDefinition,
    ...analysisBotanyStaticFiltersDefinition,
    ...{
      'subject.part': {
        propertyLabel: 'part',
        filters: {
          VocabularyBotanyTaxonomy,
        },
      },
    },
  }

const analysisBotanySeedStaticFiltersDefinition =
  analysisBotanyCharcoalStaticFiltersDefinition

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

const analysisContextJoinStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject =
  {
    'subject.description': {
      propertyLabel: 'context (description)',
      filters: {
        SearchPartial,
        Exists,
      },
    },
    'subject.name': {
      propertyLabel: 'context (name)',
      filters: {
        SearchPartial,
      },
    },
    'subject.site': {
      propertyLabel: 'context (site)',
      filters: {
        SiteEquals,
      },
    },
    'subject.type': {
      propertyLabel: 'context (type)',
      filters: {
        SelectionContextType,
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
        ...NumericOperations,
        Exists,
      },
    },
    'subject.contextStratigraphicUnits.stratigraphicUnit.number': {
      propertyLabel: 'stratigraphic unit (number)',
      filters: {
        ...NumericOperations,
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
  }

const analysisContextBotanyStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject =
  {
    ...analysisContextJoinStaticFiltersDefinition,
    ...analysisJoinStaticFiltersDefinition,
  }

const analysisSubjectStratigraphicUnitFiltersDefinition: ResourceStaticFiltersDefinitionObject =
  {
    'subject.stratigraphicUnit': {
      propertyLabel: 'stratigraphic unit',
      filters: {
        StratigraphicUnitEquals,
      },
    },
    'subject.stratigraphicUnit.year': {
      propertyLabel: 'stratigraphic unit (year)',
      filters: {
        ...NumericOperations,
        Exists,
      },
    },
    'subject.stratigraphicUnit.number': {
      propertyLabel: 'stratigraphic unit (number)',
      filters: {
        ...NumericOperations,
      },
    },
    'subject.stratigraphicUnit.interpretation': {
      propertyLabel: 'stratigraphic unit (interpretation)',
      filters: {
        SearchPartial,
      },
    },
    'subject.stratigraphicUnit.description': {
      propertyLabel: 'stratigraphic unit (description)',
      filters: {
        SearchPartial,
        Exists,
      },
    },
  }

const analysisSampleStratigraphicUnitFiltersDefinition: ResourceStaticFiltersDefinitionObject =
  {
    'subject.description': {
      propertyLabel: 'sample (description)',
      filters: {
        SearchPartial,
        Exists,
      },
    },
    'subject.number': {
      propertyLabel: 'sample (number)',
      filters: {
        ...NumericOperations,
      },
    },
    'subject.year': {
      propertyLabel: 'sample (year)',
      filters: {
        ...NumericOperations,
        Exists,
      },
    },
    'subject.sampleStratigraphicUnits.stratigraphicUnit.microstratigraphicUnits.identifier':
      {
        propertyLabel: 'microstratigraphic unit (identifier)',
        filters: {
          SearchExact,
        },
      },
    'subject.sampleStratigraphicUnits.stratigraphicUnit.microstratigraphicUnit.notes':
      {
        propertyLabel: 'microstratigraphic unit (notes)',
        filters: {
          SearchPartial,
          Exists,
        },
      },
    'subject.sampleStratigraphicUnits.stratigraphicUnits': {
      propertyLabel: 'stratigraphic unit',
      filters: {
        StratigraphicUnitEquals,
      },
    },
    'subject.sampleStratigraphicUnits.stratigraphicUnit.year': {
      propertyLabel: 'stratigraphic unit (year)',
      filters: {
        ...NumericOperations,
        Exists,
      },
    },
    'subject.sampleStratigraphicUnits.stratigraphicUnit.number': {
      propertyLabel: 'stratigraphic unit (number)',
      filters: {
        ...NumericOperations,
      },
    },
    'subject.sampleStratigraphicUnits.stratigraphicUnit.interpretation': {
      propertyLabel: 'stratigraphic unit (interpretation)',
      filters: {
        SearchPartial,
      },
    },
    'subject.sampleStratigraphicUnits.stratigraphicUnit.description': {
      propertyLabel: 'stratigraphic unit (description)',
      filters: {
        SearchPartial,
        Exists,
      },
    },
  }

const analysisIndividualStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject =
  {
    ...analysisJoinStaticFiltersDefinition,
    ...analysisSubjectStratigraphicUnitFiltersDefinition,
    ...{
      'subject.age': {
        propertyLabel: 'subject (age)',
        filters: {
          VocabularyIndividualAge,
        },
      },
      'subject.identifier': {
        propertyLabel: 'subject (identifier)',
        filters: {
          SearchPartial,
        },
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
      SelectionContextType,
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
  ...stratigraphicUnitPropertyStaticFiltersDefinition,
  // stratigraphicUnit: {
  //   propertyLabel: 'stratigraphic unit',
  //   filters: {
  //     StratigraphicUnitEquals,
  //   },
  // },
  // 'stratigraphic.number': {
  //   propertyLabel: 'stratigraphic unit (number)',
  //   filters: {
  //     SearchExact,
  //     ...NumericOperations,
  //   },
  // },
  // 'stratigraphic.year': {
  //   propertyLabel: 'stratigraphic unit (year)',
  //   filters: {
  //     SearchExact,
  //     ...NumericOperations,
  //   },
  // },
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
    year: {
      filters: {
        ...NumericOperations,
        Exists,
      },
    },
    number: {
      filters: {
        ...NumericOperations,
      },
    },
  }

const botanyCommonStaticFiltersDefinitionObject: ResourceStaticFiltersDefinitionObject =
  {
    taxonomy: {
      filters: {
        VocabularyBotanyTaxonomy,
      },
    },
    element: {
      filters: {
        VocabularyBotanyElement,
      },
    },
    part: {
      filters: {
        VocabularyBotanyElementPart,
      },
      propertyLabel: 'part',
    },
  }

const botanyCharcoalStaticFiltersDefinitionObject: ResourceStaticFiltersDefinitionObject =
  {
    ...stratigraphicUnitPropertyStaticFiltersDefinition,
    ...botanyCommonStaticFiltersDefinitionObject,
  }

const botanySeedStaticFiltersDefinitionObject: ResourceStaticFiltersDefinitionObject =
  {
    ...stratigraphicUnitPropertyStaticFiltersDefinition,
    ...botanyCommonStaticFiltersDefinitionObject,
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
    ...analysisJoinStaticFiltersDefinition,
    ...analysisSubjectStratigraphicUnitFiltersDefinition,
    'subject.notes': {
      propertyLabel: 'bone (notes)',
      filters: {
        SearchPartial,
        Exists,
      },
    },
    'subject.species': {
      propertyLabel: 'bone (taxonomy)',
      filters: {
        VocabularyZooTaxonomy,
      },
    },
    'subject.element': {
      propertyLabel: 'bone (element)',
      filters: {
        VocabularyZooBone,
      },
    },
    'subject.part': {
      filters: {
        VocabularyZooBonePart,
      },
      propertyLabel: 'bone (part)',
    },
    'subject.endsPreserved': {
      filters: {
        SelectionZooBoneEndsPreserved,
      },
      propertyLabel: 'bone (ends preserved)',
    },
    'subject.side': {
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
    ...analysisJoinStaticFiltersDefinition,
    ...analysisSubjectStratigraphicUnitFiltersDefinition,
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

const historyAnimalStaticFiltersDefinitionObject: ResourceStaticFiltersDefinitionObject =
  {
    animal: {
      filters: {
        VocabularyHistoryAnimals,
      },
    },
    location: {
      filters: {
        HistoryLocationEquals,
      },
    },
    reference: {
      filters: {
        SearchPartial,
      },
    },
    chronologyLower: {
      filters: {
        SearchExact,
        ...NumericOperations,
      },
      propertyLabel: 'chronology (lower)',
    },
    chronologyUpper: {
      filters: {
        SearchExact,
        ...NumericOperations,
      },
      propertyLabel: 'chronology (upper)',
    },
    notes: {
      filters: {
        SearchPartial,
        Exists,
      },
    },
  }

const historyPlantStaticFiltersDefinitionObject: ResourceStaticFiltersDefinitionObject =
  {
    plant: {
      filters: {
        VocabularyHistoryPlant,
      },
    },
    location: {
      filters: {
        HistoryLocationEquals,
      },
    },
    reference: {
      filters: {
        SearchPartial,
      },
    },
    chronologyLower: {
      filters: {
        SearchExact,
        ...NumericOperations,
      },
      propertyLabel: 'chronology (lower)',
    },
    chronologyUpper: {
      filters: {
        SearchExact,
        ...NumericOperations,
      },
      propertyLabel: 'chronology (upper)',
    },
    notes: {
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
  '/api/data/analyses/botany/charcoals':
    analysisBotanyCharcoalStaticFiltersDefinition,
  '/api/data/analyses/botany/seeds': analysisBotanySeedStaticFiltersDefinition,
  '/api/data/analyses/contexts/botany':
    analysisContextBotanyStaticFiltersDefinition,
  '/api/data/botany/charcoals': botanyCharcoalStaticFiltersDefinitionObject,
  '/api/data/botany/seeds': botanySeedStaticFiltersDefinitionObject,
  '/api/data/botany/charcoals/{parentId}/analyses':
    analysisBotanyCharcoalStaticFiltersDefinition,
  '/api/data/botany/seeds/{parentId}/analyses':
    analysisBotanySeedStaticFiltersDefinition,
  '/api/data/analyses/contexts/zoo':
    analysisContextZooStaticFiltersDefinitionObject,
  '/api/data/analyses/individuals': analysisIndividualStaticFiltersDefinition,
  '/api/data/analyses/potteries': analysisPotteryStaticFiltersDefinitionObject,
  '/api/data/analyses/samples/microstratigraphy':
    analysisSampleStratigraphicUnitFiltersDefinition,
  '/api/data/analyses/{parentId}/samples/microstratigraphy':
    analysisSampleStratigraphicUnitFiltersDefinition,
  '/api/data/analyses/zoo/bones': analysisZooBoneStaticFiltersDefinitionObject,
  '/api/data/analyses/zoo/teeth': analysisZooToothStaticFiltersDefinitionObject,
  '/api/data/contexts': contextStaticFiltersDefinition,
  '/api/data/contexts/{parentId}/analyses/botany':
    analysisContextBotanyStaticFiltersDefinition,
  '/api/data/contexts/{parentId}/analyses/zoo':
    analysisContextZooStaticFiltersDefinitionObject,
  '/api/data/history/animals': historyAnimalStaticFiltersDefinitionObject,
  '/api/data/history/plants': historyPlantStaticFiltersDefinitionObject,
  '/api/data/individuals/{parentId}/analyses':
    analysisIndividualStaticFiltersDefinition,
  '/api/data/media_objects': mediaObjectStaticFiltersDefinition,
  '/api/data/potteries': potteryStaticFiltersDefinition,
  '/api/data/potteries/{parentId}/analyses':
    analysisPotteryStaticFiltersDefinitionObject,
  '/api/data/samples/{parentId}/analyses/microstratigraphy':
    analysisSampleStratigraphicUnitFiltersDefinition,
  '/api/data/sites': siteStaticFiltersDefinition,
  '/api/data/sites/{parentId}/contexts': contextStaticFiltersDefinition,
  '/api/data/sites/{parentId}/stratigraphic_units':
    stratigraphicUnitStaticFiltersDefinition,
  '/api/data/stratigraphic_units': stratigraphicUnitStaticFiltersDefinition,
  '/api/data/stratigraphic_units/{parentId}/botany/charcoals':
    botanyCharcoalStaticFiltersDefinitionObject,
  '/api/data/stratigraphic_units/{parentId}/botany/seeds':
    botanySeedStaticFiltersDefinitionObject,
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
