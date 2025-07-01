import type {operations, paths} from './openapi'

export type ApiOrderKeys<T extends string> = {
  [K in T as `order[${K}]`]?: 'asc' | 'desc'
}

export type ApiPaginationParams<T extends string> = {
  page?: number;
  itemsPerPage?: number;
  search?: string;
} & OrderKeys<T>

export type ExtractOrderKeysFromApiOperation<
  OpName extends keyof operations
> = operations[OpName] extends {
    parameters: {
      query: infer Query
    }
  }
  ? Query extends Record<string, any>
    ? {
      [K in keyof Query]: K extends `order[${infer Prop}]` ? Prop : never
    }[keyof Query]
    : never
  : never

// Helper type to check if a path has a get operation
type HasGetOperation<T extends keyof paths> = paths[T]['get'] extends never
  ? false
  : true

// Extract get operation only if it exists
export type GetPathOperationIfExists<T extends keyof paths> = HasGetOperation<T> extends true
  ? paths[T]['get']
  : never


