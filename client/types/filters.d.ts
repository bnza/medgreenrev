import type { FilterKey } from '~/utils/consts/configs/filters'

export type OperandComponentsKey =
  | 'Boolean'
  | 'Single'
  | 'Numeric'
  | 'NumericRange'

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

export type FilterDefinitionObject = {
  key: FilterKey
  componentKey: OperandComponentsKey
  multiple: boolean
  operationLabel: string
  property: string
  propertyLabel: string
}

export type ExpandedFilter = FilterDefinitionObject & Filter

type StaticFiltersDefinitionObject = Omit<
  FilterDefinitionObject,
  'propertyLabel' | 'property' | 'key'
> & {
  addToQueryObject: AddToQueryObject
  propertyLabel?: string
}

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
