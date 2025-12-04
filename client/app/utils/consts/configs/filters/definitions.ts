import type {
  AddToQueryObject,
  ResourceStaticFiltersDefinitionObject,
  StaticFiltersDefinitionObject,
} from '~~/types'

export const generateResourceDefinition = <
  T extends ResourceStaticFiltersDefinitionObject,
>(
  resourceDefinition: T,
  prefix: [string, string] = ['', ''], // [propertyPrefix, propertyLabelPrefix]
  blacklistedProperties: (keyof T)[] = [],
): ResourceStaticFiltersDefinitionObject => {
  return Object.fromEntries(
    Object.entries(resourceDefinition)
      .filter(([prop, _definition]) => !blacklistedProperties.includes(prop))
      .map(([prop, definition]) => [
        prefix[0] ? prefix[0] + '.' + prop : prop,
        prefix[1]
          ? {
              propertyLabel:
                prefix[1] + ' [' + (definition.propertyLabel ?? prop) + ']',
              filters: definition.filters,
            }
          : definition,
      ]),
  )
}

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

const SelectionAnalysisStatus: StaticFiltersDefinitionObject = {
  operationLabel: 'equals',
  multiple: false,
  componentKey: 'SelectionAnalysisStatus',
  addToQueryObject: addToQueryObjectArray,
}

const SelectionArea: StaticFiltersDefinitionObject = {
  operationLabel: 'equals',
  multiple: true,
  componentKey: 'Selection',
  path: '/api/list/areas',
  addToQueryObject: addToQueryObjectArray,
}

const SelectionBuilding: StaticFiltersDefinitionObject = {
  operationLabel: 'equals',
  multiple: true,
  componentKey: 'Selection',
  path: '/api/list/buildings',
  addToQueryObject: addToQueryObjectArray,
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

const SelectionZooFamily: StaticFiltersDefinitionObject = {
  operationLabel: 'equals',
  multiple: true,
  componentKey: 'Selection',
  path: '/api/list/vocabulary/zoo/taxonomy_families',
  addToQueryObject: addToQueryObjectMultiple,
}

const SelectionZooClass: StaticFiltersDefinitionObject = {
  operationLabel: 'equals',
  multiple: true,
  componentKey: 'Selection',
  path: '/api/list/vocabulary/zoo/taxonomy_classes',
  addToQueryObject: addToQueryObjectArray,
}

const SelectionIndividualSex: StaticFiltersDefinitionObject = {
  operationLabel: 'equals',
  multiple: false,
  componentKey: 'SelectionIndividualSex',
  addToQueryObject: addToQueryObjectArray,
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

const VocabularyHistoryAnimal: StaticFiltersDefinitionObject = {
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

const VocabularySampleType: StaticFiltersDefinitionObject = {
  operationLabel: 'equals',
  multiple: false,
  componentKey: 'Vocabulary',
  path: '/api/vocabulary/sample/types',
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

export const NumericOperations = {
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

const Boolean: StaticFiltersDefinitionObject = {
  operationLabel: 'is',
  multiple: false,
  componentKey: 'Boolean',
  addToQueryObject: addToQueryObjectSingle,
}

export const API_FILTERS = {
  Boolean,
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
  SelectionAnalysisStatus,
  SelectionArea,
  SelectionBuilding,
  SelectionBotanyClass,
  SelectionBotanyFamily,
  SelectionContextType,
  SelectionIndividualSex,
  SelectionZooClass,
  SelectionZooFamily,
  SelectionZooBoneEndsPreserved,
  SelectionZooBoneSide,
  VocabularyAnalysisType,
  VocabularyBotanyElement,
  VocabularyBotanyElementPart,
  VocabularyIndividualAge,
  VocabularyBotanyTaxonomy,
  VocabularyCulturalContext,
  VocabularyHistoryAnimal,
  VocabularyHistoryPlant,
  VocabularyMediaObjectType,
  VocabularyPotteryDecoration,
  VocabularyPotteryFunctionalForm,
  VocabularyPotteryFunctionalGroups,
  VocabularyPotteryShape,
  VocabularyPotterySurfaceTreatment,
  VocabularySampleType,
  VocabularyZooTaxonomy,
  VocabularyZooBone,
  VocabularyZooBonePart,
} as const

export type FilterKey = keyof typeof API_FILTERS
