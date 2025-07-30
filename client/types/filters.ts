import type { OpenAPIV3_1 } from 'openapi-types'
import type { GetCollectionPath, paths } from './index'

export interface ApiFilterOperation {
  name: string
  schema: OpenAPIV3_1.SchemaObject
  description?: string
  multiple: boolean
}

export interface ApiPropertyFilters {
  [operationType: string]: ApiFilterOperation
}

export interface ApiPathFilters {
  [propertyName: string]: ApiPropertyFilters
}

export interface Filter {
  id?: string
  property: string
  operation: string
  operands: any[]
}

export interface FilterState {
  [id: string]: Filter
}

export type SearchableGetCollectionPath = Extract<
  GetCollectionPath,
  '/api/sites' | '/api/users'
>

export type FilterDefinitionObject = {
  operandsComponent: string
  operandsCount: number
} & ApiFilterOperation

export type PartialFilterDefinitionObject = Partial<FilterDefinitionObject>
export type PathPropertyFilters = {
  [operationLabel: string]: FilterDefinitionObject
}

export type PathFilters = {
  [propertyLabel: string]: PathPropertyFilters
}

export type PathFiltersMap = {
  [K in SearchableGetCollectionPath]: ApiPathFilters
}

// type ExtractPathParameterNames<P extends SearchableGetCollectionPath> =
//   P extends keyof paths
//     ? paths[P] extends { get: { parameters: { query?: infer Q } } }
//       ? Q extends Record<string, any>
//         ? keyof Q
//         : never
//       : never
//     : never
//
// // Apply getBaseName logic (same as your existing function)
// type GetBaseName<T extends string> = T extends `${infer Base}[]`
//   ? Base
//   : T extends `exists[${infer Property}]`
//     ? Property
//     : T extends `${infer Base}[${string}]`
//       ? Base
//       : T
//
// // Filter out pagination/order parameters and extract base names
// type FilteredParameterNames<T extends string> = T extends
//   | 'page'
//   | 'itemsPerPage'
//   | 'search'
//   | `order[${string}]`
//   ? never
//   : GetBaseName<T>
//
// // Path-specific property base names
// export type PropertyBaseNames<P extends SearchableGetCollectionPath> =
//   FilteredParameterNames<
//     ExtractPathParameterNames<P> extends string
//       ? ExtractPathParameterNames<P>
//       : never
//   >

// // Extract operation type from parameter name using the same logic as getOperationType
// type GetOperationType<T extends string> = T extends `${string}[]`
//   ? 'in'
//   : T extends `exists[${string}]`
//     ? 'exists'
//     : T extends `${string}[${infer Op}]`
//       ? Op
//       : 'equals'
//
// // First, extract all raw operation types
// type ExtractAllOperationTypes<P extends SearchableGetCollectionPath> =
//   ExtractPathParameterNames<P> extends string
//     ? GetOperationType<ExtractPathParameterNames<P>>
//     : never
//
// // Then filter out 'equals' if 'in' is also present
// type ExtractOperationTypes<P extends SearchableGetCollectionPath> =
//   ExtractAllOperationTypes<P> extends infer AllOps
//     ? 'in' extends AllOps
//       ? Exclude<AllOps, 'equals'>
//       : AllOps
//     : never
//
// // Union of all valid operation types across all searchable paths
// export type ValidOperationType =
//   ExtractOperationTypes<SearchableGetCollectionPath>
//
// // Path-specific operation types
// export type PathOperationTypes<P extends SearchableGetCollectionPath> =
//   ExtractOperationTypes<P>
//
// // Helper to get operation types for a specific property on a path
// type PropertyOperationTypes<
//   P extends SearchableGetCollectionPath,
//   Prop extends PropertyBaseNames<P>,
// > = {
//   [K in ExtractPathParameterNames<P>]: K extends string
//     ? GetBaseName<K> extends Prop
//       ? ExtractOperationTypes<K>
//       : never
//     : never
// }[ExtractPathParameterNames<P>]
//
// // Export the property-specific operation types
// export type GetPropertyOperationTypes<
//   P extends SearchableGetCollectionPath,
//   Prop extends PropertyBaseNames<P>,
// > = PropertyOperationTypes<P, Prop>
//
// export type AddToQueryObject = (
//   queryObject: Record<string, any>,
//   filter: Filter,
// ) => void
// export type FilterOperationConfig = {
//   label: string
//   operandsComponent: string
//   operandsCount: number
//   addToQueryObject: AddToQueryObject
// } & FilterOperation
//
// export type FilterConfig<
//   P extends SearchableGetCollectionPath,
//   Prop extends PropertyBaseNames<P>,
// > = {
//   label: string
//   operations: Record<PropertyOperationTypes<P, Prop>, FilterOperationConfig>
// }
//
// export type PartialFilterConfig<
//   P extends SearchableGetCollectionPath,
//   Prop extends PropertyBaseNames<P>,
// > = {
//   label?: string
//   operations?: Partial<
//     Record<PropertyOperationTypes<P, Prop>, Partial<FilterOperationConfig>>
//   >
// }
//
// export type PropertyFiltersMap<K extends SearchableGetCollectionPath> = {
//   [P in PropertyBaseNames<K>]: FilterConfig<K, P>
// }
//
// // The map type you requested
// export type SearchablePathFiltersMap = {
//   [K in SearchableGetCollectionPath]: PropertyFiltersMap<K>
// }
