import type { FilterKey } from '~/utils/consts/configs/filters'
import type { VocabularyGetCollectionPath } from './openapi-helpers'

export type OperandComponentsKey =
  | 'Boolean'
  | 'Single'
  | 'Numeric'
  | 'NumericRange'
  | 'SelectionZooBoneEndsPreserved'
  | 'SelectionZooBoneSide'
  | 'Vocabulary'
  | 'Site'
  | 'StratigraphicUnit'

export type Filter = {
  property: string
  key: FilterKey
  operands: Array<string | number | boolean>
}

export interface FilterState {
  [id: string]: Filter
}

export type AddToQueryObject = (
  queryObject: Record<string, any>,
  filter: Filter,
) => void

type BaseFilterDefinitionObject = {
  multiple: boolean
  operationLabel: string
}

type ComponentKeyWithPath =
  | { componentKey: 'Vocabulary'; path: VocabularyGetCollectionPath }
  | { componentKey: Exclude<OperandComponentsKey, 'Vocabulary'> }

export type FilterDefinitionObject<K extends FilterKey = FilterKey> =
  BaseFilterDefinitionObject & {
    key: K
    property: string
    propertyLabel: string
  } & ComponentKeyWithPath

export type ExpandedFilter = FilterDefinitionObject & Filter

type StaticFiltersDefinitionObject = BaseFilterDefinitionObject & {
  addToQueryObject: AddToQueryObject
  propertyLabel?: string
} & ComponentKeyWithPath

type ResourcePropertyFiltersDefinitionObject = Partial<
  Record<FilterKey, FilterDefinitionObject>
>

type ResourcePropertyStaticFiltersDefinitionObject = {
  filters: Partial<Record<FilterKey, StaticFiltersDefinitionObject>>
  propertyLabel?: string
}

type ResourceStaticFiltersDefinitionObject = Record<
  string, // property
  ResourcePropertyStaticFiltersDefinitionObject
>

type ResourceFiltersDefinitionObject = Record<
  string, // property
  ResourcePropertyFiltersDefinitionObject
>

type ComponentFiltersMap = Record<
  string, // propertyLabel
  Record<
    string, // operationLabel
    FilterDefinitionObject
  >
>
